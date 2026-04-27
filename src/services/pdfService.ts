import type { TestPaper } from '../types';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '../types';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CIRCLE = ['\u2460', '\u2461', '\u2462', '\u2463'];

function renderQuestion(q: TestPaper['questions'][0], idx: number, showAnswer: boolean): string {
  let h = `<div class="q">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;
  h += `<p class="q-text">${esc(q.question)}</p>`;

  if (q.type === 'multiple-choice' && q.options) {
    h += `<div class="opts">`;
    q.options.forEach((opt, i) => {
      const cls = showAnswer && opt === q.answer ? ' class="correct"' : '';
      h += `<div${cls}>${CIRCLE[i]} ${esc(opt)}</div>`;
    });
    h += `</div>`;
  } else if (q.type === 'true-false') {
    h += `<div class="opts opts-tf">`;
    h += `<div${showAnswer && q.answer === 'O' ? ' class="correct"' : ''}>${CIRCLE[0]} O (맞다)</div>`;
    h += `<div${showAnswer && q.answer === 'X' ? ' class="correct"' : ''}>${CIRCLE[1]} X (틀리다)</div>`;
    h += `</div>`;
  } else if (q.type === 'fill-blank' || q.type === 'short-answer') {
    if (!showAnswer) {
      h += `<div class="answer-line"></div>`;
    }
  } else if (q.type === 'sentence-making') {
    if (!showAnswer) {
      // Provide 3 lined writing lines
      h += `<div class="writing-lines"></div>`;
    }
  }

  if (showAnswer && (q.type === 'fill-blank' || q.type === 'short-answer')) {
    h += `<div class="answer-box">정답: ${esc(q.answer)}</div>`;
  }
  if (showAnswer && q.type === 'sentence-making' && q.answer) {
    h += `<div class="answer-box">예시 답안: ${esc(q.answer)}</div>`;
  }

  if (showAnswer && q.explanation) {
    h += `<div class="explain"><span class="explain-label">해설</span>${esc(q.explanation)}</div>`;
  }

  h += `</div></div>`;
  return h;
}

const FONT_IMPORTS = `
@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');
`;

const CSS = `
${FONT_IMPORTS}
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'NanumSquareNeo', 'Noto Sans KR', 'KoPub Dotum', 'Apple SD Gothic Neo', sans-serif;
  color: #1a1a1a; font-size: 11.5pt; line-height: 1.65;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.page { max-width: 170mm; margin: 0 auto; }

/* -- Header -- */
.header {
  text-align: center; padding-bottom: 14px;
  border-bottom: 2.5px solid #222; margin-bottom: 6px;
}
.header h1 {
  font-size: 19pt; font-weight: 800; letter-spacing: 0.5px;
  margin-bottom: 5px; color: #111;
}
.header-sub {
  font-size: 9pt; color: #666; letter-spacing: 0.3px;
}
.header-sub span { margin: 0 6px; }
.header-sub span:not(:last-child)::after {
  content: '|'; margin-left: 12px; color: #ccc;
}

/* -- Info row -- */
.info-row {
  display: flex; justify-content: space-between; align-items: center;
  border: 1.5px solid #ddd; border-radius: 3px;
  padding: 7px 14px; margin: 10px 0 14px; font-size: 10pt; color: #444;
}
.info-row .field { display: flex; align-items: center; gap: 4px; }
.info-row .blank {
  display: inline-block; width: 90px; border-bottom: 1px solid #999;
  margin-left: 2px; height: 16px;
}
.info-row .score-blank {
  display: inline-block; width: 36px; border-bottom: 1px solid #999;
  margin: 0 2px; height: 16px; text-align: center;
}

/* -- Answer key banner -- */
.answer-banner {
  text-align: center; font-size: 11pt; font-weight: 700; color: #1a1a1a;
  border: 2px solid #222; padding: 7px 0; margin: 10px 0 14px;
  letter-spacing: 2px;
}

/* -- Section title -- */
.sec-title {
  font-size: 10pt; font-weight: 700; color: #333;
  padding: 5px 0 4px; margin: 14px 0 6px;
  border-bottom: 1.5px solid #333;
}

/* -- Question -- */
.q {
  display: flex; gap: 8px; margin-bottom: 14px;
  page-break-inside: avoid;
}
.q-num {
  flex-shrink: 0; width: 22px; font-size: 10pt;
  font-weight: 700; color: #555; padding-top: 1px; text-align: right;
}
.q-body { flex: 1; min-width: 0; }
.q-text {
  font-size: 11pt; font-weight: 600; line-height: 1.7;
  margin-bottom: 5px; color: #1a1a1a;
}

/* -- Options -- */
.opts {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1px 20px; padding-left: 2px;
  font-size: 10.5pt; line-height: 1.7; color: #333;
}
.opts-tf { grid-template-columns: auto auto; justify-content: start; gap: 1px 32px; }
.opts .correct { font-weight: 700; color: #000; }

/* -- Short answer line -- */
.answer-line {
  width: 60%; height: 1px; border-bottom: 1px solid #999;
  margin: 6px 0 4px 2px;
}

/* -- Writing lines for sentence-making -- */
.writing-lines {
  height: 72px; margin: 6px 0 6px 2px;
  background-image: repeating-linear-gradient(
    transparent, transparent 23px, #888 23px, #888 24px
  );
}

/* -- Answer box (answer key) -- */
.answer-box {
  display: inline-block; font-size: 10pt; font-weight: 700;
  color: #000; margin-top: 2px;
  border-bottom: 1.5px solid #000; padding-bottom: 1px;
}

/* -- Explanation -- */
.explain {
  margin-top: 5px; font-size: 9.5pt; color: #444;
  line-height: 1.6; padding: 5px 8px;
  background: #f5f5f5; border-left: 3px solid #bbb;
}
.explain-label {
  display: inline-block; font-weight: 700; color: #333;
  margin-right: 6px; font-size: 9pt;
}

/* -- Memo section -- */
.memo {
  page-break-before: auto; margin-top: 24px;
  border: 1.5px solid #ccc; border-radius: 4px; padding: 12px 14px;
}
.memo-title {
  font-size: 10pt; font-weight: 700; color: #444;
  margin-bottom: 8px; padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}
.memo-lines {
  height: 120px;
  background-image: repeating-linear-gradient(
    transparent, transparent 23px, #e5e5e5 23px, #e5e5e5 24px
  );
}
`;

export function generateTestPaperHTML(test: TestPaper, subjectName: string, showAnswerKey: boolean): string {
  // subjectName may be a single name or comma-separated list of names
  const date = new Date(test.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const diffLabel = DIFFICULTY_LABELS[test.difficulty].replace(/\s*\(.*?\)/, '');
  const totalScore = test.questions.length * 10;

  let html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<title>${esc(test.title)}${showAnswerKey ? ' - 답안지' : ''}</title>
<style>${CSS}</style></head><body><div class="page">`;

  // Header
  html += `<div class="header">
    <h1>${esc(test.title)}</h1>
    <div class="header-sub">
      <span>${esc(subjectName)}</span>
      <span>${esc(diffLabel)}</span>
      <span>${date}</span>
      <span>${test.questions.length}문항</span>
    </div>
  </div>`;

  // Info row or answer banner
  if (!showAnswerKey) {
    html += `<div class="info-row">
      <div class="field">이름 <span class="blank"></span></div>
      <div class="field">날짜 <span class="blank"></span></div>
      <div class="field">점수 <span class="score-blank"></span> / ${totalScore}</div>
    </div>`;
  } else {
    html += `<div class="answer-banner">답안 및 해설</div>`;
  }

  // Group by type if mixed
  const typeGroups = new Map<string, typeof test.questions>();
  test.questions.forEach((q) => {
    const group = typeGroups.get(q.type) || [];
    group.push(q);
    typeGroups.set(q.type, group);
  });

  let idx = 0;
  if (typeGroups.size > 1) {
    for (const [type, questions] of typeGroups) {
      const label = QUESTION_TYPE_LABELS[type as keyof typeof QUESTION_TYPE_LABELS];
      html += `<div class="sec-title">${esc(label)} (${questions.length}문항)</div>`;
      for (const q of questions) {
        html += renderQuestion(q, idx, showAnswerKey);
        idx++;
      }
    }
  } else {
    for (const q of test.questions) {
      html += renderQuestion(q, idx, showAnswerKey);
      idx++;
    }
  }

  // Memo section (test paper only)
  if (!showAnswerKey) {
    html += `<div class="memo">
      <div class="memo-title">오답 정리 / 메모</div>
      <div class="memo-lines"></div>
    </div>`;
  }

  html += `</div></body></html>`;
  return html;
}

function generateFileName(test: TestPaper, isAnswerKey: boolean): string {
  const date = new Date().toISOString().slice(0, 10);
  const title = test.title.replace(/[\\/:*?"<>|]/g, '_');
  return `${title}${isAnswerKey ? '_답안지' : ''}_${date}.pdf`;
}

export async function exportToPDF(test: TestPaper, subjectName: string): Promise<boolean> {
  const html = generateTestPaperHTML(test, subjectName, false);
  return openPrintWindow(html, generateFileName(test, false));
}

export async function exportAnswerKeyToPDF(test: TestPaper, subjectName: string): Promise<boolean> {
  const html = generateTestPaperHTML(test, subjectName, true);
  return openPrintWindow(html, generateFileName(test, true));
}

function openPrintWindow(html: string, _fileName: string): boolean {
  const win = window.open('', '_blank');
  if (!win) {
    return false; // popup blocked
  }
  win.document.write(html);
  win.document.close();

  // Wait for fonts to load before printing
  if (win.document.fonts && win.document.fonts.ready) {
    win.document.fonts.ready.then(() => {
      setTimeout(() => win.print(), 300);
    });
  } else {
    setTimeout(() => win.print(), 800);
  }
  return true;
}
