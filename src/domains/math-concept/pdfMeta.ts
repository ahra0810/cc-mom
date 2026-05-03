/**
 * 수학 개념어 도메인의 PDF 메타 박스 = "개념 학습 카드"
 *
 * 1페이지 학습지 구성 (개념 설명 중심, 문항은 최소화):
 *
 *   ┌─────────────────────────┬───────────────┐
 *   │  짝수  [even number]      │  이름 _______  │   ← 헤더 행 (2단)
 *   │  └ 영어 어원 (있으면)      │                │
 *   ├─────────────────────────┴───────────────┤
 *   │  📚 정의                                  │   ← 풀폭 정의 박스
 *   │   교과서 속 정의 : ~~~                    │     (교과서 + 친근한 두 줄)
 *   │   친근한 정의   : ~~~                     │
 *   ├──────────────────────┬──────────────────┤
 *   │  🎨 그림으로 보기      │  👯 단짝 친구       │   ← 좌·우 2단
 *   │   <visualEmoji 큰글씨> │   ~~ · ~~ · ~~    │
 *   │   <visualExample 부연> │                   │
 *   ├──────────────────────┴──────────────────┤
 *   │  🔍 수학 발문에서 만나기                    │   ← 풀폭 발문 박스
 *   │   "<textbookExample>"                    │
 *   │   👉 여기서 '<term>'은(는) "~~"를 의미해요   │
 *   └─────────────────────────────────────────┘
 *
 * 슬롯 2문항(객관식)은 카드 아래에 컴팩트하게 배치 (slot 렌더러가 처리).
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

  /* ─ 헤더 좌측: 용어 + 영어 + 한자 (있으면) + 영어 어원 (sub) ─ */
  const headerLeft = `<div class="mcc-header-left">
    <div class="mcc-header-main">
      <span class="mcc-h-term">${esc(meta.term)}</span>
      ${englishTag}
      ${hanjaTag}
    </div>
    ${meta.englishOrigin
      ? `<div class="mcc-h-origin">${esc(meta.englishOrigin)}</div>`
      : ''}
  </div>`;

  /* ─ 헤더 우측: 이름 빈칸 ─ */
  const headerRight = `<div class="mcc-header-right">
    <span class="mcc-name-label">이름</span>
    <span class="mcc-name-line"></span>
  </div>`;

  /* ─ 정의 섹션 (교과서 정의 + 친근한 정의) ─ */
  const textbookDefLine = meta.textbookDefinition
    ? `<div class="mcc-def-row">
        <span class="mcc-def-tag mcc-def-tag-book">교과서 속 정의</span>
        <span class="mcc-def-text">${esc(meta.textbookDefinition)}</span>
      </div>`
    : '';
  const friendlyDefLine = `<div class="mcc-def-row">
    <span class="mcc-def-tag mcc-def-tag-friend">친근한 정의</span>
    <span class="mcc-def-text">${esc(meta.definition)}</span>
  </div>`;

  const definitionSection = `<div class="mcc-section mcc-definition">
    <div class="mcc-section-head">
      <span class="mcc-section-icon">📚</span>
      <span class="mcc-section-title">정의</span>
    </div>
    <div class="mcc-section-body">
      ${textbookDefLine}
      ${friendlyDefLine}
    </div>
  </div>`;

  /* ─ 그림으로 보기 (이모지 큰 글씨 + 부연 설명) ─ */
  const visualSection = (meta.visualEmoji || meta.visualExample)
    ? `<div class="mcc-section mcc-visual">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">🎨</span>
          <span class="mcc-section-title">그림으로 보기</span>
        </div>
        <div class="mcc-section-body">
          ${meta.visualEmoji
            ? `<div class="mcc-visual-emoji">${esc(meta.visualEmoji)}</div>`
            : ''}
          ${meta.visualExample
            ? `<div class="mcc-visual-caption">${esc(meta.visualExample)}</div>`
            : ''}
        </div>
      </div>`
    : '';

  /* ─ 단짝 친구 ─ */
  const relatedSection = meta.relatedTerms && meta.relatedTerms.length
    ? `<div class="mcc-section mcc-related">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">👯</span>
          <span class="mcc-section-title">단짝 친구</span>
        </div>
        <div class="mcc-section-body">
          <div class="mcc-related-list">${meta.relatedTerms.map((r) => `<span class="mcc-related-chip">${esc(r)}</span>`).join('')}</div>
        </div>
      </div>`
    : '';

  /* ─ 수학 발문에서 만나기 ─ */
  const textbookSection = meta.textbookExample
    ? `<div class="mcc-section mcc-textbook">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">🔍</span>
          <span class="mcc-section-title">수학 발문에서 만나기</span>
        </div>
        <div class="mcc-section-body">
          <div class="mcc-textbook-quote">${esc(meta.textbookExample)}</div>
          <div class="mcc-textbook-meaning">👉 여기서 <strong>'${esc(meta.term)}'</strong>은(는) "${esc(meta.definition)}"을 의미해요.</div>
        </div>
      </div>`
    : '';

  /* festive 템플릿 — 풀폭 카드 + 둥근 박스 + 라임 액센트 */
  if (t.metaStyle === 'festive') {
    return `<div class="meta-block meta-festive math-festive math-concept-card">
      <div class="mcc-header-row">
        ${headerLeft}
        ${headerRight}
      </div>
      <div class="mcc-body">
        ${definitionSection}
        ${(visualSection || relatedSection)
          ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>`
          : ''}
        ${textbookSection}
      </div>
    </div>`;
  }

  /* 다른 metaStyle은 동일 구조의 클래식 fallback */
  return `<div class="meta-block meta-classic math-concept-card">
    <div class="mcc-header-row">
      ${headerLeft}
      ${headerRight}
    </div>
    <div class="mcc-body">
      ${definitionSection}
      ${(visualSection || relatedSection)
        ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>`
        : ''}
      ${textbookSection}
    </div>
  </div>`;
}
