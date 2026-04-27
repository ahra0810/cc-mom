import { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Tag, Database, Upload, Download, FileText, ChevronDown, ChevronRight, Copy, Sparkles } from 'lucide-react';
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
        },
        {
          type: "sentence-making",
          subjectId: "four-char-idiom",
          difficulty: "medium",
          question: "다음 사자성어를 사용해서 문장을 만들어 보세요: 자화자찬",
          answer: "오늘 발표를 잘했다고 친구가 자화자찬했다.",
          explanation: "자화자찬은 자기가 한 일을 스스로 칭찬한다는 뜻입니다.",
          tags: ["자기", "칭찬"]
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

              {/* AI Prompt Guide - 처음 사용자를 위한 핵심 가이드 */}
              <PromptGuide />

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
    },
    {
      "type": "sentence-making",
      "subjectId": "four-char-idiom",
      "difficulty": "medium",
      "question": "다음 사자성어를 사용해서 문장을 만들어 보세요: 자화자찬",
      "answer": "친구가 자기 그림을 자화자찬했다.",
      "tags": ["자기", "칭찬"]
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
              <code className="block mt-1 bg-gray-100 px-2 py-1 rounded text-[10px] leading-relaxed">
                "multiple-choice" · "true-false" · "fill-blank"<br />
                "short-answer" · "sentence-making"
              </code>
            </FieldRow>

            <FieldRow name="question" required>
              문제 내용 (문자열). 빈칸 채우기는 <code className="bg-gray-100 px-1 rounded">( )</code>로 빈칸 표시.
            </FieldRow>

            <FieldRow name="answer" required>
              정답 (문자열). <span className="text-gray-400">서술형은 선택</span>
              <ul className="mt-1 ml-3 list-disc space-y-0.5 text-[10px] text-gray-500">
                <li>객관식: options 중 정답과 동일한 문자열</li>
                <li>OX 퀴즈: <code className="bg-gray-100 px-1 rounded">"O"</code> 또는 <code className="bg-gray-100 px-1 rounded">"X"</code></li>
                <li>빈칸/단답형: 정답 문자열</li>
                <li>서술형: 예시 답안 문자열 (생략 가능)</li>
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
              <code className="bg-gray-100 px-1 rounded">"easy"</code> (초 3-4) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"medium"</code> (초 5-6) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"hard"</code> (중1) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"advanced"</code> (중2) ·
              {' '}<code className="bg-gray-100 px-1 rounded">"expert"</code> (중3)
            </FieldRow>

            <FieldRow name="passage">
              지문/제시문. 문학 작품 발췌나 비문학 글을 표시할 때 사용. 문제 위에 박스로 표시됨.
            </FieldRow>

            <FieldRow name="workTitle">
              작품명 (예: <code className="bg-gray-100 px-1 rounded">"소나기"</code>). 문학 문제에서 사용.
            </FieldRow>

            <FieldRow name="workAuthor">
              작가명 (예: <code className="bg-gray-100 px-1 rounded">"황순원"</code>).
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

/* ═══════════════════════════════════════════════════
   AI 프롬프트 가이드
   ChatGPT, Claude, Gemini 등에 붙여넣어 JSON으로 결과를
   받기 위한 미리 작성된 프롬프트 모음
   ═══════════════════════════════════════════════════ */

const MASTER_PROMPT = `당신은 초등학교 3~6학년 학생을 위한 학습 문제를 만드는 한국 교육 전문가입니다.

[과목명] 분야에서 [유형] 문제를 [개수]개 만들어 주세요.
난이도: [easy / medium / hard]
주제(선택): [예: 고대 이집트 / 친구에 관한 사자성어]

반드시 아래 JSON 형식으로만 응답해주세요.
인사말, 설명, \`\`\`json\`\`\` 같은 코드블록 표시도 모두 빼고
순수 JSON만 출력하세요.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "world-history",
      "difficulty": "easy",
      "question": "문제 내용",
      "options": ["선택지1","선택지2","선택지3","선택지4"],
      "answer": "정답",
      "explanation": "초등학생이 이해할 수 있는 쉬운 해설",
      "tags": ["키워드1","키워드2"]
    }
  ]
}

[과목 ID 표]
- 세계사 → world-history
- 사자성어 → four-char-idiom
- 관용구 → idiom
- 속담 → proverb
- 맞춤법 → spelling
- 어휘 → vocabulary

[유형 ID 표]
- 객관식 → multiple-choice  (options 4개 필수, answer는 options 중 하나와 동일)
- OX 퀴즈 → true-false       (options 생략, answer는 "O" 또는 "X")
- 빈칸 채우기 → fill-blank   (문제에 (   ) 표시, answer는 빈칸 단어)
- 단답형 → short-answer      (options 생략, answer는 짧은 단어)
- 서술형 → sentence-making   (options 생략, "다음 ___을 사용해서 문장을 만들어 보세요: 키워드" 형식, answer는 예시 문장)

[필수 사항]
1. 모든 문제에 explanation 작성
2. tags는 2~3개의 핵심 키워드
3. 초등학생이 이해할 수 있는 쉬운 단어와 문장
4. 너무 어려운 한자어 사용 금지`;

const SUBJECT_PROMPTS: { id: string; icon: string; name: string; description: string; prompt: string }[] = [
  {
    id: 'world-history',
    icon: '🌍',
    name: '세계사',
    description: '시대·지역별 객관식 위주',
    prompt: `초등 3~6학년용 세계사 객관식 4지선다 문제 10개를 만들어 주세요.
난이도는 easy(고대문명 기초) 5개 + medium(중세·근대) 5개로 섞어 주세요.
다양한 시대(고대 이집트, 그리스, 로마, 중국, 인도, 중세 유럽, 대항해시대, 산업혁명 등)를 골고루 다뤄주세요.

JSON 외 텍스트는 절대 포함하지 마세요.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "world-history",
      "difficulty": "easy",
      "question": "...",
      "options": ["...","...","...","..."],
      "answer": "...",
      "explanation": "...",
      "tags": ["...","..."]
    }
  ]
}

규칙:
- options는 정확히 4개
- answer는 options 중 하나와 동일한 문자열
- tags는 시대/지역/주제 중심 (예: ["이집트","고대문명"])`
  },
  {
    id: 'four-char-idiom',
    icon: '📜',
    name: '사자성어',
    description: '객관식 + 빈칸 + 서술형 혼합',
    prompt: `초등 3~6학년용 사자성어 문제 10개를 만들어 주세요.
유형은 다음과 같이 섞어 주세요:
- 객관식 4개 (뜻 맞추기)
- 빈칸 채우기 3개 (사자성어 자체를 빈칸에)
- 서술형 3개 ("다음 사자성어를 사용해서 문장을 만들어 보세요: ___")

난이도: easy 4개, medium 4개, hard 2개

JSON 외 텍스트는 절대 포함하지 마세요.

{
  "questions": [
    { "type": "multiple-choice", "subjectId": "four-char-idiom", "difficulty": "easy",
      "question": "...", "options": ["...","...","...","..."],
      "answer": "...", "explanation": "...",
      "tags": ["사자성어","..."] },

    { "type": "fill-blank", "subjectId": "four-char-idiom", "difficulty": "medium",
      "question": "어릴 때부터 친한 친구를 (    )(이)라고 한다.",
      "answer": "죽마고우",
      "explanation": "...", "tags": ["친구"] },

    { "type": "sentence-making", "subjectId": "four-char-idiom", "difficulty": "medium",
      "question": "다음 사자성어를 사용해서 문장을 만들어 보세요: 일석이조",
      "answer": "운동을 하면 건강도 좋아지고 살도 빠지니 일석이조다.",
      "explanation": "...", "tags": ["문장만들기","효율"] }
  ]
}

규칙:
- 사자성어 한자 표기는 하지 말고 한글만 사용
- explanation에 한자 뜻풀이를 간단히 적어도 OK
- 너무 어려운 사자성어(고전·전문용어) 제외`
  },
  {
    id: 'idiom',
    icon: '💬',
    name: '관용구',
    description: '뜻 고르기 + 문장 만들기',
    prompt: `초등 3~6학년용 관용구 문제 10개를 만들어 주세요.
유형은:
- 객관식 5개 (관용구의 뜻 고르기)
- 서술형 5개 ("다음 관용구를 사용해서 문장을 만들어 보세요: ___")

신체(눈, 귀, 입, 손, 발, 간 등) 관용구 위주로 작성하되, 다양한 주제도 포함해 주세요.

JSON만 출력하세요.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "idiom",
      "difficulty": "easy",
      "question": "\\"발이 넓다\\"는 무슨 뜻일까요?",
      "options": ["아는 사람이 많다","발이 크다","걸음이 빠르다","여행을 많이 다닌다"],
      "answer": "아는 사람이 많다",
      "explanation": "...",
      "tags": ["신체","관계"]
    },
    {
      "type": "sentence-making",
      "subjectId": "idiom",
      "difficulty": "medium",
      "question": "다음 관용구를 사용해서 문장을 만들어 보세요: 손이 크다",
      "answer": "엄마는 손이 커서 음식을 항상 푸짐하게 차리신다.",
      "explanation": "...",
      "tags": ["신체","성격","문장만들기"]
    }
  ]
}

규칙:
- 비속어·부정적 관용구 제외
- 초등학생이 일상에서 쓸 만한 관용구 중심`
  },
  {
    id: 'proverb',
    icon: '📖',
    name: '속담',
    description: '빈칸 + 객관식 + 서술형',
    prompt: `초등 3~6학년용 속담 문제 10개를 만들어 주세요.
유형은:
- 빈칸 채우기 5개 (속담의 일부를 빈칸으로)
- 객관식 3개 (속담 뜻 고르기)
- 서술형 2개 ("다음 속담을 사용해서 문장을 만들어 보세요: ___")

JSON만 출력해 주세요.

{
  "questions": [
    {
      "type": "fill-blank",
      "subjectId": "proverb",
      "difficulty": "easy",
      "question": "가는 말이 고와야 (     )이 곱다.",
      "answer": "오는 말",
      "explanation": "남에게 좋게 말해야 남도 좋게 말한다는 뜻.",
      "tags": ["말","예절"]
    }
  ]
}

규칙:
- 익숙한 한국 전통 속담 위주
- 빈칸은 가장 핵심 단어로
- 너무 길거나 어려운 속담 제외`
  },
  {
    id: 'spelling',
    icon: '✏️',
    name: '맞춤법',
    description: '객관식 + OX 위주',
    prompt: `초등 3~6학년이 자주 헷갈리는 한글 맞춤법 문제 10개를 만들어 주세요.
유형은:
- 객관식 6개 (4개 보기 중 올바른 표기 고르기)
- OX 4개 (진위 판단)

다루면 좋은 주제: 됐어/됬어, 왠지/웬지, 어이없다/어의없다, 갈게/갈께, 이따가/있다가, 금세/금새, 일찍이/일찌기 등

JSON만 출력해 주세요.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "spelling",
      "difficulty": "easy",
      "question": "맞춤법이 올바른 것은?",
      "options": ["됐어","됬어","댔어","되써"],
      "answer": "됐어",
      "explanation": "\\"되었어\\"의 줄임말은 \\"됐어\\"입니다.",
      "tags": ["줄임말"]
    },
    {
      "type": "true-false",
      "subjectId": "spelling",
      "difficulty": "easy",
      "question": "\\"금새\\"가 아니라 \\"금세\\"가 맞는 표현이다.",
      "answer": "O",
      "explanation": "\\"금시에\\"의 줄임말은 \\"금세\\"입니다.",
      "tags": ["혼동","부사"]
    }
  ]
}`
  },
  {
    id: 'middle-literature',
    icon: '📕',
    name: '중학 국어 (문학)',
    description: '작품 발췌 + 갈래·시점·상징·주제 분석',
    prompt: `당신은 대한민국 중학교 국어 교과(2022 개정 교육과정)에 정통한 교사입니다.

다음 작품에 대한 중학생용 문학 문제 8개를 만들어 주세요.
- 작품: [작품명] (예: 소나기, 동백꽃, 수난이대, 운수 좋은 날, 먼 후일, 청포도 등)
- 작가: [작가명]
- 학년: 중학 [1/2/3]학년 수준
- 난이도: hard 4개 + advanced 3개 + expert 1개

다음 성취기준 영역을 골고루 다뤄 주세요:
1. 갈래 특성 (단편소설/시/수필 등)
2. 화자/서술자 시점
3. 인물의 성격·심리
4. 비유·상징·소재의 의미
5. 작품의 배경 (시대·공간)
6. 주제 의식
7. 서술상 특징·구성

유형은 다음을 적절히 섞어 주세요:
- 객관식 5개 (4지선다)
- 단답형 1개 (핵심 소재/시점 등)
- OX 1개 (서술상 특징 진위)
- 서술형 1개 (인물 심리·주제 의미를 1~2문장으로)

반드시 아래 JSON 형식으로만 출력하세요. JSON 외 텍스트 절대 금지.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "middle-literature",
      "difficulty": "hard",
      "workTitle": "소나기",
      "workAuthor": "황순원",
      "passage": "(선택) 작품의 핵심 장면 5~6줄 발췌. 지문이 필요한 문제에만 작성",
      "question": "이 작품의 갈래로 가장 알맞은 것은?",
      "options": ["...","...","...","..."],
      "answer": "...",
      "explanation": "정답에 대한 명확한 근거와 작품 분석",
      "tags": ["[작품명]", "갈래", "..."]
    }
  ]
}

[필수 사항]
- 모든 문항의 subjectId는 "middle-literature"
- workTitle, workAuthor는 모든 문항에 작성
- passage는 발췌 지문이 필요한 1~2문항에만 (선택)
- explanation은 작품 근거를 들어 명확하게
- tags 첫 번째 항목은 작품명 (예: "소나기")
- 한자보다 한글 표기 우선
- 중학생이 이해할 수 있는 어휘 사용`
  },
  {
    id: 'vocabulary',
    icon: '📚',
    name: '어휘',
    description: '유의어·반의어·뜻 혼합',
    prompt: `초등 3~6학년용 어휘력 문제 10개를 만들어 주세요.
다양한 유형으로 섞어 주세요:
- 유의어/반의어 객관식 4개
- 단어 뜻 객관식 3개
- 빈칸 채우기 2개
- 서술형 1개 ("다음 단어를 사용해서 문장을 만들어 보세요: ___")

다룰 단어 예: 호기심, 공감, 절약, 용기, 감사, 후회, 즐겁다, 꼼꼼하다 등

JSON만 출력해 주세요.

{
  "questions": [
    {
      "type": "multiple-choice",
      "subjectId": "vocabulary",
      "difficulty": "easy",
      "question": "\\"꼼꼼하다\\"와 반대되는 뜻을 가진 단어는?",
      "options": ["덤벙대다","조심하다","차분하다","깔끔하다"],
      "answer": "덤벙대다",
      "explanation": "...",
      "tags": ["반의어","성격"]
    }
  ]
}`
  },
];

function PromptGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        className="w-full flex items-center justify-between gap-2 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary-600" />
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            AI로 문항 만들기 (프롬프트 가이드)
          </h3>
        </div>
        {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
      </button>

      {open && (
        <div className="mt-3 space-y-4 animate-fadeIn">
          {/* Workflow */}
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-lg p-3">
            <h4 className="text-xs font-bold text-primary-800 mb-2">📌 사용 방법 (3단계)</h4>
            <ol className="space-y-2 text-[11px] text-gray-700 leading-relaxed">
              <Step n={1}>
                아래 <strong>프롬프트 [복사]</strong> 버튼을 눌러 원하는 과목의 프롬프트를 복사하세요.
              </Step>
              <Step n={2}>
                <a className="text-primary-600 underline" href="https://chat.openai.com" target="_blank" rel="noreferrer">ChatGPT</a>,
                {' '}<a className="text-primary-600 underline" href="https://claude.ai" target="_blank" rel="noreferrer">Claude</a>,
                {' '}<a className="text-primary-600 underline" href="https://gemini.google.com" target="_blank" rel="noreferrer">Gemini</a> 등에 붙여넣고 결과를 받으세요. (필요시 개수·주제 수정)
              </Step>
              <Step n={3}>
                받은 JSON을 <strong>.json 파일</strong>로 저장한 뒤, 위쪽
                {' '}<strong className="text-primary-700">"가져오기"</strong> 버튼으로 업로드하세요.
              </Step>
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 leading-relaxed">
            <strong className="block mb-1">💡 팁</strong>
            <ul className="list-disc ml-4 space-y-0.5">
              <li>한 번에 5~15개 정도가 가장 안정적입니다</li>
              <li>"JSON 외 절대 출력 금지" 문구를 꼭 유지하세요</li>
              <li>같은 종류 더 받으려면: <em>"위와 같은 형식으로 10개 더, 겹치지 않게"</em> 추가</li>
              <li>특정 주제에 집중하려면 <em>"주제: 한국 위인"</em>처럼 지정하세요</li>
            </ul>
          </div>

          {/* Master prompt */}
          <PromptCard
            label="🎯 마스터 프롬프트 (모든 과목·유형 공통)"
            description="[ ]에 원하는 값만 채우면 어떤 과목/유형에도 사용 가능"
            prompt={MASTER_PROMPT}
            highlighted
          />

          {/* Subject-specific prompts */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 mb-2">과목별 즉시 사용 프롬프트</h4>
            <div className="space-y-2">
              {SUBJECT_PROMPTS.map((p) => (
                <PromptCard
                  key={p.id}
                  label={`${p.icon} ${p.name}`}
                  description={p.description}
                  prompt={p.prompt}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center mt-0.5">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function PromptCard({ label, description, prompt, highlighted = false }: {
  label: string; description?: string; prompt: string; highlighted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast('success', '프롬프트를 복사했습니다');
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${
      highlighted ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          className="flex items-center gap-1.5 flex-1 text-left min-w-0"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={11} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={11} className="text-gray-400 flex-shrink-0" />}
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-800 truncate">{label}</div>
            {description && <div className="text-[10px] text-gray-500 truncate">{description}</div>}
          </div>
        </button>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors"
          title="프롬프트 복사"
        >
          <Copy size={10} /> 복사
        </button>
      </div>
      {open && (
        <div className="border-t border-gray-200 bg-gray-900">
          <pre className="text-gray-100 text-[10px] leading-relaxed p-3 overflow-x-auto font-mono whitespace-pre-wrap break-keep max-h-72">
{prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
