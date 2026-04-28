export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'short-answer'
  | 'sentence-making'
  | 'hanja-writing'; // 1번 — 한자 4자가 옅게 표시되고 학생이 한글음 + 한자 따라쓰기

export type Difficulty = 'easy' | 'medium' | 'hard' | 'advanced' | 'expert';

export type QuestionSource = 'manual' | 'preset' | 'ai-imported';

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
  /** 지문/제시문 (문학 작품 발췌, 비문학 글 등) - 문제 위에 박스로 표시됨 */
  passage?: string;
  /** 작품명 (예: 소나기) */
  workTitle?: string;
  /** 작가명 (예: 황순원) */
  workAuthor?: string;
  /** hanja-writing 타입 전용: 학생이 따라 쓸 한자 4자 (예: "東問西答").
   *  PDF에서 옅은 회색 글자로 박스 안에 표시되고 학생이 위에 따라 씀. */
  hanjaTrace?: string;
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
  easy: '쉬움 (초등 3~4학년)',
  medium: '보통 (초등 5~6학년)',
  hard: '어려움 (중학 1학년)',
  advanced: '심화 (중학 2학년)',
  expert: '도전 (중학 3학년)',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': '객관식 (4지선다)',
  'true-false': 'OX 퀴즈',
  'fill-blank': '빈칸 채우기',
  'short-answer': '단답형',
  'sentence-making': '서술형 (문장 만들기)',
  'hanja-writing': '한자 쓰기 (음 + 따라쓰기)',
};

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'four-char-idiom', name: '사자성어', icon: '📜', color: '#8B5CF6' },
];
