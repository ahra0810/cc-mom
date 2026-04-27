import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { Question, QuestionType, Difficulty } from '../types';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '../types';
import { useQuestionStore } from '../stores/questionStore';
import { useTestStore } from '../stores/testStore';

interface Props {
  question?: Question | null; // null = create new (or duplicate)
  duplicateSource?: Question | null; // pre-fill from this question
  onClose: () => void;
}

export default function QuestionEditor({ question, duplicateSource, onClose }: Props) {
  const { subjects, addQuestion, updateQuestion } = useQuestionStore();
  const { currentTest, addQuestionToTest, updateQuestionInTest } = useTestStore();
  const isEdit = !!question;
  const seed = question || duplicateSource;

  const [type, setType] = useState<QuestionType>(seed?.type || 'multiple-choice');
  const [subjectId, setSubjectId] = useState(seed?.subjectId || currentTest?.subjectIds?.[0] || subjects[0]?.id || '');
  const [difficulty, setDifficulty] = useState<Difficulty>(seed?.difficulty || currentTest?.difficulty || 'easy');
  const [questionText, setQuestionText] = useState(seed?.question || '');
  const [options, setOptions] = useState<string[]>(seed?.options || ['', '', '', '']);
  const [answer, setAnswer] = useState(seed?.answer || '');
  const [explanation, setExplanation] = useState(seed?.explanation || '');
  const [passage, setPassage] = useState(seed?.passage || '');
  const [workTitle, setWorkTitle] = useState(seed?.workTitle || '');
  const [workAuthor, setWorkAuthor] = useState(seed?.workAuthor || '');
  const [showWorkInfo, setShowWorkInfo] = useState(!!(seed?.passage || seed?.workTitle));

  useEffect(() => {
    if (type === 'true-false' && !question) {
      setAnswer('O');
    }
  }, [type]);

  const handleSave = () => {
    if (!questionText.trim()) return;
    // Sentence-making allows empty answer (it's a sample answer)
    if (type !== 'sentence-making' && !answer.trim()) return;

    const q: Question = {
      id: question?.id || nanoid(),
      type,
      subjectId,
      difficulty,
      question: questionText.trim(),
      options: type === 'multiple-choice' ? options.filter((o) => o.trim()) : undefined,
      answer: answer.trim(),
      explanation: explanation.trim() || undefined,
      tags: question?.tags || seed?.tags || [],
      createdAt: question?.createdAt || Date.now(),
      source: question?.source || 'manual',
      passage: passage.trim() || undefined,
      workTitle: workTitle.trim() || undefined,
      workAuthor: workAuthor.trim() || undefined,
    };

    if (isEdit) {
      updateQuestion(q.id, q);
      // Also update in test if present
      if (currentTest?.questions.some((tq) => tq.id === q.id)) {
        updateQuestionInTest(q.id, q);
      }
    } else {
      addQuestion(q);
      if (currentTest) {
        addQuestionToTest(q);
      }
    }
    onClose();
  };

  const updateOption = (index: number, value: string) => {
    const newOpts = [...options];
    newOpts[index] = value;
    setOptions(newOpts);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">
            {isEdit ? '문항 편집' : '새 문항 만들기'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">문제 유형</label>
            <select className="select-field text-xs" value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
              {Object.entries(QUESTION_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Subject & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">과목</label>
              <select className="select-field text-xs" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">난이도</label>
              <select className="select-field text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Work info / Passage (collapsible, optional) */}
          <div>
            <button
              type="button"
              onClick={() => setShowWorkInfo(!showWorkInfo)}
              className="flex items-center gap-1.5 text-[11px] text-gray-600 hover:text-primary-600 font-medium"
            >
              <span>📕</span>
              <span>작품 정보 / 지문 {showWorkInfo ? '▾' : '▸'}</span>
              <span className="text-[10px] text-gray-400">(선택)</span>
            </button>
            {showWorkInfo && (
              <div className="mt-2 space-y-2 p-3 bg-purple-50/50 border border-purple-100 rounded-lg animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 mb-1 block">작품명</label>
                    <input
                      className="input-field !text-xs"
                      placeholder="예: 소나기"
                      value={workTitle}
                      onChange={(e) => setWorkTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 mb-1 block">작가</label>
                    <input
                      className="input-field !text-xs"
                      placeholder="예: 황순원"
                      value={workAuthor}
                      onChange={(e) => setWorkAuthor(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-600 mb-1 block">지문 (제시문)</label>
                  <textarea
                    className="input-field !text-xs min-h-[80px] resize-y"
                    placeholder="작품에서 발췌한 지문을 입력하세요..."
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    문학·국어 문제 등 작품 발췌가 필요한 경우에 사용하세요. 문제 위에 박스로 표시됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Question text */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">문제</label>
            <textarea
              className="input-field text-xs min-h-[80px] resize-y"
              placeholder="문제를 입력하세요..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          {/* Options (for multiple choice) */}
          {type === 'multiple-choice' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">선택지</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4 flex-shrink-0">{i + 1}.</span>
                    <input
                      className="input-field text-xs flex-1"
                      placeholder={`선택지 ${i + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                    />
                    <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        checked={answer === opt && opt !== ''}
                        onChange={() => setAnswer(opt)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      정답
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer (for true-false) */}
          {type === 'true-false' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">정답</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="tf-answer"
                    checked={answer === 'O'}
                    onChange={() => setAnswer('O')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  O (맞다)
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="tf-answer"
                    checked={answer === 'X'}
                    onChange={() => setAnswer('X')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  X (틀리다)
                </label>
              </div>
            </div>
          )}

          {/* Answer (for fill-blank, short-answer) */}
          {(type === 'fill-blank' || type === 'short-answer') && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">정답</label>
              <input
                className="input-field text-xs"
                placeholder="정답을 입력하세요"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          )}

          {/* Sample answer (for sentence-making) */}
          {type === 'sentence-making' && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                예시 답안 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <textarea
                className="input-field text-xs min-h-[60px] resize-y"
                placeholder='예시: "오늘 발표 잘했다고 자화자찬했다."'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                학생이 직접 문장을 작성하는 서술형 문제입니다. 답안지 PDF에 예시 답안이 표시됩니다.
              </p>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">해설 (선택)</label>
            <textarea
              className="input-field text-xs min-h-[60px] resize-y"
              placeholder="해설을 입력하세요..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button className="btn btn-secondary" onClick={onClose}>취소</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!questionText.trim() || (type !== 'sentence-making' && !answer.trim())}
          >
            <Save size={14} />
            {isEdit ? '수정 완료' : '문항 추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
