/**
 * SetCenterPanel — A4 1페이지 실제 미리보기 (iframe).
 *
 * setPdfService.generateSetHTML 결과를 iframe srcdoc으로 렌더하고,
 * 컨테이너에 transform: scale(...)로 축소.
 *
 *  - "맞춤" 모드: 컨테이너 폭/높이 모두에 맞춰 페이지 전체가 보이도록 자동 축소
 *  - "수동" 모드: 사용자가 슬라이더/버튼으로 25~150% 직접 지정
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Pencil, Minus, Plus, Maximize2 } from 'lucide-react';
import { useSetStore } from '../stores/setStore';
import EmptySetHero from './EmptySetHero';
import { getSlotCompletionCount } from '../services/setValidator';
import { generateSetHTML } from '../services/setPdfService';

interface Props {
  onCreateNew: () => void;
  onEditSet: (setId: string) => void;
}

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78; /* 96dpi 기준 */

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.05;

export default function SetCenterPanel({ onCreateNew, onEditSet }: Props) {
  const selectedSetId = useSetStore((s) => s.selectedSetId);
  const sets = useSetStore((s) => s.sets);
  const selectedTemplateId = useSetStore((s) => s.selectedTemplateId);
  const selectedSet = sets.find((s) => s.id === selectedSetId);

  const [showAnswer, setShowAnswer] = useState(false);

  /* 줌 상태 — 'fit' = 자동 맞춤 / 숫자 = 수동 지정 */
  const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit');
  const [manualZoom, setManualZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(() => {
    if (!selectedSet) return '';
    return generateSetHTML(selectedSet, selectedTemplateId ?? undefined, showAnswer);
  }, [selectedSet, selectedTemplateId, showAnswer]);

  /* iframe 내용 갱신 */
  useEffect(() => {
    if (!iframeRef.current || !html) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  /* 컨테이너 폭+높이에 맞춰 fit 스케일 자동 산출 */
  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const el = containerRef.current!;
      /* padding 32px (좌우/상하) + 약간의 여유 */
      const w = el.clientWidth - 32;
      const h = el.clientHeight - 32;
      const a4w = A4_WIDTH_MM * MM_TO_PX;
      const a4h = A4_HEIGHT_MM * MM_TO_PX;
      const sx = w / a4w;
      const sy = h / a4h;
      /* 폭과 높이 모두에 맞춰 — 전체 페이지가 다 보이게 */
      setFitScale(Math.max(0.1, Math.min(sx, sy)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (!selectedSet) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center gap-1.5 px-3 h-11 border-b border-gray-200 bg-white flex-shrink-0">
          <Eye size={13} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600">A4 1페이지 미리보기</span>
        </div>
        <EmptySetHero onCreateNew={onCreateNew} />
      </div>
    );
  }

  const completion = getSlotCompletionCount(selectedSet);
  const effectiveScale = zoomMode === 'fit' ? fitScale : manualZoom;

  const setManual = (next: number) => {
    const clamped = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, next));
    setManualZoom(Number(clamped.toFixed(2)));
    setZoomMode('manual');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 h-11 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Eye size={13} className="text-purple-600" />
          <span className="text-xs font-bold text-gray-800 truncate">{selectedSet.title}</span>
          <span className={`text-[10px] flex-shrink-0 px-1.5 py-0.5 rounded ${
            completion === 8 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {completion}/8
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className={`btn !py-1 !px-2 !text-[11px] ${showAnswer ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAnswer(!showAnswer)}
            title="정답 표시 토글"
          >
            {showAnswer ? <Eye size={11} /> : <EyeOff size={11} />}
            {showAnswer ? '정답 ON' : '정답 OFF'}
          </button>
          <button
            className="btn !py-1 !px-2 !text-[11px] btn-secondary"
            onClick={() => onEditSet(selectedSet.id)}
          >
            <Pencil size={11} /> 편집
          </button>
        </div>
      </div>

      {/* 줌 컨트롤 */}
      <div className="flex items-center justify-center gap-2 px-3 h-9 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <button
          className={`btn !py-0.5 !px-2 !text-[10px] ${zoomMode === 'fit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setZoomMode('fit')}
          title="화면에 맞춤"
        >
          <Maximize2 size={10} /> 맞춤
        </button>
        <div className="w-px h-4 bg-gray-300" />
        <button
          className="btn btn-ghost !py-0.5 !px-1.5 !text-[10px]"
          onClick={() => setManual(effectiveScale - ZOOM_STEP)}
          disabled={effectiveScale <= ZOOM_MIN}
          title="축소"
        >
          <Minus size={10} />
        </button>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={ZOOM_STEP}
          value={effectiveScale}
          onChange={(e) => setManual(parseFloat(e.target.value))}
          className="w-32 accent-purple-600"
          title="확대/축소"
        />
        <button
          className="btn btn-ghost !py-0.5 !px-1.5 !text-[10px]"
          onClick={() => setManual(effectiveScale + ZOOM_STEP)}
          disabled={effectiveScale >= ZOOM_MAX}
          title="확대"
        >
          <Plus size={10} />
        </button>
        <span
          className="text-[10px] text-gray-700 font-mono w-12 text-right cursor-pointer hover:text-purple-600"
          onClick={() => setManual(1)}
          title="100%로 재설정 (클릭)"
        >
          {Math.round(effectiveScale * 100)}%
        </span>
      </div>

      {/* A4 iframe 미리보기 — 컨테이너에 맞춰 비례 축소 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-200 p-4"
      >
        {/* 스케일된 페이지의 실제 점유 공간을 잡아주는 외곽 박스 */}
        <div
          style={{
            width: `${A4_WIDTH_MM * MM_TO_PX * effectiveScale}px`,
            height: `${A4_HEIGHT_MM * MM_TO_PX * effectiveScale}px`,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <iframe
              ref={iframeRef}
              title="A4 미리보기"
              className="w-full h-full border-0 block"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* 푸터 안내 */}
      <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-400 text-center flex-shrink-0">
        실제 PDF 출력 시 동일하게 A4 한 페이지로 출력됩니다 ·
        {zoomMode === 'fit' ? ' 자동 맞춤' : ' 수동 줌'} {Math.round(effectiveScale * 100)}%
      </div>
    </div>
  );
}
