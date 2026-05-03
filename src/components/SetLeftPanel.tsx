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
 * - **선택 모드**: 체크박스 + 전체 선택 + 일괄 삭제 / 일괄 JSON 내보내기
 */
import { useState, useMemo, useEffect } from 'react';
import {
  Search, X, Plus, Pencil, Copy, Trash2, Settings, Check,
  Filter, ChevronDown, ChevronRight,
  CheckSquare, Square, ListChecks, Download,
} from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { getSlotCompletionCount } from '../services/setValidator';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import type { QuestionSet, SetDomain } from '../types/sets';
import { getDomain, listDomains } from '../domains/registry';

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
  const deleteSets = useSetStore((s) => s.deleteSets);
  const duplicateSet = useSetStore((s) => s.duplicateSet);
  const allSets = useSetStore((s) => s.sets);

  const { toast } = useToast();
  const confirm = useConfirm();

  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [showFilters, setShowFilters] = useState(false);

  /* ── 선택 모드 ── */
  const [selectionMode, setSelectionMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const filtered = getFilteredSets();
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === 'recent') arr.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sortKey === 'idiom') {
      /* 가나다순 — 도메인별 카드 헤드라인(idiom·proverb 등)으로 정렬 */
      arr.sort((a, b) => {
        const ah = getDomain(a.meta.domain).getCardSummary(a.meta).headline;
        const bh = getDomain(b.meta.domain).getCardSummary(b.meta).headline;
        return ah.localeCompare(bh);
      });
    } else if (sortKey === 'difficulty') {
      const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2, advanced: 3, expert: 4 };
      arr.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }
    return arr;
  }, [filtered, sortKey]);

  /* 선택 모드를 빠져나가거나 필터로 카드가 사라지면 체크 정리 */
  useEffect(() => {
    if (!selectionMode && checkedIds.size > 0) {
      setCheckedIds(new Set());
    }
  }, [selectionMode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 보이는 카드(필터 적용됨)에 한해 전체 선택 상태 계산 */
  const visibleIds = useMemo(() => sorted.map((s) => s.id), [sorted]);
  const checkedVisibleCount = useMemo(
    () => visibleIds.filter((id) => checkedIds.has(id)).length,
    [visibleIds, checkedIds],
  );
  const allVisibleChecked = visibleIds.length > 0 && checkedVisibleCount === visibleIds.length;
  const someVisibleChecked = checkedVisibleCount > 0 && !allVisibleChecked;

  const toggleAllVisible = () => {
    if (allVisibleChecked) {
      /* 전체 해제 (현재 보이는 것만) */
      const next = new Set(checkedIds);
      for (const id of visibleIds) next.delete(id);
      setCheckedIds(next);
    } else {
      /* 보이는 것 전체 선택 */
      const next = new Set(checkedIds);
      for (const id of visibleIds) next.add(id);
      setCheckedIds(next);
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const enterSelection = () => {
    setSelectionMode(true);
    setCheckedIds(new Set());
  };
  const exitSelection = () => {
    setSelectionMode(false);
    setCheckedIds(new Set());
  };

  /* 일괄 삭제 */
  const handleBulkDelete = async () => {
    if (checkedIds.size === 0) {
      toast('error', '선택된 set이 없어요');
      return;
    }
    const ok = await confirm({
      title: '선택한 set 일괄 삭제',
      message: `선택한 ${checkedIds.size}개의 학습지 set을 삭제합니다.\n이 작업은 되돌릴 수 없습니다.\n계속하시겠습니까?`,
      variant: 'danger',
      confirmText: '삭제',
    });
    if (!ok) return;
    const removed = deleteSets(Array.from(checkedIds));
    toast('success', `${removed}개의 set을 삭제했어요`);
    exitSelection();
  };

  /* 일괄 JSON 내보내기 — 체크된 set만 */
  const handleBulkExport = () => {
    if (checkedIds.size === 0) {
      toast('error', '선택된 set이 없어요');
      return;
    }
    const subset = allSets.filter((s) => checkedIds.has(s.id));
    const json = JSON.stringify({ version: 1, sets: subset }, null, 2);
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idiom-sets-${subset.length}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('success', `${subset.length}개의 set을 내보냈어요`);
    } catch (e) {
      console.error(e);
      toast('error', '내보내기 실패');
    }
  };

  /* 단건 액션 (기존 동작) */
  const handleDelete = async (s: QuestionSet) => {
    const ok = await confirm({
      title: '학습지 set 삭제',
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

  const handleCardClick = (s: QuestionSet) => {
    if (selectionMode) toggleOne(s.id);
    else selectSet(s.id);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base">📜</span>
          <span className="text-xs font-bold text-gray-800 truncate">학습지 set</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{filtered.length}/{allSets.length}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className={`p-1.5 rounded transition-colors ${
              selectionMode
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-400 hover:text-purple-600 hover:bg-gray-100'
            }`}
            onClick={() => (selectionMode ? exitSelection() : enterSelection())}
            title={selectionMode ? '선택 모드 종료' : '선택 모드 (일괄 삭제·내보내기)'}
            aria-label="선택 모드 토글"
          >
            <ListChecks size={13} />
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded transition-colors"
            onClick={onCreateNew}
            title="새 학습지 set 만들기"
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

      {/* 선택 모드 액션 바 */}
      {selectionMode && (
        <div className="px-3 py-2 bg-purple-50 border-b border-purple-200 flex items-center gap-2 flex-shrink-0 animate-fadeIn">
          <button
            onClick={toggleAllVisible}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 hover:text-purple-900"
            title={allVisibleChecked ? '전체 해제' : '전체 선택'}
          >
            {allVisibleChecked ? (
              <CheckSquare size={14} className="text-purple-600" />
            ) : someVisibleChecked ? (
              <div className="w-3.5 h-3.5 rounded border-2 border-purple-600 bg-purple-600 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-white" />
              </div>
            ) : (
              <Square size={14} className="text-purple-600" />
            )}
            전체 선택
          </button>
          <span className="text-[11px] text-purple-700 font-mono">
            {checkedIds.size} / {visibleIds.length}
          </span>
          <div className="flex-1" />
          <button
            onClick={handleBulkExport}
            disabled={checkedIds.size === 0}
            className="btn btn-secondary !py-1 !px-2 !text-[10.5px] disabled:opacity-50 disabled:cursor-not-allowed"
            title="선택한 set만 JSON으로 내보내기"
          >
            <Download size={11} /> 내보내기
          </button>
          <button
            onClick={handleBulkDelete}
            disabled={checkedIds.size === 0}
            className="btn btn-danger !py-1 !px-2 !text-[10.5px] disabled:opacity-50 disabled:cursor-not-allowed"
            title="선택한 set 일괄 삭제"
          >
            <Trash2 size={11} /> 삭제
          </button>
          <button
            onClick={exitSelection}
            className="p-1 text-purple-600 hover:text-purple-900 rounded"
            title="선택 모드 종료"
            aria-label="선택 모드 종료"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* 도메인 필터 pill — 등록된 도메인이 2개 이상일 때만 표시 */}
      <DomainFilterPills />

      {/* Search */}
      <div className="px-3 pt-2 flex-shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input-field !pl-8 !pr-7 !py-1.5"
            placeholder="키워드 · 본문 검색"
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
              selectionMode={selectionMode}
              isChecked={checkedIds.has(s.id)}
              onClick={() => handleCardClick(s)}
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

/* ─── 도메인 필터 pill 행 — 등록된 도메인이 2개 이상일 때만 표시 ─── */
function DomainFilterPills() {
  const filters = useSetStore((s) => s.filters);
  const setFilters = useSetStore((s) => s.setFilters);
  const allSets = useSetStore((s) => s.sets);
  const selectSet = useSetStore((s) => s.selectSet);
  const selectedSetId = useSetStore((s) => s.selectedSetId);
  const domains = listDomains();
  if (domains.length < 2) return null;

  /* 도메인 pill 클릭 시 — 필터 변경 + 해당 도메인의 첫 set 자동 선택 (가운데 미리보기·우측 템플릿이 함께 전환) */
  const handlePickDomain = (domainId: SetDomain | null) => {
    setFilters({ domain: domainId });
    if (!domainId) {
      /* "전체" 선택 시: 현재 선택이 유효하면 유지, 없으면 가장 최근 set으로 */
      if (!selectedSetId) {
        const recent = [...allSets].sort((a, b) => b.updatedAt - a.updatedAt)[0];
        if (recent) selectSet(recent.id);
      }
      return;
    }
    /* 현재 선택된 set이 이미 그 도메인이면 유지 */
    const currentSet = allSets.find((s) => s.id === selectedSetId);
    if (currentSet && currentSet.domain === domainId) return;
    /* 그 외엔 그 도메인의 가장 최근 set 자동 선택 */
    const firstOfDomain = [...allSets]
      .filter((s) => s.domain === domainId)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (firstOfDomain) selectSet(firstOfDomain.id);
  };

  return (
    <div className="px-3 pt-2 flex items-center gap-1 overflow-x-auto flex-shrink-0">
      <button
        className={`flex-shrink-0 px-2 py-0.5 text-[10.5px] font-semibold rounded-full border transition-colors ${
          !filters.domain
            ? 'border-purple-500 bg-purple-500 text-white'
            : 'border-gray-200 text-gray-600 hover:border-gray-400'
        }`}
        onClick={() => handlePickDomain(null)}
      >
        전체
      </button>
      {domains.map((d) => {
        const active = filters.domain === d.id;
        return (
          <button
            key={d.id}
            className={`flex-shrink-0 px-2 py-0.5 text-[10.5px] font-semibold rounded-full border transition-colors ${
              active
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
            style={
              active
                ? { backgroundColor: d.labels.accentColor, borderColor: d.labels.accentColor }
                : undefined
            }
            onClick={() => handlePickDomain(d.id as SetDomain)}
          >
            {d.labels.subjectName}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Set 카드 ─── */
function SetCard({
  set: s, isSelected, selectionMode, isChecked, onClick, onEdit, onDuplicate, onDelete,
}: {
  set: QuestionSet;
  isSelected: boolean;
  selectionMode: boolean;
  isChecked: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const completion = getSlotCompletionCount(s);
  const completionColor = completion === 8 ? 'bg-emerald-500' : completion >= 5 ? 'bg-amber-500' : 'bg-gray-400';
  /* 도메인별 카드 요약 — idiom의 경우 headline=idiom 한글, subhead=한자, body=뜻
   *                  proverb의 경우 headline=속담 본문, subhead=뜻 등 */
  const summary = getDomain(s.meta.domain).getCardSummary(s.meta);
  const headline = summary.headline;
  const subhead = summary.subhead;
  const body = summary.body;

  /* 카드 배경 — 선택 모드의 체크 우선, 그 다음 출력 선택 */
  let bgClass = 'hover:bg-gray-50';
  if (selectionMode && isChecked) bgClass = 'bg-purple-100/80 hover:bg-purple-100';
  else if (!selectionMode && isSelected) bgClass = 'bg-purple-50/80';

  return (
    <div
      className={`relative px-3 py-2.5 border-b border-gray-100 cursor-pointer transition-colors group ${bgClass}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* 좌측 인디케이터 — 선택 모드면 체크박스, 아니면 라디오 */}
        <div className="flex-shrink-0 mt-1">
          {selectionMode ? (
            <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${
              isChecked ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'
            }`}>
              {isChecked && <Check size={9} strokeWidth={3} className="text-white" />}
            </div>
          ) : (
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'
            }`}>
              {isSelected && <Check size={8} strokeWidth={3} className="text-white" />}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-gray-800 truncate">{headline}</span>
            <span className="text-xs text-gray-500 font-normal" style={{ fontFamily: "'Noto Serif KR', serif" }}>
              {subhead}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug line-clamp-1 break-keep mt-0.5">
            {body}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`badge !text-[9px] !px-1.5 !py-0 ${DIFF_BADGE[s.difficulty]}`}>
              {DIFF_SHORT[s.difficulty]}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <div className={`w-1.5 h-1.5 rounded-full ${completionColor}`} />
              {completion}/8
            </div>
          </div>
        </div>

        {/* Actions (hover) — 선택 모드에서는 숨김 */}
        {!selectionMode && (
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
        )}
      </div>
    </div>
  );
}
