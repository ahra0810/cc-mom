/**
 * SetLeftPanel — 사자성어 Set DB 패널.
 *
 * 기능:
 * - 검색 (idiom/hanja/meaning/슬롯 본문)
 * - 난이도 필터
 * - 정렬 (최신/가나다/난이도)
 * - Set 카드: idiom + 한자 + 의미 + 진행률 + 액션
 * - 단일 선택(라디오) — 선택 = 출력 대상
 * - 카드 액션: 편집, 복제, 삭제
 */
import { useState, useMemo } from 'react';
import { Search, X, Plus, Pencil, Copy, Trash2, Settings, Check, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { getSlotCompletionCount } from '../services/setValidator';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import type { QuestionSet } from '../types/sets';

const DIFF_BADGE: Record<Difficulty, string> = {
  easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard',
  advanced: 'badge-advanced', expert: 'badge-expert',
};
const DIFF_SHORT: Record<Difficulty, string> = {
  easy: '쉬움', medium: '보통', hard: '어려움', advanced: '심화', expert: '도전',
};

type SortKey = 'recent' | 'idiom' | 'difficulty';

interface Props {
  onCreateNew: () => void;
  onEditSet: (setId: string) => void;
  onOpenSettings: () => void;
}

export default function SetLeftPanel({ onCreateNew, onEditSet, onOpenSettings }: Props) {
  const filters = useSetStore((s) => s.filters);
  const setFilters = useSetStore((s) => s.setFilters);
  const clearFilters = useSetStore((s) => s.clearFilters);
  const hasActiveFilters = useSetStore((s) => s.hasActiveFilters);
  const getFilteredSets = useSetStore((s) => s.getFilteredSets);
  const selectedSetId = useSetStore((s) => s.selectedSetId);
  const selectSet = useSetStore((s) => s.selectSet);
  const deleteSet = useSetStore((s) => s.deleteSet);
  const duplicateSet = useSetStore((s) => s.duplicateSet);
  const allSets = useSetStore((s) => s.sets);

  const { toast } = useToast();
  const confirm = useConfirm();

  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = getFilteredSets();
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === 'recent') arr.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sortKey === 'idiom') {
      arr.sort((a, b) => {
        const ai = a.meta.domain === 'four-char-idiom' ? a.meta.idiom : '';
        const bi = b.meta.domain === 'four-char-idiom' ? b.meta.idiom : '';
        return ai.localeCompare(bi);
      });
    } else if (sortKey === 'difficulty') {
      const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2, advanced: 3, expert: 4 };
      arr.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }
    return arr;
  }, [filtered, sortKey]);

  const handleDelete = async (s: QuestionSet) => {
    const ok = await confirm({
      title: '사자성어 set 삭제',
      message: `"${s.title}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      variant: 'danger',
      confirmText: '삭제',
    });
    if (!ok) return;
    deleteSet(s.id);
    toast('success', '삭제되었습니다');
  };

  const handleDuplicate = (s: QuestionSet) => {
    const newId = duplicateSet(s.id);
    if (newId) {
      selectSet(newId);
      toast('success', '복제했습니다');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base">📜</span>
          <span className="text-xs font-bold text-gray-800 truncate">사자성어 set</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{filtered.length}/{allSets.length}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded transition-colors"
            onClick={onCreateNew}
            title="새 사자성어 set 만들기"
            aria-label="새 set"
          >
            <Plus size={14} />
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded transition-colors"
            onClick={onOpenSettings}
            title="설정"
            aria-label="설정"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-2 flex-shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input-field !pl-8 !pr-7 !py-1.5"
            placeholder="사자성어 · 한자 · 뜻 · 본문 검색"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              aria-label="검색 지우기"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Filter toggle + sort */}
      <div className="px-3 pt-2 flex items-center gap-1.5 flex-shrink-0">
        <button
          className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={11} /> 필터
          {showFilters ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        <div className="ml-auto flex items-center gap-1 text-[11px]">
          <select
            className="bg-transparent text-gray-500 border-none focus:outline-none cursor-pointer pr-1"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            title="정렬"
          >
            <option value="recent">최신순</option>
            <option value="idiom">가나다순</option>
            <option value="difficulty">난이도순</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="px-3 pt-2 flex items-center gap-1 flex-shrink-0 animate-fadeIn">
          <select
            className="select-field !text-[11px] !py-1 !px-2 flex-1 min-w-0"
            value={filters.difficulty || ''}
            onChange={(e) => setFilters({ difficulty: (e.target.value || null) as Difficulty | null })}
          >
            <option value="">난이도 전체</option>
            {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {hasActiveFilters() && (
            <button
              className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
              onClick={clearFilters}
              title="필터 초기화"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Card list */}
      <div className="flex-1 overflow-y-auto mt-2">
        {sorted.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">
            {hasActiveFilters() ? (
              <>
                검색 결과가 없습니다.
                <br />
                <button onClick={clearFilters} className="mt-2 underline text-purple-600">필터 초기화</button>
              </>
            ) : (
              <>
                아직 set이 없습니다.
                <br />
                <button onClick={onCreateNew} className="mt-2 underline text-purple-600">+ 새 set 만들기</button>
              </>
            )}
          </div>
        ) : (
          sorted.map((s) => (
            <SetCard
              key={s.id}
              set={s}
              isSelected={selectedSetId === s.id}
              onSelect={() => selectSet(s.id)}
              onEdit={() => onEditSet(s.id)}
              onDuplicate={() => handleDuplicate(s)}
              onDelete={() => handleDelete(s)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Set 카드 ─── */
function SetCard({
  set: s, isSelected, onSelect, onEdit, onDuplicate, onDelete,
}: {
  set: QuestionSet;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const completion = getSlotCompletionCount(s);
  const completionColor = completion === 7 ? 'bg-emerald-500' : completion >= 4 ? 'bg-amber-500' : 'bg-gray-400';
  const idiom = s.meta.domain === 'four-char-idiom' ? s.meta.idiom : '';
  const hanja = s.meta.domain === 'four-char-idiom' ? s.meta.hanja : '';
  const meaning = s.meta.domain === 'four-char-idiom' ? s.meta.meaning : '';

  return (
    <div
      className={`relative px-3 py-2.5 border-b border-gray-100 cursor-pointer transition-colors group ${
        isSelected ? 'bg-purple-50/80' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        {/* Radio indicator */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
            isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'
          }`}>
            {isSelected && <Check size={8} strokeWidth={3} className="text-white" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-gray-800 truncate">{idiom}</span>
            <span className="text-xs text-gray-500 font-normal" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {hanja}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug line-clamp-1 break-keep mt-0.5">
            {meaning}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`badge !text-[9px] !px-1.5 !py-0 ${DIFF_BADGE[s.difficulty]}`}>
              {DIFF_SHORT[s.difficulty]}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <div className={`w-1.5 h-1.5 rounded-full ${completionColor}`} />
              {completion}/7
            </div>
          </div>
        </div>

        {/* Actions (hover) */}
        <div className="flex flex-col gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50"
            title="편집"
            aria-label="편집"
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            title="복제"
            aria-label="복제"
          >
            <Copy size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
            title="삭제"
            aria-label="삭제"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
