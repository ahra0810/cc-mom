/**
 * 속담·관용어 카드용 자체 제작 SVG 장면 그림.
 *
 * - 전통 속담/관용어(공공 영역 표현)의 뜻을 직접 그린 원본 벡터 삽화.
 *   외부 교재·이미지 복제가 아닌 자체 도안.
 * - stroke/색은 카드 톤(청록 강조 + 짙은 회색)에 맞춤.
 * - viewBox 기반이라 카드 폭에 맞춰 자동 스케일 (.mcc-visual-svg CSS 공유).
 *
 * 키 = 속담/관용어 본문. defaultSets 에서 본문 일치 시 자동 주입.
 */

const A = '#0F8A7D'; // 청록 강조
const L = '#334155'; // 선·글자
const T = `font-family="Gowun Dodum, sans-serif" font-size="11" fill="${L}"`;
const TA = `font-family="Gowun Dodum, sans-serif" font-size="11" fill="${A}" font-weight="700"`;

/* 둥근 웃는 얼굴 / 찡그린 얼굴 헬퍼 — 인라인 사용 */
function face(cx: number, cy: number, happy: boolean): string {
  const mouth = happy
    ? `<path d="M${cx - 8} ${cy + 4} Q${cx} ${cy + 12} ${cx + 8} ${cy + 4}" fill="none" stroke="${L}" stroke-width="2"/>`
    : `<path d="M${cx - 8} ${cy + 9} Q${cx} ${cy + 1} ${cx + 8} ${cy + 9}" fill="none" stroke="${L}" stroke-width="2"/>`;
  return `<circle cx="${cx}" cy="${cy}" r="18" fill="${A}" opacity="${happy ? 0.18 : 0.08}" stroke="${L}" stroke-width="2"/>
    <circle cx="${cx - 6}" cy="${cy - 4}" r="2" fill="${L}"/><circle cx="${cx + 6}" cy="${cy - 4}" r="2" fill="${L}"/>
    ${mouth}`;
}

export const PROVERB_SVG: Record<string, string> = {
  /* 가는 말이 고와야 오는 말이 곱다 — 곱게 말하면 곱게 돌아옴 */
  '가는 말이 고와야 오는 말이 곱다': `<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="가는 말이 고와야 오는 말이 곱다">
    ${face(54, 56, true)}
    ${face(186, 56, true)}
    <path d="M76 46 H164" fill="none" stroke="${A}" stroke-width="2.5" marker-end="url(#pa1)"/>
    <path d="M164 70 H76" fill="none" stroke="${A}" stroke-width="2.5" marker-end="url(#pa1)"/>
    <defs><marker id="pa1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="${A}"/></marker></defs>
    <text x="120" y="40" text-anchor="middle" ${T}>고운 말</text>
    <text x="120" y="84" text-anchor="middle" ${T}>고운 답</text>
    <text x="120" y="120" text-anchor="middle" ${TA}>곱게 말하면 곱게 돌아와요</text>
  </svg>`,

  /* 백지장도 맞들면 낫다 — 함께 들면 가벼움 */
  '백지장도 맞들면 낫다': `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="백지장도 맞들면 낫다">
    <rect x="78" y="34" width="74" height="44" rx="3" fill="${A}" opacity="0.16" stroke="${L}" stroke-width="2"/>
    <circle cx="56" cy="70" r="14" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M56 84 V112 M56 92 L80 70 M56 92 L40 112 M56 112 L44 132 M56 112 L70 132" fill="none" stroke="${L}" stroke-width="2"/>
    <circle cx="174" cy="70" r="14" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M174 84 V112 M174 92 L150 70 M174 92 L190 112 M174 112 L162 132 M174 112 L188 132" fill="none" stroke="${L}" stroke-width="2"/>
    <text x="115" y="60" text-anchor="middle" ${T}>같이!</text>
    <text x="115" y="128" text-anchor="middle" ${TA}>함께 들면 더 쉬워요</text>
  </svg>`,

  /* 천 리 길도 한 걸음부터 — 작은 걸음이 모여 긴 길 */
  '천 리 길도 한 걸음부터': `<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="천 리 길도 한 걸음부터">
    <path d="M24 104 Q120 92 216 40" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="2 5"/>
    <g fill="${A}">
      <ellipse cx="40" cy="100" rx="7" ry="4"/><ellipse cx="68" cy="94" rx="7" ry="4" opacity="0.85"/>
      <ellipse cx="98" cy="86" rx="7" ry="4" opacity="0.7"/><ellipse cx="130" cy="76" rx="7" ry="4" opacity="0.55"/>
      <ellipse cx="164" cy="62" rx="7" ry="4" opacity="0.4"/><ellipse cx="198" cy="46" rx="7" ry="4" opacity="0.28"/>
    </g>
    <text x="34" y="122" ${TA}>첫 걸음</text>
    <text x="206" y="34" text-anchor="end" ${T}>천 리</text>
    <text x="120" y="20" text-anchor="middle" ${T}>작은 한 걸음이 모여 먼 길</text>
  </svg>`,
};

export const PHRASE_SVG: Record<string, string> = {
  /* 발이 넓다 — 아는 사람이 많음 (중심 인물 + 여러 연결) */
  '발이 넓다': `<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="발이 넓다">
    <circle cx="120" cy="70" r="16" fill="${A}" opacity="0.2" stroke="${L}" stroke-width="2"/>
    <text x="120" y="74" text-anchor="middle" ${T}>나</text>
    ${[[40, 32], [200, 32], [30, 86], [210, 86], [80, 122], [160, 122]]
      .map(([x, y]) => `<line x1="120" y1="70" x2="${x}" y2="${y}" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="11" fill="none" stroke="${L}" stroke-width="2"/>`)
      .join('')}
    <text x="120" y="18" text-anchor="middle" ${TA}>아는 사람이 아주 많아요</text>
  </svg>`,

  /* 손이 크다 — 푸짐하게 베풂 (큰 손 + 많은 음식) */
  '손이 크다': `<svg viewBox="0 0 230 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="손이 크다">
    <path d="M40 116 Q36 70 60 66 Q60 44 74 52 Q76 36 90 46 Q96 34 108 50 L112 116 Z" fill="${A}" opacity="0.16" stroke="${L}" stroke-width="2"/>
    <g fill="${A}">
      <circle cx="150" cy="56" r="11"/><circle cx="182" cy="50" r="11" opacity="0.8"/>
      <circle cx="170" cy="82" r="11" opacity="0.65"/><circle cx="200" cy="78" r="11" opacity="0.5"/>
      <circle cx="156" cy="106" r="11" opacity="0.4"/>
    </g>
    <text x="116" y="124" text-anchor="middle" ${T}>듬뿍!</text>
    <text x="120" y="22" text-anchor="middle" ${TA}>씀씀이가 후하고 넉넉해요</text>
  </svg>`,

  /* 입이 무겁다 — 비밀을 잘 지킴 (자물쇠 + 입) */
  '입이 무겁다': `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="입이 무겁다">
    <circle cx="110" cy="60" r="34" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <circle cx="100" cy="52" r="3" fill="${L}"/><circle cx="120" cy="52" r="3" fill="${L}"/>
    <rect x="98" y="68" width="24" height="6" rx="3" fill="${L}"/>
    <rect x="96" y="92" width="28" height="22" rx="3" fill="${A}" opacity="0.3" stroke="${L}" stroke-width="2"/>
    <path d="M102 92 V84 A8 8 0 0 1 118 84 V92" fill="none" stroke="${L}" stroke-width="2"/>
    <text x="110" y="132" text-anchor="middle" ${TA}>비밀을 끝까지 지켜요</text>
  </svg>`,
};
