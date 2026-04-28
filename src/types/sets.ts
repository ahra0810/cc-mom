/**
 * Question Set 타입 — "사자성어 1개 + 8문항 = A4 1페이지 학습지" 단위.
 *
 * 도메인은 우선 사자성어(four-char-idiom)만, 추후 idiomatic / proverb /
 * vocabulary 등으로 SetMeta 와 SetDomain 의 union 만 확장하면 됨.
 */
import type { Question, Difficulty } from './index';

/* ─── 도메인 ─── */
export type SetDomain = 'four-char-idiom';

/* ─── 8슬롯 readonly tuple ─── */
export type SetSlots = readonly [
  Question, /* 1: hanja-writing — 한자 따라쓰기 + 한글음 작성 */
  Question, /* 2: multiple-choice */
  Question, /* 3: multiple-choice */
  Question, /* 4: multiple-choice */
  Question, /* 5: multiple-choice */
  Question, /* 6: multiple-choice */
  Question, /* 7: multiple-choice */
  Question, /* 8: sentence-making — 사자성어 사용 문장 만들기 */
];

/* ─── 슬롯별 강제 type — 검증 + 폼 분기에 사용 ─── */
export const REQUIRED_SLOT_TYPES = [
  'hanja-writing',
  'multiple-choice',
  'multiple-choice',
  'multiple-choice',
  'multiple-choice',
  'multiple-choice',
  'multiple-choice',
  'sentence-making',
] as const;

export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const SLOT_COUNT = 8;

/* 슬롯 위치별 한글 라벨 (UI 표시) */
export const SLOT_LABELS: readonly string[] = [
  '1번 한자 쓰기',
  '2번 객관식',
  '3번 객관식',
  '4번 객관식',
  '5번 객관식',
  '6번 객관식',
  '7번 객관식',
  '8번 문장 만들기',
];

/* ─── 도메인 메타데이터 ─── */

/** 사자성어 메타 */
export interface IdiomMeta {
  domain: 'four-char-idiom';
  /** 한글 4자 (예: "동문서답") */
  idiom: string;
  /** 한자 4자 (예: "東問西答") */
  hanja: string;
  /** 뜻풀이 — 학생에게 보여주는 설명 */
  meaning: string;
  /** 출전·유래 (선택) */
  origin?: string;
}

/* 추후 확장 예정:
 * export interface IdiomaticMeta { domain: 'idiomatic'; phrase: string; meaning: string; }
 * export interface ProverbMeta   { domain: 'proverb';   proverb: string; meaning: string; }
 */
export type SetMeta = IdiomMeta;

/* ─── Set 컨테이너 ─── */
export interface QuestionSet {
  id: string;
  /** 자동 생성: "{idiom} 학습지" — 사용자가 변경 가능 */
  title: string;
  domain: SetDomain;
  /** 기존 5단계 그대로 사용 (학년 개념 사용 안 함) */
  difficulty: Difficulty;
  /** 도메인별 메타데이터 (discriminated union) */
  meta: SetMeta;
  /** 정확히 8개의 Question */
  slots: SetSlots;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  source: 'manual' | 'preset' | 'ai-imported';
}

/* ─── 검증 결과 ─── */
export interface SetValidationError {
  /** 'meta' | 'title' | 슬롯 인덱스(0-7) */
  scope: 'meta' | 'title' | SlotIndex;
  /** 에러 사유 — UI 토스트 또는 인라인 표시 */
  message: string;
  /** 검증 실패한 필드 키 (선택) */
  field?: string;
}

export interface SetValidation {
  ok: boolean;
  errors: SetValidationError[];
}
