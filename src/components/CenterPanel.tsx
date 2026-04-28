import { useEffect, useCallback } from 'react';
import {
  Eye, EyeOff, ChevronUp, ChevronDown, X, Edit3, Undo2, RotateCcw,
  ArrowUpDown, Plus, Trash2, CheckSquare, Square, FileText, Sparkles,
} from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import { useToast } from './Toast';
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS } from '../types';
import type { Question, Difficulty } from '../types';

interface Props {
  activeTab: 'preview' | 'test';
  onTabChange: (tab: 'preview' | 'test') => void;
  previewQuestion: Question | null;
  onEditQuestion: (q: Question) => void;
  onDuplicateQuestion?: (q: Question) => void;
}

export default function CenterPanel({ activeTab, onTabChange, previewQuestion, onEditQuestion, onDuplicateQuestion }: Props) {
  // onDuplicateQuestion is accepted for future use; suppress unused warning
  void onDuplicateQuestion;
  const { currentTest } = useTestStore();

  return (
    <div className="flex flex-col h-full">
      {/* Inline pill toggle (saves vertical space, doesn't wrap on narrow screens) */}
      <div className="flex items-center justify-center gap-1 px-3 h-11 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'test'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('test')}
          >
            <FileText size={12} /> 시험지
            {currentTest && currentTest.questions.length > 0 && (
              <span className={`text-[10px] px-1 rounded-full ${
                activeTab === 'test' ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentTest.questions.length}
              </span>
            )}
          </button>
          <button
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('preview')}
          >
            <Eye size={12} /> 문항
          </button>
        </div>
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
          <span className={`badge text-xs badge-${question.difficulty}`}>
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="badge bg-blue-50 text-blue-700 text-xs">
            {QUESTION_TYPE_LABELS[question.type]}
          </span>
        </div>

        {/* Passage / work info (literature) */}
        {(question.passage || question.workTitle) && (
          <div className="border border-gray-300 border-l-4 border-l-purple-400 bg-gray-50 rounded-md p-3 mb-3">
            {question.passage && (
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {question.passage}
              </div>
            )}
            {(question.workTitle || question.workAuthor) && (
              <div className="text-xs text-gray-500 italic text-right mt-2 pt-2 border-t border-dashed border-gray-300">
                – {question.workTitle}{question.workAuthor ? `, ${question.workAuthor}` : ''}
              </div>
            )}
          </div>
        )}

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
          {question.type === 'sentence-making' && (
            <div className="mt-4 space-y-2">
              <div className="text-[11px] text-gray-500 italic">
                직접 문장을 작성하는 서술형 문제
              </div>
              <div className="border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-400 italic min-h-[60px]">
                답안 작성 영역
              </div>
              {question.answer && (
                <div className="px-3 py-2 rounded-lg border border-primary-300 bg-primary-50 text-primary-700 text-sm">
                  <strong>예시 답안:</strong> {question.answer}
                </div>
              )}
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
    return <EmptyTestHero />;
  }

  const testSubjects = currentTest.subjectIds
    .map((id) => subjects.find((s) => s.id === id))
    .filter(Boolean) as typeof subjects;
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
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 flex-wrap">
          {testSubjects.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-0.5">
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </span>
          ))}
          {testSubjects.length === 0 && <span>(과목 없음)</span>}
          <span className="text-gray-300">|</span>
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
            {q.workTitle && (
              <span className="text-[10px] text-purple-600 font-medium">📕 {q.workTitle}</span>
            )}
          </div>
          {(q.passage || q.workTitle) && q.passage && (
            <div className="border-l-2 border-purple-300 bg-purple-50/30 px-2 py-1 mb-1.5 text-[11px] text-gray-600 leading-relaxed line-clamp-3 whitespace-pre-line">
              {q.passage}
              {(q.workTitle || q.workAuthor) && (
                <div className="text-[9px] text-gray-500 italic mt-1">
                  – {q.workTitle}{q.workAuthor ? `, ${q.workAuthor}` : ''}
                </div>
              )}
            </div>
          )}
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
          {q.type === 'sentence-making' && (
            <>
              <div className="text-[10px] text-gray-400 italic mt-1">서술형 (직접 작성)</div>
              {showAnswer && q.answer && (
                <div className="text-[11px] text-primary-600 font-medium mt-1">
                  예시: {q.answer}
                </div>
              )}
            </>
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

/* ═══════════════════════════════════════════════════
   EmptyTestHero — 시험지가 없을 때 보이는 히어로
   첫 사용자가 무엇을 해야 할지 한눈에 알 수 있도록
   Quick-start 카드 4개 + 단계 안내
   ═══════════════════════════════════════════════════ */
function EmptyTestHero() {
  const { questions } = useQuestionStore();
  const { createTest, addQuestionsToTest } = useTestStore();
  const { toast } = useToast();

  /* 빠른 시작 — 한 클릭에 시험지 생성 + 랜덤 문항 자동 추가 */
  const quickStart = (preset: {
    title: string;
    subjectIds: string[];
    difficulty: Difficulty;
    count: number;
    icon: string;
    color: string;
    description: string;
  }) => {
    /* 해당 과목/난이도 문항 필터링 */
    const matching = questions.filter(
      (q) => preset.subjectIds.includes(q.subjectId) && q.difficulty === preset.difficulty
    );

    if (matching.length === 0) {
      toast('warning', `"${preset.title}" 조건에 맞는 문항이 없어요. 직접 만들거나 가져오기를 이용해 주세요.`);
      return;
    }

    /* 시험지 생성 */
    createTest(preset.title, preset.subjectIds, preset.difficulty);

    /* 랜덤 N개 선택 (Fisher-Yates) */
    const target = Math.min(preset.count, matching.length);
    const pool = [...matching];
    for (let i = 0; i < target; i++) {
      const j = i + Math.floor(Math.random() * (pool.length - i));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    /* 다음 tick에 추가 (createTest의 set이 먼저 처리되도록) */
    setTimeout(() => {
      addQuestionsToTest(pool.slice(0, target));
      toast('success', `"${preset.title}" 시험지를 만들었어요! ${target}문항이 자동으로 추가되었습니다.`);
    }, 0);
  };

  const presets = [
    {
      title: '사자성어 시험지',
      subjectIds: ['four-char-idiom'],
      difficulty: 'medium' as Difficulty,
      count: 10,
      icon: '📜',
      color: '#8B5CF6',
      description: '초등 5~6학년 · 보통 · 10문항',
    },
    {
      title: '맞춤법 학습지',
      subjectIds: ['spelling'],
      difficulty: 'easy' as Difficulty,
      count: 10,
      icon: '✏️',
      color: '#10B981',
      description: '초등 3~4학년 · 쉬움 · 10문항',
    },
    {
      title: '국어 종합 (속담·관용구·어휘)',
      subjectIds: ['proverb', 'idiom', 'vocabulary'],
      difficulty: 'medium' as Difficulty,
      count: 10,
      icon: '📚',
      color: '#0EA5E9',
      description: '초등 5~6학년 · 보통 · 10문항',
    },
    {
      title: '중학 국어 (문학)',
      subjectIds: ['middle-literature'],
      difficulty: 'hard' as Difficulty,
      count: 5,
      icon: '📕',
      color: '#7C3AED',
      description: '중학 1학년 · 어려움 · 5문항',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* 단계 안내 */}
        <StepIndicator current={0} />

        {/* Hero */}
        <div className="text-center mt-8 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 mb-4 shadow-lg">
            <FileText size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">
            첫 시험지를 만들어 보세요
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            아래에서 미리 만들어 둔 템플릿을 한 번 클릭하거나,
            <br />
            <span className="text-primary-600 font-semibold">우측 패널 → "새 시험지 만들기"</span>에서 직접 시작할 수 있어요.
          </p>
        </div>

        {/* Quick start presets */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              ⚡ 빠르게 시작하기
            </h3>
            <span className="text-[10px] text-gray-400">한 번 클릭으로 시험지 + 랜덤 문항 자동 생성</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((p) => (
              <button
                key={p.title}
                onClick={() => quickStart(p)}
                className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${p.color}20` }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{p.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{p.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 안내 — 그 외 옵션 */}
        <div className="text-center text-[11px] text-gray-400 leading-relaxed pt-4 border-t border-gray-100">
          💡 우측 패널에서 직접 제목·과목·난이도를 정해 시험지를 만들 수도 있어요.
          <br />
          기본 문항 외에 새 문항이 필요하면 <strong>좌측 ✏️ 버튼</strong>으로 직접 만들거나, <strong>설정 → 데이터 관리 → AI 프롬프트</strong>로 한 번에 여러 개를 만들 수 있어요.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   StepIndicator — 4단계 진행 상태 표시
   현재 어느 단계에 있는지 항상 보여줌
   ═══════════════════════════════════════════════════ */
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: '시험지 만들기', icon: <Plus size={11} /> },
    { num: 2, label: '문항 추가', icon: <FileText size={11} /> },
    { num: 3, label: '미리보기', icon: <Eye size={11} /> },
    { num: 4, label: 'PDF 출력', icon: <ArrowUpDown size={11} className="rotate-90" /> },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-2">
      {steps.map((s, i) => {
        const isCurrent = i === current;
        const isPast = i < current;
        return (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isCurrent
                  ? 'bg-primary-600 text-white shadow-sm'
                  : isPast
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold ${
                isCurrent
                  ? 'bg-white/25'
                  : isPast
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {isPast ? '✓' : s.num}
              </span>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-3 h-px ${isPast ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
