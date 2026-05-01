/**
 * 속담 도메인의 PDF 메타 박스 렌더러.
 * 4가지 metaStyle(classic/hanja-emphasis/big-friendly/quiz-banner) 모두에서
 * 한자 박스 대신 큰 따옴표로 속담 본문 강조.
 */
import type { ProverbMeta } from '../../types/sets';
import type { SetTemplate } from '../../services/setPdfTemplates';

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

export function renderProverbMetaBlock(meta: ProverbMeta, t: SetTemplate): string {
  if (t.metaStyle === 'hanja-emphasis') {
    /* 한자 강조 템플릿 — 속담은 한자가 없으니 큰 따옴표 + 본문으로 대체 */
    return `<div class="meta-block meta-classic">
      <div class="proverb-quote-block">
        <span class="proverb-quote-mark">&ldquo;</span>
        <span class="proverb-body">${esc(meta.proverb)}</span>
        <span class="proverb-quote-mark">&rdquo;</span>
      </div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.lesson ? `<div class="meta-meaning"><strong>교훈</strong> · ${esc(meta.lesson)}</div>` : ''}
      ${meta.origin ? `<div class="meta-origin">유래: ${esc(meta.origin)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'big-friendly') {
    return `<div class="meta-block meta-big-friendly">
      <div class="meta-friendly-star">★</div>
      <div class="proverb-quote-block">
        <span class="proverb-body">"${esc(meta.proverb)}"</span>
      </div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.lesson ? `<div class="meta-origin">교훈: ${esc(meta.lesson)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'quiz-banner') {
    return `<div class="meta-block meta-quiz-banner">
      <div class="qb-ribbon">퀴즈로 배워나가는 속담</div>
      <div class="qb-title-row">
        <span class="qb-title">"${esc(meta.proverb)}"</span>
      </div>
      <div class="qb-meaning-row">
        <span class="qb-meaning-label">뜻풀이</span>
        <span class="qb-meaning-text">${esc(meta.meaning)}</span>
        ${meta.lesson ? ` <span class="qb-origin">· 교훈: ${esc(meta.lesson)}</span>` : ''}
      </div>
    </div>`;
  }

  /* classic (기본) — 큰 따옴표로 속담 본문 강조 */
  return `<div class="meta-block meta-classic">
    <div class="proverb-quote-block">
      <span class="proverb-quote-mark">&ldquo;</span>
      <span class="proverb-body">${esc(meta.proverb)}</span>
      <span class="proverb-quote-mark">&rdquo;</span>
    </div>
    <div class="meta-meaning">${esc(meta.meaning)}</div>
    ${meta.lesson ? `<div class="meta-meaning"><strong>교훈</strong> · ${esc(meta.lesson)}</div>` : ''}
    ${meta.origin ? `<div class="meta-origin">유래: ${esc(meta.origin)}</div>` : ''}
  </div>`;
}
