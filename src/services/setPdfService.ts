/**
 * setPdfService — 사자성어 set의 A4 1페이지 PDF HTML 렌더러.
 *
 * 핵심:
 *  - 1 set = 정확히 A4 한 장 (`.page { height: 273mm; overflow: hidden }`)
 *  - 자동 폰트 축소 — 컨텐츠 길이에 따라 11pt → 10pt → 9.5pt
 *  - 1번(hanja-writing): 한자 4자 박스에 옅은 회색 글자 + 한글음 답란
 *  - 2~6번: 4지선다 2-col 그리드
 *  - 7번: 5줄 작성 영역
 */
import type { Question } from '../types';
import type { QuestionSet, IdiomMeta } from '../types/sets';
import { getSetTemplate, type SetTemplate } from './setPdfTemplates';

const FONT_IMPORTS = `
@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&family=Noto+Serif+KR:wght@400;500;600;700;800&display=swap');
`;

/* ─── HTML escape ─── */
function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/* ─── 자동 폰트 축소 — 컨텐츠 길이 + 옵션 최댓값 ─── */
/**
 * 휴리스틱:
 *   - 총 글자수가 임계값을 넘으면 폰트를 한 단계 줄임
 *   - 객관식 옵션 중 가장 긴 것이 26자 이상이면 한 단계 더 줄임 (가로 2-col fit)
 *   - 7번 모범답안이 길어도 .writing-lines가 flex로 흡수하므로 큰 영향 X
 *   - 절대 9pt 미만으로 내려가지 않음
 */
function pickFontSize(set: QuestionSet, base: number): number {
  let totalChars = 0;
  let maxOptionLen = 0;
  for (const q of set.slots) {
    totalChars += (q.question || '').length;
    totalChars += (q.options || []).join('').length;
    totalChars += (q.answer || '').length;
    for (const o of q.options || []) {
      if (o.length > maxOptionLen) maxOptionLen = o.length;
    }
  }
  let fs = base;
  if (totalChars >= 1100) fs -= 1.5;
  else if (totalChars >= 750) fs -= 1.0;
  else if (totalChars >= 550) fs -= 0.5;

  /* 옵션이 너무 길면 한 단계 더 축소 */
  if (maxOptionLen >= 30) fs -= 1.0;
  else if (maxOptionLen >= 24) fs -= 0.5;

  /* 9pt 하한 */
  return Math.max(fs, 9);
}

/* ─── 메타 박스 — metaStyle 분기 ─── */
function renderMetaBlock(meta: IdiomMeta, t: SetTemplate): string {
  const hanjaChars = [...(meta.hanja || '')].slice(0, 4);
  while (hanjaChars.length < 4) hanjaChars.push('');

  if (t.metaStyle === 'hanja-emphasis') {
    /* 한자 4자를 큰 가로 박스로 — 서예 풍 */
    return `<div class="meta-block meta-hanja-emphasis">
      <div class="meta-hanja-row">
        ${hanjaChars.map((c) => `<div class="meta-hanja-cell">${esc(c)}</div>`).join('')}
      </div>
      <div class="meta-hanja-foot">
        <span class="meta-idiom">${esc(meta.idiom)}</span>
        <span class="meta-meaning">${esc(meta.meaning)}</span>
        ${meta.origin ? `<span class="meta-origin">· ${esc(meta.origin)}</span>` : ''}
      </div>
    </div>`;
  }

  if (t.metaStyle === 'big-friendly') {
    /* 저학년 친화 — 둥근 카드 + 별 장식 */
    return `<div class="meta-block meta-big-friendly">
      <div class="meta-friendly-star">★</div>
      <div class="meta-hanja">${esc(meta.hanja)}</div>
      <div class="meta-idiom">${esc(meta.idiom)}</div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.origin ? `<div class="meta-origin">출전: ${esc(meta.origin)}</div>` : ''}
    </div>`;
  }

  /* classic (기본) */
  return `<div class="meta-block meta-classic">
    <div class="meta-hanja">${esc(meta.hanja)}</div>
    <div class="meta-idiom">${esc(meta.idiom)}</div>
    <div class="meta-meaning">${esc(meta.meaning)}</div>
    ${meta.origin ? `<div class="meta-origin">출전: ${esc(meta.origin)}</div>` : ''}
  </div>`;
}

/* ─── 슬롯 1: hanja-writing ─── */
function renderSlot1(q: Question, idx: number, showAnswer: boolean): string {
  const hanja = q.hanjaTrace || '';
  const hanjaChars = [...hanja].slice(0, 4);
  while (hanjaChars.length < 4) hanjaChars.push('');

  let h = `<div class="q slot-1">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += `<p class="q-text">${esc(q.question)}</p>`;

  /* 한자 따라쓰기 박스 4개 */
  h += `<div class="hanja-tracing-row">`;
  for (const ch of hanjaChars) {
    h += `<div class="hanja-tracing-box">${esc(ch)}</div>`;
  }
  h += `</div>`;

  /* 한글음 답란 */
  h += `<div class="answer-row">`;
  h += `<span class="answer-label">한글음:</span>`;
  if (showAnswer) {
    h += `<span class="answer-filled">${esc(q.answer || '')}</span>`;
  } else {
    h += `<span class="answer-line"></span>`;
  }
  h += `</div>`;

  if (showAnswer && q.explanation) {
    h += `<div class="explain"><span class="explain-label">해설</span>${esc(q.explanation)}</div>`;
  }

  h += `</div></div>`;
  return h;
}

/* ─── 슬롯 2~6: multiple-choice ─── */
function renderMcSlot(q: Question, idx: number, showAnswer: boolean): string {
  let h = `<div class="q slot-mc">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += `<p class="q-text">${esc(q.question)}</p>`;

  if (q.options && q.options.length > 0) {
    const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];
    h += `<div class="opts">`;
    q.options.forEach((opt, i) => {
      const isAnswer = showAnswer && opt === q.answer;
      h += `<div${isAnswer ? ' class="correct"' : ''}>${labels[i]} ${esc(opt)}</div>`;
    });
    h += `</div>`;
  }

  if (showAnswer && q.explanation) {
    h += `<div class="explain"><span class="explain-label">해설</span>${esc(q.explanation)}</div>`;
  }

  h += `</div></div>`;
  return h;
}

/* ─── 슬롯 8: sentence-making (마지막 슬롯) ─── */
function renderSlot8(q: Question, idx: number, showAnswer: boolean): string {
  let h = `<div class="q slot-last">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += `<p class="q-text">${esc(q.question)}</p>`;

  if (showAnswer && q.answer) {
    h += `<div class="answer-box">예시 답안: ${esc(q.answer)}</div>`;
  } else {
    h += `<div class="writing-lines"></div>`;
  }

  if (showAnswer && q.explanation) {
    h += `<div class="explain"><span class="explain-label">해설</span>${esc(q.explanation)}</div>`;
  }

  h += `</div></div>`;
  return h;
}

/* ─── 메인 HTML 생성 ─── */
export function generateSetHTML(set: QuestionSet, templateId: string | undefined, showAnswer: boolean): string {
  const t = getSetTemplate(templateId);
  const baseFs = pickFontSize(set, t.baseFontSize);
  const meta = set.meta as IdiomMeta;

  const css = `
${FONT_IMPORTS}
@page { size: A4 portrait; margin: 12mm 14mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  font-family: ${t.fontStack};
  color: ${t.textColor};
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  word-break: keep-all; overflow-wrap: break-word;
}
body { font-size: ${baseFs}pt; line-height: 1.6; }
.page {
  width: 182mm; height: 273mm;
  margin: 0 auto;
  display: flex; flex-direction: column;
  page-break-after: always;
  overflow: hidden;
  background: white;
}

/* ─── Header — 이름 칸만 우상단에 (이중선/구분선 없음) ─── */
.header {
  display: flex; justify-content: flex-end; align-items: center;
  padding: 0; margin-bottom: 5mm;
  flex-shrink: 0;
}
.header-name {
  font-size: ${baseFs}pt; color: ${t.textColor}; font-weight: 700;
  display: inline-flex; align-items: flex-end; gap: 3mm;
}
.header-name .blank {
  display: inline-block; min-width: 70mm;
  border-bottom: 1.5px solid ${t.textColor}; /* 한 줄만 */
  height: 12mm; /* 1.2cm 기록 공간 */
}
.answer-banner { text-align: center; font-weight: 800; color: ${t.primaryColor}; border: 1.5px solid ${t.primaryColor}; padding: 2mm 0; margin-bottom: 4mm; letter-spacing: 4px; background: ${t.bgAccent}; flex-shrink: 0; }

/* ─── Meta block ─── */
.meta-block { border: 1.5px solid ${t.accentColor}; border-radius: 4px; padding: 4mm 6mm; margin-bottom: 4mm; background: ${t.bgAccent}66; flex-shrink: 0; text-align: center; }
.meta-hanja { font-family: 'Noto Serif KR', serif; font-size: ${baseFs + 8}pt; font-weight: 700; letter-spacing: 4mm; padding-left: 4mm; color: ${t.primaryColor}; line-height: 1.2; }
.meta-idiom { font-size: ${baseFs + 1}pt; font-weight: 700; color: ${t.textColor}; margin-top: 2mm; }
.meta-meaning { font-size: ${baseFs - 0.5}pt; color: ${t.textColor}cc; margin-top: 1mm; }
.meta-origin { font-size: ${baseFs - 1.5}pt; color: ${t.textColor}99; margin-top: 1mm; font-style: italic; }

/* ─── Meta: hanja-emphasis ─── */
.meta-hanja-emphasis { background: ${t.bgAccent}; border: 2px solid ${t.primaryColor}; border-radius: 2px; padding: 4mm 6mm; }
.meta-hanja-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; }
.meta-hanja-cell {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 16}pt;
  font-weight: 700;
  color: ${t.primaryColor};
  background: white;
  border: 1.5px solid ${t.primaryColor}55;
  aspect-ratio: 1.2;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}
.meta-hanja-foot { margin-top: 3mm; padding-top: 2mm; border-top: 1px solid ${t.accentColor}; font-size: ${baseFs - 0.5}pt; line-height: 1.5; }
.meta-hanja-foot .meta-idiom { display: inline; margin: 0 2mm 0 0; font-size: ${baseFs}pt; font-weight: 700; color: ${t.primaryColor}; }
.meta-hanja-foot .meta-meaning { display: inline; margin: 0; font-size: ${baseFs - 0.5}pt; color: ${t.textColor}cc; }
.meta-hanja-foot .meta-origin { display: inline; margin: 0 0 0 2mm; font-size: ${baseFs - 1.5}pt; color: ${t.textColor}99; font-style: italic; }

/* ─── Meta: big-friendly ─── */
.meta-big-friendly { background: ${t.bgAccent}; border: 2.5px solid ${t.accentColor}; border-radius: 14px; padding: 5mm 6mm; position: relative; }
.meta-friendly-star { position: absolute; top: 2mm; right: 4mm; font-size: ${baseFs + 4}pt; color: ${t.primaryColor}; }
.meta-big-friendly .meta-hanja { font-size: ${baseFs + 10}pt; }
.meta-big-friendly .meta-idiom { font-size: ${baseFs + 2}pt; }
.meta-big-friendly .meta-meaning { font-size: ${baseFs}pt; }

/* ─── Set body — 8문항 + 자동 균등 분배 ─── */
.set {
  display: flex; flex-direction: column;
  flex: 1 1 auto; min-height: 0;
  /* 모든 슬롯 사이의 여유 공간을 자동 균등 분배 — 각 문항 사이 간격 최대화 */
  justify-content: space-between;
  gap: 2mm; /* 최소 간격 보장 (overflow 방지) */
}
.q { display: flex; gap: 3mm; page-break-inside: avoid; flex: 0 0 auto; }
.q-num { flex-shrink: 0; width: 7mm; font-size: ${baseFs}pt; font-weight: 800; color: ${t.primaryColor}; padding-top: 0.5mm; }
.q-body { flex: 1; min-width: 0; }
.q-text { font-size: ${baseFs}pt; font-weight: 600; line-height: 1.5; margin-bottom: 1.5mm; white-space: pre-wrap; }

/* ─── 1번: 한자 따라쓰기 ─── */
.hanja-tracing-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin: 3mm 0 6mm 0; max-width: 90mm; }
.hanja-tracing-box {
  border: 1.5px solid ${t.textColor}66;
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: ${baseFs + 12}pt;
  color: ${t.textColor}33;
  font-family: 'Noto Serif KR', serif;
}
/* 한글음 답란 — 한자 박스와 충분한 간격 + 줄도 더 두툼하게 */
.answer-row { display: flex; align-items: baseline; gap: 2mm; margin-top: 6mm; padding-top: 2mm; font-size: ${baseFs - 0.5}pt; }
.answer-label { font-weight: 700; color: ${t.primaryColor}; }
.answer-line { display: inline-block; flex: 1; min-width: 60mm; border-bottom: 1.5px solid ${t.textColor}aa; height: 8mm; }
.answer-filled { font-weight: 700; color: ${t.primaryColor}; border-bottom: 1.5px solid ${t.primaryColor}; padding-bottom: 1px; min-width: 30mm; display: inline-block; }

/* ─── 2~7번: 객관식 ─── */
.opts { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5mm 6mm; padding-left: 1mm; font-size: ${baseFs - 0.5}pt; line-height: 1.45; }
.opts > div { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.opts .correct { font-weight: 800; color: ${t.primaryColor}; }

/* ─── 8번: 작성 영역 — 1.3cm 줄 간격, 정확히 2줄 ─── */
.writing-lines {
  height: 26mm; /* 1.3cm × 2줄 */
  margin: 2mm 0 0 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(13mm - 0.4mm),
    ${t.textColor}88 calc(13mm - 0.4mm),
    ${t.textColor}88 13mm
  );
  background-size: 100% 13mm;
  background-repeat: repeat-y;
}
.answer-box { display: inline-block; font-size: ${baseFs - 1}pt; font-weight: 700; color: ${t.primaryColor}; border-bottom: 1.5px solid ${t.primaryColor}; padding-bottom: 1px; }

/* ─── Explanation ─── */
.explain { margin-top: 1.5mm; font-size: ${baseFs - 1.5}pt; color: ${t.textColor}cc; line-height: 1.5; padding: 1mm 2mm; background: ${t.bgAccent}; border-left: 2px solid ${t.accentColor}; }
.explain-label { font-weight: 800; color: ${t.primaryColor}; margin-right: 2mm; }
`;

  let html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${esc(set.title)}</title><style>${css}</style></head><body><div class="page">`;

  /* Header — 시험지명 제거, 이름 칸만 우상단 / 답안지일 때는 정중앙 배너 */
  if (showAnswer) {
    html += `<div class="answer-banner">답안 및 해설</div>`;
  } else {
    html += `<div class="header"><div class="header-name">이름 <span class="blank"></span></div></div>`;
  }

  /* Meta block */
  html += renderMetaBlock(meta, t);

  /* 8 slots */
  html += `<div class="set">`;
  set.slots.forEach((q, idx) => {
    if (idx === 0) html += renderSlot1(q, idx, showAnswer);
    else if (idx === 7) html += renderSlot8(q, idx, showAnswer);
    else html += renderMcSlot(q, idx, showAnswer);
  });
  html += `</div>`;

  html += `</div></body></html>`;
  return html;
}

/* ─── PDF 출력 (인쇄 다이얼로그) ─── */
export function exportSetToPDF(set: QuestionSet, templateId?: string): void {
  const html = generateSetHTML(set, templateId, false);
  openPrintWindow(html);
}

export function exportSetAnswerKeyToPDF(set: QuestionSet, templateId?: string): void {
  const html = generateSetHTML(set, templateId, true);
  openPrintWindow(html);
}

function openPrintWindow(html: string): void {
  const win = window.open('', '_blank');
  if (!win) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}
