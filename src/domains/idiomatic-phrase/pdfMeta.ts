/**
 * 관용어 도메인의 PDF 메타 박스 렌더러.
 * 한자 박스 대신 큰 따옴표로 관용어 본문 강조 + 예문이 있으면 작은 글씨로 함께 표시.
 */
import type { IdiomaticPhraseMeta } from '../../types/sets';
import type { SetTemplate } from '../../services/setPdfTemplates';

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

export function renderIdiomaticMetaBlock(meta: IdiomaticPhraseMeta, t: SetTemplate): string {
  if (t.metaStyle === 'hanja-emphasis') {
    return `<div class="meta-block meta-classic">
      <div class="phrase-quote-block">
        <span class="phrase-quote-mark">&ldquo;</span>
        <span class="phrase-body">${esc(meta.phrase)}</span>
        <span class="phrase-quote-mark">&rdquo;</span>
      </div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.example ? `<div class="meta-meaning"><strong>예문</strong> · ${esc(meta.example)}</div>` : ''}
      ${meta.origin ? `<div class="meta-origin">유래: ${esc(meta.origin)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'big-friendly') {
    return `<div class="meta-block meta-big-friendly">
      <div class="meta-friendly-star">★</div>
      <div class="phrase-quote-block">
        <span class="phrase-body">"${esc(meta.phrase)}"</span>
      </div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.example ? `<div class="meta-origin">예) ${esc(meta.example)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'quiz-banner') {
    return `<div class="meta-block meta-quiz-banner">
      <div class="qb-ribbon">퀴즈로 배워나가는 관용어</div>
      <div class="qb-title-row">
        <span class="qb-title">"${esc(meta.phrase)}"</span>
      </div>
      <div class="qb-meaning-row">
        <span class="qb-meaning-label">뜻풀이</span>
        <span class="qb-meaning-text">${esc(meta.meaning)}</span>
        ${meta.example ? ` <span class="qb-origin">· 예) ${esc(meta.example)}</span>` : ''}
      </div>
    </div>`;
  }

  /* classic (기본) */
  return `<div class="meta-block meta-classic">
    <div class="phrase-quote-block">
      <span class="phrase-quote-mark">&ldquo;</span>
      <span class="phrase-body">${esc(meta.phrase)}</span>
      <span class="phrase-quote-mark">&rdquo;</span>
    </div>
    <div class="meta-meaning">${esc(meta.meaning)}</div>
    ${meta.example ? `<div class="meta-meaning"><strong>예문</strong> · ${esc(meta.example)}</div>` : ''}
    ${meta.origin ? `<div class="meta-origin">유래: ${esc(meta.origin)}</div>` : ''}
  </div>`;
}
