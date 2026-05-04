/**
 * 관용어 도메인의 메타 입력 폼.
 * v2: 시각 카드 + 일상 응용 학습지 — 풍부한 메타 입력.
 */
import type { IdiomaticPhraseMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';
import RelatedDetailedEditor from '../../components/RelatedDetailedEditor';

export default function IdiomaticMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  const m = meta as IdiomaticPhraseMeta;

  const update = (patch: Partial<IdiomaticPhraseMeta>) =>
    onUpdate(patch as Partial<SetMeta>);

  const relatedString = (m.relatedPhrases || []).join(', ');

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
          교과서 속 뜻 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder="예: 사귀어 아는 사람이 많다."
          value={m.textbookMeaning || ''}
          onChange={(e) => update({ textbookMeaning: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">사전·교과서 톤의 정확한 뜻.</p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          친근한 뜻 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 아는 사람이 정말정말 많아요!"
          value={m.meaning}
          onChange={(e) => update({ meaning: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          그림 (이모지 만화, 선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder={`예 (발이 넓다):\n👫 👫 👫 👫 👫 👫 👫\n      ↑\n      나 (친구가 많아요!)\n= **친구가 많은 사람** !`}
          value={m.visualEmoji || ''}
          onChange={(e) => update({ visualEmoji: e.target.value })}
          style={{ fontFamily: 'monospace, "Noto Sans KR"' }}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          이모지로 미니 시나리오를 그려요. **xxx** 는 강조(컬러).
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          시각 예시 설명 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder={`예: 학교에서 어느 반에 가도 인사할 친구가 많아요.\n사교성이 좋고 활발한 사람이에요.`}
          value={m.visualExample || ''}
          onChange={(e) => update({ visualExample: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          일상 사용 예 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder="예: 민수는 학교에서 발이 넓어서 어느 반에 가도 인사하는 친구가 있어."
          value={m.usageExample || ''}
          onChange={(e) => update({ usageExample: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          학생 일상의 실제 상황. 카드의 "일상에서 만나기" 박스에 인용됩니다.
        </p>
      </div>

      <RelatedDetailedEditor
        label="비슷한 관용어"
        items={m.relatedPhrasesDetailed || []}
        fallbackTerms={m.relatedPhrases || []}
        onChange={(next) => {
          update({
            relatedPhrasesDetailed: next.length ? next : undefined,
            relatedPhrases: next.length ? next.map((x) => x.term) : (m.relatedPhrases || []),
          });
        }}
      />

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          비슷한 관용어 (쉼표 구분, 선택 — 위 상세 입력 시 자동 동기화)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 얼굴이 넓다, 손이 닳도록"
          value={relatedString}
          onChange={(e) =>
            update({
              relatedPhrases: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
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

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-gray-700 mb-1 block">학년 (선택)</label>
          <select
            className="select-field !text-xs"
            value={m.grade ?? ''}
            onChange={(e) => update({ grade: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">선택</option>
            <option value="3">초3</option>
            <option value="4">초4</option>
            <option value="5">초5</option>
            <option value="6">초6</option>
            <option value="7">중1</option>
          </select>
        </div>
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
