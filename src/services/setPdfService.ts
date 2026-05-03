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
import type { QuestionSet } from '../types/sets';
import { getSetTemplate } from './setPdfTemplates';
import { getDomain } from '../domains/registry';

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

/* ─── 자동 폰트 축소 — 컨텐츠 길이 + 옵션 길이 + 템플릿 영향 ─── */
/**
 * 휴리스틱:
 *   - 총 글자수가 많으면 한 단계씩 축소
 *   - 옵션이 18자 이상이면 1단 그리드(=세로 4줄) 진입 — 한 단계 더 축소
 *   - 'festive' 메타 박스는 리본·타이틀이 더 커서 추가 축소
 *   - 9pt 하한
 *
 * 페이지 초과 방지가 최우선 — 페이지 fit 안 되면 학습 가치 0.
 */
function pickFontSize(set: QuestionSet, base: number, metaStyle?: string): number {
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

  /* festive 메타 박스는 리본·타이틀·이모지로 일반 메타보다 ~10mm 더 큼 → 한 단계 일찍 축소 */
  if (metaStyle === 'festive') fs -= 0.5;

  return Math.max(fs, 9);
}

/* 메타 박스 렌더는 src/domains/<id>/pdfMeta.ts에서 도메인별로 정의 → registry로 위임. */

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

/* ─── short-answer (예: 속담 빈칸 채우기) ─── */
function renderShortAnswerSlot(q: Question, idx: number, showAnswer: boolean): string {
  let h = `<div class="q slot-short">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += renderQuestionText(q);

  /* 정답 라인 — 시험지에서는 빈 줄, 답안지에서는 정답 채워짐 */
  h += `<div class="answer-row">`;
  h += `<span class="answer-label">정답</span>`;
  if (showAnswer) {
    h += `<span class="answer-filled">${esc(q.answer || '')}</span>`;
  } else {
    h += `<span class="answer-line"></span>`;
  }
  h += `</div>`;

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

/* ─── 답안지 하단 정답 그리드 — 시험지 정답 매칭용 컴팩트 양식 ───
 * 슬롯 유형별 표시:
 *   - hanja-writing: 한글음만 (예: "동문서답")
 *   - multiple-choice: 정답 마커 + 보기 텍스트 (예: "① 묻는 말에 엉뚱하게 답함")
 *   - sentence-making: "예) <모범답안>" 또는 답변이 없으면 생략
 * 해설(explanation) 필드는 표시하지 않음 — 1번처럼 정답을 그대로 풀어 쓰는 경우가 많아
 * 시각적 노이즈만 키움. 필요한 경우 사용자가 직접 해설 표시 토글을 추가하면 됨. */
function renderAnswerExplanations(set: QuestionSet): string {
  const items: string[] = [];
  set.slots.forEach((q, idx) => {
    let display = '';
    if (q.type === 'hanja-writing') {
      if (q.answer) display = q.answer;
    } else if (q.type === 'multiple-choice' && q.options) {
      const ai = q.options.indexOf(q.answer);
      const marker = ai >= 0 ? ['\u2460', '\u2461', '\u2462', '\u2463'][ai] + ' ' : '';
      display = `${marker}${q.answer}`;
    } else if (q.type === 'sentence-making') {
      if (q.answer) display = `예) ${q.answer}`;
    }
    if (!display) return;

    items.push(
      `<div class="ax-item">
        <span class="ax-num">${idx + 1}</span>
        <span class="ax-text">${esc(display)}</span>
      </div>`
    );
  });
  if (items.length === 0) return '';
  return `<div class="answer-explanations">
    <div class="ax-title">정답</div>
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
  const baseFs = pickFontSize(set, t.baseFontSize, t.metaStyle);
  const meta = set.meta;

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
  overflow: hidden;
  background: white;
  position: relative;
}
/* 다중 페이지 시 페이지 사이 강제 분할 */
.page.multi-page { page-break-after: always; }
.page.multi-page:last-child { page-break-after: auto; }
/* 페이지 격려 헤더 — 도메인이 pageHeaders 정의한 경우만 표시 */
.page-encourage {
  display: flex; align-items: center; justify-content: space-between;
  background: #FEF3C7;
  border-left: 3px solid #F59E0B;
  border-radius: 1.5mm;
  padding: 2.5mm 4mm;
  margin-bottom: 4mm;
  flex-shrink: 0;
}
.pe-text {
  font-size: ${baseFs}pt;
  font-weight: 700;
  color: #78350F;
  letter-spacing: 0.2mm;
}
.pe-num {
  font-size: ${baseFs - 2}pt;
  font-weight: 600;
  color: #92400E;
  background: white;
  border: 1px solid #FCD34D;
  border-radius: 1mm;
  padding: 0.2mm 1.5mm;
  flex-shrink: 0;
}

/* ─── 답안지 식별 시그널 (시험지와 한눈에 구분) ───
 * 1) 답안 카드(우상단)가 빨강 톤
 * 2) 하단 정답 그리드 보더·라벨이 빨강
 * 색상은 템플릿과 독립된 universal red — 어떤 템플릿이든 동일한 시그널
 */

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

/* ─── Answer key card (우측, 답안지 전용) — 빨강 톤으로 시험지와 강하게 구분 ─── */
.answer-key-card {
  border: 2px solid #DC2626;
  border-radius: 4px;
  background: #FEF2F2;
  padding: 4mm 5mm;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center;
  gap: 1mm;
  position: relative;
}
.answer-key-card::before {
  content: '✓';
  position: absolute;
  top: 1.5mm; left: 3mm;
  font-size: ${baseFs + 4}pt;
  font-weight: 900;
  color: #DC2626;
  line-height: 1;
}
.ak-label {
  font-size: ${baseFs + 1}pt;
  font-weight: 900;
  color: #B91C1C;
  letter-spacing: 4px;
}
.ak-meta {
  font-size: ${baseFs - 2}pt;
  color: #7F1D1D;
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

/* ─── Festive 공통 (도메인별 컨셉을 발랄·이모지·리본으로 표현) ───
 * 1페이지 fit 보장이 최우선이므로 메타 박스는 컴팩트하게.
 * 리본·타이틀·이모지 사이즈를 일반 메타와 비슷한 수준으로 유지. */
.meta-festive {
  border: 1.5px solid ${t.accentColor};
  border-radius: 3mm;
  padding: 3mm 5mm 2.5mm 5mm;
  background: linear-gradient(135deg, ${t.bgAccent} 0%, white 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.festive-ribbon {
  /* 모든 도메인에서 가독성 보장 — primary 진한 색 위에 흰 글자 */
  display: inline-block;
  background: ${t.primaryColor};
  color: white;
  font-weight: 800;
  font-size: ${baseFs - 1.5}pt;
  padding: 0.8mm 4.5mm;
  border-radius: 4mm;
  margin-bottom: 1.5mm;
  letter-spacing: 0.2mm;
  /* 강조 보더 (액센트 색) */
  box-shadow: 0 0 0 1px ${t.accentColor};
}
.festive-headline {
  margin: 0.5mm 0 1.5mm 0;
  display: flex; align-items: baseline; justify-content: center; gap: 2.5mm;
  flex-wrap: wrap;
  line-height: 1.1;
}
.festive-title {
  font-size: ${baseFs + 6}pt;
  font-weight: 900;
  color: ${t.primaryColor};
  letter-spacing: 1mm;
}
.festive-meaning {
  display: inline-block;
  font-size: ${baseFs - 0.5}pt;
  background: white;
  border: 1px dashed ${t.accentColor};
  border-radius: 1.5mm;
  padding: 0.8mm 3mm;
  margin: 0.5mm 0 0 0;
  text-align: left;
  max-width: 100%;
}
.fm-label {
  display: inline-block;
  background: ${t.primaryColor};
  color: white;
  font-weight: 800;
  border-radius: 1mm;
  padding: 0.1mm 1.5mm;
  margin-right: 1.5mm;
  font-size: ${baseFs - 1.5}pt;
  letter-spacing: 0.2mm;
}
.fm-text { color: ${t.textColor}; font-weight: 600; }
.fm-origin { color: ${t.textColor}99; font-style: italic; font-size: ${baseFs - 1.5}pt; }

/* ─── 사자성어 festive — 한자 4박스 골드 톤 (컴팩트) ─── */
.idiom-festive .if-hanja-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 2mm; max-width: 70mm; margin: 0.5mm auto 1mm auto;
}
.idiom-festive .if-hanja-cell {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 4}pt;
  font-weight: 700;
  color: ${t.primaryColor};
  background: white;
  border: 1.5px solid ${t.accentColor};
  border-radius: 1mm;
  aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}

/* ─── 속담 festive — 큰 따옴표 강조 (컴팩트) ─── */
.proverb-festive .pf-headline { line-height: 1.15; }
.proverb-festive .pf-quote {
  font-size: ${baseFs + 8}pt; font-weight: 900;
  color: ${t.accentColor}; line-height: 1;
  font-family: 'Noto Serif KR', serif;
}
.proverb-festive .pf-title {
  font-family: 'Noto Serif KR', serif;
  letter-spacing: 0.3mm;
  font-size: ${baseFs + 3}pt;
}
.proverb-festive .pf-lesson {
  margin-top: 1mm;
  font-size: ${baseFs - 1.5}pt;
  color: ${t.primaryColor};
  font-weight: 600;
}
.proverb-festive .pf-lesson strong { color: ${t.primaryColor}; }

/* ─── 관용어 festive — 신체 이모지 캐릭터 + 말풍선 (컴팩트) ─── */
.phrase-festive .ipf-headline { gap: 3mm; }
.phrase-festive .ipf-emoji {
  font-size: ${baseFs + 10}pt;
  line-height: 1;
}
.phrase-festive .ipf-title {
  font-size: ${baseFs + 4}pt;
}
.phrase-festive .ipf-example {
  margin-top: 1mm;
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}cc;
  background: white;
  border: 1px solid ${t.accentColor};
  border-radius: 1.5mm 1.5mm 1.5mm 0;
  padding: 0.8mm 2.5mm;
  display: inline-block;
}
.phrase-festive .ipf-example strong { color: ${t.primaryColor}; }

/* ─── 수학 festive — 마법 별 + 시각 예시 박스 (수학은 2페이지라 다소 여유) ─── */
.math-festive .mf-headline { gap: 3mm; }
.math-festive .mf-stars {
  font-size: ${baseFs + 6}pt;
  color: ${t.accentColor};
  line-height: 1;
}
.math-festive .mf-title {
  font-size: ${baseFs + 5}pt;
}
.math-festive .mf-hanja {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 0.5}pt;
  font-weight: 700;
  color: ${t.primaryColor}cc;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.2mm 1.2mm;
}
.math-festive .mf-visual {
  margin-top: 1mm;
  font-size: ${baseFs - 1}pt;
  color: ${t.textColor};
  background: ${t.accentColor}1F;
  border-left: 3px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.8mm 2.5mm;
  text-align: left;
  display: inline-block;
}
.math-festive .mf-visual strong { color: ${t.primaryColor}; font-weight: 800; }
.math-festive .mf-related {
  margin-top: 0.8mm;
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}cc;
}
.math-festive .mf-related strong { color: ${t.primaryColor}; font-weight: 800; }

/* ─── 수학 개념어 도메인 메타 — term + 한자 태그 + 정의 박스 + 시각 예시 + 관련 용어 ─── */
.mc-term-block {
  text-align: center;
  margin-bottom: 2mm;
  display: flex; align-items: baseline; justify-content: center; gap: 3mm;
}
.mc-term-text {
  font-size: ${baseFs + 8}pt;
  font-weight: 900;
  color: ${t.primaryColor};
  letter-spacing: 1mm;
}
.mc-hanja-tag {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 1}pt;
  font-weight: 700;
  color: ${t.primaryColor}cc;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.3mm 1.5mm;
  letter-spacing: 0.3mm;
}
/* 영어 단어 태그 — 한↔영 짝짓기 학습 시각 표시 */
.mc-english-tag {
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: ${baseFs + 0.5}pt;
  font-weight: 700;
  font-style: italic;
  color: ${t.accentColor};
  background: ${t.accentColor}1F;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.3mm 1.8mm;
  letter-spacing: 0.2mm;
}
.mc-eng-origin {
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}cc;
  text-align: center;
  margin-top: 1mm;
  font-style: italic;
}
.mc-eng-origin strong { color: ${t.primaryColor}; font-weight: 800; }
.mc-definition {
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor};
  font-weight: 600;
  text-align: center;
  padding: 1.5mm 3mm;
  background: ${t.bgAccent};
  border-radius: 1mm;
  margin: 1mm 0;
}
.mc-visual {
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}cc;
  text-align: center;
  font-style: italic;
  margin-top: 1mm;
}
.mc-related {
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}99;
  text-align: center;
  margin-top: 0.8mm;
}
.mc-related strong { color: ${t.primaryColor}; font-weight: 800; margin-right: 1mm; }

/* ─── 수학 개념 학습 카드 — 풀폭 메타 박스 (1페이지 메인 콘텐츠) ─── */
.math-concept-card {
  width: 100%;
  box-sizing: border-box;
}
/* 헤더 — 좌측: term+영어+한자 / 우측: 이름 빈칸 (2단) */
.math-concept-card .mcc-header-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3mm;
  align-items: stretch;
  margin-bottom: 2.5mm;
}
.math-concept-card .mcc-header-left,
.math-concept-card .mcc-header-right {
  background: ${t.bgAccent};
  border: 1.2px solid ${t.accentColor}66;
  border-radius: 2mm;
  padding: 2.5mm 3.5mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.math-concept-card .mcc-header-main {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 2.5mm;
}
.math-concept-card .mcc-h-term {
  font-size: ${baseFs + 10}pt;
  font-weight: 900;
  color: ${t.primaryColor};
  letter-spacing: 1.2mm;
}
.math-concept-card .mc-english-tag {
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: ${baseFs + 1.5}pt;
  font-weight: 700;
  font-style: italic;
  color: ${t.accentColor};
  background: ${t.accentColor}1F;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.6mm 2.2mm;
  letter-spacing: 0.2mm;
}
.math-concept-card .mc-hanja-tag {
  font-family: 'Noto Serif KR', serif;
  font-size: ${baseFs + 1}pt;
  font-weight: 700;
  color: ${t.primaryColor}cc;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.5mm 2mm;
  letter-spacing: 0.3mm;
}
.math-concept-card .mcc-h-origin {
  margin-top: 1.2mm;
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: ${baseFs - 1}pt;
  color: ${t.textColor}aa;
  font-style: italic;
  letter-spacing: 0.1mm;
  border-top: 1px dashed ${t.accentColor}55;
  padding-top: 1.2mm;
}
.math-concept-card .mcc-header-right {
  flex-direction: row;
  align-items: center;
  gap: 3mm;
}
.math-concept-card .mcc-name-label {
  font-size: ${baseFs + 1}pt;
  font-weight: 800;
  color: ${t.primaryColor};
  flex-shrink: 0;
}
.math-concept-card .mcc-name-line {
  flex: 1;
  height: 0;
  border-bottom: 1.5px solid ${t.textColor}88;
  margin-bottom: 1mm;
}

/* 본문 섹션들 */
.math-concept-card .mcc-body {
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
}
.math-concept-card .mcc-section {
  background: #ffffff;
  border: 1.2px solid ${t.textColor}33;
  border-radius: 2mm;
  padding: 2.5mm 3mm 2.8mm 3mm;
}
.math-concept-card .mcc-section-head {
  display: flex;
  align-items: center;
  gap: 1.5mm;
  margin-bottom: 1.5mm;
  padding-bottom: 1.2mm;
  border-bottom: 1px dashed ${t.accentColor}55;
}
.math-concept-card .mcc-section-icon {
  font-size: ${baseFs + 1}pt;
}
.math-concept-card .mcc-section-title {
  font-size: ${baseFs - 0.5}pt;
  font-weight: 800;
  color: ${t.primaryColor};
  letter-spacing: 0.2mm;
}
.math-concept-card .mcc-section-body {
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor};
  line-height: 1.55;
  word-break: keep-all;
}

/* 정의 섹션 — 교과서 정의 + 친근한 정의 두 줄 */
.math-concept-card .mcc-definition .mcc-section-body {
  display: flex;
  flex-direction: column;
  gap: 1.5mm;
}
.math-concept-card .mcc-def-row {
  display: flex;
  align-items: baseline;
  gap: 2.5mm;
}
.math-concept-card .mcc-def-tag {
  flex-shrink: 0;
  font-size: ${baseFs - 1.5}pt;
  font-weight: 800;
  padding: 0.5mm 2mm;
  border-radius: 1mm;
  letter-spacing: 0.2mm;
  white-space: nowrap;
}
.math-concept-card .mcc-def-tag-book {
  background: ${t.textColor}15;
  color: ${t.textColor}cc;
  border: 1px solid ${t.textColor}33;
}
.math-concept-card .mcc-def-tag-friend {
  background: ${t.accentColor}22;
  color: ${t.primaryColor};
  border: 1px solid ${t.accentColor};
}
.math-concept-card .mcc-def-text {
  flex: 1;
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor};
  line-height: 1.55;
  font-weight: 500;
}

/* 좌·우 2단: 그림 + 단짝 */
.math-concept-card .mcc-row-2col {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2.5mm;
}
.math-concept-card .mcc-row-2col .mcc-section {
  margin: 0;
}

/* 그림으로 보기 — 이모지 큰 글씨 + 부연 설명 */
.math-concept-card .mcc-visual .mcc-section-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5mm;
  text-align: center;
}
.math-concept-card .mcc-visual-emoji {
  font-size: ${baseFs + 6}pt;
  line-height: 1.5;
  letter-spacing: 1mm;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Noto Sans KR', monospace;
  color: ${t.textColor};
}
.math-concept-card .mcc-visual-caption {
  font-size: ${baseFs - 1.5}pt;
  color: ${t.textColor}cc;
  font-style: italic;
  line-height: 1.4;
}

/* 단짝 친구 — chip 가로 배치 */
.math-concept-card .mcc-related .mcc-section-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.math-concept-card .mcc-related-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5mm;
  justify-content: center;
}
.math-concept-card .mcc-related-chip {
  display: inline-block;
  background: ${t.accentColor}1F;
  border: 1px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 0.8mm 2.5mm;
  font-size: ${baseFs - 0.5}pt;
  font-weight: 700;
  color: ${t.primaryColor};
}

/* 수학 발문에서 만나기 */
.math-concept-card .mcc-textbook .mcc-section-body {
  display: flex;
  flex-direction: column;
  gap: 1.5mm;
}
.math-concept-card .mcc-textbook-quote {
  background: ${t.bgAccent};
  border-left: 3px solid ${t.accentColor};
  border-radius: 1mm;
  padding: 1.8mm 3mm;
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor};
  font-style: italic;
  line-height: 1.55;
}
.math-concept-card .mcc-textbook-meaning {
  font-size: ${baseFs - 0.5}pt;
  color: ${t.textColor}dd;
  line-height: 1.5;
}
.math-concept-card .mcc-textbook-meaning strong {
  color: ${t.primaryColor};
  font-weight: 800;
}

/* festive 변형 — 부드러운 배경 + 둥근 모서리 강조 */
.math-concept-card.meta-festive {
  background: ${t.bgAccent}cc;
  border: 1.5px solid ${t.accentColor}88;
  border-radius: 3mm;
  padding: 3mm 3.5mm 3.5mm 3.5mm;
}
.math-concept-card.meta-festive .mcc-header-left,
.math-concept-card.meta-festive .mcc-header-right {
  background: #ffffff;
}

/* ─── math-concept 페이지: 풀폭 메타 카드 + 컴팩트 문항 + 상·하 여백 균형 ───
 * 이름 칸이 메타 헤더에 내장됨 — 별도 .name-card 없이 풀폭으로 메타 박스가
 * 페이지 가용 공간을 채우고, 그 아래 문항이 자연 크기로 컴팩트하게 배치된다.
 * .page 의 padding(14mm) 이 상·하 동일하므로 카드가 flex:1 로 늘어나면
 * 자연스럽게 페이지 하단 여백이 상단과 같아진다.
 */
.page.math-concept-page .math-concept-card {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 5mm;
}
.page.math-concept-page .math-concept-card .mcc-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 3mm;
  justify-content: space-between;
}
.page.math-concept-page .math-concept-card .mcc-section {
  flex: 0 0 auto;
}
/* 그림+단짝 2단 구역은 flex-grow 로 빈 공간 일부 흡수 */
.page.math-concept-page .math-concept-card .mcc-row-2col {
  flex: 1 1 auto;
  align-items: stretch;
}
.page.math-concept-page .math-concept-card .mcc-row-2col .mcc-section {
  display: flex;
  flex-direction: column;
}
.page.math-concept-page .math-concept-card .mcc-row-2col .mcc-section-body {
  flex: 1 1 auto;
}
/* 문항 영역 — 컴팩트 (space-between 분배 비활성, 자연 크기) */
.page.math-concept-page .set {
  flex: 0 0 auto;
  justify-content: flex-start;
  gap: 4mm;
}

/* 해설지 배너 (math-concept 전용) — 풀폭 메타 위 한 줄 컴팩트 표시 */
.answer-banner-pill {
  display: flex; align-items: center; gap: 2.5mm;
  border: 1.5px solid #DC2626;
  background: #FEF2F2;
  border-radius: 2mm;
  padding: 2mm 4mm;
  margin-bottom: 3mm;
  flex-shrink: 0;
}
.answer-banner-pill .abp-mark {
  font-size: ${baseFs + 2}pt;
  font-weight: 900;
  color: #DC2626;
  line-height: 1;
}
.answer-banner-pill .abp-label {
  font-size: ${baseFs}pt;
  font-weight: 900;
  color: #B91C1C;
  letter-spacing: 3px;
}
.answer-banner-pill .abp-meta {
  margin-left: auto;
  font-size: ${baseFs - 2}pt;
  color: #7F1D1D;
  font-weight: 600;
  letter-spacing: 0.3mm;
}

/* ─── 속담 도메인 메타 — 큰 따옴표로 본문 강조 ─── */
.proverb-quote-block,
.phrase-quote-block {
  text-align: center;
  margin-bottom: 2mm;
  font-family: 'Noto Serif KR', serif;
  line-height: 1.4;
}
.proverb-quote-mark,
.phrase-quote-mark {
  font-size: ${baseFs + 14}pt;
  color: ${t.primaryColor};
  font-weight: 900;
  vertical-align: middle;
  line-height: 1;
}
.proverb-body,
.phrase-body {
  font-size: ${baseFs + 4}pt;
  font-weight: 700;
  color: ${t.primaryColor};
  margin: 0 2mm;
  letter-spacing: 0.5mm;
}

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

/* ─── 답안지 하단 해설 그리드 — 표준 정답표 양식 (컴팩트, 빨강 톤) ───
 * 상단 스트립과 하단 그리드가 모두 빨강 → 시각적 액자 효과로 "정답지" 느낌 강화. */
.answer-explanations {
  flex-shrink: 0;
  margin-top: 3mm;
  padding-top: 2mm;
  border-top: 1.5px solid #DC2626;
}
.ax-title {
  display: inline-block;
  font-size: ${baseFs - 1}pt;
  font-weight: 900;
  color: white;
  letter-spacing: 2mm;
  padding: 0.6mm 3mm;
  border-radius: 1mm;
  background: #DC2626;
  margin-bottom: 1.5mm;
}
.ax-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2mm 6mm;
}
.ax-item {
  display: flex; align-items: baseline; gap: 2mm;
  font-size: ${baseFs - 1.5}pt;
  line-height: 1.4;
  color: ${t.textColor};
  break-inside: avoid;
}
.ax-num {
  flex-shrink: 0;
  width: 4mm;
  font-weight: 800;
  color: #DC2626;
  font-size: ${baseFs - 1}pt;
}
.ax-text {
  flex: 1; min-width: 0;
  font-weight: 600;
  color: ${t.textColor};
}

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
  /* 도메인 슬롯 구성 — 다중 페이지 분할 지원 */
  const cfg = getDomain(set.domain);
  const pageBreaks = cfg.slotConfig.pageBreaks ?? [];
  const pageHeaders = cfg.slotConfig.pageHeaders ?? [];
  const repeatMeta = cfg.slotConfig.repeatMetaOnEachPage ?? false;
  const isQuizBanner = t.metaStyle === 'quiz-banner';
  const slotsArr = set.slots as readonly Question[];

  /* 슬롯을 페이지 그룹으로 분할 — pageBreaks=[3]이면 [0..3] / [4..N] */
  const slotGroups: { startIdx: number; slots: Question[] }[] = [];
  let lastBreak = -1;
  for (const breakIdx of pageBreaks) {
    slotGroups.push({
      startIdx: lastBreak + 1,
      slots: slotsArr.slice(lastBreak + 1, breakIdx + 1) as Question[],
    });
    lastBreak = breakIdx;
  }
  slotGroups.push({
    startIdx: lastBreak + 1,
    slots: slotsArr.slice(lastBreak + 1) as Question[],
  });
  const totalPages = slotGroups.length;
  const isMultiPage = totalPages > 1;

  /* 단일 슬롯 HTML 렌더 */
  const renderOneSlot = (q: Question, globalIdx: number): string => {
    switch (q.type) {
      case 'hanja-writing':
        return renderSlot1(q, globalIdx, showAnswer);
      case 'short-answer':
        return renderShortAnswerSlot(q, globalIdx, showAnswer);
      case 'sentence-making':
        return renderSlot8(q, globalIdx, showAnswer);
      case 'multiple-choice':
      default:
        return renderMcSlot(q, globalIdx, showAnswer);
    }
  };

  const isMathConcept = set.domain === 'math-concept';

  /* 페이지별 HTML 생성 */
  slotGroups.forEach((group, pageIdx) => {
    const isFirstPage = pageIdx === 0;
    const isLastPage = pageIdx === totalPages - 1;
    html += `<div class="page${showAnswer ? ' answer-mode' : ''}${isMultiPage ? ' multi-page' : ''}${isMathConcept ? ' math-concept-page' : ''}">`;

    /* 페이지 격려 헤더 (multi-page일 때만) */
    if (isMultiPage && pageHeaders[pageIdx]) {
      html += `<div class="page-encourage">
        <span class="pe-text">${esc(pageHeaders[pageIdx])}</span>
        <span class="pe-num">${pageIdx + 1} / ${totalPages}</span>
      </div>`;
    }

    /* 상단 — 첫 페이지에만 (또는 repeatMeta=true면 모든 페이지) */
    if (isFirstPage || repeatMeta) {
      if (isMathConcept) {
        /* 수학 개념어: 이름 칸이 메타 헤더에 내장 → 풀폭 메타 카드 + 해설지 배너 */
        if (showAnswer) {
          html += `<div class="answer-banner-pill">
            <span class="abp-mark">✓</span>
            <span class="abp-label">답안 및 해설</span>
            <span class="abp-meta">${set.slots.length}문항 · ${esc(set.title)}</span>
          </div>`;
        }
        html += cfg.renderMetaBlock(meta, t, baseFs);
      } else {
        html += `<div class="top-row">`;
        html += cfg.renderMetaBlock(meta, t, baseFs);
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
      }
    }

    /* 슬롯 영역 */
    if (isQuizBanner) {
      html += `<div class="qb-frame">`;
      html += `<span class="qb-quote left">&ldquo;</span>`;
      html += `<span class="qb-quote right">&rdquo;</span>`;
    }
    html += `<div class="set">`;
    group.slots.forEach((q, localIdx) => {
      html += renderOneSlot(q, group.startIdx + localIdx);
    });
    html += `</div>`;
    if (isQuizBanner) html += `</div>`;

    /* 답안지 정답 그리드 — 마지막 페이지 하단에만 */
    if (showAnswer && isLastPage) {
      html += renderAnswerExplanations(set);
    }

    html += `</div>`;
  });

  html += `</body></html>`;
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
