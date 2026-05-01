/**
 * NewSetDomainPicker — "+ 새 set" 클릭 시 어떤 도메인으로 만들지 고르는 모달.
 *
 * 등록된 도메인이 1개일 때는 표시되지 않음 (App.tsx에서 자동 우회).
 * 도메인이 2개 이상이면 카드 행으로 표시 → 선택 시 startNewSet(domain) → SetEditor 오픈.
 */
import { X, FilePlus } from 'lucide-react';
import { listDomains } from '../domains/registry';
import type { SetDomain } from '../types/sets';

interface Props {
  onClose: () => void;
  onPick: (domain: SetDomain) => void;
}

export default function NewSetDomainPicker({ onClose, onPick }: Props) {
  const domains = listDomains();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FilePlus size={16} className="text-purple-600" />
            <h2 className="text-base font-bold text-gray-800">어떤 학습지를 만들까요?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            과목(도메인)을 고르면 해당 도메인에 맞는 메타 폼과 8문항 슬롯이 자동으로 준비됩니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domains.map((d) => (
              <button
                key={d.id}
                onClick={() => onPick(d.id as SetDomain)}
                className="text-left p-4 rounded-xl border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-base flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: `${d.labels.accentColor}1F`,
                      color: d.labels.accentColor,
                    }}
                  >
                    📜
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold text-gray-800">
                      {d.labels.subjectName}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {d.labels.heroSubline.split('\n')[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
