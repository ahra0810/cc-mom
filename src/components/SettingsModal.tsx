/**
 * SettingsModal — 도메인별 AI 프롬프트 + 데이터 관리.
 *
 *  - AI 프롬프트 가이드 (도메인별 + 두 버전: 키워드 직접 지정 / AI 선정)
 *  - JSON Export (모든 도메인 set 전체 다운로드)
 *  - JSON Import
 *  - 이전 localStorage 정리 + 시드 초기화
 */
import { useRef, useState } from 'react';
import { listDomains } from '../domains/registry';
import type { DomainConfig } from '../domains/types';
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

/* 프롬프트는 src/domains/<id>/prompts.ts에서 도메인별로 정의되어 있고
 * registry.listDomains()로 가져와 도메인 탭 UI에 표시. */


export default function SettingsModal({ onClose }: Props) {
  const resetToSeed = useSetStore((s) => s.resetToSeed);
  const exportData = useSetStore((s) => s.exportData);
  const importData = useSetStore((s) => s.importData);

  const { toast } = useToast();
  const confirm = useConfirm();

  /* 등록된 도메인 목록 — 도메인 탭에 사용 */
  const domains: DomainConfig[] = listDomains();
  const [activeDomainId, setActiveDomainId] = useState<string>(domains[0].id);
  const activeDomain =
    domains.find((d) => d.id === activeDomainId) ?? domains[0];

  const [copiedKey, setCopiedKey] = useState<'a' | 'b' | null>(null);
  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<{
    ok: number;
    failed: { index: number; errors: string[] }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* AI 프롬프트 복사 — 활성 도메인의 두 버전 */
  const handleCopyPrompt = async (key: 'a' | 'b') => {
    const text =
      key === 'a' ? activeDomain.aiPrompts.userKeyword : activeDomain.aiPrompts.aiSelect;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast('success', 'AI 프롬프트가 복사되었어요');
      setTimeout(() => setCopiedKey(null), 2000);
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
          {/* AI 프롬프트 가이드 — 2버전 */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> AI 프롬프트 가이드 (2종)
            </h3>
            <div className="text-xs text-gray-600 leading-relaxed mb-3 space-y-1.5">
              <p>
                아래 프롬프트를 복사해 <b className="text-gray-800">ChatGPT · Claude · Gemini</b> 어디든 붙여넣어 set JSON을 받으세요. 세 모델 모두 동일한 JSON 형식으로 작동합니다.
              </p>
              <p className="text-gray-500">
                결과 JSON은 아래 "JSON 가져오기"에 붙여넣으면 자동 검증·추가됩니다. 두 프롬프트 모두 "정답 누설 방지" 규칙과 "그럴싸한 distractor" 가이드라인을 강제합니다.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-400">권장 모델:</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-semibold">
                  ChatGPT (GPT-4o / o1)
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[10px] text-purple-700 font-semibold">
                  Claude (Sonnet / Opus)
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-semibold">
                  Gemini (1.5 Pro / 2.0)
                </span>
              </div>
            </div>

            {/* 도메인 탭 — 등록된 도메인이 2개 이상일 때만 표시 */}
            {domains.length > 1 && (
              <div className="flex items-center gap-1 mb-3 border-b border-gray-200">
                {domains.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveDomainId(d.id)}
                    className={`px-3 py-1.5 text-[11px] font-semibold transition-colors -mb-px border-b-2 ${
                      d.id === activeDomainId
                        ? 'text-purple-700 border-purple-600'
                        : 'text-gray-500 border-transparent hover:text-gray-800'
                    }`}
                  >
                    {d.labels.subjectName}
                  </button>
                ))}
              </div>
            )}

            {/* 버전 A: 사용자가 키워드 직접 지정 */}
            <div className="rounded border border-purple-200 bg-purple-50/40 p-3 mb-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-[12px] font-bold text-purple-800">
                  A. {activeDomain.labels.subjectName}를 내가 지정 → 문항만 AI가 작성
                </h4>
                <button
                  className={`btn !text-xs !py-1 !px-2 ${copiedKey === 'a' ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleCopyPrompt('a')}
                >
                  {copiedKey === 'a' ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === 'a' ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="text-[10.5px] text-purple-900/70 leading-relaxed mb-2">
                {activeDomain.labels.subjectName} 키워드만 던지면 메타·8문항을 모두 AI가 채웁니다.
              </p>
              <pre className="text-[10.5px] leading-relaxed bg-white border border-purple-200 rounded p-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-gray-700">
                {activeDomain.aiPrompts.userKeyword}
              </pre>
            </div>

            {/* 버전 B: AI가 키워드 선정부터 */}
            <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-[12px] font-bold text-emerald-800">
                  B. {activeDomain.labels.subjectName} 선정부터 → 문항까지 AI가 모두
                </h4>
                <button
                  className={`btn !text-xs !py-1 !px-2 ${copiedKey === 'b' ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => handleCopyPrompt('b')}
                >
                  {copiedKey === 'b' ? <Check size={11} /> : <Copy size={11} />}
                  {copiedKey === 'b' ? '복사됨' : '복사'}
                </button>
              </div>
              <p className="text-[10.5px] text-emerald-900/70 leading-relaxed mb-2">
                예: "초5~6 수준으로 5개". 키워드 선정부터 문항까지 AI가 일괄 처리.
              </p>
              <pre className="text-[10.5px] leading-relaxed bg-white border border-emerald-200 rounded p-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-gray-700">
                {activeDomain.aiPrompts.aiSelect}
              </pre>
            </div>
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
