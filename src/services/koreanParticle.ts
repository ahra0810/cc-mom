/**
 * 한글 조사 자동 선택 + PDF 메타 박스 공통 escape 헬퍼.
 *
 * 받침 유무 기반으로 은/는·을/를 자동 선택하여 "은(는)" 같은 어색한 병기를 제거.
 * 끝에 붙은 구두점·이모지·따옴표 등은 무시하고 마지막 한글 음절을 기준으로 판단.
 *
 * + visualEmoji 류 텍스트의 마크업 escape 두 종류:
 *   - esc:    일반 — \n → <br>, HTML 특수문자 escape
 *   - escPre: visualEmoji 전용 — \n 보존 (white-space:pre-line CSS가 처리)
 *             + **xxx** → <strong class="mcc-em">xxx</strong> 강조 마크업
 */

/* ─── 한글 조사 ─── */

export function lastHangul(text: string): string {
  for (let i = text.length - 1; i >= 0; i--) {
    const code = text.charCodeAt(i);
    if (code >= 0xAC00 && code <= 0xD7A3) return text[i];
  }
  return '';
}

export function hasJongseong(syllable: string): boolean {
  if (!syllable) return false;
  const code = syllable.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return false;
  return ((code - 0xAC00) % 28) !== 0;
}

/** 받침 O → '은', X → '는' */
export function eunNeun(word: string): string {
  return hasJongseong(lastHangul(word)) ? '은' : '는';
}

/** 받침 O → '을', X → '를' */
export function eulReul(word: string): string {
  return hasJongseong(lastHangul(word)) ? '을' : '를';
}

/** 받침 O → '이', X → '가' */
export function iGa(word: string): string {
  return hasJongseong(lastHangul(word)) ? '이' : '가';
}

/** 받침 O → '와', X → '과' (문어/구어 모두 통용) */
export function gwaWa(word: string): string {
  return hasJongseong(lastHangul(word)) ? '과' : '와';
}

/* ─── HTML escape ─── */

/** 일반 텍스트 — HTML 특수문자 escape + \n → <br> */
export function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/**
 * visualEmoji 전용: <br> 변환 X — `white-space: pre-line` CSS 가 \n 을 직접 처리.
 *  + **xxx** 마크업을 primary 컬러 강조로 변환 (기본은 검정, 중요한 단어만 색상).
 */
export function escPre(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  /* **xxx** → <strong class="mcc-em">xxx</strong>
   * 같은 줄 안에서만 매칭 (줄바꿈은 매칭 안 함) — 마크업 누락 방지 */
  return escaped.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="mcc-em">$1</strong>');
}
