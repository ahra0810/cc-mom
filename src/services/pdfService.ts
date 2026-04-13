import type { TestPaper } from '../types';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '../types';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderQuestion(q: TestPaper['questions'][0], idx: number, showAnswer: boolean): string {
  let html = `<div class="question-item" style="margin-bottom:18px;page-break-inside:avoid;">`;
  html += `<p style="margin:0 0 6px;font-weight:600;font-size:13px;line-height:1.7;">`;
  html += `${idx + 1}. ${escapeHtml(q.question)}</p>`;

  if (q.type === 'multiple-choice' && q.options) {
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 24px;padding-left:20px;font-size:12.5px;line-height:1.7;">`;
    const labels = ['\u2460', '\u2461', '\u2462', '\u2463'];
    q.options.forEach((opt, i) => {
      const isAnswer = showAnswer && opt === q.answer;
      html += `<div style="${isAnswer ? 'font-weight:700;color:#1D4ED8;' : ''}">${labels[i]} ${escapeHtml(opt)}</div>`;
    });
    html += `</div>`;
  } else if (q.type === 'true-false') {
    html += `<div style="padding-left:20px;font-size:12.5px;line-height:1.7;">`;
    const oStyle = showAnswer && q.answer === 'O' ? 'font-weight:700;color:#1D4ED8;' : '';
    const xStyle = showAnswer && q.answer === 'X' ? 'font-weight:700;color:#1D4ED8;' : '';
    html += `<span style="margin-right:24px;${oStyle}">\u2460 O</span>`;
    html += `<span style="${xStyle}">\u2461 X</span>`;
    html += `</div>`;
  } else if (showAnswer) {
    html += `<div style="padding-left:20px;font-size:12px;color:#1D4ED8;font-weight:600;line-height:1.7;">`;
    html += `\u2192 ${escapeHtml(q.answer)}</div>`;
  }

  if (showAnswer && q.explanation) {
    html += `<div style="padding-left:20px;margin-top:4px;font-size:11px;color:#6B7280;line-height:1.6;background:#F9FAFB;padding:6px 12px;border-radius:4px;">`;
    html += `\uD83D\uDCA1 ${escapeHtml(q.explanation)}</div>`;
  }

  html += `</div>`;
  return html;
}

export function generateTestPaperHTML(test: TestPaper, subjectName: string, showAnswerKey: boolean): string {
  const date = new Date(test.createdAt).toLocaleDateString('ko-KR');
  const diffLabel = DIFFICULTY_LABELS[test.difficulty];

  let html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<style>
@page { size: A4; margin: 20mm 15mm; }
body { font-family: 'Malgun Gothic','Pretendard',sans-serif; margin:0; padding:0; color:#1E293B; }
.page { width:170mm; margin:0 auto; }
.header { text-align:center; border-bottom:2px solid #1E293B; padding-bottom:12px; margin-bottom:16px; }
.header h1 { font-size:20px; margin:0 0 4px; letter-spacing:1px; }
.header .meta { font-size:11px; color:#64748B; }
.name-row { display:flex; justify-content:space-between; border:1px solid #CBD5E1; padding:8px 16px; margin-bottom:16px; font-size:12px; border-radius:4px; }
.name-row span { min-width:120px; }
.section-title { font-size:13px; font-weight:700; color:#1E40AF; margin:16px 0 8px; padding:4px 0; border-bottom:1px solid #BFDBFE; }
.footer { text-align:center; font-size:10px; color:#94A3B8; margin-top:20px; padding-top:8px; border-top:1px solid #E2E8F0; }
</style></head><body><div class="page">`;

  // Header
  html += `<div class="header">
    <h1>${escapeHtml(test.title)}</h1>
    <div class="meta">${escapeHtml(subjectName)} | ${escapeHtml(diffLabel)} | ${date} | 총 ${test.questions.length}문항</div>
  </div>`;

  // Name row
  if (!showAnswerKey) {
    html += `<div class="name-row">
      <span>이름: _______________</span>
      <span>날짜: _______________</span>
      <span>점수: _____ / ${test.questions.length * 10}</span>
    </div>`;
  } else {
    html += `<div style="text-align:center;background:#EFF6FF;padding:8px;border-radius:6px;margin-bottom:12px;font-size:13px;font-weight:700;color:#1D4ED8;">
      \uD83D\uDD11 답안지 및 해설
    </div>`;
  }

  // Group by type
  const typeGroups = new Map<string, typeof test.questions>();
  test.questions.forEach((q) => {
    const group = typeGroups.get(q.type) || [];
    group.push(q);
    typeGroups.set(q.type, group);
  });

  let globalIdx = 0;
  if (typeGroups.size > 1) {
    for (const [type, questions] of typeGroups) {
      html += `<div class="section-title">${QUESTION_TYPE_LABELS[type as keyof typeof QUESTION_TYPE_LABELS]} (${questions.length}문항)</div>`;
      questions.forEach((q) => {
        html += renderQuestion(q, globalIdx, showAnswerKey);
        globalIdx++;
      });
    }
  } else {
    test.questions.forEach((q) => {
      html += renderQuestion(q, globalIdx, showAnswerKey);
      globalIdx++;
    });
  }

  html += `<div class="footer">퀴즈 메이커로 제작됨</div>`;
  html += `</div></body></html>`;
  return html;
}

export async function exportToPDF(test: TestPaper, subjectName: string): Promise<void> {
  // Generate test paper
  const testHtml = generateTestPaperHTML(test, subjectName, false);
  const testWindow = window.open('', '_blank');
  if (!testWindow) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }
  testWindow.document.write(testHtml);
  testWindow.document.close();

  // Auto-trigger print dialog
  setTimeout(() => {
    testWindow.print();
  }, 500);
}

export async function exportAnswerKeyToPDF(test: TestPaper, subjectName: string): Promise<void> {
  const answerHtml = generateTestPaperHTML(test, subjectName, true);
  const answerWindow = window.open('', '_blank');
  if (!answerWindow) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }
  answerWindow.document.write(answerHtml);
  answerWindow.document.close();

  setTimeout(() => {
    answerWindow.print();
  }, 500);
}
