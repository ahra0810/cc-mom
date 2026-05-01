/**
 * SetSlotInput — 슬롯별 입력 컴포넌트.
 *
 * 분기는 슬롯 인덱스가 아닌 `slot.type` 기준 (도메인별 슬롯 구성이 다양해질 수 있음).
 * 라벨은 도메인 레지스트리에서 가져옵니다.
 */
import { Check, AlertCircle } from 'lucide-react';
import type { Question } from '../types';
import type { SlotIndex, SetDomain } from '../types/sets';
import { getDomain } from '../domains/registry';

interface Props {
  index: SlotIndex;
  slot: Question;
  domain: SetDomain;
  onChange: (updates: Partial<Question>) => void;
  errorMessages?: string[];
  isComplete: boolean;
}

export default function SetSlotInput({
  index,
  slot,
  domain,
  onChange,
  errorMessages = [],
  isComplete,
}: Props) {
  const cfg = getDomain(domain);
  const title = cfg.labels.slotLabels[index] ?? `${index + 1}번`;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        errorMessages.length > 0
          ? 'border-red-300 bg-red-50/30'
          : isComplete
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-gray-200 bg-white'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              isComplete ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isComplete ? <Check size={10} strokeWidth={3} /> : index + 1}
          </div>
          <span className="text-xs font-bold text-gray-700">{title}</span>
        </div>
      </div>

      {/* Body — slot.type 기준 분기 */}
      <div className="p-3 space-y-2.5">
        {slot.type === 'hanja-writing' && <SlotHanjaWriting slot={slot} onChange={onChange} />}
        {slot.type === 'multiple-choice' && <SlotMultipleChoice slot={slot} onChange={onChange} />}
        {slot.type === 'sentence-making' && <SlotSentenceMaking slot={slot} onChange={onChange} />}
        {slot.type === 'short-answer' && <SlotShortAnswer slot={slot} onChange={onChange} />}

        {/* 공통: 해설 */}
        <div>
          <label className="text-[10px] font-medium text-gray-500 mb-1 block">해설 (선택)</label>
          <textarea
            className="input-field !text-xs min-h-[40px] resize-y"
            placeholder="이 문항의 해설을 적어주세요"
            value={slot.explanation || ''}
            onChange={(e) => onChange({ explanation: e.target.value })}
          />
        </div>

        {/* 검증 에러 */}
        {errorMessages.length > 0 && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 bg-red-50 border border-red-200 rounded text-[10px] text-red-700">
            <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />
            <ul className="space-y-0.5 leading-snug">
              {errorMessages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── 한자 쓰기 (사자성어 1번) ─── */
function SlotHanjaWriting({
  slot,
  onChange,
}: {
  slot: Question;
  onChange: (u: Partial<Question>) => void;
}) {
  return (
    <>
      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">문제 본문</label>
        <textarea
          className="input-field !text-xs min-h-[60px] resize-y"
          placeholder='예: "다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요."'
          value={slot.question}
          onChange={(e) => onChange({ question: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          💡 메타 정보를 입력하면 자동으로 채워집니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-medium text-gray-500 mb-1 block">
            한자 4자 (학생이 따라 쓸 글자)
          </label>
          <input
            className="input-field !text-xs"
            placeholder="예: 東問西答"
            value={slot.hanjaTrace || ''}
            onChange={(e) => onChange({ hanjaTrace: e.target.value })}
            maxLength={10}
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          />
          <p className="text-[10px] text-gray-400 mt-1">PDF에서 옅은 회색 글자로 표시됨</p>
        </div>
        <div>
          <label className="text-[10px] font-medium text-gray-500 mb-1 block">
            정답 (한글음)
          </label>
          <input
            className="input-field !text-xs"
            placeholder="예: 동문서답"
            value={slot.answer}
            onChange={(e) => onChange({ answer: e.target.value })}
          />
          <p className="text-[10px] text-gray-400 mt-1">학생이 한글음으로 작성하는 답</p>
        </div>
      </div>
    </>
  );
}

/* ─── 객관식 4지선다 ─── */
function SlotMultipleChoice({
  slot,
  onChange,
}: {
  slot: Question;
  onChange: (u: Partial<Question>) => void;
}) {
  const options = slot.options || ['', '', '', ''];

  const updateOption = (idx: number, value: string) => {
    const next = [...options];
    while (next.length < 4) next.push('');
    next[idx] = value;
    onChange({ options: next.slice(0, 4) });
  };

  return (
    <>
      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">문제 본문</label>
        <textarea
          className="input-field !text-xs min-h-[40px] resize-y"
          placeholder='예: "이 표현의 뜻으로 알맞은 것은?"'
          value={slot.question}
          onChange={(e) => onChange({ question: e.target.value })}
        />
      </div>

      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">
          4지선다 (정답을 라디오로 선택)
        </label>
        <div className="space-y-1.5">
          {[0, 1, 2, 3].map((i) => {
            const labels = ['①', '②', '③', '④'];
            const opt = options[i] || '';
            const isAnswer = slot.answer === opt && opt.trim() !== '';
            return (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 w-4">{labels[i]}</span>
                <input
                  className={`input-field !text-xs flex-1 ${isAnswer ? '!border-emerald-400 !bg-emerald-50' : ''}`}
                  placeholder={`보기 ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
                <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer whitespace-nowrap">
                  <input
                    type="radio"
                    name={`answer-${slot.id}`}
                    checked={isAnswer}
                    onChange={() => onChange({ answer: opt })}
                    disabled={!opt.trim()}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  정답
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── 단답형 (속담 빈칸 채우기 등) ─── */
function SlotShortAnswer({
  slot,
  onChange,
}: {
  slot: Question;
  onChange: (u: Partial<Question>) => void;
}) {
  return (
    <>
      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">문제 본문</label>
        <textarea
          className="input-field !text-xs min-h-[50px] resize-y"
          placeholder='예: "다음 빈칸을 채우세요: 가는 말이 ___ 오는 말이 곱다"'
          value={slot.question}
          onChange={(e) => onChange({ question: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          💡 빈칸 자리는 "___" (밑줄 3개)로 표시하세요.
        </p>
      </div>

      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">
          정답 (빈칸에 들어갈 어절)
        </label>
        <input
          className="input-field !text-xs"
          placeholder="예: 고와야"
          value={slot.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
        />
      </div>
    </>
  );
}

/* ─── 서술형 (문장 만들기) ─── */
function SlotSentenceMaking({
  slot,
  onChange,
}: {
  slot: Question;
  onChange: (u: Partial<Question>) => void;
}) {
  return (
    <>
      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">문제 본문</label>
        <textarea
          className="input-field !text-xs min-h-[40px] resize-y"
          placeholder="예: '동문서답'을(를) 사용해 한 문장을 만드세요."
          value={slot.question}
          onChange={(e) => onChange({ question: e.target.value })}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          💡 메타 정보를 입력하면 자동으로 채워집니다.
        </p>
      </div>

      <div>
        <label className="text-[10px] font-medium text-gray-500 mb-1 block">
          모범 답안 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <textarea
          className="input-field !text-xs min-h-[40px] resize-y"
          placeholder="답안지 PDF에 표시될 예시 답안을 적어주세요"
          value={slot.answer}
          onChange={(e) => onChange({ answer: e.target.value })}
        />
      </div>
    </>
  );
}
