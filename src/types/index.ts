export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer' | 'sentence-making';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionSource = 'manual' | 'preset';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  subjectId: string;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  tags?: string[];
  createdAt: number;
  source: QuestionSource;
}

export interface TestPaper {
  id: string;
  title: string;
  subjectIds: string[]; // multiple subjects can be selected per test paper
  difficulty: Difficulty;
  questions: Question[];
  createdAt: number;
  showAnswerKey: boolean;
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '쉬움 (초등 3학년)',
  medium: '보통 (초등 4학년)',
  hard: '어려움 (초등 5~6학년)',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': '객관식 (4지선다)',
  'true-false': 'OX 퀴즈',
  'fill-blank': '빈칸 채우기',
  'short-answer': '단답형',
  'sentence-making': '서술형 (문장 만들기)',
};

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'world-history', name: '세계사', icon: '🌍', color: '#3B82F6' },
  { id: 'four-char-idiom', name: '사자성어', icon: '📜', color: '#8B5CF6' },
  { id: 'idiom', name: '관용구', icon: '💬', color: '#EC4899' },
  { id: 'proverb', name: '속담', icon: '📖', color: '#F59E0B' },
  { id: 'spelling', name: '맞춤법', icon: '✏️', color: '#10B981' },
  { id: 'vocabulary', name: '어휘', icon: '📚', color: '#6366F1' },
];
