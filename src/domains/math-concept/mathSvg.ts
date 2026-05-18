/**
 * 수학 개념어 카드용 자체 제작 SVG 도형 모음.
 *
 * - 전부 표준 수학 도식을 직접 작성한 원본 벡터 그림 (외부 자료 복제 아님).
 * - stroke 는 currentColor 상속 → 템플릿 색에 자동 적응.
 * - viewBox 기반이라 카드 폭에 맞춰 자동 스케일.
 * - 라벨 폰트는 카드 본문 폰트(Gowun Dodum) 상속.
 *
 * 키 = 개념어 term. defaultSets 의 CS.svg 에서 MATH_SVG[term] 으로 주입.
 */

const A = '#0F8A7D'; // 강조 색(청록 계열) — 채움/포인트
const L = '#334155'; // 선·글자(짙은 회색)

/* 공통 텍스트 속성 */
const T = `font-family="Gowun Dodum, sans-serif" font-size="11" fill="${L}"`;
const TA = `font-family="Gowun Dodum, sans-serif" font-size="11" fill="${A}" font-weight="700"`;

export const MATH_SVG: Record<string, string> = {
  /* 반지름 — 원 + 중심 + 반지름선 + 지름선 */
  반지름: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="반지름 도형">
    <circle cx="110" cy="70" r="52" fill="none" stroke="${L}" stroke-width="2"/>
    <line x1="110" y1="70" x2="162" y2="70" stroke="${A}" stroke-width="3"/>
    <circle cx="110" cy="70" r="3.5" fill="${L}"/>
    <circle cx="162" cy="70" r="3.5" fill="${A}"/>
    <text x="110" y="60" text-anchor="middle" ${T}>중심</text>
    <text x="136" y="64" text-anchor="middle" ${TA}>반지름</text>
    <text x="110" y="134" text-anchor="middle" ${T}>지름 = 반지름 × 2</text>
  </svg>`,

  /* 지름 — 중심을 지나는 가장 긴 선 */
  지름: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="지름 도형">
    <circle cx="110" cy="65" r="52" fill="none" stroke="${L}" stroke-width="2"/>
    <line x1="58" y1="65" x2="162" y2="65" stroke="${A}" stroke-width="3"/>
    <circle cx="110" cy="65" r="3.5" fill="${L}"/>
    <text x="110" y="55" text-anchor="middle" ${T}>중심</text>
    <text x="110" y="84" text-anchor="middle" ${TA}>지름 (가장 긴 선분)</text>
    <text x="110" y="130" text-anchor="middle" ${T}>지름 = 반지름 × 2</text>
  </svg>`,

  /* 막대그래프 — 축 + 막대 3개 */
  막대그래프: `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="막대그래프">
    <line x1="34" y1="14" x2="34" y2="118" stroke="${L}" stroke-width="1.5"/>
    <line x1="34" y1="118" x2="200" y2="118" stroke="${L}" stroke-width="1.5"/>
    <rect x="52" y="48" width="34" height="70" fill="${A}" opacity="0.85"/>
    <rect x="102" y="78" width="34" height="40" fill="${A}" opacity="0.55"/>
    <rect x="152" y="38" width="34" height="80" fill="${A}"/>
    <text x="69" y="40" text-anchor="middle" ${T}>5</text>
    <text x="119" y="70" text-anchor="middle" ${T}>3</text>
    <text x="169" y="30" text-anchor="middle" ${TA}>8</text>
    <text x="69" y="132" text-anchor="middle" ${T}>사과</text>
    <text x="119" y="132" text-anchor="middle" ${T}>배</text>
    <text x="169" y="132" text-anchor="middle" ${T}>감</text>
    <text x="110" y="148" text-anchor="middle" ${TA}>막대 길이 = 양</text>
  </svg>`,

  /* 꺾은선그래프 — 축 + 점 잇는 선 */
  꺾은선그래프: `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="꺾은선그래프">
    <line x1="30" y1="14" x2="30" y2="116" stroke="${L}" stroke-width="1.5"/>
    <line x1="30" y1="116" x2="204" y2="116" stroke="${L}" stroke-width="1.5"/>
    <polyline points="52,88 96,52 140,72 184,34" fill="none" stroke="${A}" stroke-width="2.5"/>
    <circle cx="52" cy="88" r="4" fill="${A}"/>
    <circle cx="96" cy="52" r="4" fill="${A}"/>
    <circle cx="140" cy="72" r="4" fill="${A}"/>
    <circle cx="184" cy="34" r="4" fill="${A}"/>
    <text x="52" y="132" text-anchor="middle" ${T}>1월</text>
    <text x="96" y="132" text-anchor="middle" ${T}>2월</text>
    <text x="140" y="132" text-anchor="middle" ${T}>3월</text>
    <text x="184" y="132" text-anchor="middle" ${T}>4월</text>
    <text x="117" y="148" text-anchor="middle" ${TA}>점을 이어 변화 표시</text>
  </svg>`,

  /* 좌표 — 좌표평면 + 점 P(3,2) */
  좌표: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="좌표평면">
    <line x1="20" y1="120" x2="186" y2="120" stroke="${L}" stroke-width="1.5"/>
    <line x1="60" y1="20" x2="60" y2="150" stroke="${L}" stroke-width="1.5"/>
    <text x="190" y="124" ${T}>x</text>
    <text x="56" y="18" ${T}>y</text>
    <text x="52" y="134" ${T}>O</text>
    <line x1="138" y1="120" x2="138" y2="68" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <line x1="60" y1="68" x2="138" y2="68" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="138" cy="68" r="4.5" fill="${A}"/>
    <text x="146" y="60" ${TA}>P(3, 2)</text>
    <text x="138" y="138" text-anchor="middle" ${T}>x=3</text>
    <text x="40" y="72" text-anchor="middle" ${T}>y=2</text>
  </svg>`,

  /* 피타고라스 정리 — 직각삼각형 + 직각표시 */
  '피타고라스 정리': `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="직각삼각형">
    <polygon points="44,118 164,118 44,38" fill="${A}" opacity="0.12"/>
    <polyline points="164,118 44,118 44,38 164,118" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M44 100 L62 100 L62 118" fill="none" stroke="${L}" stroke-width="1.5"/>
    <text x="104" y="134" text-anchor="middle" ${T}>b</text>
    <text x="32" y="82" text-anchor="middle" ${T}>a</text>
    <text x="112" y="74" text-anchor="middle" ${TA}>c (빗변)</text>
    <text x="110" y="26" text-anchor="middle" ${TA}>a² + b² = c²</text>
  </svg>`,

  /* 삼각비 — 직각삼각형 + 각 A */
  삼각비: `<svg viewBox="0 0 230 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="삼각비 직각삼각형">
    <polyline points="40,120 180,120 180,40 40,120" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M164 120 L164 104 L180 104" fill="none" stroke="${L}" stroke-width="1.5"/>
    <path d="M40 120 A26 26 0 0 1 64 109" fill="none" stroke="${A}" stroke-width="2"/>
    <text x="56" y="116" ${TA}>A</text>
    <text x="110" y="135" text-anchor="middle" ${T}>밑변</text>
    <text x="190" y="84" ${T}>높이</text>
    <text x="98" y="72" text-anchor="middle" ${TA}>빗변</text>
    <text x="115" y="26" text-anchor="middle" ${T}>sin = 높이÷빗변</text>
  </svg>`,

  /* 부채꼴 — 원 + 색칠된 부채꼴 + 중심각 */
  부채꼴: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="부채꼴">
    <circle cx="100" cy="78" r="56" fill="none" stroke="${L}" stroke-width="1.5"/>
    <path d="M100 78 L156 78 A56 56 0 0 0 128 29 Z" fill="${A}" opacity="0.4" stroke="${A}" stroke-width="2"/>
    <circle cx="100" cy="78" r="3" fill="${L}"/>
    <text x="120" y="64" ${TA}>중심각</text>
    <text x="150" y="58" ${T}>호</text>
    <text x="128" y="92" ${T}>반지름</text>
    <text x="100" y="146" text-anchor="middle" ${TA}>피자 한 조각 모양</text>
  </svg>`,

  /* 중심각 — 원 + 두 반지름 사이 각 */
  중심각: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="중심각">
    <circle cx="100" cy="76" r="54" fill="none" stroke="${L}" stroke-width="1.5"/>
    <line x1="100" y1="76" x2="154" y2="76" stroke="${A}" stroke-width="2.5"/>
    <line x1="100" y1="76" x2="127" y2="29" stroke="${A}" stroke-width="2.5"/>
    <path d="M128 76 A28 28 0 0 0 114 52" fill="none" stroke="${A}" stroke-width="2"/>
    <circle cx="100" cy="76" r="3" fill="${L}"/>
    <text x="112" y="86" ${TA}>각</text>
    <text x="100" y="142" text-anchor="middle" ${T}>두 반지름이 벌어진 각</text>
  </svg>`,

  /* 직사각형 — 변 라벨 + 직각표시 */
  직사각형: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="직사각형">
    <rect x="44" y="34" width="132" height="74" fill="${A}" opacity="0.1" stroke="${L}" stroke-width="2"/>
    <path d="M44 50 L60 50 L60 34" fill="none" stroke="${L}" stroke-width="1.5"/>
    <text x="110" y="26" text-anchor="middle" ${T}>가로</text>
    <text x="188" y="74" ${T}>세로</text>
    <text x="110" y="132" text-anchor="middle" ${TA}>네 각 모두 90°</text>
  </svg>`,

  /* 직각삼각형 (정삼각형/이등변 대표로도 활용 가능) */
  직각: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="직각">
    <polyline points="40,100 150,100 40,30" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M40 84 L56 84 L56 100" fill="none" stroke="${A}" stroke-width="2"/>
    <text x="63" y="96" ${TA}>90°</text>
    <text x="100" y="122" text-anchor="middle" ${T}>두 변이 직각으로 만남</text>
  </svg>`,

  /* 원그래프 — 원 + 비율 부채꼴 3개 */
  원그래프: `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원그래프">
    <circle cx="78" cy="74" r="54" fill="#fff" stroke="${L}" stroke-width="1.5"/>
    <path d="M78 74 L78 20 A54 54 0 0 1 126 99 Z" fill="${A}"/>
    <path d="M78 74 L126 99 A54 54 0 0 1 47 119 Z" fill="${A}" opacity="0.55"/>
    <path d="M78 74 L47 119 A54 54 0 0 1 78 20 Z" fill="${A}" opacity="0.25"/>
    <text x="170" y="56" ${TA}>🔵 40%</text>
    <text x="170" y="80" ${T}>🟢 35%</text>
    <text x="170" y="104" ${T}>🟡 25%</text>
    <text x="110" y="144" text-anchor="middle" ${T}>전체 = 100%</text>
  </svg>`,
};
