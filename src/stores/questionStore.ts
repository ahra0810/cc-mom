import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Subject, Difficulty, QuestionType } from '../types';
import { DEFAULT_SUBJECTS } from '../types';
import { defaultQuestions } from '../data/defaultQuestions';
import { resolveSubjectForQuestion, type TaggingStats } from '../services/autoTag';

interface QuestionFilters {
  subjectId: string | null;
  difficulty: Difficulty | null;
  type: QuestionType | null;
  search: string;
}

interface QuestionStore {
  questions: Question[];
  subjects: Subject[];
  filters: QuestionFilters;
  selectedQuestionIds: Set<string>;

  // Actions
  setFilters: (filters: Partial<QuestionFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  addQuestion: (question: Question) => void;
  addQuestions: (questions: Question[]) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  toggleSelectQuestion: (id: string) => void;
  selectAllFiltered: () => void;
  clearSelection: () => void;
  addSubject: (subject: Subject) => boolean; // returns false if duplicate
  removeSubject: (id: string) => void;
  getFilteredQuestions: () => Question[];
  resetToDefaults: () => void;
  getSubjectQuestionCount: (subjectId: string) => number;

  // Data export/import
  exportData: () => string;
  importData: (jsonStr: string) => ImportReport;
}

export interface ImportReport {
  questions: number;
  subjectsAdded: number;
  newSubjectNames: string[];
  taggingStats: TaggingStats;
}

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      questions: defaultQuestions,
      subjects: DEFAULT_SUBJECTS,
      filters: {
        subjectId: null,
        difficulty: null,
        type: null,
        search: '',
      },
      selectedQuestionIds: new Set<string>(),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      clearFilters: () =>
        set({
          filters: { subjectId: null, difficulty: null, type: null, search: '' },
        }),

      hasActiveFilters: () => {
        const { filters } = get();
        return !!(filters.subjectId || filters.difficulty || filters.type || filters.search);
      },

      addQuestion: (question) =>
        set((state) => ({
          questions: [question, ...state.questions],
        })),

      addQuestions: (questions) =>
        set((state) => ({
          questions: [...questions, ...state.questions],
        })),

      updateQuestion: (id, updates) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      deleteQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
          selectedQuestionIds: new Set(
            [...state.selectedQuestionIds].filter((qid) => qid !== id)
          ),
        })),

      toggleSelectQuestion: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedQuestionIds);
          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          return { selectedQuestionIds: newSet };
        }),

      selectAllFiltered: () =>
        set((state) => {
          const filtered = getFiltered(state);
          return {
            selectedQuestionIds: new Set(filtered.map((q) => q.id)),
          };
        }),

      clearSelection: () => set({ selectedQuestionIds: new Set() }),

      addSubject: (subject) => {
        const { subjects } = get();
        // Duplicate name check
        if (subjects.some((s) => s.name.trim().toLowerCase() === subject.name.trim().toLowerCase())) {
          return false;
        }
        set({ subjects: [...subjects, subject] });
        return true;
      },

      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      getFilteredQuestions: () => getFiltered(get()),

      resetToDefaults: () =>
        set({
          questions: defaultQuestions,
          subjects: DEFAULT_SUBJECTS,
          selectedQuestionIds: new Set(),
        }),

      getSubjectQuestionCount: (subjectId) => {
        return get().questions.filter((q) => q.subjectId === subjectId).length;
      },

      exportData: () => {
        const { questions, subjects } = get();
        return JSON.stringify({ questions, subjects }, null, 2);
      },

      importData: (jsonStr) => {
        let data: { questions?: unknown[]; subjects?: unknown[] };
        try {
          data = JSON.parse(jsonStr);
        } catch {
          throw new Error('JSON 파싱에 실패했습니다. 파일이 올바른 JSON 형식인지 확인해주세요.');
        }
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('"questions" 필드가 없거나 배열이 아닙니다.');
        }

        const VALID_TYPES = ['multiple-choice', 'true-false', 'fill-blank', 'short-answer', 'sentence-making'];
        const VALID_DIFF = ['easy', 'medium', 'hard', 'advanced', 'expert'];

        const currentSubjects = get().subjects;

        /* ─── JSON에 명시된 subjects는 먼저 흡수 ─── */
        const explicitNewSubjects: Subject[] = [];
        if (Array.isArray(data.subjects)) {
          const existingIds = new Set(currentSubjects.map((s) => s.id));
          for (let i = 0; i < data.subjects.length; i++) {
            const raw = data.subjects[i] as Record<string, unknown>;
            const id = typeof raw.id === 'string' ? raw.id : `imported-sub-${Date.now()}-${i}`;
            if (existingIds.has(id)) continue;
            explicitNewSubjects.push({
              id,
              name: typeof raw.name === 'string' ? raw.name : `과목${i + 1}`,
              icon: typeof raw.icon === 'string' ? raw.icon : '📝',
              color: typeof raw.color === 'string' ? raw.color : '#6366F1',
            });
            existingIds.add(id);
          }
        }

        /* ─── 자동 태깅 — 매칭/생성 과정 ─── */
        const autoCreatedSubjects: Subject[] = [];
        const taggingStats: TaggingStats = {
          total: 0,
          matched: 0,
          newSubjects: [],
          byMethod: { exact: 0, normalized: 0, name: 0, keyword: 0, 'work-title': 0, created: 0, fallback: 0 },
        };

        const newQuestions: Question[] = data.questions.map((raw, idx) => {
          const q = raw as Record<string, unknown>;
          if (typeof q.question !== 'string' || !q.question.trim()) {
            throw new Error(`${idx + 1}번 문항: "question" 필드가 필요합니다.`);
          }
          const type = (typeof q.type === 'string' && VALID_TYPES.includes(q.type)) ? q.type : 'multiple-choice';
          if (type !== 'sentence-making' && typeof q.answer !== 'string' && !Array.isArray(q.answer)) {
            throw new Error(`${idx + 1}번 문항: "answer" 필드가 필요합니다.`);
          }
          const difficulty = (typeof q.difficulty === 'string' && VALID_DIFF.includes(q.difficulty)) ? q.difficulty : 'medium';

          /* 임시 Question 객체 — 태깅 매칭에 사용 */
          const partialQ: Partial<Question> = {
            question: String(q.question).trim(),
            subjectId: typeof q.subjectId === 'string' ? q.subjectId : undefined,
            tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
            passage: typeof q.passage === 'string' ? q.passage : undefined,
            workTitle: typeof q.workTitle === 'string' ? q.workTitle : undefined,
            workAuthor: typeof q.workAuthor === 'string' ? q.workAuthor : undefined,
          };

          /* 자동 태깅 실행 */
          const allKnownSubjects = [...currentSubjects, ...explicitNewSubjects, ...autoCreatedSubjects];
          const result = resolveSubjectForQuestion(partialQ, allKnownSubjects, []);

          if (result.newSubject && !autoCreatedSubjects.some((s) => s.id === result.newSubject!.id)) {
            autoCreatedSubjects.push(result.newSubject);
          }
          taggingStats.total += 1;
          taggingStats.byMethod[result.matchedBy] += 1;
          if (result.matchedBy !== 'created' && result.matchedBy !== 'fallback') {
            taggingStats.matched += 1;
          }

          return {
            id: typeof q.id === 'string' ? q.id : `imported-${Date.now()}-${idx}`,
            type: type as Question['type'],
            subjectId: result.subjectId,
            difficulty: difficulty as Question['difficulty'],
            question: String(q.question).trim(),
            options: Array.isArray(q.options) ? q.options.map(String) : undefined,
            answer: Array.isArray(q.answer) ? q.answer.join(',') : (typeof q.answer === 'string' ? q.answer : ''),
            explanation: typeof q.explanation === 'string' ? q.explanation : undefined,
            tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
            createdAt: typeof q.createdAt === 'number' ? q.createdAt : Date.now(),
            source: 'manual' as const,
            passage: typeof q.passage === 'string' && q.passage.trim() ? q.passage : undefined,
            workTitle: typeof q.workTitle === 'string' && q.workTitle.trim() ? q.workTitle : undefined,
            workAuthor: typeof q.workAuthor === 'string' && q.workAuthor.trim() ? q.workAuthor : undefined,
          };
        });

        const allNewSubjects = [...explicitNewSubjects, ...autoCreatedSubjects];
        taggingStats.newSubjects = autoCreatedSubjects;

        /* ─── 상태 적용 ─── */
        set((state) => {
          const existingQIds = new Set(state.questions.map((q) => q.id));
          const uniqueQuestions = newQuestions.filter((q) => !existingQIds.has(q.id));

          const existingSIds = new Set(state.subjects.map((s) => s.id));
          const uniqueSubjects = allNewSubjects.filter((s) => !existingSIds.has(s.id));

          return {
            questions: [...uniqueQuestions, ...state.questions],
            subjects: [...state.subjects, ...uniqueSubjects],
          };
        });

        return {
          questions: newQuestions.length,
          subjectsAdded: allNewSubjects.length,
          newSubjectNames: allNewSubjects.map((s) => `${s.icon} ${s.name}`),
          taggingStats,
        };
      },
    }),
    {
      name: 'quiz-maker-questions',
      partialize: (state) => ({
        questions: state.questions,
        subjects: state.subjects,
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<QuestionStore> | undefined;
        /* 저장된 과목 목록과 현재 기본 과목을 병합 — 새로 추가된 default subject가
           기존 사용자에게도 자동으로 보이도록 함 (merge bug 수정).
           단, 사용자가 의도적으로 삭제한 과목을 다시 살리지는 않도록
           "_removedDefaults" 마커(추후 확장)를 사용할 수도 있음. */
        const persistedSubjects = p?.subjects ?? current.subjects;
        const persistedIds = new Set(persistedSubjects.map((s) => s.id));
        const missingDefaults = current.subjects.filter((s) => !persistedIds.has(s.id));
        const mergedSubjects = [...persistedSubjects, ...missingDefaults];

        return {
          ...current,
          questions: p?.questions ?? current.questions,
          subjects: mergedSubjects,
        };
      },
    }
  )
);

function getFiltered(state: { questions: Question[]; filters: QuestionFilters }): Question[] {
  return state.questions.filter((q) => {
    if (state.filters.subjectId && q.subjectId !== state.filters.subjectId) return false;
    if (state.filters.difficulty && q.difficulty !== state.filters.difficulty) return false;
    if (state.filters.type && q.type !== state.filters.type) return false;
    if (state.filters.search) {
      const s = state.filters.search.toLowerCase();
      return (
        q.question.toLowerCase().includes(s) ||
        q.answer.toLowerCase().includes(s) ||
        q.tags?.some((t) => t.toLowerCase().includes(s)) ||
        q.workTitle?.toLowerCase().includes(s) ||
        q.workAuthor?.toLowerCase().includes(s) ||
        q.passage?.toLowerCase().includes(s)
      );
    }
    return true;
  });
}
