import { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Tag, Database, Upload, Download } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useQuestionStore } from '../stores/questionStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const { subjects, addSubject, removeSubject, resetToDefaults, exportData, importData, getSubjectQuestionCount } = useQuestionStore();
  const { toast } = useToast();
  const confirm = useConfirm();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📝');
  const [activeTab, setActiveTab] = useState<'subjects' | 'data'>('subjects');

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];
    const ok = addSubject({
      id: nanoid(8),
      name: newSubjectName.trim(),
      icon: newSubjectIcon,
      color: colors[subjects.length % colors.length],
    });
    if (!ok) {
      toast('error', '같은 이름의 과목이 이미 있습니다');
      return;
    }
    toast('success', `"${newSubjectName.trim()}" 과목을 추가했습니다`);
    setNewSubjectName('');
    setNewSubjectIcon('📝');
  };

  const handleRemoveSubject = async (id: string, name: string) => {
    const count = getSubjectQuestionCount(id);
    const ok = await confirm({
      title: `"${name}" 과목 삭제`,
      message: count > 0
        ? `이 과목에는 ${count}개의 문항이 있습니다.\n과목을 삭제해도 문항은 유지되지만, 표시되지 않게 됩니다. 계속하시겠습니까?`
        : `정말로 "${name}" 과목을 삭제하시겠습니까?`,
      variant: 'danger',
      confirmText: '삭제',
    });
    if (ok) {
      removeSubject(id);
      toast('success', `"${name}" 과목을 삭제했습니다`);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('success', '데이터를 내보냈습니다');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const result = importData(text);
        toast('success', `${result.questions}문항, ${result.subjects}과목을 불러왔습니다`);
      } catch (err) {
        toast('error', err instanceof Error ? err.message : '가져오기 실패');
      }
    };
    input.click();
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: '기본 데이터로 초기화',
      message: '모든 문항과 과목이 기본 상태로 복원됩니다.\n저장된 시험지는 유지됩니다.\n이 작업은 되돌릴 수 없습니다.',
      variant: 'danger',
      confirmText: '초기화',
    });
    if (ok) {
      resetToDefaults();
      toast('success', '기본 데이터로 초기화했습니다');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">설정</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'subjects', label: '과목 관리', icon: <Tag size={13} /> },
            { key: 'data', label: '데이터 관리', icon: <Database size={13} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                activeTab === key
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  현재 과목 ({subjects.length}개)
                </h3>
                <div className="space-y-1.5">
                  {subjects.map((s) => {
                    const count = getSubjectQuestionCount(s.id);
                    return (
                      <div key={s.id} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{s.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{s.name}</span>
                          <span className="text-xs text-gray-400">{count}문항</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSubject(s.id, s.name)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          aria-label={`${s.name} 삭제`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  새 과목 추가
                </h3>
                <div className="flex gap-2">
                  <input
                    className="input-field !text-sm w-12 text-center"
                    placeholder="📝"
                    value={newSubjectIcon}
                    onChange={(e) => setNewSubjectIcon(e.target.value)}
                    maxLength={2}
                    aria-label="아이콘"
                  />
                  <input
                    className="input-field !text-sm flex-1"
                    placeholder="과목 이름 (예: 한국사)"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                    aria-label="과목 이름"
                  />
                  <button
                    className="btn btn-primary btn-lg !px-3"
                    onClick={handleAddSubject}
                    disabled={!newSubjectName.trim()}
                  >
                    <Plus size={14} /> 추가
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  이모지를 지원합니다. 예: 🌍 📜 💬 📖 ✏️ 📚 🔢 🌱
                </p>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  내보내기 / 가져오기
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  현재 문항과 과목을 JSON 파일로 백업하거나, 다른 곳에서 만든 문항을 가져올 수 있습니다.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-secondary btn-lg" onClick={handleExport}>
                    <Download size={14} /> 내보내기
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={handleImport}>
                    <Upload size={14} /> 가져오기
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  초기화
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed mb-3">
                  모든 문항과 과목을 기본 상태로 되돌립니다. 저장된 시험지는 유지됩니다.
                </div>
                <button className="btn btn-danger btn-lg w-full" onClick={handleReset}>
                  <RotateCcw size={14} /> 기본 데이터로 초기화
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
