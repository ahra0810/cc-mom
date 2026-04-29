/**
 * setStore — Set 단위 영속 store.
 *
 * key: idiom-set-maker-v1
 * partialize: { sets, selectedSetId } 만 영속화
 * 첫 부팅(저장 데이터 없음) 시 DEFAULT_SETS 자동 시드
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import type { Question, Difficulty } from '../types';
import type {
  QuestionSet,
  SetSlots,
  SetMeta,
  SetDomain,
  SetValidation,
  SlotIndex,
} from '../types/sets';
import { SLOT_COUNT } from '../types/sets';
import {
  validateSet,
  createEmptySet,
  syncSlot1FromMeta,
  syncSlot8FromMeta,
} from '../services/setValidator';
import { DEFAULT_SETS } from '../data/defaultSets';

/* ─── 필터 ─── */
export interface SetFilters {
  domain: SetDomain | null;
  difficulty: Difficulty | null;
  search: string;
}

/* ─── Import 결과 리포트 ─── */
export interface SetImportReport {
  ok: number;
  failed: { index: number; errors: string[] }[];
  newSets: QuestionSet[];
}

/* ─── Store 인터페이스 ─── */
interface SetStore {
  /* 영속 상태 */
  sets: QuestionSet[];
  selectedSetId: string | null;
  /** 가운데 미리보기 + PDF 출력에 공유되는 템플릿 id. null이면 기본 템플릿. */
  selectedTemplateId: string | null;

  /* 휘발성 상태 */
  editingSetDraft: QuestionSet | null;
  filters: SetFilters;

  /* CRUD */
  addSet: (set: QuestionSet) => void;
  updateSet: (id: string, updates: Partial<QuestionSet>) => void;
  deleteSet: (id: string) => void;
  deleteSets: (ids: string[]) => number;  // 일괄 삭제 — 삭제된 개수 반환
  duplicateSet: (id: string) => string | null;

  /* Editing — draft 기반 */
  startNewSet: (domain?: SetDomain, difficulty?: Difficulty) => void;
  startEditSet: (id: string) => void;
  updateDraftMeta: (meta: Partial<SetMeta>) => void;
  updateDraftSlot: (idx: SlotIndex, updates: Partial<Question>) => void;
  updateDraftField: (field: 'title' | 'difficulty' | 'tags', value: unknown) => void;
  commitDraft: () => boolean; // true = 저장 성공, false = 검증 실패
  discardDraft: () => void;
  validateDraft: () => SetValidation;

  /* Selection (출력 대상) */
  selectSet: (id: string | null) => void;
  /* Template — 미리보기·PDF 출력 양쪽에 적용 */
  setSelectedTemplateId: (id: string | null) => void;

  /* Filter */
  setFilters: (f: Partial<SetFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  getFilteredSets: () => QuestionSet[];

  /* Export / Import */
  exportData: () => string;
  importData: (jsonStr: string) => SetImportReport;

  /* Utilities */
  getSetById: (id: string) => QuestionSet | undefined;
  resetToSeed: () => void;
}

/* ─── Helper: tuple로 변환 ─── */
function toSetSlots(slots: Question[]): SetSlots {
  if (slots.length !== SLOT_COUNT) {
    throw new Error(`SetSlots requires exactly ${SLOT_COUNT} slots, got ${slots.length}`);
  }
  return slots as unknown as SetSlots;
}

/* ─── 메타와 슬롯 1·7번 자동 동기화 ─── */
function applyMetaSync(set: QuestionSet): QuestionSet {
  const slots = [...set.slots] as Question[];
  slots[0] = syncSlot1FromMeta(slots[0], set.meta);
  slots[7] = syncSlot8FromMeta(slots[7], set.meta);
  return { ...set, slots: toSetSlots(slots) };
}

/* ─── Store 구현 ─── */
export const useSetStore = create<SetStore>()(
  persist(
    (set, get) => ({
      sets: [],
      selectedSetId: null,
      selectedTemplateId: null,
      editingSetDraft: null,
      filters: { domain: null, difficulty: null, search: '' },

      /* CRUD */
      addSet: (newSet) =>
        set((state) => ({ sets: [newSet, ...state.sets] })),

      updateSet: (id, updates) =>
        set((state) => ({
          sets: state.sets.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          ),
        })),

      deleteSet: (id) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== id),
          selectedSetId: state.selectedSetId === id ? null : state.selectedSetId,
        })),

      deleteSets: (ids) => {
        if (!Array.isArray(ids) || ids.length === 0) return 0;
        const toDelete = new Set(ids);
        const before = get().sets.length;
        set((state) => ({
          sets: state.sets.filter((s) => !toDelete.has(s.id)),
          selectedSetId:
            state.selectedSetId && toDelete.has(state.selectedSetId)
              ? null
              : state.selectedSetId,
        }));
        return before - get().sets.length;
      },

      duplicateSet: (id) => {
        const original = get().sets.find((s) => s.id === id);
        if (!original) return null;
        const now = Date.now();
        const dup: QuestionSet = {
          ...JSON.parse(JSON.stringify(original)),
          id: nanoid(),
          title: `${original.title} (복제)`,
          createdAt: now,
          updatedAt: now,
          source: 'manual',
        };
        /* 슬롯 ID도 새로 발급 */
        const dupSlots = (dup.slots as unknown as Question[]).map((q) => ({
          ...q, id: nanoid(),
        }));
        dup.slots = toSetSlots(dupSlots);
        set((state) => ({ sets: [dup, ...state.sets] }));
        return dup.id;
      },

      /* Editing */
      startNewSet: (domain = 'four-char-idiom', difficulty = 'medium') =>
        set({ editingSetDraft: createEmptySet(domain, difficulty) }),

      startEditSet: (id) => {
        const target = get().sets.find((s) => s.id === id);
        if (!target) return;
        /* 깊은 복사로 draft 만들기 (취소 시 원본 보존) */
        set({ editingSetDraft: JSON.parse(JSON.stringify(target)) });
      },

      updateDraftMeta: (metaUpdates) =>
        set((state) => {
          if (!state.editingSetDraft) return state;
          const merged: SetMeta = { ...state.editingSetDraft.meta, ...metaUpdates } as SetMeta;
          /* idiom 변경 시 title 자동 업데이트 (사용자가 별도 변경하지 않은 경우) */
          let newTitle = state.editingSetDraft.title;
          if (
            merged.domain === 'four-char-idiom' &&
            merged.idiom &&
            (!state.editingSetDraft.title ||
              state.editingSetDraft.title === '새 학습지' ||
              state.editingSetDraft.title.endsWith(' 학습지'))
          ) {
            newTitle = `${merged.idiom} 학습지`;
          }
          const next: QuestionSet = {
            ...state.editingSetDraft,
            meta: merged,
            title: newTitle,
          };
          return { editingSetDraft: applyMetaSync(next) };
        }),

      updateDraftSlot: (idx, updates) =>
        set((state) => {
          if (!state.editingSetDraft) return state;
          const slots = [...state.editingSetDraft.slots] as Question[];
          slots[idx] = { ...slots[idx], ...updates };
          return {
            editingSetDraft: { ...state.editingSetDraft, slots: toSetSlots(slots) },
          };
        }),

      updateDraftField: (field, value) =>
        set((state) => {
          if (!state.editingSetDraft) return state;
          return {
            editingSetDraft: { ...state.editingSetDraft, [field]: value } as QuestionSet,
          };
        }),

      validateDraft: () => {
        const draft = get().editingSetDraft;
        if (!draft) return { ok: false, errors: [{ scope: 'meta', message: '편집 중인 set이 없습니다' }] };
        return validateSet(draft);
      },

      commitDraft: () => {
        const draft = get().editingSetDraft;
        if (!draft) return false;
        const validation = validateSet(draft);
        if (!validation.ok) return false;
        const finalized: QuestionSet = { ...draft, updatedAt: Date.now() };

        const exists = get().sets.find((s) => s.id === finalized.id);
        if (exists) {
          /* 기존 set 업데이트 */
          set((state) => ({
            sets: state.sets.map((s) => (s.id === finalized.id ? finalized : s)),
            editingSetDraft: null,
          }));
        } else {
          /* 새 set 추가 */
          set((state) => ({
            sets: [finalized, ...state.sets],
            editingSetDraft: null,
            selectedSetId: state.selectedSetId ?? finalized.id,
          }));
        }
        return true;
      },

      discardDraft: () => set({ editingSetDraft: null }),

      /* Selection */
      selectSet: (id) => set({ selectedSetId: id }),
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),

      /* Filter */
      setFilters: (f) =>
        set((state) => ({ filters: { ...state.filters, ...f } })),

      clearFilters: () =>
        set({ filters: { domain: null, difficulty: null, search: '' } }),

      hasActiveFilters: () => {
        const f = get().filters;
        return !!(f.domain || f.difficulty || f.search.trim());
      },

      getFilteredSets: () => {
        const { sets, filters } = get();
        const term = filters.search.trim().toLowerCase();
        return sets.filter((s) => {
          if (filters.domain && s.domain !== filters.domain) return false;
          if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
          if (term) {
            const haystack = [
              s.title,
              s.tags?.join(' ') || '',
              s.meta.domain === 'four-char-idiom' ? `${s.meta.idiom} ${s.meta.hanja} ${s.meta.meaning} ${s.meta.origin || ''}` : '',
              ...((s.slots as unknown as Question[]).map((q) => `${q.question} ${q.answer} ${(q.options || []).join(' ')}`)),
            ].join(' ').toLowerCase();
            if (!haystack.includes(term)) return false;
          }
          return true;
        });
      },

      /* Export / Import */
      exportData: () => {
        const { sets } = get();
        return JSON.stringify({ version: 1, sets }, null, 2);
      },

      importData: (jsonStr) => {
        let data: { version?: number; sets?: unknown[] };
        try {
          data = JSON.parse(jsonStr);
        } catch {
          throw new Error('JSON 파싱 실패');
        }
        if (!data.sets || !Array.isArray(data.sets)) {
          throw new Error('"sets" 배열이 없습니다');
        }
        if (data.version && data.version !== 1) {
          throw new Error(`지원하지 않는 버전: ${data.version}`);
        }

        const report: SetImportReport = { ok: 0, failed: [], newSets: [] };
        const existingIds = new Set(get().sets.map((s) => s.id));
        const accepted: QuestionSet[] = [];

        data.sets.forEach((raw, idx) => {
          const setObj = raw as Partial<QuestionSet>;
          /* ID 중복 시 새로 발급 */
          let id = typeof setObj.id === 'string' ? setObj.id : nanoid();
          if (existingIds.has(id)) id = nanoid();
          existingIds.add(id);

          const now = Date.now();
          const partial: Partial<QuestionSet> = {
            ...setObj,
            id,
            createdAt: typeof setObj.createdAt === 'number' ? setObj.createdAt : now,
            updatedAt: now,
            source: 'ai-imported',
          };

          /* 슬롯 ID 보장 */
          if (Array.isArray(setObj.slots)) {
            const slotsWithIds = (setObj.slots as Question[]).map((q) => ({
              ...q,
              id: typeof q?.id === 'string' && q.id ? q.id : nanoid(),
              createdAt: typeof q?.createdAt === 'number' ? q.createdAt : now,
              source: q?.source || 'ai-imported',
              subjectId: q?.subjectId || (setObj.domain || 'four-char-idiom'),
            }));
            partial.slots = slotsWithIds as unknown as SetSlots;
          }

          const validation = validateSet(partial);
          if (validation.ok) {
            accepted.push(partial as QuestionSet);
            report.ok++;
            report.newSets.push(partial as QuestionSet);
          } else {
            report.failed.push({
              index: idx,
              errors: validation.errors.map((e) => `[${e.scope}] ${e.message}`),
            });
          }
        });

        if (accepted.length > 0) {
          set((state) => ({ sets: [...accepted, ...state.sets] }));
        }
        return report;
      },

      /* Utilities */
      getSetById: (id) => get().sets.find((s) => s.id === id),

      resetToSeed: () => set({ sets: DEFAULT_SETS, selectedSetId: null, editingSetDraft: null }),
    }),
    {
      /* v1 → v2 (7슬롯 → 8슬롯). 구 데이터는 자동 폐기 후 시드 재주입. */
      name: 'idiom-set-maker-v2',
      partialize: (state) => ({
        sets: state.sets,
        selectedSetId: state.selectedSetId,
        selectedTemplateId: state.selectedTemplateId,
      }),
      /* 첫 부팅 / 빈 상태 / 슬롯 수 불일치 → 시드 자동 주입.
       * 추가: 시드 set(id가 'seed-set-'로 시작)은 항상 DEFAULT_SETS의 최신 버전으로 교체.
       *      → 코드에서 시드 문항을 수정해도 기존 사용자가 자동으로 새 버전을 받음.
       *      사용자가 만든 set(id 다름)은 그대로 유지. */
      merge: (persisted: unknown, current) => {
        const p = persisted as {
          sets?: QuestionSet[];
          selectedSetId?: string | null;
          selectedTemplateId?: string | null;
        } | undefined;
        const persistedSets = Array.isArray(p?.sets) ? p!.sets! : [];

        /* 슬롯 수 검사 — 8슬롯 구조가 아니면 전부 시드로 리셋 */
        const allValid =
          persistedSets.length > 0 &&
          persistedSets.every((s) => Array.isArray(s.slots) && s.slots.length === SLOT_COUNT);

        if (!allValid) {
          return {
            ...current,
            sets: DEFAULT_SETS,
            selectedSetId: null,
            selectedTemplateId: p?.selectedTemplateId ?? null,
          };
        }

        /* 시드 set은 최신 DEFAULT_SETS 버전으로 자동 갱신, 사용자 set은 보존 */
        const seedById = new Map(DEFAULT_SETS.map((s) => [s.id, s]));
        const persistedIds = new Set(persistedSets.map((s) => s.id));

        /* 1단계: 기존 순서대로 순회 — 시드면 최신 버전으로 교체, 사용자 set은 그대로 */
        const sets: QuestionSet[] = persistedSets.map((s) => seedById.get(s.id) ?? s);

        /* 2단계: persisted에 없는 새 시드(향후 DEFAULT_SETS에 추가될 수 있음)는 뒤에 추가 */
        for (const seed of DEFAULT_SETS) {
          if (!persistedIds.has(seed.id)) sets.push(seed);
        }

        return {
          ...current,
          sets,
          selectedSetId: p?.selectedSetId ?? null,
          selectedTemplateId: p?.selectedTemplateId ?? null,
        };
      },
    }
  )
);
