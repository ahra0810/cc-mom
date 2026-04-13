import { useState } from 'react';
import { GripVertical, X, Eye, EyeOff, FileText, Edit3, ChevronUp, ChevronDown } from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import { DIFFICULTY_LABELS } from '../types';
import type { Question } from '../types';

interface Props {
  onEditQuestion: (q: Question) => void;
}

export default function TestPreview({ onEditQuestion }: Props) {
  const {
    currentTest, removeQuestionFromTest, setShowAnswerKey,
    updateTestTitle, reorderQuestions,
  } = useTestStore();
  const { subjects } = useQuestionStore();
  const [editingTitle, setEditingTitle] = useState(false);

  if (!currentTest) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <FileText size={48} className="mb-4 text-gray-300" />
        <p className="text-sm font-medium mb-1">시험지가 없습니다</p>
        <p className="text-xs text-center">우측 도구판에서 "새 시험지 만들기"를<br />클릭하여 시작하세요.</p>
      </div>
    );
  }

  const subject = subjects.find((s) => s.id === currentTest.subjectId);
  const diffLabel = DIFFICULTY_LABELS[currentTest.difficulty];

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentTest.questions.length) return;
    reorderQuestions(index, newIndex);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          {editingTitle ? (
            <input
              className="input-field text-sm font-bold"
              value={currentTest.title}
              onChange={(e) => updateTestTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              autoFocus
            />
          ) : (
            <h2
              className="text-sm font-bold text-gray-800 cursor-pointer hover:text-primary-600 flex items-center gap-1"
              onClick={() => setEditingTitle(true)}
            >
              {currentTest.title}
              <Edit3 size={12} className="text-gray-400" />
            </h2>
          )}
          <span className="text-xs text-gray-500">{currentTest.questions.length}문항</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{subject?.icon} {subject?.name}</span>
          <span>|</span>
          <span>{diffLabel}</span>
          <div className="ml-auto">
            <button
              className={`btn !py-1 !px-2 !text-xs ${currentTest.showAnswerKey ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowAnswerKey(!currentTest.showAnswerKey)}
            >
              {currentTest.showAnswerKey ? <Eye size={12} /> : <EyeOff size={12} />}
              {currentTest.showAnswerKey ? '정답 표시 중' : '정답 숨김'}
            </button>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentTest.questions.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-12">
            <p className="mb-2">문항이 없습니다.</p>
            <p>좌측 문항 DB에서 문항을 추가하거나,<br />우측 도구판에서 AI 자동 생성을 이용하세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentTest.questions.map((q, idx) => (
              <PreviewQuestionCard
                key={q.id}
                question={q}
                index={idx}
                total={currentTest.questions.length}
                showAnswer={currentTest.showAnswerKey}
                onRemove={() => removeQuestionFromTest(q.id)}
                onMoveUp={() => moveQuestion(idx, 'up')}
                onMoveDown={() => moveQuestion(idx, 'down')}
                onEdit={() => onEditQuestion(q)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewQuestionCard({
  question: q, index, total, showAnswer, onRemove, onMoveUp, onMoveDown, onEdit,
}: {
  question: Question; index: number; total: number; showAnswer: boolean;
  onRemove: () => void; onMoveUp: () => void; onMoveDown: () => void; onEdit: () => void;
}) {
  const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];

  return (
    <div className="card p-3 animate-fadeIn group">
      <div className="flex items-start gap-2">
        {/* Drag handle & reorder */}
        <div className="flex flex-col items-center gap-0.5 pt-0.5 flex-shrink-0">
          <GripVertical size={14} className="text-gray-300" />
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-primary-600 mt-0.5 flex-shrink-0">{index + 1}.</span>
            <div className="flex-1">
              <p className="text-xs text-gray-800 leading-relaxed">{q.question}</p>

              {/* Options */}
              {q.type === 'multiple-choice' && q.options && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-2 text-xs">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`py-0.5 ${showAnswer && opt === q.answer ? 'text-primary-600 font-bold' : 'text-gray-600'}`}
                    >
                      {labels[i]} {opt}
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'true-false' && (
                <div className="flex gap-6 mt-2 text-xs">
                  <span className={showAnswer && q.answer === 'O' ? 'text-primary-600 font-bold' : 'text-gray-600'}>
                    {labels[0]} O
                  </span>
                  <span className={showAnswer && q.answer === 'X' ? 'text-primary-600 font-bold' : 'text-gray-600'}>
                    {labels[1]} X
                  </span>
                </div>
              )}

              {/* Answer & Explanation */}
              {showAnswer && (
                <div className="mt-2 space-y-1">
                  {(q.type === 'fill-blank' || q.type === 'short-answer') && (
                    <div className="text-xs text-primary-600 font-bold">
                      정답: {q.answer}
                    </div>
                  )}
                  {q.explanation && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 rounded px-2 py-1">
                      {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1 text-gray-400 hover:text-amber-600 rounded" title="편집">
            <Edit3 size={13} />
          </button>
          <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 rounded" title="제거">
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
