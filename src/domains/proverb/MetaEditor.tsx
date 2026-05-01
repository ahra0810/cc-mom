/**
 * 속담 도메인의 메타 입력 폼.
 */
import type { ProverbMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';

export default function ProverbMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  const m = meta as ProverbMeta;

  const update = (patch: Partial<ProverbMeta>) => onUpdate(patch as Partial<SetMeta>);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">속담 정보</h3>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          속담 본문 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[50px] resize-y"
          placeholder="예: 가는 말이 고와야 오는 말이 곱다"
          value={m.proverb}
          onChange={(e) => update({ proverb: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          뜻풀이 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 내가 남에게 좋게 말해야 남도 나에게 좋게 말한다"
          value={m.meaning}
          onChange={(e) => update({ meaning: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">교훈 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 남에게 친절히 말하는 것이 중요하다"
          value={m.lesson || ''}
          onChange={(e) => update({ lesson: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">유래 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 옛 농경 사회의 인간관계 격언"
          value={m.origin || ''}
          onChange={(e) => update({ origin: e.target.value })}
        />
      </div>
    </div>
  );
}
