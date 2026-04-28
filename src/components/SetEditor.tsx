/**
 * SetEditor — 사자성어 set 풀스크린 편집 모달.
 *
 * 좌측: 메타데이터 폼 (사자성어, 한자, 뜻, 출전, 제목, 난이도, 태그)
 * 우측: 7슬롯 인라인 입력 (SetSlotInput)
 *
 * 저장 시 validateSet → 첫 에러 슬롯으로 스크롤
 */
import { useEffect, useMemo, useRef } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import SetSlotInput from './SetSlotInput';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { getSlotCompletionCount } from '../services/setValidator';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import { SLOT_COUNT, type SlotIndex, type IdiomMeta } from '../types/sets';

interface Props {
  onClose: () => void;
}

export default function SetEditor({ onClose }: Props) {
  const draft = useSetStore((s) => s.editingSetDraft);
  const updateDraftMeta = useSetStore((s) => s.updateDraftMeta);
  const updateDraftSlot = useSetStore((s) => s.updateDraftSlot);
  const updateDraftField = useSetStore((s) => s.updateDraftField);
  const validateDraft = useSetStore((s) => s.validateDraft);
  const commitDraft = useSetStore((s) => s.commitDraft);
  const discardDraft = useSetStore((s) => s.discardDraft);

  const { toast } = useToast();
  const confirm = useConfirm();

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* draft가 없으면 모달 자체를 닫음 */
  useEffect(() => {
    if (!draft) onClose();
  }, [draft, onClose]);

  /* 검증 결과 (실시간) */
  const validation = useMemo(() => validateDraft(), [draft, validateDraft]);

  /* 슬롯별 에러 메시지 그룹 */
  const slotErrors = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const e of validation.errors) {
      if (typeof e.scope === 'number') {
        if (!map[e.scope]) map[e.scope] = [];
        map[e.scope].push(e.message);
      }
    }
    return map;
  }, [validation]);

  const metaErrors = validation.errors.filter((e) => e.scope === 'meta' || e.scope === 'title');

  const handleClose = async () => {
    /* 저장 안 된 변경 있으면 확인 */
    const ok = await confirm({
      title: '편집 종료',
      message: '저장하지 않은 변경 사항이 사라집니다. 계속하시겠습니까?',
      variant: 'warning',
      confirmText: '닫기',
    });
    if (ok) {
      discardDraft();
      onClose();
    }
  };

  const handleSave = () => {
    const result = validateDraft();
    if (!result.ok) {
      /* 첫 에러 슬롯으로 스크롤 */
      const firstSlotErr = result.errors.find((e) => typeof e.scope === 'number');
      if (firstSlotErr && typeof firstSlotErr.scope === 'number') {
        slotRefs.current[firstSlotErr.scope]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast('error', `입력이 완료되지 않았어요 (${result.errors.length}건)`);
      return;
    }
    const ok = commitDraft();
    if (ok) {
      toast('success', '저장되었습니다');
      onClose();
    } else {
      toast('error', '저장 실패');
    }
  };

  if (!draft) return null;

  /* 사자성어 메타 */
  const meta = draft.meta as IdiomMeta;
  const completion = getSlotCompletionCount(draft);

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-stretch">
      <div className="bg-white w-full h-full flex flex-col animate-fadeIn">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 h-12 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
              aria-label="닫기"
              title="저장 없이 닫기"
            >
              <X size={18} />
            </button>
            <span className="text-sm font-bold text-gray-800 truncate">
              {meta.idiom ? `${meta.idiom} 학습지 편집` : '새 사자성어 학습지'}
            </span>
            <span className={`text-[10px] flex-shrink-0 px-1.5 py-0.5 rounded ${
              completion === 7
                ? 'bg-emerald-100 text-emerald-700'
                : completion >= 4
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {completion}/7
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {!validation.ok && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-red-600">
                <AlertTriangle size={11} /> {validation.errors.length}건의 입력 필요
              </span>
            )}
            <button onClick={handleClose} className="btn btn-secondary !text-xs">취소</button>
            <button
              onClick={handleSave}
              className={`btn !text-xs ${validation.ok ? 'btn-success' : 'btn-secondary opacity-60'}`}
            >
              <Check size={12} /> 저장
            </button>
          </div>
        </div>

        {/* Body — 좌(메타) / 우(슬롯) 2단 */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left — 메타 폼 */}
          <aside className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50 p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">학습지 정보</h3>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 mb-1 block">제목</label>
              <input
                className="input-field !text-xs"
                placeholder="예: 동문서답 학습지"
                value={draft.title}
                onChange={(e) => updateDraftField('title', e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 mb-1 block">난이도</label>
              <select
                className="select-field !text-xs"
                value={draft.difficulty}
                onChange={(e) => updateDraftField('difficulty', e.target.value as Difficulty)}
              >
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">사자성어 정보</h3>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
                  사자성어 (한글 4자) <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-field !text-xs"
                  placeholder="예: 동문서답"
                  value={meta.idiom}
                  onChange={(e) => updateDraftMeta({ idiom: e.target.value })}
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
                  value={meta.hanja}
                  onChange={(e) => updateDraftMeta({ hanja: e.target.value })}
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
                  value={meta.meaning}
                  onChange={(e) => updateDraftMeta({ meaning: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1 block">출전 (선택)</label>
                <input
                  className="input-field !text-xs"
                  placeholder="예: 사기열전"
                  value={meta.origin || ''}
                  onChange={(e) => updateDraftMeta({ origin: e.target.value })}
                />
              </div>
            </div>

            {/* 메타 에러 */}
            {metaErrors.length > 0 && (
              <div className="px-2 py-1.5 bg-red-50 border border-red-200 rounded text-[10px] text-red-700">
                <ul className="space-y-0.5 leading-snug">
                  {metaErrors.map((e, i) => (
                    <li key={i}>{e.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3">
              <label className="text-[11px] font-semibold text-gray-700 mb-1 block">태그 (쉼표로 구분)</label>
              <input
                className="input-field !text-xs"
                placeholder="예: 대화, 엉뚱"
                value={(draft.tags || []).join(', ')}
                onChange={(e) =>
                  updateDraftField('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))
                }
              />
            </div>
          </aside>

          {/* Right — 7슬롯 */}
          <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">
              💡 1번 한자 따라쓰기 → 2~6번 객관식 → 7번 문장 만들기 순서로 작성하세요.
              메타에 사자성어 정보를 채우면 1·7번이 자동으로 일부 채워집니다.
            </div>
            {Array.from({ length: SLOT_COUNT }, (_, i) => {
              const idx = i as SlotIndex;
              const slot = draft.slots[idx];
              return (
                <div key={i} ref={(el) => { slotRefs.current[idx] = el; }}>
                  <SetSlotInput
                    index={idx}
                    slot={slot}
                    onChange={(u) => updateDraftSlot(idx, u)}
                    errorMessages={slotErrors[idx] || []}
                    isComplete={!slotErrors[idx] || slotErrors[idx].length === 0}
                  />
                </div>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}
