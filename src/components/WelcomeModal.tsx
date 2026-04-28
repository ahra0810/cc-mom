import { useState } from 'react';
import { X, BookOpen, FilePlus, Eye, Download, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  onStart: () => void;
}

/**
 * 첫 방문자를 위한 환영/안내 모달.
 * "이 앱이 뭐 하는 곳이고 어디서부터 시작하면 되는지"를 30초 안에 이해시키는 게 목표.
 */
export default function WelcomeModal({ onClose, onStart }: Props) {
  const [step, setStep] = useState<0 | 1>(0);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-white/80 hover:text-white rounded-lg z-10"
          aria-label="닫기"
        >
          <X size={18} />
        </button>

        {/* 헤더 */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 px-7 pt-8 pb-6 text-white relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase opacity-80">
              퀴즈 메이커
            </span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            {step === 0 ? '환영합니다 👋' : '4단계로 끝내요'}
          </h1>
          <p className="text-sm opacity-90 leading-relaxed">
            {step === 0
              ? '초등 3학년부터 중학 3학년까지\n맞춤 시험지·학습지를 빠르게 만들 수 있어요.'
              : '아래 단계를 따라 오시면\n5분 안에 첫 시험지가 완성됩니다.'}
          </p>
        </div>

        {/* 본문 */}
        <div className="px-7 py-6">
          {step === 0 ? (
            <div className="space-y-3">
              <Feature
                icon={<BookOpen size={16} />}
                color="#3B82F6"
                title="다양한 과목 + 문항"
                desc="세계사 · 사자성어 · 관용구 · 속담 · 맞춤법 · 어휘 · 중학 국어 (문학)"
              />
              <Feature
                icon={<FilePlus size={16} />}
                color="#8B5CF6"
                title="3가지 방법으로 문항 만들기"
                desc="① 직접 작성  ② AI 채팅으로 생성 후 가져오기  ③ 이미 있는 문항 사용"
              />
              <Feature
                icon={<Eye size={16} />}
                color="#10B981"
                title="20종의 시험지 디자인"
                desc="초등용 10종 + 중학용 10종, 학년·과목별 최적화 템플릿"
              />
              <Feature
                icon={<Download size={16} />}
                color="#F59E0B"
                title="A4 PDF로 출력"
                desc="시험지 + 답안지/해설 별도 PDF, 인쇄 그대로"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <StepItem n={1} title="시험지 만들기" desc="우측 패널에서 제목과 과목·난이도를 선택해 새 시험지를 만들어요." color="#3B82F6" />
              <StepItem n={2} title="문항 추가하기" desc="좌측 문항 DB에서 마음에 드는 문항을 클릭 또는 '🎲 랜덤'으로 한 번에 N개 선택." color="#8B5CF6" />
              <StepItem n={3} title="미리보기 확인" desc="가운데 패널에서 시험지가 어떻게 나올지 확인 · 순서 변경 · 과목별 정렬." color="#10B981" />
              <StepItem n={4} title="PDF 내보내기" desc="우측 '내보내기'에서 템플릿 선택 후 시험지 PDF + 답안지 PDF 출력." color="#F59E0B" />
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
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
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm flex items-center justify-center gap-1"
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
                <FilePlus size={14} /> 첫 시험지 만들기
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

function StepItem({ n, title, desc, color }: { n: number; title: string; desc: string; color: string }) {
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
