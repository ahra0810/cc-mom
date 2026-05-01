/**
 * Question Set 타입 — "키워드 1개 + 8문항 = A4 1페이지 학습지" 단위.
 *
 * 도메인 추가는 src/domains/<id>/index.ts에 DomainConfig를 등록하고
 * 이 파일의 SetDomain union·SetMeta union을 확장하면 됩니다.
 */
import type { Question, Difficulty } from './index';

/* ─── 도메인 ─── */
export type SetDomain = 'four-char-idiom' | 'proverb' | 'idiomatic-phrase';

/* ─── 슬롯 — 도메인별로 type이 다르므로 readonly Question[] ───
 * 길이/타입 검증은 setValidator.validateSet이 도메인 slotConfig 기반으로 수행.
 * SetSlotsTuple은 코드에서 [Q, Q, ...] 8-tuple 가정 부분의 호환을 위해 유지. */
export type SetSlots = readonly Question[];

/* (legacy) 사자성어 도메인용 8-tuple — 일부 location에서 readonly tuple 가정으로 cast 사용 */
export type SetSlotsTuple = readonly [
  Question,
  Question,
  Question,
  Question,
  Question,
  Question,
  Question,
  Question,
];

/* ─── 슬롯별 강제 type — 사자성어 도메인 기준 (legacy export) ───
 * 도메인별 강제 타입은 src/domains/<id>/index.ts의 slotConfig.requiredTypes 참고. */
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

/* 슬롯 위치별 한글 라벨 (UI 표시) — legacy. 도메인별로는 domain.labels.slotLabels 사용. */
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

/** 속담 메타 */
export interface ProverbMeta {
  domain: 'proverb';
  /** 속담 본문 (예: "가는 말이 고와야 오는 말이 곱다") */
  proverb: string;
  /** 뜻풀이 */
  meaning: string;
  /** 교훈 (선택) */
  lesson?: string;
  /** 유래·출전 (선택) */
  origin?: string;
}

/** 관용어 메타 — 한국어 관용 표현 (예: "발이 넓다", "손이 크다") */
export interface IdiomaticPhraseMeta {
  domain: 'idiomatic-phrase';
  /** 관용어 본문 (예: "발이 넓다") */
  phrase: string;
  /** 뜻풀이 (예: "아는 사람이 많다") */
  meaning: string;
  /** 예문 (선택) — 표현이 실제로 쓰이는 한 문장 */
  example?: string;
  /** 유래 / 어원 (선택) */
  origin?: string;
}

/** 도메인별 메타 union (discriminated by `domain`) */
export type SetMeta = IdiomMeta | ProverbMeta | IdiomaticPhraseMeta;

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
  /** 도메인의 slotConfig.count 만큼의 Question */
  slots: SetSlots;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  source: 'manual' | 'preset' | 'ai-imported';
}

/* ─── 검증 결과 ─── */
export interface SetValidationError {
  /** 'meta' | 'title' | 슬롯 인덱스(0-N) */
  scope: 'meta' | 'title' | SlotIndex | number;
  /** 에러 사유 — UI 토스트 또는 인라인 표시 */
  message: string;
  /** 검증 실패한 필드 키 (선택) */
  field?: string;
}

export interface SetValidation {
  ok: boolean;
  errors: SetValidationError[];
}
