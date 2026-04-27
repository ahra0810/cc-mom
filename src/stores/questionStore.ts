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
        const data = JSON.parse(jsonStr);
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('올바른 형식이 아닙니다.');
        }
        const newQuestions = data.questions as Question[];
        const newSubjects = (data.subjects as Subject[]) || [];

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
