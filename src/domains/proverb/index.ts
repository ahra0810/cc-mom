/**
 * 속담 도메인 — DomainConfig 등록.
 * v2: 시각 카드 + 일상 응용 + 미니 퀴즈 3문항 (math-concept 패턴).
 */
import type { Question } from '../../types';
import type { ProverbMeta, SetValidationError } from '../../types/sets';
import type { DomainConfig, DomainCardSummary } from '../types';

import { PROVERB_LABELS } from './labels';
import { PROMPT_USER_PROVIDES_PROVERB, PROMPT_AI_SELECTS_PROVERB } from './prompts';
import { renderProverbMetaBlock } from './pdfMeta';
import ProverbMetaEditor from './MetaEditor';
import { PROVERB_DEFAULT_SETS } from './defaultSets';

/* ─── 메타 검증 ─── */
function validateProverbMeta(meta: ProverbMeta): SetValidationError[] {
  const errors: SetValidationError[] = [];
  if (!meta.proverb || meta.proverb.trim().length < 4) {
    errors.push({ scope: 'meta', field: 'proverb', message: '속담 본문을 입력해 주세요 (4자 이상)' });
  }
  if (!meta.meaning || !meta.meaning.trim()) {
    errors.push({ scope: 'meta', field: 'meaning', message: '친근한 뜻을 입력해 주세요' });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ───
 * 슬롯 구성: [0] 객관식(뜻) [1] 객관식(상황) [2] 서술형(직접 응용)
 * 메타 변경에 따라 슬롯 question 이 깨지지 않도록 빈 슬롯에만 hint 채움. */
function syncSlotFromProverbMeta(slotIdx: number, slot: Question, meta: ProverbMeta): Question {
  /* 슬롯 2 (서술형 응용): 빈 슬롯에 hint 자동 채움 */
  if (slotIdx === 2) {
    if (slot.question) return slot;
    if (!meta.proverb) return slot;
    return {
      ...slot,
      question: `🤝 "${meta.proverb}"을(를) 사용해서 짧은 문장을 만들어 보세요.`,
    };
  }
  return slot;
}

/* ─── title 자동 생성 ─── */
function deriveProverbTitle(meta: ProverbMeta, currentTitle: string): string {
  if (
    meta.proverb &&
    (!currentTitle ||
      currentTitle === '새 학습지' ||
      currentTitle.endsWith(' 학습지'))
  ) {
    const head = meta.proverb.length > 14 ? `${meta.proverb.slice(0, 14)}…` : meta.proverb;
    return `${head} 학습지`;
  }
  return currentTitle;
}

/* ─── 좌측 패널 검색 haystack ─── */
function getProverbSearchHaystack(meta: ProverbMeta): string {
  return [
    meta.proverb,
    meta.textbookMeaning || '',
    meta.meaning,
    meta.visualEmoji || '',
    meta.visualExample || '',
    (meta.relatedProverbs || []).join(' '),
    (meta.relatedProverbsDetailed || []).map((f) => `${f.term} ${f.desc}`).join(' '),
    meta.usageExample || '',
    meta.lesson || '',
    meta.origin || '',
  ].join(' ');
}

/* ─── 카드 요약 ─── */
function getProverbCardSummary(meta: ProverbMeta): DomainCardSummary {
  return {
    headline: meta.proverb || '속담 미입력',
    subhead: meta.lesson || (meta.proverb ? '”' : '—'),
    body: meta.meaning || '',
  };
}

/* ─── DomainConfig export ─── */
export const proverbDomainConfig: DomainConfig<ProverbMeta> = {
  id: 'proverb',
  labels: PROVERB_LABELS,
  slotConfig: {
    /* 1페이지 구성: 풀폭 "속담 학습 카드" (시각·단짝·일상)
     *   + 미니 퀴즈 3문항 (객관식 뜻 / 객관식 상황 / 서술형 응용) */
    count: 3,
    requiredTypes: ['multiple-choice', 'multiple-choice', 'sentence-making'],
    autoSyncedSlots: [2],
  },
  createEmptyMeta: () => ({
    domain: 'proverb',
    proverb: '',
    meaning: '',
  }),
  validateMeta: validateProverbMeta,
  deriveTitle: deriveProverbTitle,
  syncSlotFromMeta: syncSlotFromProverbMeta,
  getSearchHaystack: getProverbSearchHaystack,
  getCardSummary: getProverbCardSummary,
  MetaEditor: ProverbMetaEditor,
  renderMetaBlock: (meta, t) => renderProverbMetaBlock(meta, t),
  aiPrompts: {
    userKeyword: PROMPT_USER_PROVIDES_PROVERB,
    aiSelect: PROMPT_AI_SELECTS_PROVERB,
  },
  defaultSets: PROVERB_DEFAULT_SETS,
  editorHint:
    '💡 시각 카드 + 일상 응용 학습지 (초3~중1, A4 1페이지). 헤더(속담·이름칸) + \'뜻\' 박스(교과서 + 친근한) + 좌·우 2단(그림으로 보기·비슷한 속담) + 일상에서 만나기 + 미니 퀴즈 3문항(객관식 2 + 서술형 1). **그림 필드(visualEmoji)에 이모지 만화로 미니 시나리오를** 그려 주세요.',
  recommendedTemplateId: 'proverb-festive',
  availableTemplateIds: ['proverb-festive', 'idiom-low-grade', 'idiom-classic'],
};
