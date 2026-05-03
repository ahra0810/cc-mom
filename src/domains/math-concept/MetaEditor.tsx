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
          정의 <span className="text-red-500">*</span>
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
          시각/구체 예시 (선택)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 가로 5cm, 세로 3cm 직사각형의 둘레는 16cm"
          value={m.visualExample || ''}
          onChange={(e) => update({ visualExample: e.target.value })}
        />
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

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          관련 용어 (쉼표로 구분, 선택)
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
