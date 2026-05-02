/**
 * 수학 개념어 도메인의 메타 입력 폼.
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
          개념어 본문 <span className="text-red-500">*</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 분모"
          value={m.term}
          onChange={(e) => update({ term: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">한자 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 分母 — 순한국어(몫·둘레)는 비워 두세요"
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
          placeholder="예: 분수에서 아래에 쓰는 수"
          value={m.definition}
          onChange={(e) => update({ definition: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          시각/구체 예시 (선택)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 3/4 에서 4가 분모 / 10÷3=3 (몫) … 1 (나머지)"
          value={m.visualExample || ''}
          onChange={(e) => update({ visualExample: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          관련 용어 (쉼표로 구분, 선택)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 분자, 분수"
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
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">어원 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 분(分)은 나누다, 모(母)는 바탕·기준"
          value={m.origin || ''}
          onChange={(e) => update({ origin: e.target.value })}
        />
      </div>
    </div>
  );
}
