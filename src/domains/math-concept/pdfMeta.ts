/**
 * 수학 개념어 도메인의 PDF 메타 박스 = "개념 학습 카드"
 *
 * 1페이지 학습지 구성:
 *   - 풀폭 메타 박스(개념 카드, 4섹션)
 *   - 미니 퀴즈 2문항 (객관식)
 *
 * 카드 구성 (festive 템플릿):
 *   상단:  term  ┃  englishTerm  ┃  englishOrigin (인라인)
 *          ┌─ 한자 태그 (있는 경우만)
 *   본문:  ┌─ 1️⃣ 친근한 정의
 *          ├─ 2️⃣ 그림으로 보기 (visualExample) | 3️⃣ 단짝 친구 (relatedTerms)  ← 좌·우 2단
 *          └─ 4️⃣ 수학 발문에서 만나기 (textbookExample)
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
  const englishTag = meta.englishTerm
    ? `<span class="mc-english-tag">${esc(meta.englishTerm)}</span>`
    : '';
  const hanjaTag = meta.hanja
    ? `<span class="mc-hanja-tag">${esc(meta.hanja)}</span>`
    : '';
  const englishOriginInline = meta.englishOrigin
    ? `<span class="mc-eng-origin-inline">${esc(meta.englishOrigin)}</span>`
    : '';

  /* 4섹션 본문 */
  const definitionSection = `<div class="mcc-section mcc-definition">
    <span class="mcc-section-num">1️⃣</span>
    <span class="mcc-section-title">친근한 정의</span>
    <div class="mcc-section-body">${esc(meta.definition)}</div>
  </div>`;

  const visualSection = meta.visualExample
    ? `<div class="mcc-section mcc-visual">
        <span class="mcc-section-num">2️⃣</span>
        <span class="mcc-section-title">그림으로 보기</span>
        <div class="mcc-section-body">${esc(meta.visualExample)}</div>
      </div>`
    : '';

  const relatedSection = meta.relatedTerms && meta.relatedTerms.length
    ? `<div class="mcc-section mcc-related">
        <span class="mcc-section-num">3️⃣</span>
        <span class="mcc-section-title">단짝 친구</span>
        <div class="mcc-section-body">👯 ${meta.relatedTerms.map(esc).join(' · ')}</div>
      </div>`
    : '';

  const textbookSection = meta.textbookExample
    ? `<div class="mcc-section mcc-textbook">
        <span class="mcc-section-num">4️⃣</span>
        <span class="mcc-section-title">수학 발문에서 만나기 🔍</span>
        <div class="mcc-section-body">
          <div class="mcc-textbook-quote">${esc(meta.textbookExample)}</div>
          <div class="mcc-textbook-meaning">👉 여기서 <strong>'${esc(meta.term)}'</strong>은(는) "${esc(meta.definition)}"을 의미해요.</div>
        </div>
      </div>`
    : '';

  /* festive 템플릿 — 풀폭 카드 + 둥근 박스 + 라임 액센트 */
  if (t.metaStyle === 'festive') {
    return `<div class="meta-block meta-festive math-festive math-concept-card">
      <div class="festive-ribbon">🧙 수학 마법사의 친근한 노트 🧮 ✨</div>
      <div class="mcc-headline">
        <span class="mcc-h-stars">✨</span>
        <span class="mcc-h-term">${esc(meta.term)}</span>
        ${englishTag ? `<span class="mcc-h-sep">┃</span>${englishTag}` : ''}
        ${englishOriginInline ? `<span class="mcc-h-sep">┃</span>${englishOriginInline}` : ''}
        ${hanjaTag ? `<span class="mcc-h-sep">┃</span>${hanjaTag}` : ''}
        <span class="mcc-h-stars">✨</span>
      </div>
      <div class="mcc-body">
        ${definitionSection}
        ${(visualSection || relatedSection) ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>` : ''}
        ${textbookSection}
      </div>
    </div>`;
  }

  /* 다른 metaStyle은 컴팩트 fallback (1페이지 그대로 유지) */
  return `<div class="meta-block meta-classic math-concept-card">
    <div class="mcc-headline">
      <span class="mcc-h-term">${esc(meta.term)}</span>
      ${englishTag}
      ${englishOriginInline ? `<span class="mcc-h-sep">·</span>${englishOriginInline}` : ''}
      ${hanjaTag}
    </div>
    <div class="mcc-body">
      ${definitionSection}
      ${(visualSection || relatedSection) ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>` : ''}
      ${textbookSection}
    </div>
  </div>`;
}
