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

/* 관용어 본문에서 신체 부위 키워드를 감지해 적절한 이모지 반환 */
function pickBodyEmoji(phrase: string): string {
  if (/입|혀|입술/.test(phrase)) return '👄';
  if (/눈|시선|눈빛/.test(phrase)) return '👁';
  if (/귀/.test(phrase)) return '👂';
  if (/코/.test(phrase)) return '👃';
  if (/손|손가락/.test(phrase)) return '✋';
  if (/발|걸음/.test(phrase)) return '🦶';
  if (/머리|이마/.test(phrase)) return '🧠';
  if (/어깨/.test(phrase)) return '💪';
  if (/배|뱃속/.test(phrase)) return '🫃';
  if (/마음|가슴/.test(phrase)) return '💗';
  return '✨';
}

export function renderIdiomaticMetaBlock(meta: IdiomaticPhraseMeta, t: SetTemplate): string {
  if (t.metaStyle === 'festive') {
    /* 우리 몸으로 배우는 관용어 — 앰버 + 핑크 + 신체 이모지 캐릭터 + 말풍선 */
    /* 관용어 본문에서 신체 부위 키워드를 자동 감지해 이모지 매칭 */
    const bodyEmoji = pickBodyEmoji(meta.phrase);
    return `<div class="meta-block meta-festive phrase-festive">
      <div class="festive-ribbon">${bodyEmoji} 우리 몸으로 배우는 관용어 ✨</div>
      <div class="festive-headline ipf-headline">
        <span class="ipf-emoji">${bodyEmoji}</span>
        <span class="festive-title ipf-title">${esc(meta.phrase)}</span>
      </div>
      <div class="festive-meaning">
        <span class="fm-label">뜻</span>
        <span class="fm-text">${esc(meta.meaning)}</span>
      </div>
      ${meta.example ? `<div class="ipf-example">💬 <strong>예문</strong> · ${esc(meta.example)}</div>` : ''}
    </div>`;
  }

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
