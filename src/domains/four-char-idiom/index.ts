/**
 * 사자성어 도메인 — DomainConfig 등록.
 * 다른 코드는 이 모듈을 직접 import하지 않고 registry.ts를 통해 접근합니다.
 */
import type { Question } from '../../types';
import type { IdiomMeta, SetValidationError } from '../../types/sets';
import type { DomainConfig, DomainCardSummary } from '../types';

import { IDIOM_LABELS } from './labels';
import { PROMPT_USER_PROVIDES_IDIOM, PROMPT_AI_SELECTS_IDIOM } from './prompts';
import { renderIdiomMetaBlock } from './pdfMeta';
import IdiomMetaEditor from './MetaEditor';
import { DEFAULT_SETS } from '../../data/defaultSets';

/* ─── 사자성어 검증 정규식 ─── */
const HANGUL_4_RE = /^[\uAC00-\uD7AF]{4}$/;
const HANJA_4_RE = /^[\u4E00-\u9FFF]{4}$/;

/* ─── 메타 검증 ─── */
function validateIdiomMeta(meta: IdiomMeta): SetValidationError[] {
  const errors: SetValidationError[] = [];
  if (!meta.idiom || !HANGUL_4_RE.test(meta.idiom)) {
    errors.push({ scope: 'meta', field: 'idiom', message: '사자성어(한글 4자)를 정확히 입력해 주세요' });
  }
  if (!meta.hanja || !HANJA_4_RE.test(meta.hanja)) {
    errors.push({ scope: 'meta', field: 'hanja', message: '한자 4자를 정확히 입력해 주세요' });
  }
  if (!meta.meaning || !meta.meaning.trim()) {
    errors.push({ scope: 'meta', field: 'meaning', message: '뜻풀이를 입력해 주세요' });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ─── */
function syncSlotFromIdiomMeta(slotIdx: number, slot: Question, meta: IdiomMeta): Question {
  /* 1번 슬롯: hanja-writing */
  if (slotIdx === 0) {
    return {
      ...slot,
      hanjaTrace: meta.hanja || undefined,
      answer: slot.answer || meta.idiom || '',
      question: slot.question
        ? slot.question
        : meta.meaning
          ? `다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: ${meta.meaning}`
          : '',
    };
  }
  /* 8번 슬롯: sentence-making */
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.idiom) return slot;
    return {
      ...slot,
      question: `'${meta.idiom}'을(를) 사용해 한 문장을 만드세요.`,
    };
  }
  return slot;
}

/* ─── title 자동 생성 ─── */
function deriveIdiomTitle(meta: IdiomMeta, currentTitle: string): string {
  if (
    meta.idiom &&
    (!currentTitle ||
      currentTitle === '새 학습지' ||
      currentTitle.endsWith(' 학습지'))
  ) {
    return `${meta.idiom} 학습지`;
  }
  return currentTitle;
}

/* ─── 좌측 패널 검색용 haystack ─── */
function getIdiomSearchHaystack(meta: IdiomMeta): string {
  return `${meta.idiom} ${meta.hanja} ${meta.meaning} ${meta.origin || ''}`;
}

/* ─── 카드 요약 (좌측 카드 / 우측 출력 카드) ─── */
function getIdiomCardSummary(meta: IdiomMeta): DomainCardSummary {
  return {
    headline: meta.idiom || '사자성어 미입력',
    subhead: meta.hanja || '—',
    body: meta.meaning || '',
  };
}

/* ─── 사자성어 도메인 시드만 추출 ─── */
const IDIOM_SEEDS = DEFAULT_SETS.filter((s) => s.domain === 'four-char-idiom');

/* ─── DomainConfig export ─── */
export const idiomDomainConfig: DomainConfig<IdiomMeta> = {
  id: 'four-char-idiom',
  labels: IDIOM_LABELS,
  slotConfig: {
    count: 8,
    requiredTypes: [
      'hanja-writing',
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
    domain: 'four-char-idiom',
    idiom: '',
    hanja: '',
    meaning: '',
  }),
  validateMeta: validateIdiomMeta,
  deriveTitle: deriveIdiomTitle,
  syncSlotFromMeta: syncSlotFromIdiomMeta,
  getSearchHaystack: getIdiomSearchHaystack,
  getCardSummary: getIdiomCardSummary,
  MetaEditor: IdiomMetaEditor,
  renderMetaBlock: (meta, t) => renderIdiomMetaBlock(meta, t),
  aiPrompts: {
    userKeyword: PROMPT_USER_PROVIDES_IDIOM,
    aiSelect: PROMPT_AI_SELECTS_IDIOM,
  },
  defaultSets: IDIOM_SEEDS,
  editorHint:
    '💡 1번 한자 따라쓰기 → 2~7번 객관식 → 8번 문장 만들기 순서로 작성하세요. 메타에 사자성어 정보를 채우면 1·8번이 자동으로 일부 채워집니다.',
  recommendedTemplateId: 'idiom-festive',
};
