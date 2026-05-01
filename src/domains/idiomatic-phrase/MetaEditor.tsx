/**
 * 관용어 도메인의 메타 입력 폼.
 */
import type { IdiomaticPhraseMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';

export default function IdiomaticMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  const m = meta as IdiomaticPhraseMeta;

  const update = (patch: Partial<IdiomaticPhraseMeta>) =>
    onUpdate(patch as Partial<SetMeta>);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">관용어 정보</h3>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          관용어 본문 <span className="text-red-500">*</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 발이 넓다"
          value={m.phrase}
          onChange={(e) => update({ phrase: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          뜻풀이 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 아는 사람이 많아 사교 범위가 넓다"
          value={m.meaning}
          onChange={(e) => update({ meaning: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">예문 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 민수는 학교에서 발이 넓어서 모두와 친하다."
          value={m.example || ''}
          onChange={(e) => update({ example: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">어원 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 신체 부위로 사람의 특성을 비유"
          value={m.origin || ''}
          onChange={(e) => update({ origin: e.target.value })}
        />
      </div>
    </div>
  );
}
