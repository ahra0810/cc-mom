/**
 * 속담 도메인의 메타 입력 폼.
 * v2: 시각 카드 + 일상 응용 학습지 — 풍부한 메타 입력.
 */
import type { ProverbMeta, SetMeta } from '../../types/sets';
import type { MetaEditorProps } from '../types';
import RelatedDetailedEditor from '../../components/RelatedDetailedEditor';

export default function ProverbMetaEditor({ meta, onUpdate }: MetaEditorProps) {
  const m = meta as ProverbMeta;

  const update = (patch: Partial<ProverbMeta>) => onUpdate(patch as Partial<SetMeta>);

  const relatedString = (m.relatedProverbs || []).join(', ');

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
          교과서 속 뜻 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder="예: 자기가 남에게 말이나 행동을 좋게 해야 남도 자기에게 좋게 한다."
          value={m.textbookMeaning || ''}
          onChange={(e) => update({ textbookMeaning: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">사전·교과서 톤의 정확한 뜻. 친근한 뜻과 함께 표시됩니다.</p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          친근한 뜻 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder="예: 내가 곱게 말하면 친구도 곱게 답해줘요!"
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
          placeholder={`예:\n😊 "안녕!"  →  😊 "안녕!"\n😠 "야!"   →   😠 "뭐?"\n= 곱게 말하면 **곱게 돌아와요** !`}
          value={m.visualEmoji || ''}
          onChange={(e) => update({ visualEmoji: e.target.value })}
          style={{ fontFamily: 'monospace, "Noto Sans KR"' }}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          이모지·화살표·짧은 대화로 미니 시나리오를 그려요. **xxx** 는 강조(컬러).
        </p>
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          시각 예시 설명 (선택)
        </label>
        <textarea
          className="input-field !text-xs min-h-[48px] resize-y"
          placeholder={`예: 친구에게 부드럽게 말하면 친구도 부드럽게 답해요.\n화내며 말하면 친구도 화내며 답하지요.`}
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
          placeholder="예: 동생이 화내며 말하니까 형도 화를 냈어. 그래서 둘 다 마음이 상했지."
          value={m.usageExample || ''}
          onChange={(e) => update({ usageExample: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          학생 일상의 실제 상황 한 줄. 카드의 "일상에서 만나기" 박스에 인용됩니다.
        </p>
      </div>

      <RelatedDetailedEditor
        label="비슷한 속담"
        items={m.relatedProverbsDetailed || []}
        fallbackTerms={m.relatedProverbs || []}
        onChange={(next) => {
          update({
            relatedProverbsDetailed: next.length ? next : undefined,
            relatedProverbs: next.length ? next.map((x) => x.term) : (m.relatedProverbs || []),
          });
        }}
      />

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
          비슷한 속담 (쉼표 구분, 선택 — 위 상세 입력 시 자동 동기화)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 오는 정이 있어야 가는 정이 있다, 말 한 마디에 천 냥 빚도 갚는다"
          value={relatedString}
          onChange={(e) =>
            update({
              relatedProverbs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold text-gray-700 mb-1 block">교훈 (선택)</label>
        <input
          className="input-field !text-xs"
          placeholder="예: 친절은 친절을 부른다."
          value={m.lesson || ''}
          onChange={(e) => update({ lesson: e.target.value })}
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
