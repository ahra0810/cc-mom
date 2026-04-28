/**
 * SettingsModal — Phase 8 본격 구현.
 *
 *  - AI 프롬프트 가이드 (사자성어 set 마스터 프롬프트, 복사 버튼)
 *  - JSON Export (사자성어 set 전체 다운로드)
 *  - JSON Import (텍스트/파일 → setStore.importData → 결과 리포트)
 *  - 이전 버전 localStorage 정리
 *  - 시드 5개로 초기화
 */
import { useRef, useState } from 'react';
import {
  X,
  RotateCcw,
  Database,
  Trash2,
  Sparkles,
  Copy,
  Download,
  Upload,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';

interface Props {
  onClose: () => void;
}

const AI_MASTER_PROMPT = `당신은 한국 초등 ~ 중학생용 "사자성어 학습지" 출제 전문가입니다.
사자성어 N개를 입력으로 받으면, 각각에 대해 정확히 8문항으로 구성된 set을 JSON으로 만들어 주세요.

[Set 한 개의 구조]
- meta: { domain: "four-char-idiom", idiom: <한글 4자>, hanja: <한자 4자>, meaning: <뜻풀이>, origin?: <출전> }
- difficulty: "easy" | "medium" | "hard" | "advanced" | "expert"
- title: "<idiom> 학습지"
- slots (정확히 8개, 순서·유형 고정):
  1) type: "hanja-writing"
     - question: "다음 사자성어의 한자를 보고 한글음을 쓴 후, 옆 칸에 한자를 따라 쓰세요.\\n\\n뜻: <뜻풀이>"
     - hanjaTrace: <한자 4자>
     - answer: <idiom 한글 4자>
     - explanation: 한 줄 설명
  2~7) type: "multiple-choice"
     - question, options(정확히 4개), answer(options 중 하나), explanation
     - 오답은 같은 학년 수준의 다른 사자성어/유사 표현으로
     - 6문항 모두 서로 다른 유형(뜻 묻기·한자 풀이·예문 고르기·반의/유의 등)으로 구성
  8) type: "sentence-making"
     - question: "'<idiom>'을(를) 사용해 한 문장을 만드세요."
     - answer: 모범답안 한 문장
     - explanation: 한 줄 설명

[규칙]
- 모든 한글은 4자 (예: "동문서답"), 한자도 4자 (예: "東問西答")
- 1번 answer는 idiom 한글 4자와 동일해야 함
- 객관식 4개 보기는 모두 비어있으면 안 됨
- 학년 수준에 맞는 어휘 사용 (초3~중1)
- 모든 문항에 explanation 한 줄 포함

[출력]
JSON only. 다음 형식 그대로:
{
  "version": 1,
  "sets": [
    {
      "title": "동문서답 학습지",
      "domain": "four-char-idiom",
      "difficulty": "medium",
      "meta": { "domain": "four-char-idiom", "idiom": "동문서답", "hanja": "東問西答", "meaning": "...", "origin": "..." },
      "slots": [
        { "type": "hanja-writing", "question": "...", "hanjaTrace": "東問西答", "answer": "동문서답", "explanation": "..." },
        { "type": "multiple-choice", "question": "...", "options": ["A","B","C","D"], "answer": "A", "explanation": "..." },
        ... (총 8개: hanja-writing 1 + multiple-choice 6 + sentence-making 1)
      ],
      "tags": ["대화","엉뚱"]
    }
  ]
}`;

export default function SettingsModal({ onClose }: Props) {
  const resetToSeed = useSetStore((s) => s.resetToSeed);
  const exportData = useSetStore((s) => s.exportData);
  const importData = useSetStore((s) => s.importData);

  const { toast } = useToast();
  const confirm = useConfirm();

  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<{
    ok: number;
    failed: { index: number; errors: string[] }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* AI 프롬프트 복사 */
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_MASTER_PROMPT);
      setCopied(true);
      toast('success', 'AI 프롬프트가 복사되었어요');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('error', '복사 실패 — 직접 선택해서 복사해 주세요');
    }
  };

  /* JSON Export 다운로드 */
  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `idiom-sets-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('success', 'JSON 파일을 다운로드했어요');
    } catch (e) {
      console.error(e);
      toast('error', '내보내기 실패');
    }
  };

  /* JSON Import — 텍스트박스 */
  const handleImportFromText = () => {
    if (!importText.trim()) {
      toast('error', '가져올 JSON을 붙여넣어 주세요');
      return;
    }
    runImport(importText);
  };

  /* JSON Import — 파일 */
  const handleFilePick = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      setImportText(text);
      runImport(text);
    } catch {
      toast('error', '파일 읽기 실패');
    }
  };

  const runImport = (text: string) => {
    setImportBusy(true);
    setImportResult(null);
    try {
      const result = importData(text);
      setImportResult({ ok: result.ok, failed: result.failed });
      if (result.ok > 0 && result.failed.length === 0) {
        toast('success', `${result.ok}개 set을 가져왔어요`);
      } else if (result.ok > 0) {
        toast('info', `${result.ok}개 가져옴 / ${result.failed.length}개 실패`);
      } else {
        toast('error', `모두 실패했어요 (${result.failed.length}건)`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'JSON 파싱 실패';
      toast('error', msg);
      setImportResult({ ok: 0, failed: [{ index: -1, errors: [msg] }] });
    } finally {
      setImportBusy(false);
    }
  };

  /* 이전 데이터 정리 */
  const handleClearLegacy = async () => {
    const ok = await confirm({
      title: '이전 데이터 정리',
      message:
        '이전 버전(quiz-maker)의 localStorage 데이터를 삭제합니다.\n사자성어 set 데이터는 영향받지 않습니다.\n계속하시겠습니까?',
      variant: 'warning',
      confirmText: '삭제',
    });
    if (ok) {
      try {
        localStorage.removeItem('quiz-maker-questions');
        localStorage.removeItem('quiz-maker-tests');
        localStorage.removeItem('quiz-maker-ai-settings');
        toast('success', '이전 데이터를 삭제했습니다');
      } catch {
        toast('error', '삭제 실패');
      }
    }
  };

  /* 시드 초기화 */
  const handleReset = async () => {
    const ok = await confirm({
      title: '시드 데이터로 초기화',
      message:
        '모든 사자성어 set이 기본 시드 5개로 복원됩니다.\n현재 작성한 set은 모두 사라집니다.\n계속하시겠습니까?',
      variant: 'danger',
      confirmText: '초기화',
    });
    if (ok) {
      resetToSeed();
      toast('success', '시드 데이터로 초기화했습니다');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fadeIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800">설정</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* AI 프롬프트 가이드 */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> AI 프롬프트 가이드
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              ChatGPT·Claude에 붙여넣어 사자성어 set JSON을 받아오세요. 결과 JSON은 아래 "가져오기"에 붙여넣으면 자동 검증 후 추가됩니다.
            </p>
            <pre className="text-[10.5px] leading-relaxed bg-gray-50 border border-gray-200 rounded p-3 max-h-44 overflow-y-auto whitespace-pre-wrap text-gray-700">
              {AI_MASTER_PROMPT}
            </pre>
            <button
              className={`btn !text-xs mt-2 ${copied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleCopyPrompt}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? '복사됨' : '프롬프트 복사'}
            </button>
          </section>

          {/* 데이터 가져오기 */}
          <section className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload size={12} /> JSON 가져오기
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              AI가 만든 JSON 또는 내보내기 파일을 붙여넣거나 파일로 선택하세요. 검증을 통과한 set만 추가됩니다.
            </p>
            <textarea
              className="input-field !text-[11px] !min-h-[100px] !font-mono resize-y mb-2"
              placeholder='{ "version": 1, "sets": [ ... ] }'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              <button
                className="btn btn-primary !text-xs"
                onClick={handleImportFromText}
                disabled={importBusy}
              >
                <Upload size={12} /> 텍스트로 가져오기
              </button>
              <button
                className="btn btn-secondary !text-xs"
                onClick={handleFilePick}
                disabled={importBusy}
              >
                <Upload size={12} /> 파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {importResult && (
              <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-2.5 text-[11px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <Check size={11} /> 성공: {importResult.ok}
                  </span>
                  <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                    <AlertTriangle size={11} /> 실패: {importResult.failed.length}
                  </span>
                </div>
                {importResult.failed.length > 0 && (
                  <ul className="text-[10.5px] text-red-700 list-disc pl-4 space-y-0.5 max-h-28 overflow-y-auto">
                    {importResult.failed.map((f, i) => (
                      <li key={i}>
                        #{f.index + 1}: {f.errors.slice(0, 2).join(' / ')}
                        {f.errors.length > 2 ? ` … 외 ${f.errors.length - 2}건` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          {/* 데이터 내보내기 */}
          <section className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Download size={12} /> JSON 내보내기
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              현재 가지고 있는 모든 사자성어 set을 JSON 파일로 다운로드합니다.
            </p>
            <button className="btn btn-secondary !text-xs" onClick={handleExport}>
              <Download size={12} /> 전체 set 내보내기
            </button>
          </section>

          {/* 데이터 정리 */}
          <section className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database size={12} /> 데이터 관리
            </h3>
            <button
              className="btn btn-secondary w-full !text-xs mb-2"
              onClick={handleClearLegacy}
            >
              <Trash2 size={12} /> 이전 버전 데이터 정리 (quiz-maker-*)
            </button>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800 leading-relaxed mb-2">
              아래 "초기화"는 현재 사자성어 set을 모두 삭제하고 시드 5개로 복원합니다. 신중히 사용하세요.
            </div>
            <button className="btn btn-danger w-full !text-xs" onClick={handleReset}>
              <RotateCcw size={12} /> 시드 5개로 초기화
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
