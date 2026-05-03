/**
 * 관용어 도메인 — DomainConfig 등록.
 */
import type { Question } from '../../types';
import type { IdiomaticPhraseMeta, SetValidationError } from '../../types/sets';
import type { DomainConfig, DomainCardSummary } from '../types';

import { IDIOMATIC_LABELS } from './labels';
import { PROMPT_USER_PROVIDES_PHRASE, PROMPT_AI_SELECTS_PHRASE } from './prompts';
import { renderIdiomaticMetaBlock } from './pdfMeta';
import IdiomaticMetaEditor from './MetaEditor';
import { IDIOMATIC_DEFAULT_SETS } from './defaultSets';

/* ─── 메타 검증 ─── */
function validatePhraseMeta(meta: IdiomaticPhraseMeta): SetValidationError[] {
  const errors: SetValidationError[] = [];
  if (!meta.phrase || meta.phrase.trim().length < 2) {
    errors.push({ scope: 'meta', field: 'phrase', message: '관용어 본문을 입력해 주세요 (2자 이상)' });
  }
  if (!meta.meaning || !meta.meaning.trim()) {
    errors.push({ scope: 'meta', field: 'meaning', message: '뜻풀이를 입력해 주세요' });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ─── */
function syncSlotFromPhraseMeta(slotIdx: number, slot: Question, meta: IdiomaticPhraseMeta): Question {
  /* 1번 슬롯: short-answer (관용어 빈칸 채우기) */
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.phrase) return slot;
    /* 사용자가 어절을 정해야 하므로 hint만 — 실제 빈칸은 편집에서 ___ 표시 */
    const hintMeaning = meta.meaning ? ` (${meta.meaning})` : '';
    return {
      ...slot,
      question: `다음 빈칸을 채우세요: ${meta.phrase}${hintMeaning}`,
    };
  }
  /* 8번 슬롯: sentence-making */
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.phrase) return slot;
    return {
      ...slot,
      question: `'${meta.phrase}'을(를) 사용해 한 문장을 만드세요.`,
    };
  }
  return slot;
}

/* ─── title 자동 생성 ─── */
function derivePhraseTitle(meta: IdiomaticPhraseMeta, currentTitle: string): string {
  if (
    meta.phrase &&
    (!currentTitle ||
      currentTitle === '새 학습지' ||
      currentTitle.endsWith(' 학습지'))
  ) {
    const head = meta.phrase.length > 14 ? `${meta.phrase.slice(0, 14)}…` : meta.phrase;
    return `${head} 학습지`;
  }
  return currentTitle;
}

/* ─── 좌측 패널 검색 haystack ─── */
function getPhraseSearchHaystack(meta: IdiomaticPhraseMeta): string {
  return `${meta.phrase} ${meta.meaning} ${meta.example || ''} ${meta.origin || ''}`;
}

/* ─── 카드 요약 (좌측 카드 / 우측 출력 카드) ─── */
function getPhraseCardSummary(meta: IdiomaticPhraseMeta): DomainCardSummary {
  return {
    headline: meta.phrase || '관용어 미입력',
    subhead: meta.phrase ? '”' : '—',
    body: meta.meaning || '',
  };
}

/* ─── DomainConfig export ─── */
export const idiomaticPhraseDomainConfig: DomainConfig<IdiomaticPhraseMeta> = {
  id: 'idiomatic-phrase',
  labels: IDIOMATIC_LABELS,
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
    domain: 'idiomatic-phrase',
    phrase: '',
    meaning: '',
  }),
  validateMeta: validatePhraseMeta,
  deriveTitle: derivePhraseTitle,
  syncSlotFromMeta: syncSlotFromPhraseMeta,
  getSearchHaystack: getPhraseSearchHaystack,
  getCardSummary: getPhraseCardSummary,
  MetaEditor: IdiomaticMetaEditor,
  renderMetaBlock: (meta, t) => renderIdiomaticMetaBlock(meta, t),
  aiPrompts: {
    userKeyword: PROMPT_USER_PROVIDES_PHRASE,
    aiSelect: PROMPT_AI_SELECTS_PHRASE,
  },
  defaultSets: IDIOMATIC_DEFAULT_SETS,
  editorHint:
    '💡 1번 빈칸 채우기 → 2~7번 객관식 → 8번 문장 만들기 순서로 작성하세요. 메타에 관용어 정보를 채우면 1·8번이 자동으로 일부 채워집니다.',
  recommendedTemplateId: 'phrase-festive',
  /* 관용어 어울리는 템플릿 — festive(기본) + 저학년 친화 + 클래식 */
  availableTemplateIds: ['phrase-festive', 'idiom-low-grade', 'idiom-classic'],
};
