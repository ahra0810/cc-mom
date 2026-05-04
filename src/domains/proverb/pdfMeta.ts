/**
 * 속담 도메인의 PDF 메타 박스 = "속담 학습 카드"
 *
 * 1페이지 학습지 구성 (시각 카드 + 일상 응용 + 미니 퀴즈 3문항):
 *
 *   ┌─────────────────────────┬───────────┐
 *   │  ✨ "<속담 본문>" ✨        │  이름 ___ │
 *   ├─────────────────────────┴───────────┤
 *   │  📚 뜻 — 교과서 + 친근한                  │
 *   ├──────────────────────┬──────────────────┤
 *   │  🎨 그림으로 보기      │  💡 비슷한 속담     │
 *   ├──────────────────────┴──────────────────┤
 *   │  🌟 일상에서 만나기                        │
 *   └─────────────────────────────────────────┘
 *
 *   01·02 객관식 + 03 서술형 (응용)
 */
import type { ProverbMeta } from '../../types/sets';
import type { SetTemplate } from '../../services/setPdfTemplates';
import { esc, escPre, eulReul } from '../../services/koreanParticle';

export function renderProverbMetaBlock(meta: ProverbMeta, t: SetTemplate): string {
  /* ─ 헤더 좌측: 속담 큰 글씨 (가운데 정렬) ─ */
  const headerLeft = `<div class="mcc-header-left">
    <div class="mcc-header-main">
      <span class="mcc-h-stars">✨</span>
      <span class="mcc-h-term mcc-h-proverb">${esc(meta.proverb)}</span>
      <span class="mcc-h-stars">✨</span>
    </div>
    ${meta.lesson
      ? `<div class="mcc-h-origin">⭐ ${esc(meta.lesson)}</div>`
      : ''}
  </div>`;

  /* ─ 헤더 우측: 이름 빈칸 ─ */
  const headerRight = `<div class="mcc-header-right">
    <div class="mcc-name-group">
      <span class="mcc-name-label">이름</span>
      <span class="mcc-name-line"></span>
    </div>
  </div>`;

  /* ─ 정의 (뜻) 섹션 ─ */
  const textbookDefLine = meta.textbookMeaning
    ? `<div class="mcc-def-row">
        <span class="mcc-def-tag mcc-def-tag-book">교과서 속 뜻</span>
        <span class="mcc-def-text">${esc(meta.textbookMeaning)}</span>
      </div>`
    : '';
  const friendlyDefLine = `<div class="mcc-def-row">
    <span class="mcc-def-tag mcc-def-tag-friend">친근한 뜻</span>
    <span class="mcc-def-text">${esc(meta.meaning)}</span>
  </div>`;

  const definitionSection = `<div class="mcc-section mcc-definition">
    <div class="mcc-section-head">
      <span class="mcc-section-icon">📚</span>
      <span class="mcc-section-title">뜻</span>
    </div>
    <div class="mcc-section-body">
      ${textbookDefLine}
      ${friendlyDefLine}
    </div>
  </div>`;

  /* ─ 그림으로 보기 ─ */
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

  /* ─ 비슷한 속담 (단짝) ─ */
  const detailedFriends = meta.relatedProverbsDetailed && meta.relatedProverbsDetailed.length;
  let relatedBody = '';
  if (detailedFriends && meta.relatedProverbsDetailed) {
    relatedBody = `<div class="mcc-friend-list">${meta.relatedProverbsDetailed
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
  } else if (meta.relatedProverbs && meta.relatedProverbs.length) {
    relatedBody = `<div class="mcc-related-list">${meta.relatedProverbs
      .map((r) => `<span class="mcc-related-chip">${esc(r)}</span>`)
      .join('')}</div>`;
  }

  const relatedSection = relatedBody
    ? `<div class="mcc-section mcc-related">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">💡</span>
          <span class="mcc-section-title">비슷한 속담</span>
        </div>
        <div class="mcc-section-body">
          ${relatedBody}
        </div>
      </div>`
    : '';

  /* ─ 일상에서 만나기 ─ */
  const proverbParticle = eulReul(meta.proverb);
  const usageSection = meta.usageExample
    ? `<div class="mcc-section mcc-textbook">
        <div class="mcc-section-head">
          <span class="mcc-section-icon">🌟</span>
          <span class="mcc-section-title">일상에서 만나기</span>
        </div>
        <div class="mcc-section-body">
          <div class="mcc-textbook-quote">${esc(meta.usageExample)}</div>
          <div class="mcc-textbook-meaning">👉 이럴 때 <strong>"${esc(meta.proverb)}"</strong>${proverbParticle} 써요!</div>
        </div>
      </div>`
    : '';

  /* festive 템플릿 — 풀폭 카드 */
  if (t.metaStyle === 'festive') {
    return `<div class="meta-block meta-festive proverb-festive proverb-card rich-meta-card">
      <div class="mcc-header-row">
        ${headerLeft}
        ${headerRight}
      </div>
      <div class="mcc-body">
        ${definitionSection}
        ${(visualSection || relatedSection)
          ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>`
          : ''}
        ${usageSection}
      </div>
    </div>`;
  }

  /* fallback (classic 등) */
  return `<div class="meta-block meta-classic proverb-card rich-meta-card">
    <div class="mcc-header-row">
      ${headerLeft}
      ${headerRight}
    </div>
    <div class="mcc-body">
      ${definitionSection}
      ${(visualSection || relatedSection)
        ? `<div class="mcc-row-2col">${visualSection}${relatedSection}</div>`
        : ''}
      ${usageSection}
    </div>
  </div>`;
}
