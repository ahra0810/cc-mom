/**
 * 수학 개념어 도메인의 메타 입력 폼.
 * 한국어 term + 영어 단어 + (선택) 한자 + 정의 + 시각 예시 + 관련 용어 +
 * 교과서 발문 예 + 어원 + 학년 입력.
 */
import type { MathConceptMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';

export default function MathConceptMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  const m = meta as MathConceptMeta;

  const update = (patch: Partial<MathConceptMeta>) =>
    onUpdate(patch as Partial<SetMeta>);

  /* relatedTerms는 쉼표로 구분된 단일 input으로 입력받음 */
  const relatedString = (m.relatedTerms || []).join(', ');

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">수학 개념어 정보</h3>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          한국어 용어 <span className="text-red-500">*</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 둘레"
          value={m.term}
          onChange={(e) => update({ term: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          영어 단어 <span className="text-blue-500">권장</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: perimeter / side / even number"
          value={m.englishTerm || ''}
          onChange={(e) => update({ englishTerm: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          한↔영 짝짓기 학습용. 비워 두면 영어 슬롯이 비활성화됩니다.
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">한자 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 周邊 — 순한국어(둘레·몫)는 비워 두세요"
          value={m.hanja || ''}
          onChange={(e) => update({ hanja: e.target.value })}
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          교과서 속 정의 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder="예: 둘로 나누어 떨어지는 자연수"
          value={m.textbookDefinition || ''}
          onChange={(e) => update({ textbookDefinition: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          교과서·사전 톤의 정확한 정의. 친근한 정의와 함께 표시됩니다.
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          친근한 정의 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 도형 바깥쪽을 한 바퀴 도는 길의 길이"
          value={m.definition}
          onChange={(e) => update({ definition: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">영어 어원 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: peri-(주변) + meter(재다)"
          value={m.englishOrigin || ''}
          onChange={(e) => update({ englishOrigin: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          영어 단어가 있고 어원이 흥미로운 경우 4번 슬롯(이름의 비밀)에서 활용됩니다.
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          그림 (이모지·도형, 선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder={`예 (짝수):\n🟡🟡  🟡🟡  🟡🟡\n둘씩 짝지어요!`}
          value={m.visualEmoji || ''}
          onChange={(e) => update({ visualEmoji: e.target.value })}
          style={{ fontFamily: 'monospace, "Noto Sans KR"' }}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          개념 카드 "그림으로 보기" 섹션 좌측에 큰 글씨로 표시됩니다. 이모지·도형 문자를 활용하세요.
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          시각 예시 설명 (선택)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 가로 5cm, 세로 3cm 직사각형의 둘레는 16cm"
          value={m.visualExample || ''}
          onChange={(e) => update({ visualExample: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          그림 옆에 작은 글씨로 표시되는 부연 설명. 일상 비유 + 수치 예시.
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          교과서 발문 예 (선택)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 정원의 둘레를 구하시오. 정원은 가로 5m, 세로 3m인 직사각형입니다."
          value={m.textbookExample || ''}
          onChange={(e) => update({ textbookExample: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          7번 슬롯(수학 발문 속 단어 찾기)에서 활용됩니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
            교과서 학년 (선택)
          </label>
          <select
            className="select-field !text-xs"
            value={m.grade ?? ''}
            onChange={(e) =>
              update({ grade: e.target.value ? Number(e.target.value) : undefined })
            }
          >
            <option value="">선택</option>
            <option value="1">초1</option>
            <option value="2">초2</option>
            <option value="3">초3</option>
            <option value="4">초4</option>
            <option value="5">초5</option>
            <option value="6">초6</option>
          </select>
        </div>
      </div>

      <RelatedDetailedEditor
        items={m.relatedTermsDetailed || []}
        fallbackTerms={m.relatedTerms || []}
        onChange={(next) => {
          /* relatedTermsDetailed 변경 시 단순 relatedTerms 도 같이 갱신 → 검색 hayasack 일관성 */
          update({
            relatedTermsDetailed: next.length ? next : undefined,
            relatedTerms: next.length ? next.map((x) => x.term) : (m.relatedTerms || []),
          });
        }}
      />

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          관련 용어 (쉼표로 구분, 선택 — 위 상세 입력 시 자동 동기화)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 넓이, 변, 다각형"
          value={relatedString}
          onChange={(e) =>
            update({
              relatedTerms: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">우리말 이야기 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: '둘레'는 한자가 없는 우리말이에요"
          value={m.origin || ''}
          onChange={(e) => update({ origin: e.target.value })}
        />
      </div>
    </div>
  );
}

/* ─── 단짝 친구 상세 에디터 — emoji + term + desc 한 줄씩 ─── */
type FriendItem = { term: string; emoji: string; desc: string };

function RelatedDetailedEditor({
  items,
  fallbackTerms,
  onChange,
}: {
  items: FriendItem[];
  fallbackTerms: string[];
  onChange: (next: FriendItem[]) => void;
}) {
  /* 처음 진입 시 items 가 비어있고 fallbackTerms 만 있다면 그대로 노출 (단순 chip 모드) */
  const isEmpty = items.length === 0;

  const addRow = () => {
    /* 단순 chip 으로 입력된 게 있으면 첫 진입 시 그것을 상세 row 로 변환 */
    if (isEmpty && fallbackTerms.length) {
      onChange(fallbackTerms.map((t) => ({ term: t, emoji: '🔗', desc: '' })));
      return;
    }
    onChange([...items, { term: '', emoji: '🔗', desc: '' }]);
  };
  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };
  const patchRow = (idx: number, patch: Partial<FriendItem>) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold text-gray-700">
          단짝 친구 — 상세 (이모지 · 용어 · 설명)
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
          비워두면 아래 "관련 용어"의 단순 chip 으로 표시됩니다. 추가 버튼을 누르면 이모지·짧은 설명이 들어간 카드 형태로 바뀌어요.
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
                placeholder="짧은 설명 (한 줄, 30자 내외)"
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
