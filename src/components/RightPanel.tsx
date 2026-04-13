import { useState } from 'react';
import {
  Plus, Save, Trash2, FolderOpen, FileDown, FileText, Settings,
} from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import { exportToPDF, exportAnswerKeyToPDF } from '../services/pdfService';

interface Props {
  onOpenSettings: () => void;
}

export default function RightPanel({ onOpenSettings }: Props) {
  const [activeTab, setActiveTab] = useState<'create' | 'export' | 'saved'>('create');

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {[
          { key: 'create', label: '시험지', icon: <FileText size={12} /> },
          { key: 'export', label: '내보내기', icon: <FileDown size={12} /> },
          { key: 'saved', label: '저장됨', icon: <FolderOpen size={12} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              activeTab === key
                ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(key as typeof activeTab)}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'create' && <CreateTab />}
        {activeTab === 'export' && <ExportTab />}
        {activeTab === 'saved' && <SavedTab />}
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0">
        <button className="btn btn-ghost w-full !text-xs" onClick={onOpenSettings}>
          <Settings size={13} /> 설정
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ 시험지 생성 탭 ═══════════════ */

function CreateTab() {
  const { subjects } = useQuestionStore();
  const { currentTest, createTest, clearTest, saveTest } = useTestStore();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleCreate = () => {
    if (!title.trim()) return;
    createTest(title.trim(), subjectId, difficulty);
    setTitle('');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* New test */}
      <Section title="새 시험지 만들기" icon={<Plus size={13} />}>
        <input
          className="input-field text-xs"
          placeholder="시험지 제목 (예: 3학년 세계사 퀴즈)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <select className="select-field text-xs" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
          ))}
        </select>
        <select className="select-field text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button className="btn btn-primary w-full !text-xs" onClick={handleCreate} disabled={!title.trim()}>
          <Plus size={13} /> 시험지 생성
        </button>
      </Section>

      {/* Current test info */}
      {currentTest && (
        <Section title="현재 시험지" icon={<FileText size={13} />}>
          <div className="bg-gray-50 rounded-lg p-2.5 text-xs space-y-1">
            <div className="font-medium text-gray-800">{currentTest.title}</div>
            <div className="text-gray-500">{currentTest.questions.length}문항</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-success flex-1 !text-xs" onClick={saveTest}
              disabled={currentTest.questions.length === 0}>
              <Save size={12} /> 저장
            </button>
            <button className="btn btn-danger flex-1 !text-xs"
              onClick={() => { if (confirm('시험지를 닫으시겠습니까?')) clearTest(); }}>
              <Trash2 size={12} /> 닫기
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}

/* ═══════════════ 내보내기 탭 ═══════════════ */

function ExportTab() {
  const { currentTest } = useTestStore();
  const { subjects } = useQuestionStore();

  const handleExportPDF = () => {
    if (!currentTest || currentTest.questions.length === 0) return;
    const sub = subjects.find((s) => s.id === currentTest.subjectId);
    exportToPDF(currentTest, sub?.name || '');
  };

  const handleExportAnswerKey = () => {
    if (!currentTest || currentTest.questions.length === 0) return;
    const sub = subjects.find((s) => s.id === currentTest.subjectId);
    exportAnswerKeyToPDF(currentTest, sub?.name || '');
  };

  if (!currentTest || currentTest.questions.length === 0) {
    return (
      <div className="text-center text-gray-400 text-xs py-8 animate-fadeIn">
        <FileDown size={32} className="mx-auto mb-2 text-gray-300" />
        <p>내보낼 시험지가 없습니다.</p>
        <p className="mt-1">먼저 시험지를 만들고 문항을 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <Section title="PDF 내보내기" icon={<FileDown size={13} />}>
        <div className="bg-gray-50 rounded-lg p-2.5 text-xs">
          <div className="font-medium text-gray-800">{currentTest.title}</div>
          <div className="text-gray-500">{currentTest.questions.length}문항</div>
        </div>
        <button className="btn btn-primary w-full !text-xs" onClick={handleExportPDF}>
          <FileDown size={13} /> 시험지 PDF
        </button>
        <button className="btn btn-secondary w-full !text-xs" onClick={handleExportAnswerKey}>
          <FileDown size={13} /> 답안지 + 해설 PDF
        </button>
        <p className="text-[10px] text-gray-400 text-center">
          새 창에서 인쇄 대화상자가 열립니다.<br />"PDF로 저장"을 선택하세요.
        </p>
      </Section>
    </div>
  );
}

/* ═══════════════ 저장됨 탭 ═══════════════ */

function SavedTab() {
  const { savedTests, loadTest, deleteTest } = useTestStore();
  const { subjects } = useQuestionStore();

  if (savedTests.length === 0) {
    return (
      <div className="text-center text-gray-400 text-xs py-8 animate-fadeIn">
        <FolderOpen size={32} className="mx-auto mb-2 text-gray-300" />
        <p>저장된 시험지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fadeIn">
      {savedTests.map((test) => {
        const sub = subjects.find((s) => s.id === test.subjectId);
        return (
          <div key={test.id} className="card p-2.5">
            <div className="text-xs font-medium text-gray-800">{test.title}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {sub?.icon} {sub?.name} | {test.questions.length}문항 |{' '}
              {new Date(test.createdAt).toLocaleDateString('ko-KR')}
            </div>
            <div className="flex gap-1.5 mt-2">
              <button className="btn btn-primary !py-1 !px-2 !text-[10px]" onClick={() => loadTest(test.id)}>
                불러오기
              </button>
              <button className="btn btn-danger !py-1 !px-2 !text-[10px]"
                onClick={() => { if (confirm('삭제하시겠습니까?')) deleteTest(test.id); }}>
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════ Helper ═══════════════ */

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-primary-600">{icon}</span>
        <h3 className="text-xs font-bold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
