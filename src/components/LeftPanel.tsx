import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Plus, Minus, Check, X, ChevronDown, ChevronRight,
  Database, PenTool, Settings, Layers, Pencil, Trash2, Sliders,
} from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';
import { useTestStore } from '../stores/testStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import type { Question, QuestionType, Difficulty, Subject } from '../types';
import { DIFFICULTY_LABELS } from '../types';

const DIFF_BADGE: Record<Difficulty, string> = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
  advanced: 'badge-advanced',
  expert: 'badge-expert',
};
const DIFF_SHORT: Record<Difficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  advanced: '심화',
  expert: '도전',
};
const TYPE_SHORT: Record<QuestionType, string> = {
  'multiple-choice': '객관식', 'true-false': 'OX', 'fill-blank': '빈칸',
  'short-answer': '단답형', 'sentence-making': '서술형',
};

interface Props {
  onPreviewQuestion: (q: Question) => void;
  onManualCreate: () => void;
  onEditQuestion: (q: Question) => void;
  onOpenSettings: () => void;
}

type GroupBy = 'tag' | 'difficulty' | 'type' | 'subject' | 'none';
type SortBy = 'recent' | 'difficulty' | 'subject';

export default function LeftPanel({ onPreviewQuestion, onManualCreate, onEditQuestion, onOpenSettings }: Props) {
  const { filters, setFilters, clearFilters, hasActiveFilters, subjects, getFilteredQuestions, questions, deleteQuestion, updateQuestion } = useQuestionStore();
  const { currentTest, addQuestionToTest, addQuestionsToTest, removeQuestionFromTest } = useTestStore();
  const { toast } = useToast();
  const confirm = useConfirm();
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  const [groupBy, setGroupBy] = useState<GroupBy>('tag');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = getFilteredQuestions();
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'recent') arr.sort((a, b) => b.createdAt - a.createdAt);
    else if (sortBy === 'difficulty') {
      const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2, advanced: 3, expert: 4 };
      arr.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === 'subject') arr.sort((a, b) => a.subjectId.localeCompare(b.subjectId));
    return arr;
  }, [filtered, sortBy]);

  const groups = useMemo(() => buildGroups(sorted, groupBy, subjects), [sorted, groupBy, subjects]);

  const testQuestionIds = useMemo(
    () => new Set(currentTest?.questions.map((q) => q.id) || []),
    [currentTest?.questions]
  );

  const subjectCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of questions) counts.set(q.subjectId, (counts.get(q.subjectId) || 0) + 1);
    return counts;
  }, [questions]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every((q) => selectedIds.has(q.id));
  const someSelected = selectedIds.size > 0;

  const selectAllFiltered = () => {
    if (allFilteredSelected) {
      // Deselect all filtered
      setSelectedIds((prev) => {
        const s = new Set(prev);
        filtered.forEach((q) => s.delete(q.id));
        return s;
      });
    } else {
      setSelectedIds((prev) => {
        const s = new Set(prev);
        filtered.forEach((q) => s.add(q.id));
        return s;
      });
    }
  };

  const handleBatchAdd = () => {
    if (!currentTest) {
      toast('warning', '먼저 시험지를 만들어주세요');
      return;
    }
    const toAdd = filtered.filter((q) => selectedIds.has(q.id) && !testQuestionIds.has(q.id));
    if (toAdd.length === 0) {
      toast('info', '추가할 문항이 없습니다');
      return;
    }
    addQuestionsToTest(toAdd);
    toast('success', `${toAdd.length}개 문항을 추가했습니다`);
    setSelectedIds(new Set());
  };

  const handleBatchRemove = () => {
    const toRemove = filtered.filter((q) => selectedIds.has(q.id) && testQuestionIds.has(q.id));
    if (toRemove.length === 0) return;
    toRemove.forEach((q) => removeQuestionFromTest(q.id));
    toast('success', `${toRemove.length}개 문항을 제거했습니다`);
    setSelectedIds(new Set());
  };

  /* DB에서 영구 삭제 (단일) */
  const handleDeleteQuestion = async (q: Question) => {
    const ok = await confirm({
      title: '문항 삭제',
      message: `"${q.question.slice(0, 30)}${q.question.length > 30 ? '...' : ''}"\n이 문항을 DB에서 영구 삭제하시겠습니까?`,
      variant: 'danger',
      confirmText: '삭제',
    });
    if (!ok) return;
    if (testQuestionIds.has(q.id)) removeQuestionFromTest(q.id);
    deleteQuestion(q.id);
    toast('success', '문항을 삭제했습니다');
  };

  /* DB에서 영구 삭제 (일괄) */
  const handleBatchDeleteFromDB = async () => {
    const count = selectedIds.size;
    if (count === 0) return;
    const ok = await confirm({
      title: '문항 일괄 삭제',
      message: `선택한 ${count}개 문항을 DB에서 영구 삭제하시겠습니까?\n현재 시험지에 포함된 문항도 함께 제거됩니다.\n이 작업은 되돌릴 수 없습니다.`,
      variant: 'danger',
      confirmText: `${count}개 삭제`,
    });
    if (!ok) return;
    [...selectedIds].forEach((id) => {
      if (testQuestionIds.has(id)) removeQuestionFromTest(id);
      deleteQuestion(id);
    });
    toast('success', `${count}개 문항을 DB에서 삭제했습니다`);
    setSelectedIds(new Set());
  };

  /* 일괄 메타데이터 변경 (과목/난이도/태그) */
  const handleBulkUpdate = (updates: { subjectId?: string; difficulty?: Difficulty; addTag?: string; removeTag?: string }) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;

    ids.forEach((id) => {
      const q = questions.find((x) => x.id === id);
      if (!q) return;
      const partial: Partial<Question> = {};
      if (updates.subjectId) partial.subjectId = updates.subjectId;
      if (updates.difficulty) partial.difficulty = updates.difficulty;
      if (updates.addTag || updates.removeTag) {
        const next = new Set(q.tags || []);
        if (updates.addTag) next.add(updates.addTag);
        if (updates.removeTag) next.delete(updates.removeTag);
        partial.tags = [...next];
      }
      updateQuestion(id, partial);
    });

    const parts: string[] = [];
    if (updates.subjectId) parts.push(`과목 → ${subjects.find((s) => s.id === updates.subjectId)?.name}`);
    if (updates.difficulty) parts.push(`난이도 → ${DIFFICULTY_LABELS[updates.difficulty].split('(')[0].trim()}`);
    if (updates.addTag) parts.push(`태그 추가: #${updates.addTag}`);
    if (updates.removeTag) parts.push(`태그 제거: #${updates.removeTag}`);
    toast('success', `${ids.length}개 문항 수정 완료\n${parts.join(' · ')}`);
  };

  const handleQuickAdd = (q: Question) => {
    if (!currentTest) {
      toast('warning', '먼저 시험지를 만들어주세요');
      return;
    }
    if (testQuestionIds.has(q.id)) removeQuestionFromTest(q.id);
    else addQuestionToTest(q);
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };

  const selectedInTest = [...selectedIds].filter((id) => testQuestionIds.has(id)).length;
  const selectedNotInTest = selectedIds.size - selectedInTest;
  const totalCount = questions.length;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ─── Header: title + quick actions ─── */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Database size={14} className="text-primary-600 flex-shrink-0" />
          <span className="text-xs font-bold text-gray-800 truncate">문항 DB</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{filtered.length}/{totalCount}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
            onClick={onManualCreate}
            title="새 문항 만들기"
            aria-label="새 문항 만들기"
          >
            <PenTool size={13} />
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
            onClick={onOpenSettings}
            title="과목/데이터 관리"
            aria-label="설정"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="px-3 pt-2 flex-shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="input-field !pl-8 !pr-7 !py-1.5"
            placeholder="문제 · 답 · 태그 검색"
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

      {/* ─── Subject pills ─── */}
      <div className="px-3 pt-2 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'thin' }}>
          <SubjectPill
            label="전체"
            count={totalCount}
            active={!filters.subjectId}
            onClick={() => setFilters({ subjectId: null })}
          />
          {subjects.map((s) => (
            <SubjectPill
              key={s.id}
              icon={s.icon}
              label={s.name}
              count={subjectCounts.get(s.id) ?? 0}
              color={s.color}
              active={filters.subjectId === s.id}
              onClick={() => setFilters({ subjectId: filters.subjectId === s.id ? null : s.id })}
            />
          ))}
        </div>
      </div>

      {/* ─── Filter row ─── */}
      <div className="px-3 pb-2 flex-shrink-0 flex items-center gap-1">
        <select
          className="select-field !text-[11px] !py-1 !px-2 flex-1 min-w-0"
          value={filters.difficulty || ''}
          onChange={(e) => setFilters({ difficulty: (e.target.value || null) as Difficulty | null })}
        >
          <option value="">난이도</option>
          {Object.entries(DIFF_SHORT).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <select
          className="select-field !text-[11px] !py-1 !px-2 flex-1 min-w-0"
          value={filters.type || ''}
          onChange={(e) => setFilters({ type: (e.target.value || null) as QuestionType | null })}
        >
          <option value="">유형</option>
          {Object.entries(TYPE_SHORT).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        {hasActiveFilters() && (
          <button
            className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0"
            onClick={clearFilters}
            title="필터 초기화"
            aria-label="필터 초기화"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* ─── Group + Sort + Select All ─── */}
      <div className="px-3 pb-2 flex-shrink-0 flex items-center gap-1.5 text-[11px] border-b border-gray-100">
        <button
          onClick={selectAllFiltered}
          className="flex items-center gap-1 py-1 px-1.5 -ml-1.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="전체 선택"
        >
          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
            allFilteredSelected
              ? 'bg-primary-600 border-primary-600 text-white'
              : someSelected
                ? 'bg-primary-100 border-primary-400'
                : 'border-gray-300 bg-white'
          }`}>
            {allFilteredSelected && <Check size={9} strokeWidth={3} />}
            {someSelected && !allFilteredSelected && <Minus size={9} strokeWidth={3} className="text-primary-600" />}
          </div>
          <span className="text-gray-600 font-medium">
            {someSelected ? `${selectedIds.size}개 선택` : '전체 선택'}
          </span>
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          <Layers size={11} className="text-gray-400" />
          <select
            className="bg-transparent text-gray-600 border-none focus:outline-none cursor-pointer pr-1"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            title="그룹 기준"
          >
            <option value="tag">테마</option>
            <option value="subject">과목</option>
            <option value="difficulty">난이도</option>
            <option value="type">유형</option>
            <option value="none">없음</option>
          </select>
          <span className="text-gray-300">|</span>
          <select
            className="bg-transparent text-gray-500 border-none focus:outline-none cursor-pointer pr-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            title="정렬"
          >
            <option value="recent">최신</option>
            <option value="difficulty">난이도</option>
            <option value="subject">과목</option>
          </select>
        </div>
      </div>

      {/* ─── Selection Action Bar ─── */}
      {selectedIds.size > 0 && (
        <div className="px-3 py-1.5 bg-primary-50 border-b border-primary-100 flex-shrink-0 animate-fadeIn space-y-1 relative">
          {/* 첫 줄: 시험지 작업 */}
          {currentTest && (selectedNotInTest > 0 || selectedInTest > 0) && (
            <div className="flex gap-1">
              {selectedNotInTest > 0 && (
                <button className="btn btn-primary !py-1 !px-2 !text-[10px] flex-1" onClick={handleBatchAdd}>
                  <Plus size={11} /> 시험지에 {selectedNotInTest}개 추가
                </button>
              )}
              {selectedInTest > 0 && (
                <button className="btn btn-danger !py-1 !px-2 !text-[10px] flex-1" onClick={handleBatchRemove}>
                  <Minus size={11} /> {selectedInTest}개 제거
                </button>
              )}
            </div>
          )}
          {/* 두 번째 줄: DB 편집 작업 */}
          <div className="flex gap-1">
            <button
              className="btn !py-1 !px-2 !text-[10px] flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => setBulkEditOpen(!bulkEditOpen)}
              title="선택한 문항 일괄 편집"
            >
              <Sliders size={11} /> 일괄 편집
            </button>
            <button
              className="btn !py-1 !px-2 !text-[10px] flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBatchDeleteFromDB}
              title="선택한 문항 DB에서 영구 삭제"
            >
              <Trash2 size={11} /> DB 삭제
            </button>
            <button
              className="btn btn-ghost !py-1 !px-2 !text-[10px]"
              onClick={() => { setSelectedIds(new Set()); setBulkEditOpen(false); }}
              aria-label="선택 취소"
              title="선택 해제"
            >
              <X size={11} />
            </button>
          </div>

          {/* 일괄 편집 팝오버 */}
          {bulkEditOpen && (
            <BulkEditPopover
              subjects={subjects}
              count={selectedIds.size}
              onApply={(updates) => { handleBulkUpdate(updates); setBulkEditOpen(false); }}
              onClose={() => setBulkEditOpen(false)}
            />
          )}
        </div>
      )}

      {/* ─── Question List ─── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters()} onClearFilters={clearFilters} onAddNew={onManualCreate} />
        ) : (
          groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.key);
            return (
              <div key={group.key}>
                {groupBy !== 'none' && (
                  <button
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border-y border-gray-200 sticky top-0 z-10 text-left transition-colors"
                    onClick={() => toggleGroup(group.key)}
                    aria-expanded={!isCollapsed}
                  >
                    {isCollapsed ? <ChevronRight size={11} className="text-gray-400" /> : <ChevronDown size={11} className="text-gray-400" />}
                    <span className="text-[11px] font-semibold text-gray-700 truncate flex-1">{group.label}</span>
                    <span className="text-[10px] text-gray-400">{group.questions.length}</span>
                  </button>
                )}
                {!isCollapsed && group.questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    subjects={subjects}
                    isSelected={selectedIds.has(q.id)}
                    isInTest={testQuestionIds.has(q.id)}
                    onSelect={() => toggleSelect(q.id)}
                    onPreview={() => onPreviewQuestion(q)}
                    onQuickAdd={() => handleQuickAdd(q)}
                    onEdit={() => onEditQuestion(q)}
                    onDelete={() => handleDeleteQuestion(q)}
                    canAddToTest={!!currentTest}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─── Subject Pill ─── */
function SubjectPill({ icon, label, count, color, active, onClick }: {
  icon?: string; label: string; count: number; color?: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all border ${
        active
          ? 'text-white border-transparent shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
      }`}
      style={active ? { backgroundColor: color || '#2563EB' } : undefined}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span>{label}</span>
      <span className={`text-[10px] ${active ? 'text-white/85' : 'text-gray-400'}`}>{count}</span>
    </button>
  );
}

/* ─── Question Card ─── */
function QuestionCard({ question: q, subjects, isSelected, isInTest, onSelect, onPreview, onQuickAdd, onEdit, onDelete, canAddToTest }: {
  question: Question;
  subjects: Subject[];
  isSelected: boolean;
  isInTest: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onQuickAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canAddToTest: boolean;
}) {
  const sub = subjects.find((s) => s.id === q.subjectId);
  const subColor = sub?.color || '#94A3B8';
  const preview = q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question;

  return (
    <div
      className={`relative flex items-stretch gap-1.5 pl-2 pr-1.5 py-1.5 border-b border-gray-100 cursor-pointer transition-colors group ${
        isSelected ? 'bg-primary-50/60' : isInTest ? 'bg-emerald-50/40' : 'hover:bg-gray-50'
      }`}
      onClick={onPreview}
    >
      {/* Subject color stripe */}
      <div className="w-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: subColor }} />

      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="flex-shrink-0 self-start mt-0.5 p-0.5"
        aria-label={isSelected ? '선택 해제' : '선택'}
      >
        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
          isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 bg-white'
        }`}>
          {isSelected && <Check size={9} strokeWidth={3} />}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5 text-[10px]">
          <span className="text-gray-500 font-medium truncate">{sub?.icon} {sub?.name}</span>
          {q.tags && q.tags.length > 0 && (
            <span className="text-gray-400 truncate">· {q.tags[0]}</span>
          )}
        </div>
        <p className="text-[11.5px] text-gray-800 leading-snug line-clamp-2 break-keep">{preview}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`badge !text-[9px] !px-1.5 !py-0 ${DIFF_BADGE[q.difficulty]}`}>{DIFF_SHORT[q.difficulty]}</span>
          <span className="text-[9px] text-gray-300">·</span>
          <span className="text-[9px] text-gray-500">{TYPE_SHORT[q.type]}</span>
        </div>
      </div>

      {/* Action buttons (vertical stack, hover-revealed for edit/delete) */}
      <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0">
        {canAddToTest && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickAdd(); }}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isInTest
                ? 'bg-emerald-500 text-white hover:bg-red-500'
                : 'bg-gray-100 text-gray-500 hover:bg-primary-600 hover:text-white'
            }`}
            title={isInTest ? '시험지에서 제거' : '시험지에 추가'}
            aria-label={isInTest ? '시험지에서 제거' : '시험지에 추가'}
          >
            {isInTest ? <Check size={11} strokeWidth={3} /> : <Plus size={11} />}
          </button>
        )}
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50"
            title="문항 편집"
            aria-label="문항 편집"
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
            title="DB에서 삭제"
            aria-label="DB에서 삭제"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ hasFilters, onClearFilters, onAddNew }: {
  hasFilters: boolean; onClearFilters: () => void; onAddNew: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
      <Database size={32} className="mb-3 text-gray-300" />
      <p className="text-sm font-medium mb-2">
        {hasFilters ? '검색 결과가 없습니다' : '문항이 없습니다'}
      </p>
      <p className="text-xs mb-4 leading-relaxed">
        {hasFilters ? '필터를 조정하거나 초기화해보세요' : '새 문항을 만들어 시작하세요'}
      </p>
      {hasFilters ? (
        <button className="btn btn-secondary" onClick={onClearFilters}>
          <X size={13} /> 필터 초기화
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onAddNew}>
          <Plus size={13} /> 첫 문항 만들기
        </button>
      )}
    </div>
  );
}

/* ─── Group Builder ─── */
interface QuestionGroup { key: string; label: string; questions: Question[]; }

function buildGroups(questions: Question[], groupBy: GroupBy, subjects: Subject[]): QuestionGroup[] {
  if (groupBy === 'none') {
    return [{ key: 'all', label: '전체', questions }];
  }

  const map = new Map<string, QuestionGroup>();

  for (const q of questions) {
    let key: string, label: string;

    if (groupBy === 'tag') {
      const tag = q.tags && q.tags.length > 0 ? q.tags[0] : '(태그 없음)';
      key = tag; label = tag;
    } else if (groupBy === 'subject') {
      const sub = subjects.find((s) => s.id === q.subjectId);
      key = q.subjectId;
      label = sub ? `${sub.icon} ${sub.name}` : q.subjectId;
    } else if (groupBy === 'difficulty') {
      key = q.difficulty; label = DIFF_SHORT[q.difficulty];
    } else {
      key = q.type; label = TYPE_SHORT[q.type];
    }

    if (!map.has(key)) map.set(key, { key, label, questions: [] });
    map.get(key)!.questions.push(q);
  }

  return [...map.values()].sort((a, b) => {
    if (groupBy === 'difficulty') {
      const order: Record<string, number> = { '쉬움': 0, '보통': 1, '어려움': 2, '심화': 3, '도전': 4 };
      return (order[a.label] ?? 99) - (order[b.label] ?? 99);
    }
    return a.label.localeCompare(b.label);
  });
}


/* ─── 일괄 편집 팝오버 ─── */
function BulkEditPopover({ subjects, count, onApply, onClose }: {
  subjects: Subject[];
  count: number;
  onApply: (updates: { subjectId?: string; difficulty?: Difficulty; addTag?: string; removeTag?: string }) => void;
  onClose: () => void;
}) {
  const [subjectId, setSubjectId] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [addTag, setAddTag] = useState('');
  const [removeTag, setRemoveTag] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  /* 외부 클릭 시 닫기 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  const handleApply = () => {
    const updates: { subjectId?: string; difficulty?: Difficulty; addTag?: string; removeTag?: string } = {};
    if (subjectId) updates.subjectId = subjectId;
    if (difficulty) updates.difficulty = difficulty;
    if (addTag.trim()) updates.addTag = addTag.trim();
    if (removeTag.trim()) updates.removeTag = removeTag.trim();
    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }
    onApply(updates);
  };

  const hasChanges = subjectId || difficulty || addTag.trim() || removeTag.trim();

  return (
    <div
      ref={ref}
      className="absolute z-30 left-3 right-3 top-full mt-1 bg-white border border-amber-200 rounded-lg shadow-xl p-3 space-y-2 animate-fadeIn"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-amber-700">
          일괄 편집 — 선택 {count}개
        </h4>
        <button
          onClick={onClose}
          className="p-0.5 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <X size={11} />
        </button>
      </div>

      {/* 과목 변경 */}
      <div>
        <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">과목 변경</label>
        <select
          className="select-field !text-[11px] !py-1"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          <option value="">— 변경 안 함 —</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
          ))}
        </select>
      </div>

      {/* 난이도 변경 */}
      <div>
        <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">난이도 변경</label>
        <select
          className="select-field !text-[11px] !py-1"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
        >
          <option value="">— 변경 안 함 —</option>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.split('(')[0].trim()} {v.match(/\(.*?\)/)?.[0]}</option>
          ))}
        </select>
      </div>

      {/* 태그 추가/제거 */}
      <div className="grid grid-cols-2 gap-1.5">
        <div>
          <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">태그 추가</label>
          <input
            className="input-field !text-[11px] !py-1"
            placeholder="예: 소나기"
            value={addTag}
            onChange={(e) => setAddTag(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-600 mb-0.5 block">태그 제거</label>
          <input
            className="input-field !text-[11px] !py-1"
            placeholder="제거할 태그"
            value={removeTag}
            onChange={(e) => setRemoveTag(e.target.value)}
          />
        </div>
      </div>

      <button
        className="btn btn-primary w-full !py-1 !text-[11px]"
        onClick={handleApply}
        disabled={!hasChanges}
      >
        <Check size={11} /> {count}개에 적용
      </button>
    </div>
  );
}
