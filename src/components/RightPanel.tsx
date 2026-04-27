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
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<string>>(
    () => new Set(subjects[0] ? [subjects[0].id] : [])
  );
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [editingTitle, setEditingTitle] = useState(false);

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    if (selectedSubjectIds.size === 0) {
      toast('warning', '과목을 한 개 이상 선택해주세요');
      return;
    }
    createTest(title.trim(), [...selectedSubjectIds], difficulty);
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
    const allSelected = subjects.length > 0 && subjects.every((s) => selectedSubjectIds.has(s.id));
    return (
      <Section title="새 시험지 만들기" icon={<Plus size={13} />} defaultOpen>
        <input
          className="input-field !text-xs"
          placeholder="시험지 제목 (예: 3학년 종합 퀴즈)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          aria-label="시험지 제목"
        />

        {/* Multi-subject selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              과목 선택 ({selectedSubjectIds.size})
            </label>
            <button
              type="button"
              className="text-[10px] text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => {
                if (allSelected) setSelectedSubjectIds(new Set());
                else setSelectedSubjectIds(new Set(subjects.map((s) => s.id)));
              }}
            >
              {allSelected ? '전체 해제' : '전체 선택'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {subjects.map((s) => {
              const checked = selectedSubjectIds.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSubject(s.id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium border transition-all text-left ${
                    checked
                      ? 'border-transparent text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  style={checked ? { backgroundColor: s.color } : undefined}
                  aria-pressed={checked}
                >
                  <div className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 ${
                    checked ? 'bg-white/20 border-white/40' : 'border-gray-300 bg-white'
                  }`}>
                    {checked && <Check size={8} strokeWidth={3} className="text-white" />}
                  </div>
                  <span className="truncate">{s.icon} {s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <select
          className="select-field !text-xs"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          aria-label="난이도"
        >
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>

        <button
          className="btn btn-primary w-full"
          onClick={handleCreate}
          disabled={!title.trim() || selectedSubjectIds.size === 0}
        >
          <Plus size={13} /> 시험지 생성
        </button>
      </Section>
    );
  }

  // Has current test → show info & actions
  const testSubjects = currentTest.subjectIds
    .map((id) => subjects.find((s) => s.id === id))
    .filter(Boolean) as typeof subjects;
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
              <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-1">
                {testSubjects.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/70 border border-primary-100">
                    {s.icon} {s.name}
                  </span>
                ))}
                {testSubjects.length === 0 && <span>(과목 없음)</span>}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {DIFFICULTY_LABELS[currentTest.difficulty].split('(')[0].trim()}
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

  const getSubjectLabel = () => {
    if (!currentTest) return '';
    const names = currentTest.subjectIds
      .map((id) => subjects.find((s) => s.id === id)?.name)
      .filter(Boolean) as string[];
    return names.join(' · ');
  };

  const handleExportPDF = () => {
    if (!currentTest || currentTest.questions.length === 0) {
      toast('warning', '먼저 문항을 추가하세요');
      return;
    }
    exportToPDF(currentTest, getSubjectLabel());
  };

  const handleExportAnswerKey = () => {
    if (!currentTest || currentTest.questions.length === 0) {
      toast('warning', '먼저 문항을 추가하세요');
      return;
    }
    exportAnswerKeyToPDF(currentTest, getSubjectLabel());
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
            const testSubs = test.subjectIds
              .map((id) => subjects.find((s) => s.id === id))
              .filter(Boolean) as typeof subjects;
            const subLabel = testSubs.length === 0
              ? '(과목 없음)'
              : testSubs.length === 1
                ? `${testSubs[0].icon} ${testSubs[0].name}`
                : `${testSubs[0].icon} ${testSubs[0].name} 외 ${testSubs.length - 1}개`;
            return (
              <div key={test.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <div className="text-xs font-medium text-gray-800 truncate">{test.title}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                  {subLabel} · {test.questions.length}문항 ·{' '}
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
