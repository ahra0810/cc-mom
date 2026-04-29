/**
 * Set 검증 + 빈 set 생성 유틸리티.
 *
 * - validateSet: 8슬롯 존재, 각 슬롯 type/필드 일치, 메타 4자 검증
 * - createEmptySet: 빈 8슬롯 + 빈 메타로 초기화 (SetEditor 시작점)
 * - getRequiredSlotType(idx): 슬롯 인덱스 → 강제 QuestionType
 */
import { nanoid } from 'nanoid';
import type { Question, Difficulty } from '../types';
import {
  REQUIRED_SLOT_TYPES,
  SLOT_COUNT,
  type QuestionSet,
  type SetSlots,
  type SetMeta,
  type SetDomain,
  type SetValidation,
  type SetValidationError,
  type SlotIndex,
} from '../types/sets';

const HANGUL_4_RE = /^[\uAC00-\uD7AF]{4}$/;
const HANJA_4_RE = /^[\u4E00-\u9FFF]{4}$/;

/* ─── 슬롯 인덱스 → 강제 QuestionType ─── */
export function getRequiredSlotType(idx: SlotIndex): Question['type'] {
  return REQUIRED_SLOT_TYPES[idx];
}

/* ─── 빈 Question 슬롯 생성 ─── */
function createEmptySlot(idx: SlotIndex, difficulty: Difficulty, subjectId: string): Question {
  const type = getRequiredSlotType(idx);
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
export function createEmptySet(domain: SetDomain = 'four-char-idiom', difficulty: Difficulty = 'medium'): QuestionSet {
  const id = nanoid();
  const subjectId = domain;
  const now = Date.now();

  const meta: SetMeta = {
    domain: 'four-char-idiom',
    idiom: '',
    hanja: '',
    meaning: '',
  };

  /* 8개 슬롯을 readonly tuple로 명시적으로 만든다 */
  const slots = [
    createEmptySlot(0, difficulty, subjectId),
    createEmptySlot(1, difficulty, subjectId),
    createEmptySlot(2, difficulty, subjectId),
    createEmptySlot(3, difficulty, subjectId),
    createEmptySlot(4, difficulty, subjectId),
    createEmptySlot(5, difficulty, subjectId),
    createEmptySlot(6, difficulty, subjectId),
    createEmptySlot(7, difficulty, subjectId),
  ] as const satisfies SetSlots;

  return {
    id,
    title: '새 학습지',
    domain,
    difficulty,
    meta,
    slots,
    tags: [],
    createdAt: now,
    updatedAt: now,
    source: 'manual',
  };
}

/* ─── 메타 → 1번 슬롯 자동 동기화 ─── */
/**
 * 메타데이터(idiom·hanja·meaning)가 변경되면 1번 슬롯의 hanjaTrace,
 * answer, question을 자동으로 동기화하는 헬퍼.
 * SetEditor에서 메타 입력 onChange에서 호출.
 */
export function syncSlot1FromMeta(slot1: Question, meta: SetMeta): Question {
  if (meta.domain !== 'four-char-idiom') return slot1;
  return {
    ...slot1,
    hanjaTrace: meta.hanja || undefined,
    /* answer는 한글음 (idiom). 이미 사용자가 채웠으면 덮어쓰지 않음 */
    answer: slot1.answer || meta.idiom || '',
    /* question 자동 채움 — 사용자가 이미 작성했으면 유지.
     * 부속(뜻)은 \n\n 뒤에 둬서 PDF에서 옅은 회색 컨텍스트 박스로 분리됨. */
    question: slot1.question
      ? slot1.question
      : meta.meaning
        ? `다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: ${meta.meaning}`
        : '',
  };
}

/* ─── 메타 → 8번 슬롯(서술형) 자동 동기화 ─── */
export function syncSlot8FromMeta(slot8: Question, meta: SetMeta): Question {
  if (meta.domain !== 'four-char-idiom') return slot8;
  if (slot8.question) return slot8; // 이미 작성됨 — 보존
  if (!meta.idiom) return slot8;
  return {
    ...slot8,
    question: `'${meta.idiom}'을(를) 사용해 한 문장을 만드세요.`,
  };
}

/* ─── 메인 검증 함수 ─── */
export function validateSet(set: Partial<QuestionSet>): SetValidation {
  const errors: SetValidationError[] = [];

  /* 제목 */
  if (!set.title || !set.title.trim()) {
    errors.push({ scope: 'title', message: '학습지 제목을 입력해 주세요' });
  }

  /* 메타 검증 (사자성어) */
  if (!set.meta) {
    errors.push({ scope: 'meta', message: '메타 정보가 없습니다' });
  } else if (set.meta.domain === 'four-char-idiom') {
    const m = set.meta;
    if (!m.idiom || !HANGUL_4_RE.test(m.idiom)) {
      errors.push({ scope: 'meta', field: 'idiom', message: '사자성어(한글 4자)를 정확히 입력해 주세요' });
    }
    if (!m.hanja || !HANJA_4_RE.test(m.hanja)) {
      errors.push({ scope: 'meta', field: 'hanja', message: '한자 4자를 정확히 입력해 주세요' });
    }
    if (!m.meaning || !m.meaning.trim()) {
      errors.push({ scope: 'meta', field: 'meaning', message: '뜻풀이를 입력해 주세요' });
    }
  }

  /* 슬롯 검증 */
  if (!set.slots || set.slots.length !== SLOT_COUNT) {
    errors.push({ scope: 0, message: `슬롯이 정확히 ${SLOT_COUNT}개여야 합니다` });
  } else {
    for (let i = 0; i < SLOT_COUNT; i++) {
      const slot = set.slots[i];
      const idx = i as SlotIndex;
      const requiredType = REQUIRED_SLOT_TYPES[i];

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

      /* 7번(서술형)은 answer가 빈 문자열이어도 허용 (모범답안 선택) */
      if (slot.type !== 'sentence-making') {
        if (!slot.answer || !slot.answer.trim()) {
          errors.push({ scope: idx, field: 'answer', message: `${i + 1}번 정답을 입력해 주세요` });
        }
      }

      /* 슬롯별 추가 검증 */
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

      if (slot.type === 'hanja-writing') {
        if (!slot.hanjaTrace || !HANJA_4_RE.test(slot.hanjaTrace)) {
          errors.push({
            scope: idx,
            field: 'hanjaTrace',
            message: `1번 한자 4자 (hanjaTrace)가 필요합니다`,
          });
        }
        /* answer는 메타의 idiom과 일치해야 함 — 권장 (warning 수준) */
        if (set.meta && set.meta.domain === 'four-char-idiom' && slot.answer && set.meta.idiom && slot.answer !== set.meta.idiom) {
          errors.push({
            scope: idx,
            field: 'answer',
            message: `1번 정답(한글음)이 메타의 사자성어와 다릅니다 (메타: ${set.meta.idiom}, 슬롯: ${slot.answer})`,
          });
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

/* ─── 슬롯별 진행률 계산 (UI: "5/7") ─── */
export function getSlotCompletionCount(set: QuestionSet): number {
  let count = 0;
  for (let i = 0; i < SLOT_COUNT; i++) {
    const slot = set.slots[i];
    const required = REQUIRED_SLOT_TYPES[i];
    if (slot.type !== required) continue;

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
