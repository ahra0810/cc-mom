/**
 * 수학 개념어 도메인의 PDF 메타 박스 렌더러.
 * 큰 글자 term + 작은 한자(있으면) + 정의 박스 + 시각 예시 + 관련 용어 짝.
 */
import type { MathConceptMeta } from '../../types/sets';
import type { SetTemplate } from '../../services/setPdfTemplates';

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

export function renderMathConceptMetaBlock(meta: MathConceptMeta, t: SetTemplate): string {
  const relatedHtml =
    meta.relatedTerms && meta.relatedTerms.length
      ? `<div class="mc-related"><strong>관련 용어</strong> · ${meta.relatedTerms.map(esc).join(' · ')}</div>`
      : '';
  const visualHtml = meta.visualExample
    ? `<div class="mc-visual">${esc(meta.visualExample)}</div>`
    : '';

  if (t.metaStyle === 'festive') {
    /* 수학 마법사 노트 — 블루 + 라임 + 별 + 마법사 캐릭터 + 시각 예시 박스 강조 */
    return `<div class="meta-block meta-festive math-festive">
      <div class="festive-ribbon">🧙 수학 마법사의 친근한 노트 🧮 ✨</div>
      <div class="festive-headline mf-headline">
        <span class="mf-stars">✨</span>
        <span class="festive-title mf-title">${esc(meta.term)}</span>
        ${meta.hanja ? `<span class="mf-hanja">${esc(meta.hanja)}</span>` : ''}
        <span class="mf-stars">✨</span>
      </div>
      <div class="festive-meaning">
        <span class="fm-label">뜻</span>
        <span class="fm-text">${esc(meta.definition)}</span>
      </div>
      ${meta.visualExample ? `<div class="mf-visual">🎯 <strong>이렇게 써요</strong> · ${esc(meta.visualExample)}</div>` : ''}
      ${
        meta.relatedTerms && meta.relatedTerms.length
          ? `<div class="mf-related">👯 <strong>단짝 친구</strong> · ${meta.relatedTerms.map(esc).join(' · ')}</div>`
          : ''
      }
    </div>`;
  }

  if (t.metaStyle === 'hanja-emphasis') {
    return `<div class="meta-block meta-classic">
      <div class="mc-term-block">
        <span class="mc-term-text">${esc(meta.term)}</span>
        ${meta.hanja ? `<span class="mc-hanja-tag">${esc(meta.hanja)}</span>` : ''}
      </div>
      <div class="mc-definition">${esc(meta.definition)}</div>
      ${visualHtml}
      ${relatedHtml}
      ${meta.origin ? `<div class="meta-origin">어원: ${esc(meta.origin)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'big-friendly') {
    return `<div class="meta-block meta-big-friendly">
      <div class="meta-friendly-star">★</div>
      <div class="mc-term-block">
        <span class="mc-term-text">${esc(meta.term)}</span>
        ${meta.hanja ? `<span class="mc-hanja-tag">${esc(meta.hanja)}</span>` : ''}
      </div>
      <div class="mc-definition">${esc(meta.definition)}</div>
      ${visualHtml}
      ${relatedHtml}
    </div>`;
  }

  if (t.metaStyle === 'quiz-banner') {
    return `<div class="meta-block meta-quiz-banner">
      <div class="qb-ribbon">퀴즈로 배워나가는 수학 개념어</div>
      <div class="qb-title-row">
        <span class="qb-title">${esc(meta.term)}</span>
        ${meta.hanja ? `<span class="qb-title-hanja">${esc(meta.hanja)}</span>` : ''}
      </div>
      <div class="qb-meaning-row">
        <span class="qb-meaning-label">정의</span>
        <span class="qb-meaning-text">${esc(meta.definition)}</span>
        ${meta.visualExample ? ` <span class="qb-origin">· ${esc(meta.visualExample)}</span>` : ''}
      </div>
    </div>`;
  }

  /* classic (기본) */
  return `<div class="meta-block meta-classic">
    <div class="mc-term-block">
      <span class="mc-term-text">${esc(meta.term)}</span>
      ${meta.hanja ? `<span class="mc-hanja-tag">${esc(meta.hanja)}</span>` : ''}
    </div>
    <div class="mc-definition">${esc(meta.definition)}</div>
    ${visualHtml}
    ${relatedHtml}
    ${meta.origin ? `<div class="meta-origin">어원: ${esc(meta.origin)}</div>` : ''}
  </div>`;
}
