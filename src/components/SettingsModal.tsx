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

/* ─── 두 프롬프트가 공유하는 공통 본문 ─── */
const COMMON_RULES = `[Set 한 개의 구조 — 절대 변경 금지]
- meta: { domain: "four-char-idiom", idiom: <한글 4자>, hanja: <한자 4자>, meaning: <뜻풀이>, origin?: <출전> }
- difficulty: "easy" | "medium" | "hard" | "advanced" | "expert"
- title: "<idiom> 학습지"
- slots (정확히 8개, 순서·유형 고정):
  1) type: "hanja-writing"
     - question: "다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\\n\\n뜻: <뜻풀이>"
       (\\n\\n 뒤 부속은 PDF에서 옅은 회색 컨텍스트 박스로 분리됨 — 뜻/지문/대화 등을 여기에)
     - hanjaTrace: <한자 4자>
     - answer: <idiom 한글 4자>
     - explanation: 한 줄 설명
  2~7) type: "multiple-choice"
     - question, options(정확히 4개), answer(options 중 하나), explanation
  8) type: "sentence-making"
     - question: "'<idiom>'을(를) 사용해 한 문장을 만드세요."
     - answer: 모범답안 한 문장
     - explanation: 한 줄 설명

[형식 규칙]
- 모든 한글 idiom은 4자, 한자도 4자
- 1번 answer는 idiom 한글 4자와 동일
- 객관식 4개 보기는 모두 비어있지 않게
- 초3 ~ 중1 수준의 어휘
- 모든 문항에 explanation 한 줄

[★ 절대 금지 — "정답 누설(leakage)" 안티패턴 ★]
다음과 같은 문항은 절대 만들지 않습니다. 출제 후 모든 객관식을 한 번 더 검토해 누설이 없는지 확인하세요.

(1) **선지 안 부연 설명에 정답을 적어 주는 경우**
   ✗ "東問西答 (동·문·서·답)" — 괄호에 idiom 한글음을 적어 정답을 알려줌
   ✗ "대나무로 만든 말 (어릴 적 장난감)" — 정답에만 친절한 부연 → 외관으로 정답 식별
   ✓ "東問西答" 같은 4개의 한자 표기만, 또는 "대나무로 만든 말" 같이 부연 없이

(2) **idiom 뜻을 알면 한자를 몰라도 풀리는 "한자 풀이" 문항**
   ✗ "다음 중 자화자찬의 한자 풀이로 알맞은 것은?"
       options: "스스로(自)·그림(畫)·스스로(自)·칭찬(讚)" / "아들(子)·화목(和)·아들(子)·밥(餐)" / ...
       → 학생이 "자화자찬 = 스스로 그림을 칭찬"이라는 뜻만 알아도 정답을 고를 수 있어 한자 학습 목적 달성 X
   ✓ 대신 "한자 표기" 문항으로: 4개의 비슷해 보이는 한자 시퀀스 중 올바른 것을 고르게.
       options: "自畫自讚" / "子和子餐" / "自火自參" / "紫禾茲讚"

(3) **선지의 부연 설명·괄호·예시가 정답에만 길게 있는 경우**
   - 정답·오답 모두 동일한 형식(길이·품사·어조)이어야 함
   - 정답에만 "(어릴 적 장난감)" 같은 힌트가 붙으면 안 됨

(4) **질문 본문이 정답을 거의 그대로 담고 있는 경우**
   ✗ 질문에 "X(韓字)"로 한자가 노출된 채 보기에 그 한자의 한글 직역만 한 개 정답으로 두는 식

(5) **오답이 명백히 무관해서 "오답 4개 중 그럴싸한 게 1개뿐"인 경우**
   - 4지선다 학습적 가치를 위해 distractor 3개는 모두 "그럴 법하지만 결정적 차이가 있는" 답이어야 함

[품질 — 객관식 6문항(2~7번) 출제 가이드]
- **유형 다양화**: 6문항을 다음 6유형 중 6개로 (반복 금지)
  · 뜻 묻기 (의미 직접 묻기)
  · 한자 표기 (4개 한자 시퀀스 중 정답)
  · 예문 고르기 (4개 문장 중 알맞게 쓰인 것)
  · 잘못 쓰인 예 고르기 (4개 중 어색한 것)
  · 유의·반의 표현 (의미가 가까운/반대인 표현·사자성어)
  · 상황·적용 (대화·짧은 지문에 어울리는 사자성어 / 적용 인물)
- **선지 길이 30자 이하** + 4개 선지 길이/품사/구조 통일 (외관 단서 제거)
- **그럴싸한 distractor**: 같은 학년 수준의 다른 사자성어·유사 표현 우선
  · 명백히 무관한 distractor는 한 set에 1~2개까지만 (저학년에 한해)
- explanation은 "왜 정답인지"를 학생이 학습할 수 있도록 한 줄로

[출력]
JSON 만 출력. 형식:
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

/* 사용자가 사자성어를 직접 지정하는 모드 */
const PROMPT_USER_PROVIDES_IDIOM = `당신은 한국 초등 ~ 중학생용 "사자성어 학습지" 출제 전문가입니다.
사용자가 입력한 사자성어 각각에 대해 정확히 8문항으로 구성된 set을 JSON으로 만들어 주세요.

[당신의 입력]
사자성어 N개 (한글). 예: "동문서답, 일석이조, 죽마고우"
필요하면 사용자가 한자/뜻/난이도/출전/태그를 함께 줄 수 있습니다.

[당신이 채워야 할 것]
- meta.idiom: 사용자가 준 한글 그대로
- meta.hanja: 표준 한자 표기 (사용자가 안 줬다면 정확히 채울 것)
- meta.meaning: 표준 뜻풀이 (사용자가 안 줬다면 정확히 채울 것)
- meta.origin: 출전이 명확하면 채우고 모호하면 비움
- difficulty: 사용자가 안 줬다면 "medium" 기본
- 8 슬롯 전체 (1번 한자쓰기 + 2~7번 객관식 6 + 8번 서술형)

${COMMON_RULES}`;

/* AI가 사자성어 선정부터 출제까지 모두 하는 모드 */
const PROMPT_AI_SELECTS_IDIOM = `당신은 한국 초등 ~ 중학생용 "사자성어 학습지" 출제 전문가입니다.
사용자가 요청한 개수(N)·난이도·테마에 맞춰 적절한 사자성어를 직접 선정하고,
각각에 대해 정확히 8문항으로 구성된 set을 JSON으로 만들어 주세요.

[당신의 입력]
- 만들 set 개수 (N)
- 대상 학년/난이도 (예: 초3~4 / easy)
- 선택: 테마 또는 주제군 (예: 우정, 노력, 효도, 자만, 협동)
- 선택: 이미 만든 사자성어 목록 (중복 회피용)

[사자성어 선정 기준 — 매우 중요]
- **초·중등 교과서·표준 한자 학습 자료에 자주 등장하는 4자 사자성어** 위주
   (예: 동문서답·일석이조·죽마고우·대기만성·자화자찬·우공이산·각자도생·유비무환·고진감래·전화위복 등)
- 너무 어렵거나 낯선 것 (예: 청출어람도 advanced부터)·고전 한자 풍의 희귀어 회피
- 학년 난이도와 idiom 친숙도가 일치하도록:
  · easy(초3~4): 일석이조·죽마고우·동문서답 등 일상 대화 가능 수준
  · medium(초5~6): 자화자찬·고진감래·과유불급
  · hard(중1): 대기만성·우공이산·각자도생
- 테마가 주어지면 그 테마에 맞춰 (예: "노력" → 우공이산·고진감래·대기만성·각고면려)
- N개 모두 서로 다른 사자성어 (중복 X)
- 사용자가 "이미 만든 목록"을 줬다면 거기 없는 것만 선정

[그 외 채워야 할 것]
- meta.idiom / meta.hanja / meta.meaning: 표준 표기·해석 정확히
- meta.origin: 출전이 명확하면 채우고 모호하면 비움
- 8 슬롯 전체 (1번 한자쓰기 + 2~7번 객관식 6 + 8번 서술형)

${COMMON_RULES}`;

export default function SettingsModal({ onClose }: Props) {
  const resetToSeed = useSetStore((s) => s.resetToSeed);
  const exportData = useSetStore((s) => s.exportData);
  const importData = useSetStore((s) => s.importData);

  const { toast } = useToast();
  const confirm = useConfirm();

  const [copiedKey, setCopiedKey] = useState<'a' | 'b' | null>(null);
  const [importText, setImportText] = useState('');
  const [importBusy, setImportBusy] = useState(false);
  const [importResult, setImportResult] = useState<{
    ok: number;
    failed: { index: number; errors: string[] }[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* AI 프롬프트 복사 — 두 버전 분리 */
  const handleCopyPrompt = async (key: 'a' | 'b') => {
    const text = key === 'a' ? PROMPT_USER_PROVIDES_IDIOM : PROMPT_AI_SELECTS_IDIOM;
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
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              ChatGPT·Claude에 붙여넣어 사자성어 set JSON을 받으세요. 결과 JSON은 아래 "가져오기"에서 붙여넣으면 자동 검증·추가됩니다.<br />
              두 프롬프트 모두 "정답 누설 방지" 규칙과 "그럴싸한 distractor" 가이드라인을 강제합니다.
            </p>

            {/* 버전 A: 사용자가 사자성어 직접 지정 */}
            <div className="rounded border border-purple-200 bg-purple-50/40 p-3 mb-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-[12px] font-bold text-purple-800">
                  A. 사자성어를 내가 지정 → 문항만 AI가 작성
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
                예: "동문서답, 일석이조, 죽마고우" 같이 사자성어 한글만 던지면, 한자·뜻·8문항을 모두 AI가 채웁니다.
              </p>
              <pre className="text-[10.5px] leading-relaxed bg-white border border-purple-200 rounded p-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-gray-700">
                {PROMPT_USER_PROVIDES_IDIOM}
              </pre>
            </div>

            {/* 버전 B: AI가 사자성어 선정부터 */}
            <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-[12px] font-bold text-emerald-800">
                  B. 사자성어 선정부터 → 문항까지 AI가 모두
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
                예: "초5~6 수준으로 5개, 노력 테마". 사자성어 선정부터 문항까지 AI가 일괄 처리.
              </p>
              <pre className="text-[10.5px] leading-relaxed bg-white border border-emerald-200 rounded p-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-gray-700">
                {PROMPT_AI_SELECTS_IDIOM}
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
