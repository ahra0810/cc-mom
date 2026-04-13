import { useState } from 'react';
import { Search, Filter, CheckSquare, Square, ChevronDown, ChevronRight, Plus, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useQuestionStore } from '../stores/questionStore';
import { useTestStore } from '../stores/testStore';
import type { Question, QuestionType, Difficulty } from '../types';

const DIFF_BADGE: Record<Difficulty, string> = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
};

const DIFF_SHORT: Record<Difficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

const TYPE_SHORT: Record<QuestionType, string> = {
  'multiple-choice': '객관식',
  'true-false': 'OX',
  'fill-blank': '빈칸',
  'short-answer': '단답형',
};

interface Props {
  onEditQuestion: (q: Question) => void;
}

export default function QuestionBank({ onEditQuestion }: Props) {
  const {
    filters, setFilters, subjects, selectedQuestionIds,
    toggleSelectQuestion, selectAllFiltered, clearSelection,
    getFilteredQuestions, deleteQuestion,
  } = useQuestionStore();
  const { currentTest, addQuestionToTest, addQuestionsToTest } = useTestStore();
  const [showFilters, setShowFilters] = useState(true);

  const filtered = getFilteredQuestions();
  const selectedCount = selectedQuestionIds.size;

  const handleAddSelected = () => {
    const selected = filtered.filter((q) => selectedQuestionIds.has(q.id));
    addQuestionsToTest(selected);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    if (!confirm(`선택한 ${selectedCount}개 문항을 삭제하시겠습니까?`)) return;
    [...selectedQuestionIds].forEach(deleteQuestion);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800">문항 DB</h2>
          <span className="text-xs text-gray-500">{filtered.length}개</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-8 text-xs"
            placeholder="문제 검색..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200">
        <button
          className="w-full flex items-center gap-1 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={12} />
          <span>필터</span>
          {showFilters ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {showFilters && (
          <div className="px-3 pb-3 space-y-2 animate-fadeIn">
            <select
              className="select-field text-xs"
              value={filters.subjectId || ''}
              onChange={(e) => setFilters({ subjectId: e.target.value || null })}
            >
              <option value="">전체 과목</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                className="select-field text-xs flex-1"
                value={filters.difficulty || ''}
                onChange={(e) => setFilters({ difficulty: (e.target.value || null) as Difficulty | null })}
              >
                <option value="">난이도</option>
                {Object.entries(DIFF_SHORT).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <select
                className="select-field text-xs flex-1"
                value={filters.type || ''}
                onChange={(e) => setFilters({ type: (e.target.value || null) as QuestionType | null })}
              >
                <option value="">유형</option>
                {Object.entries(TYPE_SHORT).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedCount > 0 && (
        <div className="px-3 py-2 bg-primary-50 border-b border-primary-200 flex items-center gap-2 animate-fadeIn">
          <span className="text-xs text-primary-700 font-medium">{selectedCount}개 선택</span>
          <div className="ml-auto flex gap-1">
            {currentTest && (
              <button className="btn btn-primary !py-1 !px-2 !text-xs" onClick={handleAddSelected}>
                <ArrowRight size={12} /> 추가
              </button>
            )}
            <button className="btn btn-danger !py-1 !px-2 !text-xs" onClick={handleDeleteSelected}>
              <Trash2 size={12} />
            </button>
            <button className="btn btn-ghost !py-1 !px-2 !text-xs" onClick={clearSelection}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* Select all */}
      <div className="px-3 py-1.5 border-b border-gray-100 flex items-center">
        <button
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
          onClick={() => selectedCount === filtered.length ? clearSelection() : selectAllFiltered()}
        >
          {selectedCount === filtered.length && filtered.length > 0
            ? <CheckSquare size={14} className="text-primary-600" />
            : <Square size={14} />
          }
          전체 선택
        </button>
      </div>

      {/* Question list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">
            문항이 없습니다.
          </div>
        ) : (
          filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selected={selectedQuestionIds.has(q.id)}
              onToggle={() => toggleSelectQuestion(q.id)}
              onAdd={() => addQuestionToTest(q)}
              onEdit={() => onEditQuestion(q)}
              onDelete={() => { if (confirm('이 문항을 삭제하시겠습니까?')) deleteQuestion(q.id); }}
              canAdd={!!currentTest}
              subjectName={subjects.find((s) => s.id === q.subjectId)?.name || ''}
              subjectIcon={subjects.find((s) => s.id === q.subjectId)?.icon || ''}
            />
          ))
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  question: q, selected, onToggle, onAdd, onEdit, onDelete,
  canAdd, subjectName, subjectIcon,
}: {
  question: Question; selected: boolean;
  onToggle: () => void; onAdd: () => void; onEdit: () => void; onDelete: () => void;
  canAdd: boolean; subjectName: string; subjectIcon: string;
}) {
  return (
    <div className={`border-b border-gray-100 px-3 py-2.5 hover:bg-gray-50 transition-colors ${selected ? 'bg-primary-50' : ''}`}>
      <div className="flex items-start gap-2">
        <button onClick={onToggle} className="mt-0.5 flex-shrink-0">
          {selected
            ? <CheckSquare size={14} className="text-primary-600" />
            : <Square size={14} className="text-gray-300" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-800 leading-relaxed line-clamp-2">{q.question}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[10px] text-gray-500">{subjectIcon} {subjectName}</span>
            <span className={`badge text-[10px] ${DIFF_BADGE[q.difficulty]}`}>{DIFF_SHORT[q.difficulty]}</span>
            <span className="badge bg-gray-100 text-gray-600 text-[10px]">{TYPE_SHORT[q.type]}</span>
            {q.source === 'ai' && <span className="badge bg-purple-100 text-purple-600 text-[10px]">AI</span>}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          {canAdd && (
            <button onClick={onAdd} className="p-1 text-gray-400 hover:text-primary-600 rounded" title="시험지에 추가">
              <Plus size={13} />
            </button>
          )}
          <button onClick={onEdit} className="p-1 text-gray-400 hover:text-amber-600 rounded" title="편집">
            <Edit3 size={13} />
          </button>
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 rounded" title="삭제">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
