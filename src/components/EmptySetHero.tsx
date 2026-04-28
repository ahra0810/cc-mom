/**
 * EmptySetHero — 가운데 패널에서 selected set이 없을 때 표시되는 환영 화면.
 * 시드 사자성어 set 5개를 카드로 보여주고 클릭하면 selectSet(id) 호출.
 * "직접 새 set 만들기" CTA로 SetEditor 오픈.
 */
import { Sparkles, FilePlus, FileText, Eye, Download } from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { getSlotCompletionCount } from '../services/setValidator';

interface Props {
  onCreateNew: () => void;
}

export default function EmptySetHero({ onCreateNew }: Props) {
  const sets = useSetStore((s) => s.sets);
  const selectSet = useSetStore((s) => s.selectSet);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-purple-50/50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Step indicator */}
        <StepIndicator current={0} />

        {/* Hero */}
        <div className="text-center mt-8 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
            <FileText size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">
            첫 학습지를 만들어 보세요
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            아래 시드 사자성어 set 중 하나를 클릭하거나,
            <br />
            <strong className="text-purple-600">직접 새 사자성어 set을 만드세요.</strong>
          </p>
        </div>

        {/* Quick start — 시드 set 카드 */}
        {sets.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                ⚡ 빠르게 시작 — 시드 사자성어
              </h3>
              <span className="text-[10px] text-gray-400">한 번 클릭으로 미리보기</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sets.slice(0, 6).map((s) => {
                if (s.meta.domain !== 'four-char-idiom') return null;
                const completion = getSlotCompletionCount(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSet(s.id)}
                    className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                        📜
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold text-gray-800 truncate">
                          {s.meta.idiom} <span className="text-xs text-gray-500 font-normal">{s.meta.hanja}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          {s.meta.meaning}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {completion}/7 문항
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Direct CTA */}
        <div className="text-center mt-6 mb-4">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-colors"
          >
            <FilePlus size={16} /> 직접 새 사자성어 set 만들기
          </button>
        </div>

        {/* Footer hint */}
        <div className="text-center text-[11px] text-gray-400 leading-relaxed pt-4 border-t border-gray-100">
          💡 한 set은 사자성어 1개 + 7문항(한자 쓰기 1 + 객관식 5 + 문장 만들기 1) = A4 1페이지 학습지입니다.
        </div>
      </div>
    </div>
  );
}

/* 4단계 진행 표시 */
function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: 'Set 만들기', icon: <FilePlus size={11} /> },
    { num: 2, label: '7문항 채우기', icon: <FileText size={11} /> },
    { num: 3, label: '미리보기', icon: <Eye size={11} /> },
    { num: 4, label: 'PDF 출력', icon: <Download size={11} /> },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
      {steps.map((s, i) => {
        const isCurrent = i === current;
        const isPast = i < current;
        return (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isPast
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold ${
                isCurrent
                  ? 'bg-white/25'
                  : isPast
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {isPast ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.icon}</span>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-3 h-px ${isPast ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
