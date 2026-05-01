/**
 * 사자성어 도메인의 메타 입력 폼.
 * SetEditor의 좌측 메타 영역(사자성어 정보 섹션)을 도메인별 컴포넌트로 분리.
 * 다른 도메인(속담 등)도 같은 props 시그니처로 자기만의 폼 구현.
 */
import type { IdiomMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';

export default function IdiomMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  /* SetMeta union이지만 이 컴포넌트는 사자성어일 때만 사용되므로 narrowing OK */
  const m = meta as IdiomMeta;

  const update = (patch: Partial<IdiomMeta>) => onUpdate(patch as Partial<SetMeta>);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">사자성어 정보</h3>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          사자성어 (한글 4자) <span className="text-red-500">*</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 동문서답"
          value={m.idiom}
          onChange={(e) => update({ idiom: e.target.value })}
          maxLength={4}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          한자 (4자) <span className="text-red-500">*</span>
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 東問西答"
          value={m.hanja}
          onChange={(e) => update({ hanja: e.target.value })}
          maxLength={4}
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          뜻풀이 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 묻는 말에 엉뚱한 답을 함"
          value={m.meaning}
          onChange={(e) => update({ meaning: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">출전 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 사기열전"
          value={m.origin || ''}
          onChange={(e) => update({ origin: e.target.value })}
        />
      </div>
    </div>
  );
}
