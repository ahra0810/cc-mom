/**
 * Set 검증 + 빈 set 생성 유틸리티 — Domain Registry 경유.
 *
 * 도메인별 로직(메타 검증·슬롯 자동 동기화·title 생성 등)은 모두
 * src/domains/<id>/index.ts의 DomainConfig에 정의되어 있고,
 * 이 파일은 그 도메인 설정을 호출만 합니다.
 */
import { nanoid } from 'nanoid';
import type { Question, Difficulty } from '../types';
import {
  type QuestionSet,
  type SetSlots,
  type SetMeta,
  type SetDomain,
  type SetValidation,
  type SetValidationError,
  type SlotIndex,
} from '../types/sets';
import { getDomain } from '../domains/registry';

/* ─── 슬롯 인덱스 → 강제 QuestionType (도메인 위임) ─── */
export function getRequiredSlotType(domain: SetDomain, idx: number): Question['type'] {
  return getDomain(domain).slotConfig.requiredTypes[idx];
}

/* ─── 빈 Question 슬롯 생성 ─── */
function createEmptySlot(
  domain: SetDomain,
  idx: number,
  difficulty: Difficulty,
  subjectId: string,
): Question {
  const type = getRequiredSlotType(domain, idx);
  const base: Question = {
    id: nanoid(),
    type,
    subjectId,
    difficulty,
    question: '',
    answer: '',
    createdAt: Date.now(),
    source: 'manual',
  };
  if (type === 'multiple-choice') {
    base.options = ['', '', '', ''];
  }
  return base;
}

/* ─── 빈 set 생성 ─── */
export function createEmptySet(
  domain: SetDomain = 'four-char-idiom',
  difficulty: Difficulty = 'medium',
): QuestionSet {
  const id = nanoid();
  const subjectId = domain;
  const now = Date.now();
  const cfg = getDomain(domain);

  /* 도메인이 정의한 슬롯 카운트만큼 빈 슬롯 생성 */
  const slotsArr: Question[] = [];
  for (let i = 0; i < cfg.slotConfig.count; i++) {
    slotsArr.push(createEmptySlot(domain, i, difficulty, subjectId));
  }
  /* SetSlots는 8슬롯 readonly tuple로 선언되어 있어 cast 필요.
   * 도메인별 슬롯 카운트가 다양해지면 추후 SetSlots를 일반화. */
  const slots = slotsArr as unknown as SetSlots;

  return {
    id,
    title: '새 학습지',
    domain,
    difficulty,
    meta: cfg.createEmptyMeta(),
    slots,
    tags: [],
    createdAt: now,
    updatedAt: now,
    source: 'manual',
  };
}

/* ─── 메타 → 슬롯 자동 동기화 (도메인 위임) ─── */
/**
 * setStore.applyMetaSync에서 호출. 도메인의 autoSyncedSlots에 포함된
 * 인덱스 모두에 대해 syncSlotFromMeta를 적용한 새 slots 배열을 반환.
 */
export function applyDomainSlotSync(set: QuestionSet): QuestionSet {
  const cfg = getDomain(set.domain);
  if (!cfg.slotConfig.autoSyncedSlots.length) return set;

  const slots = [...(set.slots as unknown as Question[])];
  for (const idx of cfg.slotConfig.autoSyncedSlots) {
    if (idx >= 0 && idx < slots.length) {
      slots[idx] = cfg.syncSlotFromMeta(idx, slots[idx], set.meta);
    }
  }
  return { ...set, slots: slots as unknown as SetSlots };
}

/* ─── 메인 검증 함수 ─── */
export function validateSet(set: Partial<QuestionSet>): SetValidation {
  const errors: SetValidationError[] = [];

  /* 제목 */
  if (!set.title || !set.title.trim()) {
    errors.push({ scope: 'title', message: '학습지 제목을 입력해 주세요' });
  }

  /* 메타 검증 (도메인 위임) */
  if (!set.meta) {
    errors.push({ scope: 'meta', message: '메타 정보가 없습니다' });
  } else {
    const cfg = getDomain(set.meta.domain);
    errors.push(...cfg.validateMeta(set.meta as SetMeta));
  }

  /* 슬롯 검증 — 도메인의 slotConfig.requiredTypes 사용 */
  const cfg = set.domain ? getDomain(set.domain) : null;
  const requiredTypes = cfg?.slotConfig.requiredTypes ?? [];
  const slotCount = cfg?.slotConfig.count ?? 8;

  if (!set.slots || set.slots.length !== slotCount) {
    errors.push({ scope: 0, message: `슬롯이 정확히 ${slotCount}개여야 합니다` });
  } else {
    for (let i = 0; i < slotCount; i++) {
      const slot = set.slots[i];
      const idx = i as SlotIndex;
      const requiredType = requiredTypes[i];

      /* 타입 일치 */
      if (slot.type !== requiredType) {
        errors.push({
          scope: idx,
          field: 'type',
          message: `${i + 1}번 슬롯은 "${requiredType}" 유형이어야 합니다 (현재: ${slot.type})`,
        });
        continue;
      }

      /* 공통: question / answer */
      if (!slot.question || !slot.question.trim()) {
        errors.push({ scope: idx, field: 'question', message: `${i + 1}번 문제 내용을 입력해 주세요` });
      }

      /* 서술형(sentence-making)은 answer가 빈 문자열이어도 허용 (모범답안 선택) */
      if (slot.type !== 'sentence-making') {
        if (!slot.answer || !slot.answer.trim()) {
          errors.push({ scope: idx, field: 'answer', message: `${i + 1}번 정답을 입력해 주세요` });
        }
      }

      /* 객관식 추가 검증 */
      if (slot.type === 'multiple-choice') {
        const opts = slot.options || [];
        if (opts.length !== 4) {
          errors.push({ scope: idx, field: 'options', message: `${i + 1}번은 정확히 4개의 보기가 필요합니다` });
        } else if (opts.some((o) => !o || !o.trim())) {
          errors.push({ scope: idx, field: 'options', message: `${i + 1}번의 모든 보기를 채워 주세요` });
        } else if (slot.answer && !opts.includes(slot.answer)) {
          errors.push({ scope: idx, field: 'answer', message: `${i + 1}번 정답이 보기 중에 없습니다` });
        }
      }

      /* hanja-writing 추가 검증 (사자성어 도메인 전용 — type 자체로 분기) */
      if (slot.type === 'hanja-writing') {
        const HANJA_4_RE = /^[\u4E00-\u9FFF]{4}$/;
        if (!slot.hanjaTrace || !HANJA_4_RE.test(slot.hanjaTrace)) {
          errors.push({
            scope: idx,
            field: 'hanjaTrace',
            message: `${i + 1}번 한자 4자 (hanjaTrace)가 필요합니다`,
          });
        }
        /* answer는 메타의 idiom과 일치해야 함 — 권장 */
        if (
          set.meta &&
          set.meta.domain === 'four-char-idiom' &&
          slot.answer &&
          set.meta.idiom &&
          slot.answer !== set.meta.idiom
        ) {
          errors.push({
            scope: idx,
            field: 'answer',
            message: `${i + 1}번 정답(한글음)이 메타의 사자성어와 다릅니다 (메타: ${set.meta.idiom}, 슬롯: ${slot.answer})`,
          });
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

/* ─── 슬롯별 진행률 계산 ─── */
export function getSlotCompletionCount(set: QuestionSet): number {
  const cfg = getDomain(set.domain);
  const requiredTypes = cfg.slotConfig.requiredTypes;
  const slotCount = cfg.slotConfig.count;
  const HANJA_4_RE = /^[\u4E00-\u9FFF]{4}$/;

  let count = 0;
  for (let i = 0; i < slotCount; i++) {
    const slot = set.slots[i];
    const required = requiredTypes[i];
    if (!slot || slot.type !== required) continue;

    if (!slot.question || !slot.question.trim()) continue;
    if (required !== 'sentence-making' && (!slot.answer || !slot.answer.trim())) continue;
    if (required === 'multiple-choice') {
      const opts = slot.options || [];
      if (opts.length !== 4 || opts.some((o) => !o || !o.trim())) continue;
    }
    if (required === 'hanja-writing') {
      if (!slot.hanjaTrace || !HANJA_4_RE.test(slot.hanjaTrace)) continue;
    }
    count++;
  }
  return count;
}
