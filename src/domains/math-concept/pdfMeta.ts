/**
 * 수학 개념어 도메인의 PDF 메타 박스 = "개념 학습 카드"
 *
 * 1페이지 학습지 구성 (개념 설명 중심):
 *
 *   ┌─────────────────────────┬───────────────┐
 *   │   짝수  [even number]    │   이름 _____  │   ← 헤더 (둘 다 가운데 정렬)
 *   │   └ 영어 어원 (있으면)    │                │
 *   ├─────────────────────────┴───────────────┤
 *   │  📚 정의 — 교과서 정의 + 친근한 정의        │
 *   ├──────────────────────┬──────────────────┤
 *   │  🎨 그림으로 보기      │  👯 단짝 친구       │
 *   │   <visualEmoji>       │  ┌ 🔺 꼭짓점       │
 *   │   <visualExample>     │  │  두 변이 만나… │
 *   │                       │  ├ ⬜ 도형         │
 *   │                       │  │  점·선·면…    │
 *   ├──────────────────────┴──────────────────┤
 *   │  🔍 수학 발문에서 만나기                    │
 *   └─────────────────────────────────────────┘
 *
 * 단짝 친구는 relatedTermsDetailed 가 있으면 [emoji + term + desc] 카드 리스트,
 * 없으면 단순 chip 으로 fallback. 콘텐츠 분량에 따라 카드 영역이 자동 흡수.
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

/* visualEmoji 전용: <br> 변환 X — `white-space: pre-line` CSS 가 \n 을 직접 처리.
 *  + **xxx** 마크업을 primary 컬러 강조로 변환 (기본은 검정, 중요한 단어만 색상). */
function escPre(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  /* **xxx** → <strong class="mcc-em">xxx</strong>
   * 같은 줄 안에서만 매칭 (줄바꿈은 매칭 안 함) — 마크업 누락 방지 */
  return escaped.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="mcc-em">$1</strong>');
}

/* ─── 한글 조사 자동 선택 (받침 유무 기반) ───
 * 변(받침 ㄴ) → '은' / '을',  둘레(받침 X) → '는' / '를'
 * 문장 끝의 구두점·이모지·따옴표 등은 무시하고 마지막 한글 음절 기준으로 판단. */
function lastHangul(text: string): string {
  for (let i = text.length - 1; i >= 0; i--) {
    const code = text.charCodeAt(i);
    if (code >= 0xAC00 && code <= 0xD7A3) return text[i];
  }
  return '';
}
function hasJongseong(syllable: string): boolean {
  if (!syllable) return false;
  const code = syllable.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return false;
  return ((code - 0xAC00) % 28) !== 0;
}
function eunNeun(word: string): string {
  return hasJongseong(lastHangul(word)) ? '은' : '는';
}
function eulReul(word: string): string {
  return hasJongseong(lastHangul(word)) ? '을' : '를';
}

export function renderMathConceptMetaBlock(meta: MathConceptMeta, t: SetTemplate): string {
  const englishTag = meta.englishTerm
    ? `<span class="mc-english-tag">${esc(meta.englishTerm)}</span>`
    : '';
  const hanjaTag = meta.hanja
    ? `<span class="mc-hanja-tag">${esc(meta.hanja)}</span>`
    : '';

  /* ─ 헤더 좌측: 용어 + 영어 + 한자 + 영어 어원 (모두 가운데 정렬) ─ */
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

  /* ─ 헤더 우측: 이름 빈칸 (가운데 정렬) ─ */
  const headerRight = `<div class="mcc-header-right">
    <div class="mcc-name-group">
      <span class="mcc-name-label">이름</span>
      <span class="mcc-name-line"></span>
    </div>
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

  /* ─ 그림으로 보기 (이모지 큰 그림 + 친근한 폰트 부연 설명) ─ */
  const visualSection = (meta.visualEmoji || meta.visualExample)
    ? `<div class="mcc-section mcc-visual">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">🎨</span>
          <span class="mcc-section-title">그림으로 보기</span>
        </div>
        <div class="mcc-section-body">
          ${meta.visualEmoji
            ? `<div class="mcc-visual-emoji">${escPre(meta.visualEmoji)}</div>`
            : ''}
          ${meta.visualExample
            ? `<div class="mcc-visual-caption">${esc(meta.visualExample)}</div>`
            : ''}
        </div>
      </div>`
    : '';

  /* ─ 단짝 친구 — 상세(emoji+desc) 우선, 없으면 단순 chip fallback ─ */
  const detailedFriends = meta.relatedTermsDetailed && meta.relatedTermsDetailed.length;
  let relatedBody = '';
  if (detailedFriends && meta.relatedTermsDetailed) {
    relatedBody = `<div class="mcc-friend-list">${meta.relatedTermsDetailed
      .map(
        (f) => `<div class="mcc-friend-card">
          <div class="mcc-friend-emoji">${esc(f.emoji || '🔗')}</div>
          <div class="mcc-friend-text">
            <div class="mcc-friend-term">${esc(f.term)}</div>
            ${f.desc ? `<div class="mcc-friend-desc">${esc(f.desc)}</div>` : ''}
          </div>
        </div>`,
      )
      .join('')}</div>`;
  } else if (meta.relatedTerms && meta.relatedTerms.length) {
    relatedBody = `<div class="mcc-related-list">${meta.relatedTerms
      .map((r) => `<span class="mcc-related-chip">${esc(r)}</span>`)
      .join('')}</div>`;
  }

  const relatedSection = relatedBody
    ? `<div class="mcc-section mcc-related">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">👯</span>
          <span class="mcc-section-title">단짝 친구</span>
        </div>
        <div class="mcc-section-body">
          ${relatedBody}
        </div>
      </div>`
    : '';

  /* ─ 수학 발문에서 만나기 ─ */
  const termParticle = eunNeun(meta.term);          // 변 → 은,  둘레/짝수 → 는
  const defParticle = eulReul(meta.definition);     // 정의 끝 받침에 따라 을/를
  const textbookSection = meta.textbookExample
    ? `<div class="mcc-section mcc-textbook">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">🔍</span>
          <span class="mcc-section-title">수학 발문에서 만나기</span>
        </div>
        <div class="mcc-section-body">
          <div class="mcc-textbook-quote">${esc(meta.textbookExample)}</div>
          <div class="mcc-textbook-meaning">👉 여기서 <strong>'${esc(meta.term)}'</strong>${termParticle} "${esc(meta.definition)}"${defParticle} 의미해요.</div>
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
