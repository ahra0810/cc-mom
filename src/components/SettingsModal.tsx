import { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Tag, Database, Upload, Download, FileText, ChevronDown, ChevronRight, Copy } from 'lucide-react';
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

  const handleDownloadTemplate = () => {
    const template = {
      questions: [
        {
          type: "multiple-choice",
          subjectId: "world-history",
          difficulty: "easy",
          question: "이집트에서 가장 유명한 건축물로, 왕의 무덤으로 만들어진 것은?",
          options: ["피라미드", "콜로세움", "만리장성", "타지마할"],
          answer: "피라미드",
          explanation: "피라미드는 고대 이집트의 파라오를 위한 무덤입니다.",
          tags: ["이집트", "고대문명"]
        },
        {
          type: "true-false",
          subjectId: "world-history",
          difficulty: "easy",
          question: "콜럼버스는 아메리카 대륙을 발견한 탐험가이다.",
          answer: "O",
          explanation: "1492년 아메리카 대륙에 도착했습니다.",
          tags: ["탐험"]
        },
        {
          type: "fill-blank",
          subjectId: "four-char-idiom",
          difficulty: "medium",
          question: "자기가 한 일을 자기 스스로 칭찬하는 것을 (    )(이)라 한다.",
          answer: "자화자찬",
          explanation: "자화자찬(自畫自讚): 자기가 그린 그림을 자기가 칭찬한다는 뜻입니다.",
          tags: ["자기", "칭찬"]
        },
        {
          type: "short-answer",
          subjectId: "vocabulary",
          difficulty: "medium",
          question: "\"매우 기쁘고 신나는 것\"을 나타내는 두 글자 단어는?",
          answer: "즐겁다",
          tags: ["감정"]
        }
      ],
      subjects: [
        {
          id: "history",
          name: "한국사",
          icon: "🏛️",
          color: "#F59E0B"
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('success', '예시 파일을 다운로드했습니다');
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
              {/* Export / Import */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  내보내기 / 가져오기
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  문항과 과목을 JSON 파일로 백업하거나 가져올 수 있습니다.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button className="btn btn-secondary btn-lg" onClick={handleExport}>
                    <Download size={14} /> 내보내기
                  </button>
                  <button className="btn btn-primary btn-lg" onClick={handleImport}>
                    <Upload size={14} /> 가져오기
                  </button>
                </div>
                <button
                  className="btn btn-ghost w-full !text-xs !text-primary-600"
                  onClick={handleDownloadTemplate}
                >
                  <FileText size={13} /> 예시 파일 다운로드 (quiz-template.json)
                </button>
              </div>

              {/* Format Guide */}
              <FormatGuide />

              {/* Reset */}
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

/* ═══════════════════════════════════════════════════
   JSON 양식 가이드 (접고 펼 수 있는 섹션)
   ═══════════════════════════════════════════════════ */

const SAMPLE_JSON = `{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "world-history",
      "difficulty": "easy",
      "question": "이집트에서 가장 유명한 건축물은?",
      "options": ["피라미드", "콜로세움", "만리장성", "타지마할"],
      "answer": "피라미드",
      "explanation": "피라미드는 파라오의 무덤입니다.",
      "tags": ["이집트", "고대문명"]
    }
  ],
  "subjects": [
    {
      "id": "history",
      "name": "한국사",
      "icon": "🏛️",
      "color": "#F59E0B"
    }
  ]
}`;

function FormatGuide() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_JSON);
    toast('success', '예시를 복사했습니다');
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        className="w-full flex items-center justify-between gap-2 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-1.5">
          <FileText size={13} className="text-primary-600" />
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            JSON 양식 가이드
          </h3>
        </div>
        {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
      </button>

      {open && (
        <div className="mt-3 space-y-3 animate-fadeIn">
          {/* Overview */}
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-gray-800">"가져오기"</strong>로 업로드할 JSON 파일은 아래 형식을 따라야 합니다.
            누락된 필드는 자동으로 채워지므로, <strong>question</strong>과 <strong>answer</strong>만 있으면 동작합니다.
          </p>

          {/* Sample with copy */}
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 text-[10px] leading-relaxed p-3 rounded-lg overflow-x-auto font-mono">
{SAMPLE_JSON}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
              title="복사"
            >
              <Copy size={11} />
            </button>
          </div>

          {/* Field reference */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-gray-700">필드 설명</h4>

            <FieldRow name="type" required>
              문제 유형. 다음 중 하나:
              <code className="block mt-1 bg-gray-100 px-2 py-1 rounded text-[10px]">
                "multiple-choice" · "true-false" · "fill-blank" · "short-answer"
              </code>
            </FieldRow>

            <FieldRow name="question" required>
              문제 내용 (문자열). 빈칸 채우기는 <code className="bg-gray-100 px-1 rounded">( )</code>로 빈칸 표시.
            </FieldRow>

            <FieldRow name="answer" required>
              정답 (문자열).
              <ul className="mt-1 ml-3 list-disc space-y-0.5 text-[10px] text-gray-500">
                <li>객관식: options 중 정답과 동일한 문자열</li>
                <li>OX 퀴즈: <code className="bg-gray-100 px-1 rounded">"O"</code> 또는 <code className="bg-gray-100 px-1 rounded">"X"</code></li>
                <li>빈칸/단답형: 정답 문자열</li>
              </ul>
            </FieldRow>

            <FieldRow name="options">
              객관식의 4개 선택지 (문자열 배열). 객관식이 아니면 생략.
            </FieldRow>

            <FieldRow name="subjectId">
              과목 ID. 기본 과목 ID:
              <div className="mt-1 flex flex-wrap gap-1">
                {[
                  ['world-history', '🌍 세계사'],
                  ['four-char-idiom', '📜 사자성어'],
                  ['idiom', '💬 관용구'],
                  ['proverb', '📖 속담'],
                  ['spelling', '✏️ 맞춤법'],
                  ['vocabulary', '📚 어휘'],
                ].map(([id, label]) => (
                  <code key={id} className="bg-gray-100 px-1.5 py-0.5 rounded text-[9px] text-gray-600">
                    {id} ({label})
                  </code>
                ))}
              </div>
            </FieldRow>

            <FieldRow name="difficulty">
              <code className="bg-gray-100 px-1 rounded">"easy"</code> (쉬움 / 초3) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"medium"</code> (보통 / 초4) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"hard"</code> (어려움 / 초5~6)
            </FieldRow>

            <FieldRow name="explanation">
              해설 텍스트. 답안지 PDF에 표시됨.
            </FieldRow>

            <FieldRow name="tags">
              테마 키워드 배열 (예: <code className="bg-gray-100 px-1 rounded">["이집트", "고대문명"]</code>).
              <br />
              문항 DB의 "테마별" 그룹 분류에 사용됩니다.
            </FieldRow>

            <FieldRow name="subjects">
              새 과목을 함께 추가할 때만 작성. 각 과목은
              {' '}<code className="bg-gray-100 px-1 rounded">id</code>,
              {' '}<code className="bg-gray-100 px-1 rounded">name</code>,
              {' '}<code className="bg-gray-100 px-1 rounded">icon</code>(이모지),
              {' '}<code className="bg-gray-100 px-1 rounded">color</code>(HEX) 필요.
            </FieldRow>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800 leading-relaxed">
            <strong className="block mb-1">💡 팁</strong>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>중복 ID는 자동으로 무시됩니다 (덮어쓰기 안 됨)</li>
              <li>id, createdAt이 없으면 자동 생성됩니다</li>
              <li>존재하지 않는 subjectId를 쓰면 문항은 추가되지만 과목 필터에 안 나타납니다</li>
              <li>먼저 "내보내기"로 현재 데이터 구조를 확인하면 도움이 됩니다</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldRow({ name, required, children }: { name: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="text-[11px] text-gray-600 leading-relaxed">
      <div className="flex items-center gap-1.5 mb-0.5">
        <code className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-bold text-[10px]">{name}</code>
        {required && <span className="text-[9px] text-red-500 font-bold">필수</span>}
      </div>
      <div className="pl-1">{children}</div>
    </div>
  );
}
