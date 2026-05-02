/**
 * 속담 도메인 — DomainConfig 등록.
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
    errors.push({ scope: 'meta', field: 'meaning', message: '뜻풀이를 입력해 주세요' });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ─── */
function syncSlotFromProverbMeta(slotIdx: number, slot: Question, meta: ProverbMeta): Question {
  /* 1번 슬롯: short-answer (속담 빈칸 채우기). 사용자가 빈칸을 직접 정하므로 question 자동 채움은 hint 수준. */
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.proverb) return slot;
    /* 가장 인상적인 어절을 빈칸으로 만들 수 없어서, 단순 hint만 — 사용자가 편집해야 함 */
    return {
      ...slot,
      question: `다음 빈칸을 채우세요: ${meta.proverb}`,
    };
  }
  /* 8번 슬롯: sentence-making */
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.proverb) return slot;
    return {
      ...slot,
      question: `'${meta.proverb}'이(가) 어울리는 상황을 한 문장으로 쓰세요.`,
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
    /* 속담이 길면 자르고 ... 붙임 */
    const head = meta.proverb.length > 14 ? `${meta.proverb.slice(0, 14)}…` : meta.proverb;
    return `${head} 학습지`;
  }
  return currentTitle;
}

/* ─── 좌측 패널 검색 haystack ─── */
function getProverbSearchHaystack(meta: ProverbMeta): string {
  return `${meta.proverb} ${meta.meaning} ${meta.lesson || ''} ${meta.origin || ''}`;
}

/* ─── 카드 요약 (좌측 카드 / 우측 출력 카드) ─── */
function getProverbCardSummary(meta: ProverbMeta): DomainCardSummary {
  return {
    /* 카드 헤드라인은 속담 본문 (긴 경우 잘림은 UI에서 truncate) */
    headline: meta.proverb || '속담 미입력',
    /* 카드 subhead는 짧은 인용 마크 */
    subhead: meta.proverb ? '”' : '—',
    body: meta.meaning || '',
  };
}

/* ─── DomainConfig export ─── */
export const proverbDomainConfig: DomainConfig<ProverbMeta> = {
  id: 'proverb',
  labels: PROVERB_LABELS,
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
    '💡 1번 빈칸 채우기 → 2~7번 객관식 → 8번 문장 만들기 순서로 작성하세요. 메타에 속담 정보를 채우면 1·8번이 자동으로 일부 채워집니다.',
  recommendedTemplateId: 'proverb-festive',
};
