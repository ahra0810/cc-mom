/**
 * "단짝 친구" 상세 입력 컴포넌트 — 이모지 + 용어 + 짧은 설명을 행 단위로 편집.
 *
 * math-concept / proverb / idiomatic-phrase 3개 도메인의 MetaEditor 가 공유.
 *
 * - items 비어있고 fallbackTerms 만 있으면 "단순 chip 모드" (안내 문구만 노출).
 * - "+ 추가" 클릭 시:
 *    · fallbackTerms 가 있으면 그것을 상세 row 로 일괄 변환
 *    · 그 외엔 빈 row 추가
 */

export type RelatedDetailedItem = {
  term: string;
  emoji: string;
  desc: string;
};

interface Props {
  items: RelatedDetailedItem[];
  fallbackTerms: string[];
  onChange: (next: RelatedDetailedItem[]) => void;
  /** 라벨 — 도메인별 명칭 ("단짝 친구", "비슷한 속담", "비슷한 관용어" 등) */
  label?: string;
}

export default function RelatedDetailedEditor({
  items,
  fallbackTerms,
  onChange,
  label = '단짝 친구',
}: Props) {
  const isEmpty = items.length === 0;

  const addRow = () => {
    if (isEmpty && fallbackTerms.length) {
      onChange(fallbackTerms.map((t) => ({ term: t, emoji: '🔗', desc: '' })));
      return;
    }
    onChange([...items, { term: '', emoji: '🔗', desc: '' }]);
  };
  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };
  const patchRow = (idx: number, patch: Partial<RelatedDetailedItem>) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold text-gray-700">
          {label} — 상세 (이모지 · 용어 · 설명)
        </label>
        <button
          type="button"
          className="text-[10px] text-blue-600 hover:underline"
          onClick={addRow}
        >
          + 추가
        </button>
      </div>
      {isEmpty ? (
        <p className="text-[10px] text-gray-400">
          비워두면 아래의 단순 chip 으로 표시됩니다. 추가 버튼을 누르면 이모지·짧은 설명이 들어간 카드 형태로 바뀌어요.
        </p>
      ) : (
        <div className="space-y-1.5">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <input
                className="input-field !text-xs !w-10 text-center"
                placeholder="🔺"
                value={it.emoji}
                onChange={(e) => patchRow(idx, { emoji: e.target.value })}
              />
              <input
                className="input-field !text-xs !w-20"
                placeholder="용어"
                value={it.term}
                onChange={(e) => patchRow(idx, { term: e.target.value })}
              />
              <input
                className="input-field !text-xs flex-1"
                placeholder="짧은 설명 (한 줄, 30자 내외 — 두 문장이면 \n)"
                value={it.desc}
                onChange={(e) => patchRow(idx, { desc: e.target.value })}
              />
              <button
                type="button"
                className="text-[10px] text-red-500 hover:underline px-1"
                onClick={() => removeRow(idx)}
                title="삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
