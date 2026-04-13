import { create } from 'zustand';
import type { Question, TestPaper, Difficulty } from '../types';
import { nanoid } from 'nanoid';

interface TestStore {
  currentTest: TestPaper | null;
  savedTests: TestPaper[];

  // Actions
  createTest: (title: string, subjectId: string, difficulty: Difficulty) => void;
  updateTestTitle: (title: string) => void;
  addQuestionToTest: (question: Question) => void;
  addQuestionsToTest: (questions: Question[]) => void;
  removeQuestionFromTest: (questionId: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  clearTest: () => void;
  saveTest: () => void;
  loadTest: (testId: string) => void;
  deleteTest: (testId: string) => void;
  setShowAnswerKey: (show: boolean) => void;
  updateQuestionInTest: (questionId: string, updates: Partial<Question>) => void;
}

export const useTestStore = create<TestStore>()((set, get) => ({
  currentTest: null,
  savedTests: JSON.parse(localStorage.getItem('quiz-maker-tests') || '[]'),

  createTest: (title, subjectId, difficulty) =>
    set({
      currentTest: {
        id: nanoid(),
        title,
        subjectId,
        difficulty,
        questions: [],
        createdAt: Date.now(),
        showAnswerKey: false,
      },
    }),

  updateTestTitle: (title) =>
    set((state) => ({
      currentTest: state.currentTest ? { ...state.currentTest, title } : null,
    })),

  addQuestionToTest: (question) =>
    set((state) => {
      if (!state.currentTest) return state;
      if (state.currentTest.questions.some((q) => q.id === question.id)) return state;
      return {
        currentTest: {
          ...state.currentTest,
          questions: [...state.currentTest.questions, question],
        },
      };
    }),

  addQuestionsToTest: (questions) =>
    set((state) => {
      if (!state.currentTest) return state;
      const existingIds = new Set(state.currentTest.questions.map((q) => q.id));
      const newQuestions = questions.filter((q) => !existingIds.has(q.id));
      return {
        currentTest: {
          ...state.currentTest,
          questions: [...state.currentTest.questions, ...newQuestions],
        },
      };
    }),

  removeQuestionFromTest: (questionId) =>
    set((state) => ({
      currentTest: state.currentTest
        ? {
            ...state.currentTest,
            questions: state.currentTest.questions.filter((q) => q.id !== questionId),
          }
        : null,
    })),

  reorderQuestions: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.currentTest) return state;
      const questions = [...state.currentTest.questions];
      const [moved] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, moved);
      return { currentTest: { ...state.currentTest, questions } };
    }),

  clearTest: () => set({ currentTest: null }),

  saveTest: () => {
    const { currentTest, savedTests } = get();
    if (!currentTest || currentTest.questions.length === 0) return;
    const existing = savedTests.findIndex((t) => t.id === currentTest.id);
    let newSaved;
    if (existing >= 0) {
      newSaved = [...savedTests];
      newSaved[existing] = currentTest;
    } else {
      newSaved = [currentTest, ...savedTests];
    }
    localStorage.setItem('quiz-maker-tests', JSON.stringify(newSaved));
    set({ savedTests: newSaved });
  },

  loadTest: (testId) => {
    const test = get().savedTests.find((t) => t.id === testId);
    if (test) set({ currentTest: { ...test } });
  },

  deleteTest: (testId) => {
    const newSaved = get().savedTests.filter((t) => t.id !== testId);
    localStorage.setItem('quiz-maker-tests', JSON.stringify(newSaved));
    set({ savedTests: newSaved });
  },

  setShowAnswerKey: (show) =>
    set((state) => ({
      currentTest: state.currentTest
        ? { ...state.currentTest, showAnswerKey: show }
        : null,
    })),

  updateQuestionInTest: (questionId, updates) =>
    set((state) => ({
      currentTest: state.currentTest
        ? {
            ...state.currentTest,
            questions: state.currentTest.questions.map((q) =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
          }
        : null,
    })),
}));
