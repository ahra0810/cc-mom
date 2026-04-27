import { useState } from 'react';
import {
  Plus, Save, Trash2, FolderOpen, FileDown, FileText, Settings,
  ChevronDown, ChevronRight, Pencil, Check, X,
} from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import { useQuestionStore } from '../stores/questionStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import { exportToPDF, exportAnswerKeyToPDF } from '../services/pdfService';

interface Props {
  onOpenSettings: () => void;
}

export default function RightPanel({ onOpenSettings }: Props) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <FileText size={14} className="text-primary-600" />
        <span className="text-xs font-bold text-gray-800">시험지 작업</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CurrentTestSection />
        <ExportSection />
        <SavedListSection />
      </div>

      <div className="px-3 py-2 border-t border-gray-200 flex-shrink-0">
        <button className="btn btn-ghost w-full !text-xs" onClick={onOpenSettings}>
          <Settings size={13} /> 설정
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   섹션: 현재 시험지 정보 + 새 시험지 만들기
   ═══════════════════════════════════════════════════ */

function CurrentTestSection() {
  const { subjects } = useQuestionStore();
  const { currentTest, createTest, clearTest, saveTest, updateTestTitle } = useTestStore();
  const { toast } = useToast();
  const confirm = useConfirm();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [editingTitle, setEditingTitle] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) return;
    createTest(title.trim(), subjectId, difficulty);
    toast('success', '시험지를 생성했습니다');
    setTitle('');
  };

  const handleSave = () => {
    if (!currentTest || currentTest.questions.length === 0) return;
    saveTest();
    toast('success', '시험지를 저장했습니다');
  };

  const handleClose = async () => {
    const ok = await confirm({
      title: '시험지 닫기',
      message: '저장하지 않은 변경사항은 사라집니다.\n계속하시겠습니까?',
      variant: 'warning',
      confirmText: '닫기',
    });
    if (ok) clearTest();
  };

  // No current test → show "create new" form
  if (!currentTest) {
    return (
      <Section title="새 시험지 만들기" icon={<Plus size={13} />} defaultOpen>
        <input
          className="input-field !text-xs"
          placeholder="시험지 제목 (예: 3학년 세계사 퀴즈)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <select className="select-field !text-xs" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (<option key={s.id} value={s.id}>{s.icon} {s.name}</option>))}
        </select>
        <select className="select-field !text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <button className="btn btn-primary w-full" onClick={handleCreate} disabled={!title.trim()}>
          <Plus size={13} /> 시험지 생성
        </button>
      </Section>
    );
  }

  // Has current test → show info & actions
  const sub = subjects.find((s) => s.id === currentTest.subjectId);
  return (
    <Section title="현재 시험지" icon={<FileText size={13} />} defaultOpen>
      <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-lg p-2.5 border border-primary-100">
        {editingTitle ? (
          <div className="flex items-center gap-1">
            <input
              className="input-field !text-xs !py-1 flex-1"
              value={currentTest.title}
              onChange={(e) => updateTestTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              autoFocus
            />
            <button onClick={() => setEditingTitle(false)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
              <Check size={12} />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-1.5">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-800 break-keep">{currentTest.title}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {sub?.icon} {sub?.name} · {DIFFICULTY_LABELS[currentTest.difficulty].split('(')[0].trim()}
              </div>
            </div>
            <button onClick={() => setEditingTitle(true)} className="p-1 text-gray-400 hover:text-primary-600 rounded flex-shrink-0">
              <Pencil size={11} />
            </button>
          </div>
        )}
        <div className="text-[10px] text-gray-500 mt-1.5 pt-1.5 border-t border-primary-100">
          {currentTest.questions.length}문항
        </div>
      </div>
      <div className="flex gap-1.5">
        <button className="btn btn-success flex-1" onClick={handleSave} disabled={currentTest.questions.length === 0}>
          <Save size={12} /> 저장
        </button>
        <button className="btn btn-secondary flex-1" onClick={handleClose}>
          <X size={12} /> 닫기
        </button>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   섹션: PDF 내보내기
   ═══════════════════════════════════════════════════ */

function ExportSection() {
  const { currentTest } = useTestStore();
  const { subjects } = useQuestionStore();
  const { toast } = useToast();

  const handleExportPDF = () => {
    if (!currentTest || currentTest.questions.length === 0) {
      toast('warning', '먼저 문항을 추가하세요');
      return;
    }
    const sub = subjects.find((s) => s.id === currentTest.subjectId);
    exportToPDF(currentTest, sub?.name || '');
  };

  const handleExportAnswerKey = () => {
    if (!currentTest || currentTest.questions.length === 0) {
      toast('warning', '먼저 문항을 추가하세요');
      return;
    }
    const sub = subjects.find((s) => s.id === currentTest.subjectId);
    exportAnswerKeyToPDF(currentTest, sub?.name || '');
  };

  const disabled = !currentTest || currentTest.questions.length === 0;

  return (
    <Section title="PDF 내보내기" icon={<FileDown size={13} />} defaultOpen={!disabled}>
      <button className="btn btn-primary w-full" onClick={handleExportPDF} disabled={disabled}>
        <FileDown size={13} /> 시험지 PDF
      </button>
      <button className="btn btn-secondary w-full" onClick={handleExportAnswerKey} disabled={disabled}>
        <FileDown size={13} /> 답안지 + 해설 PDF
      </button>
      <p className="text-[10px] text-gray-400 leading-relaxed">
        새 창에서 인쇄 대화상자가 열립니다. <strong>"PDF로 저장"</strong> 옵션을 선택하세요.
      </p>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   섹션: 저장된 시험지
   ═══════════════════════════════════════════════════ */

function SavedListSection() {
  const { savedTests, loadTest, deleteTest } = useTestStore();
  const { subjects } = useQuestionStore();
  const { toast } = useToast();
  const confirm = useConfirm();

  const handleLoad = (id: string, title: string) => {
    loadTest(id);
    toast('success', `"${title}" 불러오기 완료`);
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: '시험지 삭제',
      message: `"${title}"을(를) 정말 삭제하시겠습니까?`,
      variant: 'danger',
      confirmText: '삭제',
    });
    if (ok) {
      deleteTest(id);
      toast('success', '삭제되었습니다');
    }
  };

  return (
    <Section title="저장된 시험지" icon={<FolderOpen size={13} />} count={savedTests.length}>
      {savedTests.length === 0 ? (
        <div className="text-center text-gray-400 text-[11px] py-4">
          저장된 시험지가 없습니다
        </div>
      ) : (
        <div className="space-y-1.5">
          {savedTests.map((test) => {
            const sub = subjects.find((s) => s.id === test.subjectId);
            return (
              <div key={test.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <div className="text-xs font-medium text-gray-800 truncate">{test.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                  {sub?.icon} {sub?.name} · {test.questions.length}문항 ·{' '}
                  {new Date(test.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="flex gap-1 mt-1.5">
                  <button
                    className="btn btn-primary flex-1 !py-1 !px-2 !text-[10px]"
                    onClick={() => handleLoad(test.id, test.title)}
                  >
                    불러오기
                  </button>
                  <button
                    className="btn btn-ghost !py-1 !px-1.5 !text-[10px] text-gray-400 hover:!text-red-500"
                    onClick={() => handleDelete(test.id, test.title)}
                    aria-label="삭제"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   접을 수 있는 섹션 컴포넌트
   ═══════════════════════════════════════════════════ */

function Section({ title, icon, count, defaultOpen = true, children }: {
  title: string; icon: React.ReactNode; count?: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        className="w-full flex items-center gap-1.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={11} className="text-gray-400" /> : <ChevronRight size={11} className="text-gray-400" />}
        <span className="text-primary-600">{icon}</span>
        <span className="text-xs font-bold text-gray-700 flex-1">{title}</span>
        {count !== undefined && (
          <span className="text-[10px] text-gray-400 font-medium">{count}</span>
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
