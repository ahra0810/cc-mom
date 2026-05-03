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
  /* 1번 슬롯: short-answer — 흥미 도입. 사용자가 직접 작성 권장이지만
   * 빈 슬롯이면 정의 빈칸 hint 자동 채움 */
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.term || !meta.definition) return slot;
    return {
      ...slot,
      question: `🌱 다음 빈칸을 채우세요: ${meta.definition}을(를) ___라고 해요.`,
      answer: slot.answer || meta.term,
    };
  }
  /* 8번 슬롯: sentence-making — 친구에게 알려주기 */
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.term) return slot;
    return {
      ...slot,
      question: `🤝 친구가 "${meta.term}이(가) 뭐야?" 물어봐요. 한 문장으로 친근하게 알려주세요.`,
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

/* ─── 좌측 패널 검색 haystack — 영어·발문도 포함 ─── */
function getMathConceptSearchHaystack(meta: MathConceptMeta): string {
  return [
    meta.term,
    meta.hanja || '',
    meta.englishTerm || '',
    meta.englishOrigin || '',
    meta.definition,
    meta.visualExample || '',
    (meta.relatedTerms || []).join(' '),
    meta.textbookExample || '',
    meta.origin || '',
  ].join(' ');
}

/* ─── 카드 요약 — subhead에 영어 단어 (있으면) 또는 한자 ─── */
function getMathConceptCardSummary(meta: MathConceptMeta): DomainCardSummary {
  const sub = meta.englishTerm || meta.hanja || '·';
  return {
    headline: meta.term || '수학 개념어 미입력',
    subhead: sub,
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
    /* 슬롯 0~3 = 페이지 1 (한·영·한자로 만나기), 슬롯 4~7 = 페이지 2 (적용·발문 독해) */
    pageBreaks: [3],
    pageHeaders: [
      '🌱 한·영·한자로 만나기 — 이미 매일 쓰는 단어야!',
      '💪 이제 수학 발문에서 척척 찾아 내 것으로!',
    ],
    repeatMetaOnEachPage: false,
  },
  createEmptyMeta: () => ({
    domain: 'math-concept',
    term: '',
    englishTerm: '',
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
    '💡 발문 독해력 + 한·영·한자 통합 학습지 (초1~3, A4 2페이지). Page 1 (1~4번) = 한·영·한자로 만나기: 흥미 도입·정의·영어 짝꿍·이름의 비밀. Page 2 (5~8번) = 적용·발문 독해: 시각·단짝 친구·**수학 발문 속 단어 찾기**·친구에게 알려주기. 메타의 \'영어 단어\'와 \'교과서 발문 예\'를 함께 채워주세요.',
  recommendedTemplateId: 'math-festive',
  /* 수학 어울리는 템플릿 — festive(기본) + 퀴즈 배너 + 클래식 */
  availableTemplateIds: ['math-festive', 'idiom-quiz-banner', 'idiom-classic'],
};
