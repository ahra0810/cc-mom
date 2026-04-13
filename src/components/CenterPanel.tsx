import { useEffect, useCallback } from 'react';
import {
  Eye, EyeOff, ChevronUp, ChevronDown, X, Edit3, Undo2, RotateCcw,
  ArrowUpDown, Plus, Trash2, CheckSquare, Square, FileText,
} from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS } from '../types';
import type { Question } from '../types';

interface Props {
  activeTab: 'preview' | 'test';
  onTabChange: (tab: 'preview' | 'test') => void;
  previewQuestion: Question | null;
  onEditQuestion: (q: Question) => void;
}

export default function CenterPanel({ activeTab, onTabChange, previewQuestion, onEditQuestion }: Props) {
  const { currentTest } = useTestStore();

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('preview')}
        >
          <Eye size={13} /> 문항 미리보기
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'test'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('test')}
        >
          <FileText size={13} /> 시험지 미리보기
          {currentTest && currentTest.questions.length > 0 && (
            <span className="bg-primary-100 text-primary-700 text-[10px] px-1.5 rounded-full">
              {currentTest.questions.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'preview' ? (
          <QuestionPreviewTab question={previewQuestion} onEdit={onEditQuestion} />
        ) : (
          <TestPreviewTab onEditQuestion={onEditQuestion} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════ 문항 미리보기 ═══════════════ */

function QuestionPreviewTab({ question, onEdit }: { question: Question | null; onEdit: (q: Question) => void }) {
  const { subjects } = useQuestionStore();
  const { currentTest, addQuestionToTest } = useTestStore();
  const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];

  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
        <Eye size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium mb-1">문항을 선택하세요</p>
        <p className="text-xs text-center">좌측 문항 DB에서 문항을 클릭하면<br />여기에서 미리볼 수 있습니다.</p>
      </div>
    );
  }

  const sub = subjects.find((s) => s.id === question.subjectId);
  const isInTest = currentTest?.questions.some((q) => q.id === question.id);

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-lg mx-auto animate-fadeIn">
        {/* Header badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="badge bg-gray-100 text-gray-700 text-xs">{sub?.icon} {sub?.name}</span>
          <span className={`badge text-xs ${
            question.difficulty === 'easy' ? 'badge-easy' : question.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
          }`}>
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="badge bg-blue-50 text-blue-700 text-xs">
            {QUESTION_TYPE_LABELS[question.type]}
          </span>
          {question.source === 'ai' && <span className="badge bg-purple-100 text-purple-600 text-xs">AI 생성</span>}
        </div>

        {/* Question */}
        <div className="card p-4 mb-4">
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{question.question}</p>

          {question.type === 'multiple-choice' && question.options && (
            <div className="mt-4 space-y-2">
              {question.options.map((opt, i) => (
                <div key={i} className={`px-3 py-2 rounded-lg text-sm border ${
                  opt === question.answer
                    ? 'border-primary-300 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}>
                  {labels[i]} {opt}
                </div>
              ))}
            </div>
          )}
          {question.type === 'true-false' && (
            <div className="mt-4 flex gap-3">
              {['O', 'X'].map((v, i) => (
                <div key={v} className={`flex-1 text-center px-3 py-2 rounded-lg text-sm border ${
                  question.answer === v
                    ? 'border-primary-300 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}>
                  {labels[i]} {v}
                </div>
              ))}
            </div>
          )}
          {(question.type === 'fill-blank' || question.type === 'short-answer') && (
            <div className="mt-4 px-3 py-2 rounded-lg border border-primary-300 bg-primary-50 text-primary-700 text-sm font-medium">
              정답: {question.answer}
            </div>
          )}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800 leading-relaxed">
            <strong>해설:</strong> {question.explanation}
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {question.tags.map((tag) => (
              <span key={tag} className="badge bg-gray-100 text-gray-600 text-[10px]">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {currentTest && (
            <button
              className={`btn flex-1 !text-xs ${isInTest ? 'btn-secondary !text-gray-400' : 'btn-primary'}`}
              onClick={() => addQuestionToTest(question)}
              disabled={isInTest}
            >
              <Plus size={13} /> {isInTest ? '이미 추가됨' : '시험지에 추가'}
            </button>
          )}
          <button className="btn btn-secondary !text-xs" onClick={() => onEdit(question)}>
            <Edit3 size={13} /> 편집
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ 시험지 미리보기 ═══════════════ */

function TestPreviewTab({ onEditQuestion }: { onEditQuestion: (q: Question) => void }) {
  const {
    currentTest, removeQuestionFromTest, setShowAnswerKey, updateTestTitle,
    reorderQuestions, undo, canUndo, resetToInitial, sortBySubject,
    selectedInTest, toggleSelectInTest, selectRangeInTest, clearTestSelection,
    moveSelectedQuestions, removeSelectedFromTest,
  } = useTestStore();
  const { subjects } = useQuestionStore();

  // Ctrl+Z handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undo();
    }
  }, [undo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentTest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
        <FileText size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium mb-1">시험지가 없습니다</p>
        <p className="text-xs text-center">우측 패널에서 "새 시험지 만들기"를<br />클릭하여 시작하세요.</p>
      </div>
    );
  }

  const subject = subjects.find((s) => s.id === currentTest.subjectId);
  const selectedCount = selectedInTest.size;

  const handleQuestionClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      selectRangeInTest(id);
    } else {
      toggleSelectInTest(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <input
            className="text-sm font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none px-0 py-0.5 flex-1 mr-2"
            value={currentTest.title}
            onChange={(e) => updateTestTitle(e.target.value)}
          />
          <span className="text-[10px] text-gray-400 flex-shrink-0">{currentTest.questions.length}문항</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>{subject?.icon} {subject?.name}</span>
          <span>|</span>
          <span>{DIFFICULTY_LABELS[currentTest.difficulty]}</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <button className={`btn !py-1 !px-2 !text-[10px] ${currentTest.showAnswerKey ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAnswerKey(!currentTest.showAnswerKey)}>
            {currentTest.showAnswerKey ? <Eye size={11} /> : <EyeOff size={11} />}
            {currentTest.showAnswerKey ? '정답 ON' : '정답 OFF'}
          </button>
          <button className="btn btn-secondary !py-1 !px-2 !text-[10px]" onClick={sortBySubject} title="과목별 정렬">
            <ArrowUpDown size={11} /> 과목별
          </button>
          <button className="btn btn-secondary !py-1 !px-2 !text-[10px]" onClick={undo} disabled={!canUndo()} title="실행 취소 (Ctrl+Z)">
            <Undo2 size={11} /> 되돌리기
          </button>
          <button className="btn btn-secondary !py-1 !px-2 !text-[10px]" onClick={() => { if (confirm('시험지를 초기 상태로 복원하시겠습니까?')) resetToInitial(); }}
            title="초기화">
            <RotateCcw size={11} /> 초기화
          </button>
        </div>

        {/* Multi-select actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2 bg-primary-50 rounded-lg px-2.5 py-1.5 animate-fadeIn">
            <span className="text-[11px] text-primary-700 font-medium">{selectedCount}개 선택</span>
            <div className="ml-auto flex gap-1">
              <button className="btn btn-primary !py-0.5 !px-2 !text-[10px]" onClick={() => moveSelectedQuestions('up')}>
                <ChevronUp size={11} /> 위로
              </button>
              <button className="btn btn-primary !py-0.5 !px-2 !text-[10px]" onClick={() => moveSelectedQuestions('down')}>
                <ChevronDown size={11} /> 아래로
              </button>
              <button className="btn btn-danger !py-0.5 !px-2 !text-[10px]" onClick={removeSelectedFromTest}>
                <Trash2 size={11} />
              </button>
              <button className="btn btn-ghost !py-0.5 !px-2 !text-[10px]" onClick={clearTestSelection}>
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question list */}
      <div className="flex-1 overflow-y-auto p-3">
        {currentTest.questions.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-12">
            <p className="mb-1">문항이 없습니다.</p>
            <p>좌측에서 문항을 추가하세요.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentTest.questions.map((q, idx) => {
              const sub = subjects.find((s) => s.id === q.subjectId);
              const isSelected = selectedInTest.has(q.id);
              return (
                <TestQuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  total={currentTest.questions.length}
                  showAnswer={currentTest.showAnswerKey}
                  isSelected={isSelected}
                  subjectIcon={sub?.icon || ''}
                  subjectName={sub?.name || ''}
                  onClick={(e) => handleQuestionClick(q.id, e)}
                  onRemove={() => removeQuestionFromTest(q.id)}
                  onMoveUp={() => reorderQuestions(idx, idx - 1)}
                  onMoveDown={() => reorderQuestions(idx, idx + 1)}
                  onEdit={() => onEditQuestion(q)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Hint */}
      {currentTest.questions.length > 0 && (
        <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-400 text-center flex-shrink-0">
          클릭으로 선택 | Shift+클릭으로 범위 선택 | Ctrl+Z 되돌리기
        </div>
      )}
    </div>
  );
}

function TestQuestionCard({
  question: q, index, total, showAnswer, isSelected, subjectIcon, subjectName,
  onClick, onRemove, onMoveUp, onMoveDown, onEdit,
}: {
  question: Question; index: number; total: number; showAnswer: boolean;
  isSelected: boolean; subjectIcon: string; subjectName: string;
  onClick: (e: React.MouseEvent) => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void; onEdit: () => void;
}) {
  const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];

  return (
    <div
      className={`card p-3 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary-400 bg-primary-50/50' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* Select indicator + reorder */}
        <div className="flex flex-col items-center gap-0.5 pt-0.5 flex-shrink-0">
          {isSelected ? <CheckSquare size={13} className="text-primary-600" /> : <Square size={13} className="text-gray-300" />}
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30">
            <ChevronUp size={11} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30">
            <ChevronDown size={11} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-bold text-primary-600">{index + 1}.</span>
            <span className="text-[10px] text-gray-400">{subjectIcon} {subjectName}</span>
          </div>
          <p className="text-xs text-gray-800 leading-relaxed">{q.question}</p>

          {q.type === 'multiple-choice' && q.options && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1.5 text-[11px]">
              {q.options.map((opt, i) => (
                <div key={i} className={showAnswer && opt === q.answer ? 'text-primary-600 font-bold' : 'text-gray-600'}>
                  {labels[i]} {opt}
                </div>
              ))}
            </div>
          )}
          {q.type === 'true-false' && (
            <div className="flex gap-6 mt-1.5 text-[11px]">
              <span className={showAnswer && q.answer === 'O' ? 'text-primary-600 font-bold' : 'text-gray-600'}>{labels[0]} O</span>
              <span className={showAnswer && q.answer === 'X' ? 'text-primary-600 font-bold' : 'text-gray-600'}>{labels[1]} X</span>
            </div>
          )}
          {showAnswer && (q.type === 'fill-blank' || q.type === 'short-answer') && (
            <div className="text-[11px] text-primary-600 font-bold mt-1.5">정답: {q.answer}</div>
          )}
          {showAnswer && q.explanation && (
            <div className="text-[10px] text-gray-500 bg-gray-50 rounded px-2 py-1 mt-1.5">{q.explanation}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1 text-gray-300 hover:text-amber-600 rounded" title="편집">
            <Edit3 size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 text-gray-300 hover:text-red-500 rounded" title="제거">
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
