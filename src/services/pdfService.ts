import type { TestPaper } from '../types';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '../types';
import { getTemplate, buildTemplateCSS, type PDFTemplate } from './pdfTemplates';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CIRCLE = ['\u2460', '\u2461', '\u2462', '\u2463'];

function renderQuestion(q: TestPaper['questions'][0], idx: number, showAnswer: boolean): string {
  let h = `<div class="q">`;
  h += `<div class="q-num">${String(idx + 1).padStart(2, '0')}</div>`;
  h += `<div class="q-body">`;

  // Passage / work info block (for literature questions)
  if (q.passage || q.workTitle) {
    h += `<div class="passage">`;
    if (q.passage) {
      h += `<div class="passage-text">${esc(q.passage).replace(/\n/g, '<br>')}</div>`;
    }
    if (q.workTitle || q.workAuthor) {
      const author = q.workAuthor ? `, ${esc(q.workAuthor)}` : '';
      h += `<div class="passage-cite">- ${esc(q.workTitle || '')}${author}</div>`;
    }
    h += `</div>`;
  }

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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&family=Noto+Serif+KR:wght@400;500;600;700;800&display=swap');
`;

export function generateTestPaperHTML(
  test: TestPaper,
  subjectName: string,
  showAnswerKey: boolean,
  template: PDFTemplate,
): string {
  const date = new Date(test.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const diffLabel = DIFFICULTY_LABELS[test.difficulty].replace(/\s*\(.*?\)/, '');
  const totalScore = test.questions.length * 10;
  const css = FONT_IMPORTS + buildTemplateCSS(template);

  let html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<title>${esc(test.title)}</title>
<style>${css}</style></head><body><div class="page">`;

  // Header (style varies by template)
  if (template.headerStyle === 'side-stripe') {
    html += `<div class="header"><div class="header-text">
      <h1>${esc(test.title)}</h1>
      <div class="header-sub">
        <span>${esc(subjectName)}</span><span>${esc(diffLabel)}</span><span>${date}</span><span>${test.questions.length}문항</span>
      </div>
    </div></div>`;
  } else {
    html += `<div class="header">
      <h1>${esc(test.title)}</h1>
      <div class="header-sub">
        <span>${esc(subjectName)}</span><span>${esc(diffLabel)}</span><span>${date}</span><span>${test.questions.length}문항</span>
      </div>
    </div>`;
  }

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

export async function exportToPDF(
  test: TestPaper,
  subjectName: string,
  templateId?: string,
): Promise<void> {
  const template = getTemplate(templateId || 'elem-classic');
  const html = generateTestPaperHTML(test, subjectName, false, template);
  openPrintWindow(html);
}

export async function exportAnswerKeyToPDF(
  test: TestPaper,
  subjectName: string,
  templateId?: string,
): Promise<void> {
  const template = getTemplate(templateId || 'elem-classic');
  const html = generateTestPaperHTML(test, subjectName, true, template);
  openPrintWindow(html);
}

function openPrintWindow(html: string) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}
