/**
 * 관용어 도메인 — DomainConfig 등록.
 * v2: 시각 카드 + 일상 응용 + 미니 퀴즈 3문항 (math-concept 패턴).
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
    errors.push({ scope: 'meta', field: 'meaning', message: '친근한 뜻을 입력해 주세요' });
  }
  return errors;
}

/* ─── 메타 → 슬롯 자동 동기화 ───
 * 슬롯 구성 (8슬롯, 2페이지):
 *   페이지 1 — 인지·이해
 *     [0] short-answer : 빈칸 채우기 (신체 부위 채우기)
 *     [1] mc           : 친근한 뜻
 *     [2] mc           : 교과서 정의
 *     [3] mc           : 비슷한 관용어
 *   페이지 2 — 적용·산출
 *     [4] mc           : 어울리는 일상 상황
 *     [5] mc           : 잘못 쓰인 예 찾기
 *     [6] mc           : 비유의 의미 (왜 이 신체 부위?)
 *     [7] sentence-making : 직접 응용 */
function syncSlotFromPhraseMeta(slotIdx: number, slot: Question, meta: IdiomaticPhraseMeta): Question {
  if (slotIdx === 0) {
    if (slot.question) return slot;
    if (!meta.phrase) return slot;
    return {
      ...slot,
      question: `🌱 다음 빈칸을 채우세요: ${meta.phrase}`,
    };
  }
  if (slotIdx === 7) {
    if (slot.question) return slot;
    if (!meta.phrase) return slot;
    return {
      ...slot,
      question: `🤝 "${meta.phrase}"을(를) 사용해서 짧은 문장을 만들어 보세요.`,
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
  return [
    meta.phrase,
    meta.textbookMeaning || '',
    meta.meaning,
    meta.visualEmoji || '',
    meta.visualExample || '',
    (meta.relatedPhrases || []).join(' '),
    (meta.relatedPhrasesDetailed || []).map((f) => `${f.term} ${f.desc}`).join(' '),
    meta.usageExample || '',
    meta.example || '',
    meta.origin || '',
  ].join(' ');
}

/* ─── 카드 요약 ─── */
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
    /* 2페이지 구성 — 1+7 split (템플릿 폰트가 커도 잘리지 않도록):
     *   페이지 1: 풀폭 학습 카드 + 빈칸 채우기 1문항 (인지)
     *   페이지 2: 나머지 7문항 (페이지 가득 분배) */
    count: 8,
    requiredTypes: [
      'short-answer',
      'multiple-choice', 'multiple-choice', 'multiple-choice',
      'multiple-choice', 'multiple-choice', 'multiple-choice',
      'sentence-making',
    ],
    autoSyncedSlots: [0, 7],
    pageBreaks: [0],
    pageHeaders: [
      '📖 페이지 1 / 2 — 관용어 만나기',
      '✏️ 페이지 2 / 2 — 문제 풀기',
    ],
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
    '💡 시각 카드 + 8문항 학습지 (초3~중1, A4 2페이지 — 양면 인쇄 권장). 페이지 1: 시각 카드 + 인지·이해 3문항(빈칸·친근뜻·교과서뜻). 페이지 2: 분석·적용·종합·산출 5문항(비슷한 관용어·상황·잘못 쓰인 예·비유 의미·직접 문장). **그림 필드(visualEmoji)에 이모지 만화**로 미니 시나리오를 그려 주세요. visualEmoji는 5줄 이내 권장.',
  recommendedTemplateId: 'phrase-festive',
  availableTemplateIds: ['phrase-festive', 'idiom-low-grade', 'idiom-classic'],
};
