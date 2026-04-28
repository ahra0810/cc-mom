/**
 * SetCenterPanel — A4 1페이지 실제 미리보기 (iframe).
 *
 * setPdfService.generateSetHTML 결과를 iframe srcdoc으로 렌더하고,
 * 컨테이너에 transform: scale(...)로 화면 폭에 맞춰 비례 축소.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Pencil } from 'lucide-react';
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

export default function SetCenterPanel({ onCreateNew, onEditSet }: Props) {
  const selectedSetId = useSetStore((s) => s.selectedSetId);
  const sets = useSetStore((s) => s.sets);
  const selectedSet = sets.find((s) => s.id === selectedSetId);

  const [showAnswer, setShowAnswer] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(() => {
    if (!selectedSet) return '';
    return generateSetHTML(selectedSet, undefined, showAnswer);
  }, [selectedSet, showAnswer]);

  /* iframe 내용 갱신 */
  useEffect(() => {
    if (!iframeRef.current || !html) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  /* 컨테이너 폭에 맞춰 scale 자동 조정 */
  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const w = containerRef.current!.clientWidth - 32; /* padding 양옆 16px */
      const h = containerRef.current!.clientHeight - 32;
      const mmToPx = 3.78; /* 96dpi 기준 */
      const a4w = A4_WIDTH_MM * mmToPx;
      const a4h = A4_HEIGHT_MM * mmToPx;
      const sx = w / a4w;
      const sy = h / a4h;
      setScale(Math.min(sx, sy, 1.2));
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

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 h-11 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Eye size={13} className="text-purple-600" />
          <span className="text-xs font-bold text-gray-800 truncate">{selectedSet.title}</span>
          <span className={`text-[10px] flex-shrink-0 px-1.5 py-0.5 rounded ${
            completion === 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {completion}/7
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

      {/* A4 iframe 미리보기 — 컨테이너 폭에 맞춰 비례 축소 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-4"
      >
        <div
          style={{
            width: `${A4_WIDTH_MM}mm`,
            height: `${A4_HEIGHT_MM}mm`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
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

      {/* 푸터 안내 */}
      <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-[10px] text-gray-400 text-center flex-shrink-0">
        실제 PDF 출력 시 동일하게 A4 한 페이지로 출력됩니다 · 축소율 {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
