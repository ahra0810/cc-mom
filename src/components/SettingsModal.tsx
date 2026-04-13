import { useState, useEffect } from 'react';
import { X, Save, Key, Plus, Trash2, RotateCcw, Tag } from 'lucide-react';
import type { AISettings } from '../types';
import { useQuestionStore } from '../stores/questionStore';

interface Props {
  onClose: () => void;
}

const PROVIDER_OPTIONS = [
  { value: 'google', label: 'Google (Gemini)', defaultModel: 'gemini-2.0-flash', hint: 'Google AI Studio에서 API 키를 발급받으세요 (무료)' },
  { value: 'anthropic', label: 'Anthropic (Claude)', defaultModel: 'claude-sonnet-4-20250514', hint: 'Anthropic Console에서 API 키를 발급받으세요' },
  { value: 'openai', label: 'OpenAI (GPT)', defaultModel: 'gpt-4o-mini', hint: 'OpenAI Platform에서 API 키를 발급받으세요' },
];

export default function SettingsModal({ onClose }: Props) {
  const { subjects, addSubject, removeSubject, resetToDefaults } = useQuestionStore();

  // AI Settings
  const [provider, setProvider] = useState<AISettings['provider']>('google');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');

  // Subject management
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📝');
  const [activeTab, setActiveTab] = useState<'ai' | 'subjects' | 'data'>('ai');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz-maker-ai-settings');
      if (raw) {
        const s = JSON.parse(raw) as AISettings;
        setProvider(s.provider);
        setApiKey(s.apiKey);
        setModel(s.model);
      }
    } catch {}
  }, []);

  const handleSaveAI = () => {
    const settings: AISettings = {
      provider,
      apiKey: apiKey.trim(),
      model: model.trim() || PROVIDER_OPTIONS.find((p) => p.value === provider)!.defaultModel,
    };
    localStorage.setItem('quiz-maker-ai-settings', JSON.stringify(settings));
    onClose();
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const id = newSubjectName.trim().toLowerCase().replace(/\s+/g, '-');
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];
    addSubject({
      id,
      name: newSubjectName.trim(),
      icon: newSubjectIcon,
      color: colors[subjects.length % colors.length],
    });
    setNewSubjectName('');
    setNewSubjectIcon('📝');
  };

  const currentProvider = PROVIDER_OPTIONS.find((p) => p.value === provider)!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">설정</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: 'ai', label: 'AI 설정', icon: <Key size={12} /> },
            { key: 'subjects', label: '과목 관리', icon: <Tag size={12} /> },
            { key: 'data', label: '데이터', icon: <RotateCcw size={12} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === key
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto max-h-[55vh]">
          {/* AI Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">AI 제공자</label>
                <select
                  className="select-field text-xs"
                  value={provider}
                  onChange={(e) => {
                    const p = e.target.value as AISettings['provider'];
                    setProvider(p);
                    setModel(PROVIDER_OPTIONS.find((o) => o.value === p)!.defaultModel);
                  }}
                >
                  {PROVIDER_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">{currentProvider.hint}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">API 키</label>
                <input
                  type="password"
                  className="input-field text-xs"
                  placeholder="API 키를 입력하세요"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-1">API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">모델</label>
                <input
                  className="input-field text-xs"
                  placeholder={currentProvider.defaultModel}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-full" onClick={handleSaveAI}>
                <Save size={14} /> 저장
              </button>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {subjects.map((s) => (
                  <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-xs">
                      {s.icon} {s.name}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`"${s.name}" 과목을 삭제하시겠습니까?`)) removeSubject(s.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">새 과목 추가</label>
                <div className="flex gap-2">
                  <input
                    className="input-field text-xs w-12 text-center"
                    placeholder="📝"
                    value={newSubjectIcon}
                    onChange={(e) => setNewSubjectIcon(e.target.value)}
                    maxLength={2}
                  />
                  <input
                    className="input-field text-xs flex-1"
                    placeholder="과목 이름"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                  />
                  <button className="btn btn-primary !px-3" onClick={handleAddSubject} disabled={!newSubjectName.trim()}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                아래 버튼을 클릭하면 모든 문항과 과목이 초기 상태로 복원됩니다.
                저장된 시험지는 유지됩니다.
              </div>
              <button
                className="btn btn-danger w-full"
                onClick={() => {
                  if (confirm('정말로 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
                    resetToDefaults();
                    onClose();
                  }
                }}
              >
                <RotateCcw size={14} /> 기본 데이터로 초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
