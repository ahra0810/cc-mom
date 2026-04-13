import { create } from 'zustand';
import type { Question, TestPaper, Difficulty } from '../types';
import { nanoid } from 'nanoid';

const MAX_HISTORY = 50;

interface TestStore {
  currentTest: TestPaper | null;
  savedTests: TestPaper[];
  initialTestSnapshot: TestPaper | null;

  // Undo history
  history: TestPaper[];
  pushHistory: () => void;
  undo: () => void;
  canUndo: () => boolean;
  resetToInitial: () => void;

  // Multi-select in test
  selectedInTest: Set<string>;
  toggleSelectInTest: (id: string) => void;
  selectRangeInTest: (id: string) => void;
  clearTestSelection: () => void;
  moveSelectedQuestions: (direction: 'up' | 'down') => void;

  // Sort
  sortBySubject: () => void;

  // CRUD
  createTest: (title: string, subjectId: string, difficulty: Difficulty) => void;
  updateTestTitle: (title: string) => void;
  addQuestionToTest: (question: Question) => void;
  addQuestionsToTest: (questions: Question[]) => void;
  removeQuestionFromTest: (questionId: string) => void;
  removeSelectedFromTest: () => void;
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
  initialTestSnapshot: null,
  history: [],
  selectedInTest: new Set<string>(),

  pushHistory: () => {
    const { currentTest, history } = get();
    if (!currentTest) return;
    const snapshot = JSON.parse(JSON.stringify(currentTest)) as TestPaper;
    const newHistory = [...history, snapshot].slice(-MAX_HISTORY);
    set({ history: newHistory });
  },

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      currentTest: prev,
      history: history.slice(0, -1),
      selectedInTest: new Set(),
    });
  },

  canUndo: () => get().history.length > 0,

  resetToInitial: () => {
    const { initialTestSnapshot, currentTest } = get();
    if (!initialTestSnapshot || !currentTest) return;
    get().pushHistory();
    set({
      currentTest: {
        ...JSON.parse(JSON.stringify(initialTestSnapshot)),
        id: currentTest.id,
        title: currentTest.title,
      },
      selectedInTest: new Set(),
    });
  },

  toggleSelectInTest: (id) =>
    set((state) => {
      const s = new Set(state.selectedInTest);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return { selectedInTest: s };
    }),

  selectRangeInTest: (id) =>
    set((state) => {
      if (!state.currentTest) return state;
      const questions = state.currentTest.questions;
      const s = new Set(state.selectedInTest);
      if (s.size === 0) {
        s.add(id);
        return { selectedInTest: s };
      }
      // Find range between last selected and current
      const lastSelected = [...s].pop()!;
      const lastIdx = questions.findIndex((q) => q.id === lastSelected);
      const curIdx = questions.findIndex((q) => q.id === id);
      if (lastIdx === -1 || curIdx === -1) {
        s.add(id);
        return { selectedInTest: s };
      }
      const [from, to] = lastIdx < curIdx ? [lastIdx, curIdx] : [curIdx, lastIdx];
      for (let i = from; i <= to; i++) {
        s.add(questions[i].id);
      }
      return { selectedInTest: s };
    }),

  clearTestSelection: () => set({ selectedInTest: new Set() }),

  moveSelectedQuestions: (direction) => {
    const { currentTest, selectedInTest } = get();
    if (!currentTest || selectedInTest.size === 0) return;
    get().pushHistory();

    const questions = [...currentTest.questions];
    const selectedIds = new Set(selectedInTest);
    const indices = questions
      .map((q, i) => (selectedIds.has(q.id) ? i : -1))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);

    if (direction === 'up') {
      if (indices[0] === 0) return;
      for (const idx of indices) {
        [questions[idx - 1], questions[idx]] = [questions[idx], questions[idx - 1]];
      }
    } else {
      if (indices[indices.length - 1] === questions.length - 1) return;
      for (let i = indices.length - 1; i >= 0; i--) {
        const idx = indices[i];
        [questions[idx], questions[idx + 1]] = [questions[idx + 1], questions[idx]];
      }
    }

    set({ currentTest: { ...currentTest, questions } });
  },

  sortBySubject: () => {
    const { currentTest } = get();
    if (!currentTest) return;
    get().pushHistory();
    const sorted = [...currentTest.questions].sort((a, b) =>
      a.subjectId.localeCompare(b.subjectId)
    );
    set({ currentTest: { ...currentTest, questions: sorted } });
  },

  createTest: (title, subjectId, difficulty) => {
    const test: TestPaper = {
      id: nanoid(),
      title,
      subjectId,
      difficulty,
      questions: [],
      createdAt: Date.now(),
      showAnswerKey: false,
    };
    set({
      currentTest: test,
      initialTestSnapshot: JSON.parse(JSON.stringify(test)),
      history: [],
      selectedInTest: new Set(),
    });
  },

  updateTestTitle: (title) =>
    set((state) => ({
      currentTest: state.currentTest ? { ...state.currentTest, title } : null,
    })),

  addQuestionToTest: (question) => {
    const { currentTest } = get();
    if (!currentTest) return;
    if (currentTest.questions.some((q) => q.id === question.id)) return;
    get().pushHistory();
    set({
      currentTest: {
        ...currentTest,
        questions: [...currentTest.questions, question],
      },
    });
  },

  addQuestionsToTest: (questions) => {
    const { currentTest } = get();
    if (!currentTest) return;
    const existingIds = new Set(currentTest.questions.map((q) => q.id));
    const newQuestions = questions.filter((q) => !existingIds.has(q.id));
    if (newQuestions.length === 0) return;
    get().pushHistory();
    set({
      currentTest: {
        ...currentTest,
        questions: [...currentTest.questions, ...newQuestions],
      },
    });
  },

  removeQuestionFromTest: (questionId) => {
    const { currentTest } = get();
    if (!currentTest) return;
    get().pushHistory();
    set({
      currentTest: {
        ...currentTest,
        questions: currentTest.questions.filter((q) => q.id !== questionId),
      },
      selectedInTest: new Set(
        [...get().selectedInTest].filter((id) => id !== questionId)
      ),
    });
  },

  removeSelectedFromTest: () => {
    const { currentTest, selectedInTest } = get();
    if (!currentTest || selectedInTest.size === 0) return;
    get().pushHistory();
    set({
      currentTest: {
        ...currentTest,
        questions: currentTest.questions.filter((q) => !selectedInTest.has(q.id)),
      },
      selectedInTest: new Set(),
    });
  },

  reorderQuestions: (fromIndex, toIndex) => {
    const { currentTest } = get();
    if (!currentTest) return;
    get().pushHistory();
    const questions = [...currentTest.questions];
    const [moved] = questions.splice(fromIndex, 1);
    questions.splice(toIndex, 0, moved);
    set({ currentTest: { ...currentTest, questions } });
  },

  clearTest: () =>
    set({
      currentTest: null,
      initialTestSnapshot: null,
      history: [],
      selectedInTest: new Set(),
    }),

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
    if (test) {
      const copy = JSON.parse(JSON.stringify(test));
      set({
        currentTest: copy,
        initialTestSnapshot: JSON.parse(JSON.stringify(copy)),
        history: [],
        selectedInTest: new Set(),
      });
    }
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

  updateQuestionInTest: (questionId, updates) => {
    const { currentTest } = get();
    if (!currentTest) return;
    get().pushHistory();
    set({
      currentTest: {
        ...currentTest,
        questions: currentTest.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      },
    });
  },
}));
