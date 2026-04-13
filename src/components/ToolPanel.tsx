import { useState } from 'react';
import {
  Wand2, PenTool, FileDown, Settings, Plus, Save, Trash2, FolderOpen,
  Loader2, BookOpen, Sparkles, FileText, Key,
} from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import type { Difficulty, QuestionType, AISettings } from '../types';
import { DIFFICULTY_LABELS, QUESTION_TYPE_LABELS } from '../types';
import { generateQuestions } from '../services/aiService';
import { exportToPDF, exportAnswerKeyToPDF } from '../services/pdfService';

interface Props {
  onManualCreate: () => void;
  onOpenSettings: () => void;
}

export default function ToolPanel({ onManualCreate, onOpenSettings }: Props) {
  const { subjects, addQuestions } = useQuestionStore();
  const {
    currentTest, createTest, clearTest, saveTest, savedTests,
    loadTest, deleteTest, addQuestionsToTest,
  } = useTestStore();

  // New test form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(subjects[0]?.id || '');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('easy');

  // AI generation
  const [aiSubject, setAiSubject] = useState(subjects[0]?.id || '');
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('easy');
  const [aiTypes, setAiTypes] = useState<QuestionType[]>(['multiple-choice']);
  const [aiCount, setAiCount] = useState(5);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Sections
  const [activeSection, setActiveSection] = useState<'create' | 'ai' | 'export' | 'saved'>('create');

  // AI Settings from localStorage
  const getAISettings = (): AISettings | null => {
    try {
      const raw = localStorage.getItem('quiz-maker-ai-settings');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const handleCreateTest = () => {
    if (!newTitle.trim()) return;
    createTest(newTitle.trim(), newSubject, newDifficulty);
    setNewTitle('');
  };

  const handleAIGenerate = async () => {
    const settings = getAISettings();
    if (!settings?.apiKey) {
      setAiError('API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.');
      return;
    }
    const subject = subjects.find((s) => s.id === aiSubject);
    if (!subject) return;

    setAiLoading(true);
    setAiError('');
    try {
      const questions = await generateQuestions({
        subject,
        difficulty: aiDifficulty,
        questionTypes: aiTypes,
        count: aiCount,
        topic: aiTopic || undefined,
        apiKey: settings.apiKey,
        provider: settings.provider,
        model: settings.model,
      });
      addQuestions(questions);
      if (currentTest) {
        addQuestionsToTest(questions);
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI 생성 중 오류가 발생했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleToggleType = (type: QuestionType) => {
    setAiTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleExportPDF = () => {
    if (!currentTest || currentTest.questions.length === 0) return;
    const subject = subjects.find((s) => s.id === currentTest.subjectId);
    exportToPDF(currentTest, subject?.name || '');
  };

  const handleExportAnswerKey = () => {
    if (!currentTest || currentTest.questions.length === 0) return;
    const subject = subjects.find((s) => s.id === currentTest.subjectId);
    exportAnswerKeyToPDF(currentTest, subject?.name || '');
  };

  const aiSettings = getAISettings();

  return (
    <div className="flex flex-col h-full">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { key: 'create', icon: Plus, label: '시험지' },
          { key: 'ai', icon: Sparkles, label: 'AI 생성' },
          { key: 'export', icon: FileDown, label: '내보내기' },
          { key: 'saved', icon: FolderOpen, label: '저장됨' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              activeSection === key
                ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSection(key as typeof activeSection)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {/* === Create Test Section === */}
        {activeSection === 'create' && (
          <div className="space-y-4 animate-fadeIn">
            {/* New test */}
            <Section title="새 시험지 만들기" icon={<FileText size={14} />}>
              <input
                className="input-field text-xs"
                placeholder="시험지 제목 (예: 3학년 세계사 퀴즈)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <select className="select-field text-xs" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
              <select className="select-field text-xs" value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button className="btn btn-primary w-full" onClick={handleCreateTest} disabled={!newTitle.trim()}>
                <Plus size={14} /> 시험지 생성
              </button>
            </Section>

            {/* Current test actions */}
            {currentTest && (
              <Section title="현재 시험지" icon={<BookOpen size={14} />}>
                <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                  <strong>{currentTest.title}</strong>
                  <br />
                  {currentTest.questions.length}문항
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-success flex-1 !text-xs" onClick={saveTest}>
                    <Save size={12} /> 저장
                  </button>
                  <button className="btn btn-danger flex-1 !text-xs" onClick={() => { if (confirm('시험지를 닫으시겠습니까?')) clearTest(); }}>
                    <Trash2 size={12} /> 닫기
                  </button>
                </div>
                <button className="btn btn-secondary w-full !text-xs" onClick={onManualCreate}>
                  <PenTool size={12} /> 문항 수동 추가
                </button>
              </Section>
            )}
          </div>
        )}

        {/* === AI Generation Section === */}
        {activeSection === 'ai' && (
          <div className="space-y-4 animate-fadeIn">
            <Section title="AI 자동 생성" icon={<Wand2 size={14} />}>
              {!aiSettings?.apiKey && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700">
                  <Key size={12} className="inline mr-1" />
                  API 키가 필요합니다.
                  <button
                    className="underline ml-1 font-medium"
                    onClick={onOpenSettings}
                  >
                    설정하기
                  </button>
                </div>
              )}

              <select className="select-field text-xs" value={aiSubject} onChange={(e) => setAiSubject(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>

              <select className="select-field text-xs" value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value as Difficulty)}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>

              {/* Question types multi-select */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">문제 유형</label>
                <div className="space-y-1">
                  {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
                    <label key={k} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiTypes.includes(k)}
                        onChange={() => handleToggleType(k)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  문항 수: {aiCount}개
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>1</span><span>10</span><span>20</span>
                </div>
              </div>

              <input
                className="input-field text-xs"
                placeholder="특정 주제 (선택사항)"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />

              {aiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
                  {aiError}
                </div>
              )}

              <button
                className="btn btn-primary w-full"
                onClick={handleAIGenerate}
                disabled={aiLoading || aiTypes.length === 0}
              >
                {aiLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> 생성 중...</>
                ) : (
                  <><Wand2 size={14} /> AI로 {aiCount}문항 생성</>
                )}
              </button>
            </Section>
          </div>
        )}

        {/* === Export Section === */}
        {activeSection === 'export' && (
          <div className="space-y-4 animate-fadeIn">
            <Section title="PDF 내보내기" icon={<FileDown size={14} />}>
              {!currentTest || currentTest.questions.length === 0 ? (
                <p className="text-xs text-gray-500">내보낼 시험지가 없습니다. 먼저 시험지를 만들고 문항을 추가하세요.</p>
              ) : (
                <>
                  <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                    <strong>{currentTest.title}</strong> ({currentTest.questions.length}문항)
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleExportPDF}>
                    <FileDown size={14} /> 시험지 PDF 내보내기
                  </button>
                  <button className="btn btn-secondary w-full" onClick={handleExportAnswerKey}>
                    <FileDown size={14} /> 답안지+해설 PDF 내보내기
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    새 창에서 인쇄 대화상자가 열립니다.<br />
                    "PDF로 저장"을 선택하면 PDF 파일로 저장됩니다.
                  </p>
                </>
              )}
            </Section>
          </div>
        )}

        {/* === Saved Tests Section === */}
        {activeSection === 'saved' && (
          <div className="space-y-4 animate-fadeIn">
            <Section title="저장된 시험지" icon={<FolderOpen size={14} />}>
              {savedTests.length === 0 ? (
                <p className="text-xs text-gray-500">저장된 시험지가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {savedTests.map((test) => {
                    const sub = subjects.find((s) => s.id === test.subjectId);
                    return (
                      <div key={test.id} className="bg-gray-50 rounded-lg p-2.5 text-xs">
                        <div className="font-medium text-gray-800">{test.title}</div>
                        <div className="text-gray-500 mt-0.5">
                          {sub?.icon} {sub?.name} | {test.questions.length}문항 |{' '}
                          {new Date(test.createdAt).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <button className="btn btn-primary !py-1 !px-2 !text-[10px]" onClick={() => loadTest(test.id)}>
                            불러오기
                          </button>
                          <button
                            className="btn btn-danger !py-1 !px-2 !text-[10px]"
                            onClick={() => { if (confirm('이 시험지를 삭제하시겠습니까?')) deleteTest(test.id); }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>
        )}
      </div>

      {/* Settings button */}
      <div className="p-3 border-t border-gray-200">
        <button className="btn btn-ghost w-full !text-xs" onClick={onOpenSettings}>
          <Settings size={14} /> 설정
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-primary-600">{icon}</span>
        <h3 className="text-xs font-bold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}
