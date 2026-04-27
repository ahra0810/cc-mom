import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, Subject, Difficulty, QuestionType } from '../types';
import { DEFAULT_SUBJECTS } from '../types';
import { defaultQuestions } from '../data/defaultQuestions';

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
  importData: (jsonStr: string) => { questions: number; subjects: number };
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

        const VALID_TYPES = ['multiple-choice', 'true-false', 'fill-blank', 'short-answer'];
        const VALID_DIFF = ['easy', 'medium', 'hard'];

        // Validate and auto-fill missing fields
        const newQuestions: Question[] = data.questions.map((raw, idx) => {
          const q = raw as Record<string, unknown>;
          if (typeof q.question !== 'string' || !q.question.trim()) {
            throw new Error(`${idx + 1}번 문항: "question" 필드가 필요합니다.`);
          }
          if (typeof q.answer !== 'string' && !Array.isArray(q.answer)) {
            throw new Error(`${idx + 1}번 문항: "answer" 필드가 필요합니다.`);
          }
          const type = (typeof q.type === 'string' && VALID_TYPES.includes(q.type)) ? q.type : 'multiple-choice';
          const difficulty = (typeof q.difficulty === 'string' && VALID_DIFF.includes(q.difficulty)) ? q.difficulty : 'medium';

          return {
            id: typeof q.id === 'string' ? q.id : `imported-${Date.now()}-${idx}`,
            type: type as Question['type'],
            subjectId: typeof q.subjectId === 'string' ? q.subjectId : '',
            difficulty: difficulty as Question['difficulty'],
            question: String(q.question).trim(),
            options: Array.isArray(q.options) ? q.options.map(String) : undefined,
            answer: Array.isArray(q.answer) ? q.answer.join(',') : String(q.answer),
            explanation: typeof q.explanation === 'string' ? q.explanation : undefined,
            tags: Array.isArray(q.tags) ? q.tags.map(String) : [],
            createdAt: typeof q.createdAt === 'number' ? q.createdAt : Date.now(),
            source: 'manual' as const,
          };
        });

        const newSubjects: Subject[] = Array.isArray(data.subjects)
          ? data.subjects.map((raw, idx) => {
              const s = raw as Record<string, unknown>;
              return {
                id: typeof s.id === 'string' ? s.id : `imported-sub-${Date.now()}-${idx}`,
                name: typeof s.name === 'string' ? s.name : `과목${idx + 1}`,
                icon: typeof s.icon === 'string' ? s.icon : '📝',
                color: typeof s.color === 'string' ? s.color : '#6366F1',
              };
            })
          : [];

        set((state) => {
          const existingIds = new Set(state.questions.map((q) => q.id));
          const uniqueQuestions = newQuestions.filter((q) => !existingIds.has(q.id));

          const existingSubjectIds = new Set(state.subjects.map((s) => s.id));
          const uniqueSubjects = newSubjects.filter((s) => !existingSubjectIds.has(s.id));

          return {
            questions: [...uniqueQuestions, ...state.questions],
            subjects: [...state.subjects, ...uniqueSubjects],
          };
        });

        return { questions: newQuestions.length, subjects: newSubjects.length };
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
        return {
          ...current,
          questions: p?.questions ?? current.questions,
          subjects: p?.subjects ?? current.subjects,
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
        q.tags?.some((t) => t.toLowerCase().includes(s))
      );
    }
    return true;
  });
}
