/**
 * 사자성어 도메인의 PDF 메타 박스 렌더러.
 * setPdfService.ts의 renderMetaBlock 4종(metaStyle별)을 그대로 도메인 폴더로 이동.
 */
import type { IdiomMeta } from '../../types/sets';
import type { SetTemplate } from '../../services/setPdfTemplates';

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

export function renderIdiomMetaBlock(meta: IdiomMeta, t: SetTemplate): string {
  const hanjaChars = [...(meta.hanja || '')].slice(0, 4);
  while (hanjaChars.length < 4) hanjaChars.push('');

  if (t.metaStyle === 'festive') {
    /* 한자 두루마리 — 보라 + 골드 + 한자 4박스 강조 + 두루마리 리본 */
    return `<div class="meta-block meta-festive idiom-festive">
      <div class="festive-ribbon">📜 사자성어 학습 두루마리 ✨</div>
      <div class="festive-headline">
        <span class="festive-title">${esc(meta.idiom)}</span>
      </div>
      <div class="if-hanja-row">
        ${hanjaChars.map((c) => `<div class="if-hanja-cell">${esc(c)}</div>`).join('')}
      </div>
      <div class="festive-meaning">
        <span class="fm-label">뜻</span>
        <span class="fm-text">${esc(meta.meaning)}</span>
        ${meta.origin ? ` <span class="fm-origin">· ${esc(meta.origin)}</span>` : ''}
      </div>
    </div>`;
  }

  if (t.metaStyle === 'hanja-emphasis') {
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
    return `<div class="meta-block meta-big-friendly">
      <div class="meta-friendly-star">★</div>
      <div class="meta-hanja">${esc(meta.hanja)}</div>
      <div class="meta-idiom">${esc(meta.idiom)}</div>
      <div class="meta-meaning">${esc(meta.meaning)}</div>
      ${meta.origin ? `<div class="meta-origin">출전: ${esc(meta.origin)}</div>` : ''}
    </div>`;
  }

  if (t.metaStyle === 'quiz-banner') {
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
