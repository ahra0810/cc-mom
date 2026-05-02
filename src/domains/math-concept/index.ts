/**
 * 수학 개념어 도메인 — DomainConfig 등록.
 */
import type { Question } from '../../types';
import type { MathConceptMeta, SetValidationError } from '../../types/sets';
import type { DomainConfig, DomainCardSummary } from '../types';

import { MATH_CONCEPT_LABELS } from './labels';
import { PROMPT_USER_PROVIDES_TERM, PROMPT_AI_SELECTS_TERM } from './prompts';
import { renderMathConceptMetaBlock } from './pdfMeta';
import MathConceptMetaEditor from './MetaEditor';
import { MATH_CONCEPT_DEFAULT_SETS } from './defaultSets';

/* ─── 메타 검증 ─── */
function validateMathConceptMeta(meta: MathConceptMeta): SetValidationError[] {
  const errors: SetValidationError[] = [];
  if (!meta.term || !meta.term.trim()) {
    errors.push({ scope: 'meta', field: 'term', message: '수학 개념어를 입력해 주세요' });
  }
  if (!meta.definition || !meta.definition.trim()) {
    errors.push({ scope: 'meta', field: 'definition', message: '정의를 입력해 주세요' });
  }
  /* 한자가 입력되었으면 한자 영역 글자만 허용 (느슨한 검증) */
  if (meta.hanja && !/^[一-鿿]+$/.test(meta.hanja)) {
    errors.push({
      scope: 'meta',
      field: 'hanja',
      message: '한자는 한자 글자만 입력하거나 비워 두세요 (순한국어 용어는 빈 값)',
    });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ─── */
function syncSlotFromMathConceptMeta(
  slotIdx: number,
  slot: Question,
  meta: MathConceptMeta,
): Question {
  /* 1번 슬롯: short-answer — 시드/사용자가 직접 학습 활동을 정함.
   * 사용자가 빈 슬롯에서 시작할 때 정의 빈칸 패턴을 hint로 자동 채움. */
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.term || !meta.definition) return slot;
    return {
      ...slot,
      question: `다음 빈칸을 채우세요: ${meta.definition}을(를) ___라고 한다.`,
      answer: slot.answer || meta.term,
    };
  }
  /* 8번 슬롯: sentence-making — 개념 한 문장 설명 */
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.term) return slot;
    return {
      ...slot,
      question: `'${meta.term}'이(가) 무엇인지 한 문장으로 설명하세요.`,
    };
  }
  return slot;
}

/* ─── title 자동 생성 ─── */
function deriveMathConceptTitle(meta: MathConceptMeta, currentTitle: string): string {
  if (
    meta.term &&
    (!currentTitle ||
      currentTitle === '새 학습지' ||
      currentTitle.endsWith(' 학습지'))
  ) {
    return `${meta.term} 학습지`;
  }
  return currentTitle;
}

/* ─── 좌측 패널 검색 haystack ─── */
function getMathConceptSearchHaystack(meta: MathConceptMeta): string {
  return [
    meta.term,
    meta.hanja || '',
    meta.definition,
    meta.visualExample || '',
    (meta.relatedTerms || []).join(' '),
    meta.origin || '',
  ].join(' ');
}

/* ─── 카드 요약 ─── */
function getMathConceptCardSummary(meta: MathConceptMeta): DomainCardSummary {
  return {
    headline: meta.term || '수학 개념어 미입력',
    subhead: meta.hanja || '·',
    body: meta.definition || '',
  };
}

/* ─── DomainConfig export ─── */
export const mathConceptDomainConfig: DomainConfig<MathConceptMeta> = {
  id: 'math-concept',
  labels: MATH_CONCEPT_LABELS,
  slotConfig: {
    count: 8,
    requiredTypes: [
      'short-answer',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'sentence-making',
    ],
    autoSyncedSlots: [0, 7],
  },
  createEmptyMeta: () => ({
    domain: 'math-concept',
    term: '',
    definition: '',
  }),
  validateMeta: validateMathConceptMeta,
  deriveTitle: deriveMathConceptTitle,
  syncSlotFromMeta: syncSlotFromMathConceptMeta,
  getSearchHaystack: getMathConceptSearchHaystack,
  getCardSummary: getMathConceptCardSummary,
  MetaEditor: MathConceptMetaEditor,
  renderMetaBlock: (meta, t) => renderMathConceptMetaBlock(meta, t),
  aiPrompts: {
    userKeyword: PROMPT_USER_PROVIDES_TERM,
    aiSelect: PROMPT_AI_SELECTS_TERM,
  },
  defaultSets: MATH_CONCEPT_DEFAULT_SETS,
  editorHint:
    '💡 1번은 시드별로 학습 활동이 다양해요 (정의 빈칸 / 한자 풀이 / 시각 예시 中). 2~7번은 정의·한자·시각·관련용어·올바른예·잘못된예. 8번은 개념을 한 문장으로 설명. 메타에 개념어·정의를 채우면 1·8번이 자동으로 일부 채워집니다.',
};
