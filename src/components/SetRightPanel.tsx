/**
 * SetRightPanel — 출력 대상 set 정보 + 템플릿 선택 + PDF 출력.
 *
 * Phase 6 본격 구현:
 *  - 선택된 set 카드 (idiom/한자/난이도/완성도)
 *  - 빠른 편집 (제목, 난이도)
 *  - 템플릿 라디오 (Phase 5 — idiom-classic 1종, Phase 7에 2종 추가 예정)
 *  - 시험지 PDF / 답안+해설 PDF (7/7 미달 시 비활성)
 *  - 하단 설정 버튼
 */
import { useState, useEffect } from 'react';
import {
  FileText,
  Settings,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  ListChecks,
} from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import { useToast } from './Toast';
import { getSlotCompletionCount } from '../services/setValidator';
import {
  exportSetToPDF,
  exportSetAnswerKeyToPDF,
} from '../services/setPdfService';
import { SET_TEMPLATES } from '../services/setPdfTemplates';
import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../types';
import type { IdiomMeta } from '../types/sets';

interface Props {
  onOpenSettings: () => void;
}

export default function SetRightPanel({ onOpenSettings }: Props) {
  const selectedSetId = useSetStore((s) => s.selectedSetId);
  const sets = useSetStore((s) => s.sets);
  const updateSet = useSetStore((s) => s.updateSet);
  const selectedSet = sets.find((s) => s.id === selectedSetId);

  const { toast } = useToast();

  /* 템플릿 선택 — 로컬 상태 (영속화 X) */
  const [templateId, setTemplateId] = useState<string>(SET_TEMPLATES[0].id);

  /* 빠른 편집 로컬 상태 — selectedSet 변경 시 동기화 */
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDifficulty, setQuickDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    if (selectedSet) {
      setQuickTitle(selectedSet.title);
      setQuickDifficulty(selectedSet.difficulty);
    }
  }, [selectedSet?.id, selectedSet?.title, selectedSet?.difficulty]);

  /* 선택된 set 없을 때 — 안내 + 설정 버튼 */
  if (!selectedSet) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center gap-1.5 px-3 h-11 border-b border-gray-200 flex-shrink-0">
          <FileText size={14} className="text-purple-600" />
          <span className="text-xs font-bold text-gray-800">시험지 작업</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Printer size={20} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            왼쪽에서 출력할 사자성어 set을<br />선택하면 PDF로 내보낼 수 있어요.
          </p>
        </div>
        <div className="px-3 py-2 border-t border-gray-200 flex-shrink-0">
          <button className="btn btn-ghost w-full !text-xs" onClick={onOpenSettings}>
            <Settings size={13} /> 설정
          </button>
        </div>
      </div>
    );
  }

  const completion = getSlotCompletionCount(selectedSet);
  const isReady = completion === 7;
  const meta = selectedSet.meta as IdiomMeta;

  const commitQuickField = (field: 'title' | 'difficulty', value: string) => {
    if (field === 'title') {
      const v = value.trim();
      if (!v) {
        setQuickTitle(selectedSet.title); /* 롤백 */
        toast('error', '제목을 비워 둘 수 없어요');
        return;
      }
      if (v !== selectedSet.title) {
        updateSet(selectedSet.id, { title: v });
        toast('success', '제목이 수정되었어요');
      }
    } else if (field === 'difficulty') {
      const v = value as Difficulty;
      if (v !== selectedSet.difficulty) {
        updateSet(selectedSet.id, { difficulty: v });
        toast('success', `난이도가 "${DIFFICULTY_LABELS[v]}"로 변경되었어요`);
      }
    }
  };

  const handleExport = (withAnswer: boolean) => {
    if (!isReady) {
      toast('error', `7문항 모두 작성해야 PDF 출력이 가능해요 (현재 ${completion}/7)`);
      return;
    }
    try {
      if (withAnswer) {
        exportSetAnswerKeyToPDF(selectedSet, templateId);
        toast('info', '답안 PDF 인쇄 창이 열렸어요');
      } else {
        exportSetToPDF(selectedSet, templateId);
        toast('info', '시험지 PDF 인쇄 창이 열렸어요');
      }
    } catch (e) {
      console.error(e);
      toast('error', 'PDF 생성 중 오류가 발생했어요');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 h-11 border-b border-gray-200 flex-shrink-0">
        <FileText size={14} className="text-purple-600" />
        <span className="text-xs font-bold text-gray-800">시험지 작업</span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* 출력 대상 카드 */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            출력 대상
          </h3>
          <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-10 h-10 rounded bg-white border border-purple-200 flex items-center justify-center">
                <span
                  className="text-[15px] font-bold text-purple-700 leading-none"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {meta.hanja?.[0] || '?'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-gray-800 truncate">
                  {meta.idiom || '사자성어 미입력'}
                </div>
                <div
                  className="text-[11px] text-gray-500 truncate"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {meta.hanja || '—'}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isReady
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isReady ? (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={10} /> 7/7 완료
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle size={10} /> {completion}/7 작성중
                  </span>
                )}
              </span>
              <span className="text-[10px] text-gray-500">
                {DIFFICULTY_LABELS[selectedSet.difficulty].split(' ')[0]}
              </span>
            </div>
          </div>
        </section>

        {/* 빠른 편집 */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
            <Pencil size={10} /> 빠른 편집
          </h3>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-600 mb-0.5 block">제목</label>
              <input
                className="input-field !text-xs"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                onBlur={(e) => commitQuickField('title', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                placeholder="학습지 제목"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 mb-0.5 block">난이도</label>
              <select
                className="select-field !text-xs"
                value={quickDifficulty}
                onChange={(e) => {
                  const v = e.target.value as Difficulty;
                  setQuickDifficulty(v);
                  commitQuickField('difficulty', v);
                }}
              >
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 템플릿 선택 */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
            템플릿
          </h3>
          <div className="space-y-1.5">
            {SET_TEMPLATES.map((t) => {
              const checked = templateId === t.id;
              return (
                <label
                  key={t.id}
                  className={`flex items-center gap-2 px-2 py-2 rounded border cursor-pointer transition-colors ${
                    checked
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    className="accent-purple-600"
                    checked={checked}
                    onChange={() => setTemplateId(t.id)}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-gray-800">{t.name}</span>
                    <span className="text-[9.5px] text-gray-500 truncate">
                      {t.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {t.swatch.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-gray-200"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </label>
              );
            })}
            {SET_TEMPLATES.length === 1 && (
              <p className="text-[9.5px] text-gray-400 italic px-1">
                Phase 7에서 한자 강조형·저학년 친화형 추가 예정
              </p>
            )}
          </div>
        </section>

        {/* PDF 출력 */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
            <Printer size={10} /> PDF 출력
          </h3>
          <div className="space-y-1.5">
            <button
              onClick={() => handleExport(false)}
              disabled={!isReady}
              className={`btn w-full !text-xs ${
                isReady ? 'btn-primary' : 'btn-secondary opacity-60 cursor-not-allowed'
              }`}
              title={isReady ? '시험지 PDF 인쇄 창 열기' : '7문항 모두 채워야 출력 가능'}
            >
              <Printer size={13} /> 시험지 PDF
            </button>
            <button
              onClick={() => handleExport(true)}
              disabled={!isReady}
              className={`btn w-full !text-xs ${
                isReady ? 'btn-success' : 'btn-secondary opacity-60 cursor-not-allowed'
              }`}
              title={isReady ? '답안+해설 PDF 인쇄 창 열기' : '7문항 모두 채워야 출력 가능'}
            >
              <ListChecks size={13} /> 답안+해설 PDF
            </button>
            {!isReady && (
              <p className="text-[9.5px] text-amber-600 leading-relaxed mt-1 px-0.5">
                <AlertTriangle size={9} className="inline -mt-0.5 mr-0.5" />
                {7 - completion}문항 더 작성하면 PDF 출력이 활성화돼요
              </p>
            )}
            <p className="text-[9.5px] text-gray-400 leading-relaxed mt-1 px-0.5">
              버튼을 누르면 새 창에 인쇄 다이얼로그가 열려요. <br />
              "PDF로 저장"을 선택하면 정확히 A4 1페이지로 저장됩니다.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200 flex-shrink-0">
        <button className="btn btn-ghost w-full !text-xs" onClick={onOpenSettings}>
          <Settings size={13} /> 설정
        </button>
      </div>
    </div>
  );
}
