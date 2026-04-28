import { useState } from 'react';
import { X, Sparkles, FilePlus, BookOpen, FileText, Download, ChevronRight } from 'lucide-react';

interface Props {
  onClose: () => void;
  onStart: () => void;
}

/**
 * 사자성어 학습지 메이커 환영 안내.
 * 첫 방문 시 자동 표시, 이후 헤더 ?로 재방문 가능.
 */
export default function WelcomeModal({ onClose, onStart }: Props) {
  const [step, setStep] = useState<0 | 1>(0);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-white/80 hover:text-white rounded-lg z-10"
          aria-label="닫기"
        >
          <X size={18} />
        </button>

        {/* Hero header */}
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 px-7 pt-8 pb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase opacity-80">
              사자성어 학습지 메이커
            </span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            {step === 0 ? '사자성어 학습지를 빠르게 만들어요 📜' : '4단계로 끝나요'}
          </h1>
          <p className="text-sm opacity-90 leading-relaxed">
            {step === 0
              ? '사자성어 1개 + 7문항 = A4 1페이지\n초3 ~ 중1 학생용 학습지를 자동으로 만들어 드립니다.'
              : '아래 단계를 따라 오시면\n3분 안에 첫 학습지가 완성됩니다.'}
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {step === 0 ? (
            <div className="space-y-3">
              <Feature
                icon={<BookOpen size={16} />} color="#8B5CF6"
                title="사자성어 1개 = 학습지 1장"
                desc="동문서답·일석이조·자화자찬 같은 사자성어 하나를 set으로 등록하면 자동으로 7문항이 구성돼요."
              />
              <Feature
                icon={<FilePlus size={16} />} color="#10B981"
                title="고정 7문항 구조"
                desc="① 한자 따라쓰기 + 한글음 ② ~ ⑥ 4지선다 객관식 ⑦ 사자성어 사용 문장 만들기"
              />
              <Feature
                icon={<FileText size={16} />} color="#F59E0B"
                title="A4 1페이지에 정확히 fit"
                desc="긴 보기·답안이 있어도 자동으로 폰트가 조정돼 한 장에 모든 문항이 들어갑니다."
              />
              <Feature
                icon={<Download size={16} />} color="#3B82F6"
                title="PDF로 바로 출력"
                desc="시험지 PDF + 답안지/해설 PDF 두 가지를 한 번에 받을 수 있어요."
              />
            </div>
          ) : (
            <div className="space-y-3">
              <StepItem n={1} color="#8B5CF6"
                title="새 학습지 만들기"
                desc='좌측 "+ 새 set" 또는 시드 카드를 클릭해 사자성어 + 한자 + 뜻을 입력해요.' />
              <StepItem n={2} color="#10B981"
                title="7문항 채우기"
                desc="1번(한자 쓰기) → 2~6번(객관식 4지선다) → 7번(문장 만들기) 순서로 인라인 폼에 작성해요." />
              <StepItem n={3} color="#F59E0B"
                title="A4 1페이지 미리보기"
                desc="가운데 화면에서 실제 PDF와 같은 모습으로 확인하고, 길이가 맞지 않으면 자동 조정돼요." />
              <StepItem n={4} color="#3B82F6"
                title="PDF 출력"
                desc='우측 "시험지 PDF" / "답안지+해설 PDF" 버튼으로 한 번에 출력해요.' />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-2 flex items-center gap-2 bg-gray-50 border-t border-gray-100">
          {step === 0 ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                둘러보기
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm flex items-center justify-center gap-1"
              >
                다음 — 사용법 보기 <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(0)}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                둘러보기
              </button>
              <button
                onClick={onStart}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center justify-center gap-1"
              >
                <FilePlus size={14} /> 첫 학습지 만들기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, color, title, desc }: { icon: React.ReactNode; color: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-sm font-bold text-gray-800">{title}</div>
        <div className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function StepItem({ n, color, title, desc }: { n: number; color: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {n}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-sm font-bold text-gray-800">{title}</div>
        <div className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}
