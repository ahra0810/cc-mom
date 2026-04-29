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

/* ─── 자동 폰트 축소 — 컨텐츠 길이 + 옵션 길이 + 1단/2단 영향 ─── */
/**
 * 휴리스틱:
 *   - 총 글자수가 많으면 한 단계씩 축소
 *   - 옵션이 18자 이상이면 1단 그리드(=세로 4줄) 진입 — 한 단계 더 축소
 *   - 1단 옵션이 한 줄 폭(약 70자)을 넘어 줄바꿈하면 한 단계 더 축소
 *   - 9pt 하한
 */
function pickFontSize(set: QuestionSet, base: number): number {
  let totalChars = 0;
  let maxOptionLen = 0;
  let oneColMcCount = 0;
  let wrappedOptionCount = 0;
  let contextChars = 0;     /* \n\n 뒤 부속(뜻·대화·지문) — q-context 박스로 별도 렌더 */
  let contextSlotCount = 0; /* 부속 박스가 있는 슬롯 수 */

  for (const q of set.slots) {
    const qText = q.question || '';
    const idxNN = qText.indexOf('\n\n');
    if (idxNN !== -1) {
      totalChars += idxNN;
      const ctx = qText.slice(idxNN + 2);
      contextChars += ctx.length;
      contextSlotCount++;
    } else {
      totalChars += qText.length;
    }
    totalChars += (q.options || []).join('').length;
    totalChars += (q.answer || '').length;
    if (q.type === 'multiple-choice' && q.options) {
      const localMax = Math.max(0, ...q.options.map((o) => o.length));
      if (localMax > maxOptionLen) maxOptionLen = localMax;
      if (localMax >= 18) oneColMcCount++;
      for (const o of q.options) if (o.length >= 35) wrappedOptionCount++;
    }
  }

  let fs = base;
  /* 본문 글자수 기반 — q-context 글자도 합산 (회색 박스도 세로 공간 차지) */
  const allChars = totalChars + contextChars;
  if (allChars >= 1300) fs -= 1.5;
  else if (allChars >= 950) fs -= 1.0;
  else if (allChars >= 700) fs -= 0.5;

  /* 1단으로 펼치는 객관식이 많을수록 세로 공간 압박 → 추가 축소 */
  if (oneColMcCount >= 4) fs -= 1.0;
  else if (oneColMcCount >= 2) fs -= 0.5;

  /* 줄바꿈할 만큼 긴 옵션이 여럿 */
  if (wrappedOptionCount >= 3) fs -= 0.5;

  /* q-context 박스가 여러 개거나 본문이 긴 경우 추가 축소 */
  if (contextSlotCount >= 2 || contextChars >= 60) fs -= 0.5;

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

  if (t.metaStyle === 'quiz-banner') {
    /* 퀴즈 배너 — 민트 리본 + [큰 한글 | 한자] + 뜻풀이.
     * 한자 따라쓰기는 1번 슬롯에 이미 있으므로 메타에는 참고용으로 한 줄만. */
    return `<div class="meta-block meta-quiz-banner">
      <div class="qb-ribbon">퀴즈로 배워나가는 사자성어</div>
      <div class="qb-title-row">
        <span class="qb-title">${esc(meta.idiom)}</span>
        <span class="qb-title-hanja">${esc(meta.hanja)}</span>
      </div>
      <div class="qb-meaning-row">
        <span class="qb-meaning-label">뜻풀이</span>
        <span class="qb-meaning-text">${esc(meta.meaning)}</span>
        ${meta.origin ? ` <span class="qb-origin">· ${esc(meta.origin)}</span>` : ''}
      </div>
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

/* 질문 텍스트가 "주문장\n\n부속(뜻/대화/지문)" 형태이면 분리.
 * 부속은 .q-context 박스로 분리 렌더해 큰 \n\n 빈 줄 여백 제거 + 시각 구분. */
function splitQuestion(text: string): { main: string; context: string } {
  if (!text) return { main: '', context: '' };
  const idx = text.indexOf('\n\n');
  if (idx === -1) return { main: text, context: '' };
  return { main: text.slice(0, idx).trim(), context: text.slice(idx + 2).trim() };
}

function renderQuestionText(q: Question): string {
  const { main, context } = splitQuestion(q.question);
  let h = `<p class="q-text">${esc(main)}</p>`;
  if (context) h += `<div class="q-context">${esc(context)}</div>`;
  return h;
}

/* ─── 슬롯 1: hanja-writing — [한자 박스 | 한글음 칸] 2단 ─── */
function renderSlot1(q: Question, idx: number, showAnswer: boolean): string {
  const hanja = q.hanjaTrace || '';
  const hanjaChars = [...hanja].slice(0, 4);
  while (hanjaChars.length < 4) hanjaChars.push('');

  let h = `<div class="q slot-1">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += renderQuestionText(q);

  /* 좌: 한자 4박스 / 우: 한글음 답란 */
  h += `<div class="slot1-grid">`;
  h += `<div class="hanja-tracing-row">`;
  for (const ch of hanjaChars) {
    h += `<div class="hanja-tracing-box">${esc(ch)}</div>`;
  }
  h += `</div>`;

  h += `<div class="answer-row">`;
  h += `<span class="answer-label">한글음</span>`;
  if (showAnswer) {
    h += `<span class="answer-filled">${esc(q.answer || '')}</span>`;
  } else {
    h += `<span class="answer-line"></span>`;
  }
  h += `</div>`;
  h += `</div>`; /* /slot1-grid */

  /* 인라인 해설은 답안지에서 제거 — 페이지 하단의 컴팩트 해설 그리드로 통합. */

  h += `</div></div>`;
  return h;
}

/* ─── 슬롯 2~7: multiple-choice ───
 * 선지 길이에 따라 자동으로 1단/2단 그리드 결정 + 줄바꿈 허용.
 * - 어떤 선지든 18자 이상이면 1단 (한 선지가 한 줄을 다 차지)
 * - 그 외엔 2단 (간격 절약)
 * 절대 truncate 하지 않음 (`white-space: normal`).
 */
function renderMcSlot(q: Question, idx: number, showAnswer: boolean): string {
  let h = `<div class="q slot-mc">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += renderQuestionText(q);

  if (q.options && q.options.length > 0) {
    const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];
    const maxLen = Math.max(...q.options.map((o) => o.length));
    /* 18자 이상이면 1단으로 — 잘림/숨김 방지 */
    const oneCol = maxLen >= 18;
    h += `<div class="opts ${oneCol ? 'opts-1col' : 'opts-2col'}">`;
    q.options.forEach((opt, i) => {
      const isAnswer = showAnswer && opt === q.answer;
      h += `<div${isAnswer ? ' class="correct"' : ''}>${labels[i]} ${esc(opt)}</div>`;
    });
    h += `</div>`;
  }

  /* 인라인 해설은 답안지에서 제거 — 페이지 하단의 컴팩트 해설 그리드로 통합. */

  h += `</div></div>`;
  return h;
}

/* ─── 슬롯 8: sentence-making (마지막 슬롯) ─── */
function renderSlot8(q: Question, idx: number, showAnswer: boolean): string {
  let h = `<div class="q slot-last">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += renderQuestionText(q);

  if (showAnswer && q.answer) {
    h += `<div class="answer-box">예시 답안: ${esc(q.answer)}</div>`;
  } else {
    h += `<div class="writing-lines"></div>`;
  }

  /* 인라인 해설은 답안지에서 제거 — 페이지 하단의 컴팩트 해설 그리드로 통합. */

  h += `</div></div>`;
  return h;
}

/* ─── 답안지 하단 해설 그리드 — 시험지 정답 매칭용 컴팩트 양식 ─── */
function renderAnswerExplanations(set: QuestionSet): string {
  const items: string[] = [];
  set.slots.forEach((q, idx) => {
    if (!q.explanation) return;
    /* 객관식이면 정답 보기 번호 함께 표시 (① ~ ④) */
    let answerMark = '';
    if (q.type === 'multiple-choice' && q.options) {
      const ai = q.options.indexOf(q.answer);
      if (ai >= 0) answerMark = ['\u2460', '\u2461', '\u2462', '\u2463'][ai] + ' ';
    }
    items.push(
      `<div class="ax-item">
        <span class="ax-num">${idx + 1}</span>
        <span class="ax-body">
          ${answerMark ? `<span class="ax-answer">${answerMark}</span>` : ''}<span class="ax-text">${esc(q.explanation)}</span>
        </span>
      </div>`
    );
  });
  if (items.length === 0) return '';
  return `<div class="answer-explanations">
    <div class="ax-title">해설</div>
    <div class="ax-grid">${items.join('')}</div>
  </div>`;
}

/* ─── 메인 HTML 생성 ───
 * forPrint=true 일 때만 "머리글/바닥글 끄기" 안내 배너 추가
 * (iframe 미리보기에서는 false로 호출되어 안내 배너가 안 보임). */
export function generateSetHTML(
  set: QuestionSet,
  templateId: string | undefined,
  showAnswer: boolean,
  forPrint = false,
): string {
  const t = getSetTemplate(templateId);
  const baseFs = pickFontSize(set, t.baseFontSize);
  const meta = set.meta as IdiomMeta;

  const css = `
${FONT_IMPORTS}
/* 브라우저 인쇄 머리글/바닥글 영역 자체를 제거하기 위해 page margin = 0
 * (이 영역에 표시되던 날짜·문서 제목·URL·페이지번호가 더 이상 들어갈 자리가 없어짐).
 * 페이지 안전 여백은 .page 의 internal padding 으로 대체.
 * 모든 변(상·하·좌·우)에 14mm 동일 padding 을 적용해 위아래 여백이 시각적으로 같게 보이도록 함. */
@page { size: A4 portrait; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  font-family: ${t.fontStack};
  color: ${t.textColor};
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  word-break: keep-all; overflow-wrap: break-word;
}
body { font-size: ${baseFs}pt; line-height: 1.6; }
.page {
  width: 210mm; height: 297mm;
  padding: 14mm; /* 상·하·좌·우 동일 — 위아래 여백 대칭 */
  margin: 0 auto;
  display: flex; flex-direction: column;
  /* page-break-after 제거 — 단일 페이지 시험지에서 빈 2페이지가 생기는 문제 방지 */
  overflow: hidden;
  background: white;
}

/* ─── 상단 2단 레이아웃: [메타 카드 | 이름 카드] ─── */
.top-row {
  display: flex; gap: 5mm;
  margin-bottom: 5mm;
  flex-shrink: 0;
  align-items: stretch; /* 두 카드 높이 동일 */
}
.top-row > .meta-block { flex: 1.7 1 0; margin-bottom: 0; }
.top-row > .name-card { flex: 1 1 0; }

/* 답안지일 때만 등장하는 배너 */
.answer-banner { text-align: center; font-weight: 800; color: ${t.primaryColor}; border: 1.5px solid ${t.primaryColor}; padding: 2mm 0; margin-bottom: 4mm; letter-spacing: 4px; background: ${t.bgAccent}; flex-shrink: 0; }

/* ─── Name card (우측) — 메타 카드와 동일 톤·테두리 ─── */
.name-card {
  border: 1.5px solid ${t.accentColor}; border-radius: 4px;
  background: ${t.bgAccent}66;
  padding: 4mm 5mm;
  display: flex; flex-direction: column; justify-content: center;
}
.name-card-row {
  display: flex; align-items: flex-end; gap: 3mm;
  font-size: ${baseFs}pt; font-weight: 700; color: ${t.textColor};
}
.name-card-row .label { flex-shrink: 0; padding-bottom: 0.5mm; }
.name-card-row .blank {
  flex: 1 1 auto;
  border-bottom: 1.5px solid ${t.textColor};
  height: 11mm; /* 약 1.1cm 기록 공간 */
}

/* ─── Answer key card (우측, 답안지 전용) ─── */
.answer-key-card {
  border: 1.5px solid ${t.primaryColor};
  border-radius: 4px;
  background: ${t.bgAccent};
  padding: 4mm 5mm;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center;
  gap: 1mm;
}
.ak-label {
  font-size: ${baseFs + 1}pt;
  font-weight: 800;
  color: ${t.primaryColor};
  letter-spacing: 4px;
}
.ak-meta {
  font-size: ${baseFs - 2}pt;
  color: ${t.textColor}99;
  font-weight: 600;
  letter-spacing: 0.3mm;
}

/* ─── Meta block (좌측 / 답안지에서는 풀폭) ─── */
.meta-block { border: 1.5px solid ${t.accentColor}; border-radius: 4px; padding: 4mm 6mm; background: ${t.bgAccent}66; flex-shrink: 0; text-align: center; margin-bottom: 5mm; }
.meta-hanja { font-family: 'Noto Serif KR', serif; font-size: ${baseFs + 8}pt; font-weight: 700; letter-spacing: 3mm; padding-left: 3mm; color: ${t.primaryColor}; line-height: 1.2; }
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

/* ─── Meta: quiz-banner — 민트 리본 + [한글 + 한자] + 뜻풀이 (컴팩트) ─── */
.meta-quiz-banner {
  background: white;
  border: none;
  border-radius: 0;
  padding: 1mm 2mm;
  margin-bottom: 0;
  text-align: center;
}
.qb-ribbon {
  display: inline-block;
  background: ${t.accentColor};
  color: ${t.primaryColor};
  font-weight: 800;
  font-size: ${baseFs - 1}pt;
  letter-spacing: 1mm;
  padding: 1mm 5mm;
  border-radius: 1.5mm;
  margin-bottom: 1.5mm;
}
.qb-title-row {
  display: flex; align-items: baseline; justify-content: center; gap: 4mm;
  margin: 0.5mm 0 2mm 0;
  line-height: 1;
}
.qb-title {
  font-size: ${baseFs + 13}pt;
  font-weight: 900;
  color: ${t.textColor};
  letter-spacing: 1.5mm;
}
.qb-title-hanja {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 4}pt;
  font-weight: 700;
  color: ${t.primaryColor};
  letter-spacing: 1mm;
  border-left: 2px solid ${t.accentColor};
  padding-left: 3mm;
}
.qb-meaning-row {
  padding: 1.2mm 3mm;
  background: #FEF3C7;       /* 노란 하이라이트 */
  border-radius: 1mm;
  font-size: ${baseFs - 0.5}pt;
  text-align: left;
  display: inline-block;
  max-width: 100%;
}
.qb-meaning-label {
  display: inline-block;
  background: ${t.primaryColor};
  color: white;
  font-weight: 800;
  padding: 0.3mm 2mm;
  border-radius: 1mm;
  margin-right: 2mm;
  font-size: ${baseFs - 1}pt;
  letter-spacing: 0.5mm;
}
.qb-meaning-text { color: ${t.textColor}; font-weight: 600; }
.qb-origin { color: ${t.textColor}99; font-style: italic; font-size: ${baseFs - 1.5}pt; }

/* quiz-banner 템플릿일 때, 본문 .set 외곽에 굵은 프레임 + 코랄 큐오테이션 장식 */
.qb-frame {
  border: 1.8px solid ${t.textColor};
  border-radius: 1.5mm;
  padding: 5mm 5mm 4mm 5mm;
  margin-top: 1mm;
  position: relative;
  flex: 1 1 auto; min-height: 0;
  display: flex; flex-direction: column;
}
.qb-frame::before, .qb-frame::after {
  content: '';
  position: absolute; top: -2mm; width: 6mm; height: 4mm;
  background: #FB923C;       /* 코랄 */
  border-radius: 1mm;
}
.qb-frame::before { left: 6mm; }
.qb-frame::after { right: 6mm; }
.qb-quote {
  position: absolute; top: -1mm;
  font-size: ${baseFs + 14}pt; font-weight: 900;
  color: #FB923C; line-height: 1;
}
.qb-quote.left { left: 14mm; }
.qb-quote.right { right: 14mm; transform: scaleX(-1); }

/* ─── Set body — 8문항 + 자동 균등 분배 ─── */
.set {
  display: flex; flex-direction: column;
  flex: 1 1 auto; min-height: 0;
  /* 모든 슬롯 사이의 여유 공간을 자동 균등 분배 — 각 문항 사이 간격 최대화 */
  justify-content: space-between;
  gap: 2mm; /* 최소 간격 보장 (overflow 방지) */
}
/* 답안지 모드: 슬롯은 자연 크기로 컴팩트하게 위에 쌓고, 해설 그리드가 아래에 자리.
 * 시험지보다 슬롯 간격을 살짝 좁혀 해설 그리드와 페이지 하단 여백을 확보. */
.page.answer-mode .set {
  flex: 0 0 auto;
  justify-content: flex-start;
  gap: 1.8mm;
}
.page.answer-mode .qb-frame { flex: 0 0 auto; padding: 3mm 5mm 3mm 5mm; }
/* 답안지에서 한자 박스는 학생 활동이 끝났으므로 살짝 작아도 됨 */
.page.answer-mode .slot1-grid {
  grid-template-columns: 78mm 1fr;
  gap: 4mm;
  margin: 1mm 0 0 0;
}
.page.answer-mode .hanja-tracing-row { max-width: 78mm; gap: 3mm; }
.page.answer-mode .hanja-tracing-box { font-size: ${baseFs + 9}pt; }
.page.answer-mode .slot1-grid .answer-line { height: 10mm; }
.q { display: flex; gap: 3mm; page-break-inside: avoid; flex: 0 0 auto; }
.q-num { flex-shrink: 0; width: 7mm; font-size: ${baseFs}pt; font-weight: 800; color: ${t.primaryColor}; padding-top: 0.5mm; }
.q-body { flex: 1; min-width: 0; }
.q-text { font-size: ${baseFs}pt; font-weight: 600; line-height: 1.5; margin-bottom: 1mm; white-space: pre-wrap; }

/* 부속 컨텍스트 박스 — 뜻풀이·대화·지문 등을 옅은 회색 박스로 분리.
 * "주문장\n\n부속" 패턴에서 부속이 여기로 빠져 큰 빈 줄 여백을 없앰. */
.q-context {
  background: ${t.textColor}0d;          /* 약 5% alpha */
  border-left: 2px solid ${t.textColor}33;
  border-radius: 2px;
  padding: 1.5mm 3mm;
  margin: 1mm 0 1.5mm 0;
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor}cc;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* ─── 1번 본문: [한자 박스 | 한글음 답란] 2단 그리드 ─── */
.slot1-grid {
  display: grid;
  grid-template-columns: 88mm 1fr;
  gap: 5mm;
  align-items: center;
  margin: 1.5mm 0 0 0;
}
.hanja-tracing-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; max-width: 90mm; }
.hanja-tracing-box {
  border: 1.5px solid ${t.textColor}66;
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: ${baseFs + 12}pt;
  color: ${t.textColor}33;
  font-family: 'Noto Serif KR', serif;
}
/* 한글음 답란 — 1번 그리드 우측 칸. 라벨 위, 줄 아래로 세로 정렬 */
.slot1-grid .answer-row {
  display: flex; flex-direction: column; align-items: stretch;
  gap: 1.5mm;
  font-size: ${baseFs - 0.5}pt;
}
.slot1-grid .answer-label { font-weight: 700; color: ${t.primaryColor}; }
.slot1-grid .answer-line {
  display: block; width: 100%;
  border-bottom: 1.5px solid ${t.textColor}aa;
  height: 14mm; /* 한글 4자 손글씨 여유 */
}
.slot1-grid .answer-filled {
  font-weight: 700; color: ${t.primaryColor};
  border-bottom: 1.5px solid ${t.primaryColor};
  padding-bottom: 1px; min-width: 30mm; display: inline-block;
  font-size: ${baseFs + 1}pt;
}

/* ─── 2~7번: 객관식 — truncate 금지, 줄바꿈 허용, 길이에 따라 1/2단 ─── */
.opts {
  display: grid; gap: 1mm 6mm; padding-left: 1mm;
  font-size: ${baseFs - 0.5}pt; line-height: 1.4;
}
.opts.opts-2col { grid-template-columns: 1fr 1fr; }
.opts.opts-1col { grid-template-columns: 1fr; }
.opts > div {
  white-space: normal;             /* truncate 안 함 */
  overflow-wrap: break-word;
  word-break: keep-all;
  padding-left: 1.5mm;
  text-indent: -1.5mm;             /* 마커(①) 기준선 정렬 */
}
.opts .correct { font-weight: 800; color: ${t.primaryColor}; }

/* ─── 8번: 작성 영역 — 1.3cm 줄 간격, 정확히 2줄 ───
 * 첫 번째 줄 위에도 학생이 손글씨를 쓸 공간이 보장되도록
 * margin-top을 충분히 확보 (질문 텍스트와의 시각적 간격 + 첫 줄 위 쓰기 공간) */
.writing-lines {
  height: 26mm; /* 1.3cm × 2줄 */
  margin: 3.5mm 0 0 0; /* 질문 텍스트와의 분리 */
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

/* ─── Explanation (legacy, 더 이상 인라인 렌더하지 않음) ─── */
.explain { margin-top: 1.5mm; font-size: ${baseFs - 1.5}pt; color: ${t.textColor}cc; line-height: 1.5; padding: 1mm 2mm; background: ${t.bgAccent}; border-left: 2px solid ${t.accentColor}; }
.explain-label { font-weight: 800; color: ${t.primaryColor}; margin-right: 2mm; }

/* ─── 답안지 하단 해설 그리드 — 표준 정답표 양식 (컴팩트) ─── */
.answer-explanations {
  flex-shrink: 0;
  margin-top: 3mm;
  padding-top: 2mm;
  border-top: 1.5px solid ${t.accentColor};
}
.ax-title {
  display: inline-block;
  font-size: ${baseFs - 1}pt;
  font-weight: 800;
  color: ${t.primaryColor};
  letter-spacing: 1mm;
  padding: 0.4mm 2.5mm;
  border-radius: 1mm;
  background: ${t.bgAccent};
  margin-bottom: 1.5mm;
}
.ax-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1mm 5mm;
}
.ax-item {
  display: flex; align-items: baseline; gap: 1.5mm;
  font-size: ${baseFs - 2.5}pt;
  line-height: 1.35;
  color: ${t.textColor}d0;
  break-inside: avoid;
}
.ax-num {
  flex-shrink: 0;
  width: 4mm;
  font-weight: 800;
  color: ${t.primaryColor};
  font-size: ${baseFs - 2}pt;
}
.ax-body { flex: 1; min-width: 0; }
.ax-answer {
  font-weight: 800;
  color: ${t.primaryColor};
  margin-right: 0.8mm;
}
.ax-text { color: ${t.textColor}cc; }

/* ─── 인쇄 시 숨김 안내 배너 ─── */
.print-hint {
  position: fixed; top: 8px; left: 50%; transform: translateX(-50%);
  background: #1f2937; color: #fff;
  padding: 10px 16px; border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px; line-height: 1.5;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  z-index: 9999; max-width: 520px;
}
.print-hint b { color: #fcd34d; }
@media print { .print-hint { display: none !important; } }
`;

  /* title을 비워 브라우저 인쇄 머리글의 "문서 제목" 칸이 비도록 함 */
  let html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title> </title><style>${css}</style></head><body>`;
  if (forPrint) {
    html += `<div class="print-hint">💡 인쇄 시 페이지 상·하단에 날짜/URL이 함께 출력된다면, <b>인쇄 옵션 → "옵션" → "머리글 및 바닥글"</b>을 꺼 주세요.</div>`;
  }
  html += `<div class="page${showAnswer ? ' answer-mode' : ''}">`;

  /* 상단 — 시험지·답안지 모두 동일한 2단 [메타 | 보조] 구조.
   *  - 시험지: 우측은 "이름 ___" 카드
   *  - 답안지: 우측은 "정답 및 해설" 카드 (시각 통일감 + 별도 배너 불필요) */
  html += `<div class="top-row">`;
  html += renderMetaBlock(meta, t);
  if (showAnswer) {
    html += `<div class="answer-key-card">
      <div class="ak-label">답안 및 해설</div>
      <div class="ak-meta">${set.slots.length}문항 · ${esc(set.title)}</div>
    </div>`;
  } else {
    html += `<div class="name-card">
      <div class="name-card-row">
        <span class="label">이름</span>
        <span class="blank"></span>
      </div>
    </div>`;
  }
  html += `</div>`;

  /* 8 slots — quiz-banner 템플릿일 때만 qb-frame(굵은 테두리 + 코랄 큐오테이션)으로 감쌈 */
  const isQuizBanner = t.metaStyle === 'quiz-banner';
  if (isQuizBanner) {
    html += `<div class="qb-frame">`;
    html += `<span class="qb-quote left">&ldquo;</span>`;
    html += `<span class="qb-quote right">&rdquo;</span>`;
  }
  html += `<div class="set">`;
  set.slots.forEach((q, idx) => {
    if (idx === 0) html += renderSlot1(q, idx, showAnswer);
    else if (idx === 7) html += renderSlot8(q, idx, showAnswer);
    else html += renderMcSlot(q, idx, showAnswer);
  });
  html += `</div>`;
  if (isQuizBanner) {
    html += `</div>`;
  }

  /* 답안지 — 페이지 하단의 컴팩트 해설 그리드 (시험지엔 안 들어감) */
  if (showAnswer) {
    html += renderAnswerExplanations(set);
  }

  html += `</div></body></html>`;
  return html;
}

/* ─── PDF 출력 (인쇄 다이얼로그) ─── */
export function exportSetToPDF(set: QuestionSet, templateId?: string): void {
  const html = generateSetHTML(set, templateId, false, true);
  openPrintWindow(html);
}

export function exportSetAnswerKeyToPDF(set: QuestionSet, templateId?: string): void {
  const html = generateSetHTML(set, templateId, true, true);
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
