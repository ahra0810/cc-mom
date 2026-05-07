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
 * 슬롯 구성 (8슬롯, 2페이지):
 *   페이지 1 — 인지·이해
 *     [0] short-answer : 빈칸 채우기 (본문 암기)
 *     [1] mc           : 친근한 뜻
 *     [2] mc           : 교과서 정의
 *     [3] mc           : 비슷한 속담 찾기
 *   페이지 2 — 적용·산출
 *     [4] mc           : 어울리는 일상 상황
 *     [5] mc           : 잘못 쓰인 예 찾기
 *     [6] mc           : 핵심 교훈/속담 종합
 *     [7] sentence-making : 직접 응용
 * 빈 슬롯에만 hint 채움 (사용자/AI 작성 보호). */
function syncSlotFromProverbMeta(slotIdx: number, slot: Question, meta: ProverbMeta): Question {
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.proverb) return slot;
    return {
      ...slot,
      question: `🌱 다음 빈칸을 채우세요: ${meta.proverb}`,
    };
  }
  if (slotIdx === 7) {
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

/* ─── 카드 요약 — 속담은 본문이 길어 본문만 노출 (subhead/body 숨김) ─── */
function getProverbCardSummary(meta: ProverbMeta): DomainCardSummary {
  return {
    headline: meta.proverb || '속담 미입력',
    subhead: '',
    body: '',
  };
}

/* ─── DomainConfig export ─── */
export const proverbDomainConfig: DomainConfig<ProverbMeta> = {
  id: 'proverb',
  labels: PROVERB_LABELS,
  slotConfig: {
    /* 2페이지 구성 (Bloom's Taxonomy):
     *   페이지 1 (인지·이해): short-answer + mc 3개
     *   페이지 2 (적용·산출): mc 3개 + sentence-making */
    count: 8,
    requiredTypes: [
      'short-answer',
      'multiple-choice', 'multiple-choice', 'multiple-choice',
      'multiple-choice', 'multiple-choice', 'multiple-choice',
      'sentence-making',
    ],
    autoSyncedSlots: [0, 7],
    /* 슬롯 4(idx=3) 다음에서 페이지 분할 */
    pageBreaks: [3],
    pageHeaders: [
      '📖 페이지 1 / 2 — 속담 인지·이해',
      '✏️ 페이지 2 / 2 — 일상 적용·응용',
    ],
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
    '💡 시각 카드 + 8문항 학습지 (초3~중1, A4 2페이지 — 양면 인쇄 권장). 페이지 1: 시각 카드 + 인지·이해 4문항(빈칸·친근뜻·교과서뜻·비슷한속담). 페이지 2: 적용·산출 4문항(상황·잘못쓰인예·교훈·직접 문장). **그림 필드(visualEmoji)에 이모지 만화**로 미니 시나리오를 그려 주세요.',
  recommendedTemplateId: 'proverb-festive',
  availableTemplateIds: ['proverb-festive', 'idiom-low-grade', 'idiom-classic'],
};
