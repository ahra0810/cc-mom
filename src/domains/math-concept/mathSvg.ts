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

  /* 변 — 다각형의 한 변 강조 */
  변: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="변">
    <polygon points="50,40 170,40 190,108 30,108" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <line x1="170" y1="40" x2="190" y2="108" stroke="${A}" stroke-width="4"/>
    <circle cx="50" cy="40" r="3" fill="${L}"/><circle cx="170" cy="40" r="3" fill="${L}"/>
    <circle cx="190" cy="108" r="3" fill="${L}"/><circle cx="30" cy="108" r="3" fill="${L}"/>
    <text x="196" y="78" ${TA}>변</text>
    <text x="110" y="132" text-anchor="middle" ${T}>곧은 선분 하나하나 = 변</text>
  </svg>`,

  /* 선분 — 두 점 사이 곧은 선 */
  선분: `<svg viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="선분">
    <line x1="42" y1="56" x2="178" y2="56" stroke="${A}" stroke-width="3"/>
    <circle cx="42" cy="56" r="5" fill="${L}"/><circle cx="178" cy="56" r="5" fill="${L}"/>
    <text x="38" y="40" ${T}>ㄱ</text><text x="174" y="40" ${T}>ㄴ</text>
    <text x="110" y="92" text-anchor="middle" ${TA}>선분 ㄱㄴ</text>
  </svg>`,

  /* 각 — 한 점에서 두 반직선 */
  각: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="각">
    <line x1="44" y1="100" x2="190" y2="100" stroke="${L}" stroke-width="2"/>
    <line x1="44" y1="100" x2="168" y2="28" stroke="${L}" stroke-width="2"/>
    <path d="M88 100 A44 44 0 0 0 74 78" fill="none" stroke="${A}" stroke-width="2.5"/>
    <circle cx="44" cy="100" r="3.5" fill="${L}"/>
    <text x="84" y="84" ${TA}>각</text>
    <text x="110" y="122" text-anchor="middle" ${T}>두 선이 벌어진 정도 = 각의 크기</text>
  </svg>`,

  /* 정사각형 */
  정사각형: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="정사각형">
    <rect x="64" y="26" width="84" height="84" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <path d="M64 42 L80 42 L80 26" fill="none" stroke="${L}" stroke-width="1.5"/>
    <text x="106" y="20" text-anchor="middle" ${T}>같은 길이</text>
    <text x="106" y="130" text-anchor="middle" ${TA}>네 변·네 각 모두 같음</text>
  </svg>`,

  /* 원의 중심 */
  '원의 중심': `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원의 중심">
    <circle cx="100" cy="64" r="50" fill="none" stroke="${L}" stroke-width="2"/>
    <circle cx="100" cy="64" r="4.5" fill="${A}"/>
    <line x1="100" y1="64" x2="138" y2="40" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <line x1="100" y1="64" x2="64" y2="92" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="100" y="56" text-anchor="middle" ${TA}>중심</text>
    <text x="100" y="132" text-anchor="middle" ${T}>어디서 재도 원까지 거리 같음</text>
  </svg>`,

  /* 예각 — 좁은 각 */
  예각: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="예각">
    <line x1="40" y1="96" x2="178" y2="96" stroke="${L}" stroke-width="2"/>
    <line x1="40" y1="96" x2="150" y2="44" stroke="${L}" stroke-width="2"/>
    <path d="M78 96 A38 38 0 0 0 70 80" fill="none" stroke="${A}" stroke-width="2.5"/>
    <text x="86" y="88" ${TA}>&lt;90°</text>
    <text x="100" y="114" text-anchor="middle" ${T}>직각보다 좁은 각</text>
  </svg>`,

  /* 둔각 — 넓은 각 */
  둔각: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="둔각">
    <line x1="44" y1="92" x2="184" y2="92" stroke="${L}" stroke-width="2"/>
    <line x1="44" y1="92" x2="92" y2="28" stroke="${L}" stroke-width="2"/>
    <path d="M84 92 A40 40 0 0 0 70 58" fill="none" stroke="${A}" stroke-width="2.5"/>
    <text x="92" y="74" ${TA}>&gt;90°</text>
    <text x="110" y="112" text-anchor="middle" ${T}>직각보다 넓은 각</text>
  </svg>`,

  /* 수직 — 두 직선 90° */
  수직: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="수직">
    <line x1="24" y1="70" x2="176" y2="70" stroke="${L}" stroke-width="2"/>
    <line x1="100" y1="16" x2="100" y2="116" stroke="${L}" stroke-width="2"/>
    <path d="M100 84 L86 84 L86 70" fill="none" stroke="${A}" stroke-width="2"/>
    <text x="78" y="98" ${TA}>90°</text>
    <text x="100" y="128" text-anchor="middle" ${T}>두 직선이 직각으로 만남</text>
  </svg>`,

  /* 평행 — 만나지 않는 두 직선 */
  평행: `<svg viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="평행">
    <line x1="24" y1="44" x2="176" y2="44" stroke="${A}" stroke-width="2.5"/>
    <line x1="24" y1="74" x2="176" y2="74" stroke="${A}" stroke-width="2.5"/>
    <text x="184" y="48" ${T}>↑</text><text x="184" y="78" ${T}>↑</text>
    <text x="100" y="100" text-anchor="middle" ${TA}>아무리 늘여도 안 만남</text>
  </svg>`,

  /* 이등변삼각형 */
  이등변삼각형: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="이등변삼각형">
    <polygon points="100,24 48,116 152,116" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <text x="60" y="68" ${TA}>같음</text><text x="140" y="68" text-anchor="end" ${TA}>같음</text>
    <text x="100" y="134" text-anchor="middle" ${T}>두 변이 같으면 두 밑각도 같음</text>
  </svg>`,

  /* 정삼각형 */
  정삼각형: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="정삼각형">
    <polygon points="100,22 44,118 156,118" fill="${A}" opacity="0.14" stroke="${L}" stroke-width="2"/>
    <text x="70" y="74" ${T}>60°</text><text x="130" y="74" text-anchor="end" ${T}>60°</text>
    <text x="100" y="110" text-anchor="middle" ${T}>60°</text>
    <text x="100" y="134" text-anchor="middle" ${TA}>세 변·세 각 모두 같음</text>
  </svg>`,

  /* 사다리꼴 */
  사다리꼴: `<svg viewBox="0 0 210 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="사다리꼴">
    <polygon points="70,30 140,30 180,104 30,104" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <text x="105" y="24" text-anchor="middle" ${T}>윗변</text>
    <text x="105" y="120" text-anchor="middle" ${T}>아랫변</text>
    <text x="105" y="70" text-anchor="middle" ${TA}>한 쌍만 평행 ∥</text>
  </svg>`,

  /* 평행사변형 */
  평행사변형: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="평행사변형">
    <polygon points="62,30 196,30 158,104 24,104" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <text x="110" y="70" text-anchor="middle" ${TA}>두 쌍 모두 평행 ∥</text>
    <text x="110" y="124" text-anchor="middle" ${T}>마주 보는 변·각이 같음</text>
  </svg>`,

  /* 마름모 */
  마름모: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="마름모">
    <polygon points="100,22 162,75 100,128 38,75" fill="${A}" opacity="0.14" stroke="${L}" stroke-width="2"/>
    <line x1="100" y1="22" x2="100" y2="128" stroke="${A}" stroke-width="1" stroke-dasharray="3 3"/>
    <line x1="38" y1="75" x2="162" y2="75" stroke="${A}" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="100" y="146" text-anchor="middle" ${TA}>네 변 모두 같음 · 대각선 수직</text>
  </svg>`,

  /* 다각형 */
  다각형: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="다각형">
    <polygon points="40,40 80,108 30,108" fill="none" stroke="${L}" stroke-width="2"/>
    <rect x="92" y="44" width="48" height="48" fill="none" stroke="${L}" stroke-width="2"/>
    <polygon points="178,38 200,62 191,94 165,94 156,62" fill="none" stroke="${L}" stroke-width="2"/>
    <text x="55" y="124" text-anchor="middle" ${T}>3변</text>
    <text x="116" y="124" text-anchor="middle" ${T}>4변</text>
    <text x="178" y="124" text-anchor="middle" ${T}>5변</text>
    <text x="110" y="22" text-anchor="middle" ${TA}>선분으로만 둘러싸인 도형</text>
  </svg>`,

  /* 정다각형 */
  정다각형: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="정다각형">
    <polygon points="55,34 80,98 30,98" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <rect x="95" y="40" width="46" height="46" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <polygon points="180,32 202,55 193,86 167,86 158,55" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <text x="110" y="120" text-anchor="middle" ${TA}>변·각이 모두 같은 다각형</text>
  </svg>`,

  /* 대각선 */
  대각선: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="대각선">
    <polygon points="100,22 168,68 142,124 58,124 32,68" fill="none" stroke="${L}" stroke-width="2"/>
    <line x1="100" y1="22" x2="142" y2="124" stroke="${A}" stroke-width="2"/>
    <line x1="100" y1="22" x2="58" y2="124" stroke="${A}" stroke-width="2"/>
    <text x="100" y="14" text-anchor="middle" ${T}>이웃 아닌 꼭짓점 연결</text>
    <text x="100" y="138" text-anchor="middle" ${TA}>= 대각선</text>
  </svg>`,

  /* 넓이 — 단위 칸으로 채운 직사각형 */
  넓이: `<svg viewBox="0 0 210 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="넓이">
    <g stroke="${L}" stroke-width="1">
    ${Array.from({ length: 4 }, (_, r) => Array.from({ length: 6 }, (_, c) =>
      `<rect x="${44 + c * 20}" y="${22 + r * 20}" width="20" height="20" fill="${A}" opacity="0.18"/>`).join('')).join('')}
    </g>
    <text x="104" y="118" text-anchor="middle" ${T}>가로 6 × 세로 4</text>
    <text x="104" y="16" text-anchor="middle" ${TA}>= 넓이 24 cm²</text>
  </svg>`,

  /* 합동 — 포개지는 두 삼각형 */
  합동: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="합동">
    <polygon points="36,28 92,28 36,100" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <polygon points="128,28 184,28 128,100" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <text x="108" y="66" text-anchor="middle" ${TA}>≡</text>
    <text x="110" y="122" text-anchor="middle" ${T}>포개면 완전히 겹침</text>
  </svg>`,

  /* 선대칭도형 — 대칭축 */
  선대칭도형: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="선대칭도형">
    <polygon points="100,20 60,70 100,120 140,70" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <line x1="100" y1="12" x2="100" y2="128" stroke="${A}" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="148" y="40" ${TA}>대칭축</text>
    <text x="100" y="138" text-anchor="middle" ${T}>접으면 양쪽이 겹침</text>
  </svg>`,

  /* 점대칭도형 — 180° 회전 */
  점대칭도형: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="점대칭도형">
    <path d="M60 40 Q100 20 100 56 Q100 92 140 72" fill="none" stroke="${L}" stroke-width="3"/>
    <circle cx="100" cy="56" r="4" fill="${A}"/>
    <text x="112" y="50" ${TA}>중심</text>
    <text x="100" y="120" text-anchor="middle" ${T}>180° 돌리면 처음과 똑같음</text>
  </svg>`,

  /* 내각 — 삼각형 세 내각 */
  내각: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="내각">
    <polygon points="110,24 40,108 180,108" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <path d="M100 38 A20 20 0 0 1 120 38" fill="none" stroke="${A}" stroke-width="2"/>
    <path d="M58 100 A18 18 0 0 1 70 86" fill="none" stroke="${A}" stroke-width="2"/>
    <path d="M150 86 A18 18 0 0 1 162 100" fill="none" stroke="${A}" stroke-width="2"/>
    <text x="110" y="124" text-anchor="middle" ${TA}>삼각형 세 내각의 합 = 180°</text>
  </svg>`,

  /* 외각 — 내각+외각=180 */
  외각: `<svg viewBox="0 0 230 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="외각">
    <line x1="30" y1="84" x2="210" y2="84" stroke="${L}" stroke-width="2"/>
    <line x1="120" y1="84" x2="70" y2="24" stroke="${L}" stroke-width="2"/>
    <path d="M104 84 A16 16 0 0 0 110 68" fill="none" stroke="${L}" stroke-width="2"/>
    <path d="M136 84 A16 16 0 0 1 130 68" fill="none" stroke="${A}" stroke-width="2.5"/>
    <text x="98" y="78" ${T}>내각</text><text x="146" y="78" ${TA}>외각</text>
    <text x="115" y="112" text-anchor="middle" ${T}>내각 + 외각 = 180°</text>
  </svg>`,

  /* 동위각 */
  동위각: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="동위각">
    <line x1="24" y1="48" x2="196" y2="48" stroke="${L}" stroke-width="2"/>
    <line x1="24" y1="100" x2="196" y2="100" stroke="${L}" stroke-width="2"/>
    <line x1="70" y1="20" x2="150" y2="128" stroke="${L}" stroke-width="2"/>
    <circle cx="98" cy="48" r="5" fill="${A}"/>
    <circle cx="119" cy="100" r="5" fill="${A}"/>
    <text x="110" y="136" text-anchor="middle" ${TA}>같은 위치의 두 각</text>
  </svg>`,

  /* 엇각 */
  엇각: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="엇각">
    <line x1="24" y1="48" x2="196" y2="48" stroke="${L}" stroke-width="2"/>
    <line x1="24" y1="100" x2="196" y2="100" stroke="${L}" stroke-width="2"/>
    <line x1="70" y1="20" x2="150" y2="128" stroke="${L}" stroke-width="2"/>
    <circle cx="118" cy="48" r="5" fill="${A}"/>
    <circle cx="99" cy="100" r="5" fill="${A}"/>
    <text x="110" y="136" text-anchor="middle" ${TA}>엇갈린 위치의 두 각</text>
  </svg>`,

  /* 원주 — 원 둘레 강조 */
  원주: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원주">
    <circle cx="100" cy="64" r="48" fill="none" stroke="${A}" stroke-width="4"/>
    <line x1="52" y1="64" x2="148" y2="64" stroke="${L}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="100" y="58" text-anchor="middle" ${T}>지름</text>
    <text x="100" y="132" text-anchor="middle" ${TA}>원의 둘레 = 지름 × 원주율</text>
  </svg>`,

  /* 원기둥 */
  원기둥: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원기둥">
    <ellipse cx="100" cy="34" rx="46" ry="14" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <path d="M54 34 V112 A46 14 0 0 0 146 112 V34" fill="${A}" opacity="0.08" stroke="${L}" stroke-width="2"/>
    <text x="100" y="142" text-anchor="middle" ${TA}>위·아래가 합동인 원</text>
  </svg>`,

  /* 원뿔 */
  원뿔: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원뿔">
    <path d="M100 24 L150 110 A50 14 0 0 1 50 110 Z" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <ellipse cx="100" cy="110" rx="50" ry="14" fill="none" stroke="${L}" stroke-width="2" stroke-dasharray="4 3"/>
    <circle cx="100" cy="24" r="3" fill="${A}"/>
    <text x="100" y="142" text-anchor="middle" ${TA}>밑면 = 원 1개, 꼭짓점 1개</text>
  </svg>`,

  /* 구 */
  구: `<svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="구">
    <circle cx="90" cy="68" r="50" fill="${A}" opacity="0.12" stroke="${L}" stroke-width="2"/>
    <ellipse cx="90" cy="68" rx="50" ry="16" fill="none" stroke="${L}" stroke-width="1.2" stroke-dasharray="4 3"/>
    <circle cx="90" cy="68" r="3" fill="${A}"/>
    <text x="90" y="142" text-anchor="middle" ${TA}>공 모양 — 중심서 거리 같음</text>
  </svg>`,

  /* 띠그래프 */
  띠그래프: `<svg viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="띠그래프">
    <rect x="20" y="40" width="72" height="30" fill="${A}"/>
    <rect x="92" y="40" width="63" height="30" fill="${A}" opacity="0.6"/>
    <rect x="155" y="40" width="45" height="30" fill="${A}" opacity="0.32"/>
    <rect x="20" y="40" width="180" height="30" fill="none" stroke="${L}" stroke-width="1.5"/>
    <text x="56" y="60" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="10" fill="#fff">40%</text>
    <text x="123" y="60" text-anchor="middle" ${T}>35%</text>
    <text x="178" y="60" text-anchor="middle" ${T}>25%</text>
    <text x="110" y="96" text-anchor="middle" ${TA}>전체 띠를 비율만큼 나눔</text>
  </svg>`,

  /* 정비례 — 원점 지나는 직선 */
  정비례: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="정비례">
    <line x1="30" y1="120" x2="186" y2="120" stroke="${L}" stroke-width="1.5"/>
    <line x1="40" y1="20" x2="40" y2="134" stroke="${L}" stroke-width="1.5"/>
    <line x1="40" y1="120" x2="170" y2="34" stroke="${A}" stroke-width="2.5"/>
    <circle cx="40" cy="120" r="3" fill="${L}"/>
    <text x="190" y="124" ${T}>x</text><text x="34" y="18" ${T}>y</text>
    <text x="110" y="146" text-anchor="middle" ${TA}>x 커지면 y도 같은 배로 ↑</text>
  </svg>`,

  /* 반비례 — 쌍곡선 */
  반비례: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="반비례">
    <line x1="30" y1="124" x2="186" y2="124" stroke="${L}" stroke-width="1.5"/>
    <line x1="44" y1="20" x2="44" y2="138" stroke="${L}" stroke-width="1.5"/>
    <path d="M54 36 Q70 110 170 116" fill="none" stroke="${A}" stroke-width="2.5"/>
    <text x="190" y="128" ${T}>x</text><text x="38" y="18" ${T}>y</text>
    <text x="110" y="146" text-anchor="middle" ${TA}>x 커지면 y는 그만큼 ↓</text>
  </svg>`,

  /* 함수 — 입력→상자→출력 */
  함수: `<svg viewBox="0 0 230 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="함수">
    <rect x="84" y="34" width="64" height="44" rx="6" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <text x="116" y="62" text-anchor="middle" ${TA}>함수 f</text>
    <line x1="34" y1="56" x2="82" y2="56" stroke="${L}" stroke-width="2" marker-end="url(#ar)"/>
    <line x1="150" y1="56" x2="198" y2="56" stroke="${L}" stroke-width="2" marker-end="url(#ar)"/>
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="${L}"/></marker></defs>
    <text x="28" y="60" text-anchor="end" ${T}>x</text>
    <text x="208" y="60" ${T}>y</text>
    <text x="115" y="100" text-anchor="middle" ${T}>입력 1개 → 출력 1개</text>
  </svg>`,

  /* 일차함수 — 기울기 있는 직선 */
  일차함수: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="일차함수">
    <line x1="24" y1="118" x2="186" y2="118" stroke="${L}" stroke-width="1.5"/>
    <line x1="46" y1="20" x2="46" y2="134" stroke="${L}" stroke-width="1.5"/>
    <line x1="30" y1="124" x2="178" y2="40" stroke="${A}" stroke-width="2.5"/>
    <circle cx="46" cy="100" r="4" fill="${A}"/>
    <text x="56" y="98" ${T}>y절편</text>
    <text x="110" y="146" text-anchor="middle" ${TA}>y = ax + b · 그래프는 직선</text>
  </svg>`,

  /* 이차함수 / 포물선 */
  이차함수: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="이차함수">
    <line x1="24" y1="120" x2="186" y2="120" stroke="${L}" stroke-width="1.5"/>
    <line x1="100" y1="18" x2="100" y2="136" stroke="${L}" stroke-width="1.5"/>
    <path d="M44 32 Q100 156 156 32" fill="none" stroke="${A}" stroke-width="2.5"/>
    <circle cx="100" cy="118" r="4" fill="${A}"/>
    <text x="108" y="112" ${T}>꼭짓점</text>
    <text x="110" y="148" text-anchor="middle" ${TA}>y = ax² · 그래프는 포물선</text>
  </svg>`,

  포물선: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="포물선">
    <line x1="24" y1="120" x2="186" y2="120" stroke="${L}" stroke-width="1.5"/>
    <line x1="100" y1="18" x2="100" y2="136" stroke="${L}" stroke-width="1.5"/>
    <path d="M44 32 Q100 156 156 32" fill="none" stroke="${A}" stroke-width="2.5"/>
    <line x1="100" y1="18" x2="100" y2="136" stroke="${A}" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="110" y="146" text-anchor="middle" ${TA}>좌우 대칭 곡선</text>
  </svg>`,

  /* 원주각 — 원 위 점에서 본 각 */
  원주각: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원주각">
    <circle cx="100" cy="78" r="56" fill="none" stroke="${L}" stroke-width="1.5"/>
    <circle cx="56" cy="52" r="4" fill="${A}"/>
    <line x1="56" y1="52" x2="62" y2="130" stroke="${A}" stroke-width="2"/>
    <line x1="56" y1="52" x2="150" y2="98" stroke="${A}" stroke-width="2"/>
    <text x="46" y="48" ${TA}>P</text>
    <text x="100" y="146" text-anchor="middle" ${T}>원주각 = 중심각 ÷ 2</text>
  </svg>`,

  /* 절댓값 — 수직선 거리 */
  절댓값: `<svg viewBox="0 0 230 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="절댓값">
    <line x1="20" y1="52" x2="210" y2="52" stroke="${L}" stroke-width="2"/>
    ${[-3, -2, -1, 0, 1, 2, 3].map((n, i) => `<line x1="${35 + i * 27}" y1="47" x2="${35 + i * 27}" y2="57" stroke="${L}" stroke-width="1.5"/><text x="${35 + i * 27}" y="74" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="10" fill="${L}">${n}</text>`).join('')}
    <path d="M62 38 Q116 18 116 38" fill="none" stroke="${A}" stroke-width="2"/>
    <text x="89" y="20" text-anchor="middle" ${TA}>거리 3</text>
    <text x="115" y="94" text-anchor="middle" ${T}>0에서 떨어진 거리 |−3| = 3</text>
  </svg>`,

  /* 실수 — 수직선 가득 채움 */
  실수: `<svg viewBox="0 0 230 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="실수">
    <line x1="20" y1="44" x2="210" y2="44" stroke="${A}" stroke-width="3"/>
    ${[-2, -1, 0, 1, 2].map((n, i) => `<line x1="${50 + i * 33}" y1="38" x2="${50 + i * 33}" y2="50" stroke="${L}" stroke-width="1.5"/><text x="${50 + i * 33}" y="66" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="10" fill="${L}">${n}</text>`).join('')}
    <text x="115" y="84" text-anchor="middle" ${TA}>유리수+무리수로 빈틈없이 채움</text>
  </svg>`,

  /* 부등식 — 수직선 해 표시 */
  부등식: `<svg viewBox="0 0 230 95" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="부등식">
    <line x1="20" y1="46" x2="210" y2="46" stroke="${L}" stroke-width="2"/>
    ${[0, 1, 2, 3, 4, 5].map((n, i) => `<line x1="${40 + i * 30}" y1="41" x2="${40 + i * 30}" y2="51" stroke="${L}" stroke-width="1.2"/><text x="${40 + i * 30}" y="68" text-anchor="middle" font-family="Gowun Dodum,sans-serif" font-size="10" fill="${L}">${n}</text>`).join('')}
    <line x1="130" y1="46" x2="210" y2="46" stroke="${A}" stroke-width="4"/>
    <circle cx="130" cy="46" r="5" fill="#fff" stroke="${A}" stroke-width="2.5"/>
    <text x="120" y="88" text-anchor="middle" ${TA}>x &gt; 3 의 해 (○ = 3 제외)</text>
  </svg>`,

  /* 평균 — 막대 고르게 평탄화 */
  평균: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="평균">
    <line x1="28" y1="104" x2="200" y2="104" stroke="${L}" stroke-width="1.5"/>
    <rect x="44" y="64" width="26" height="40" fill="${A}" opacity="0.4"/>
    <rect x="84" y="44" width="26" height="60" fill="${A}" opacity="0.4"/>
    <rect x="124" y="84" width="26" height="20" fill="${A}" opacity="0.4"/>
    <line x1="36" y1="68" x2="166" y2="68" stroke="${A}" stroke-width="2.5" stroke-dasharray="5 3"/>
    <text x="172" y="66" ${TA}>평균</text>
    <text x="110" y="124" text-anchor="middle" ${T}>고르게 폈을 때의 한 값</text>
  </svg>`,

  /* 직육면체 (기존 emoji보다 도형으로) */
  직육면체: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="직육면체">
    <rect x="40" y="44" width="92" height="64" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <polygon points="40,44 64,24 156,24 132,44" fill="${A}" opacity="0.16" stroke="${L}" stroke-width="2"/>
    <polygon points="132,44 156,24 156,88 132,108" fill="${A}" opacity="0.06" stroke="${L}" stroke-width="2"/>
    <text x="100" y="140" text-anchor="middle" ${TA}>면 6 · 모서리 12 · 꼭짓점 8</text>
  </svg>`,

  /* 각기둥 */
  각기둥: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="각기둥">
    <polygon points="56,30 110,30 134,46 80,46" fill="${A}" opacity="0.16" stroke="${L}" stroke-width="2"/>
    <path d="M56 30 V108 L80 124 V46 M110 30 V108 L134 124 V46 M80 124 H134 M56 108 H110" fill="none" stroke="${L}" stroke-width="2"/>
    <text x="100" y="142" text-anchor="middle" ${TA}>위·아래 합동 · 옆면 직사각형</text>
  </svg>`,

  /* 각뿔 */
  각뿔: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="각뿔">
    <polygon points="100,22 60,104 110,120 150,98" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <path d="M100 22 L110 120 M60 104 L150 98" fill="none" stroke="${L}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="100" cy="22" r="3" fill="${A}"/>
    <text x="100" y="142" text-anchor="middle" ${TA}>밑면 1개 · 옆면 모두 삼각형</text>
  </svg>`,

  /* 전개도 */
  전개도: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="전개도">
    <g fill="${A}" opacity="0.14" stroke="${L}" stroke-width="1.5">
      <rect x="78" y="20" width="36" height="36"/>
      <rect x="42" y="56" width="36" height="36"/><rect x="78" y="56" width="36" height="36"/>
      <rect x="114" y="56" width="36" height="36"/><rect x="150" y="56" width="36" height="36"/>
      <rect x="78" y="92" width="36" height="36"/>
    </g>
    <text x="110" y="144" text-anchor="middle" ${TA}>접으면 정육면체가 됨</text>
  </svg>`,

  /* 겉넓이 */
  겉넓이: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="겉넓이">
    <rect x="40" y="48" width="86" height="60" fill="${A}" opacity="0.22" stroke="${L}" stroke-width="2"/>
    <polygon points="40,48 62,28 148,28 126,48" fill="${A}" opacity="0.34" stroke="${L}" stroke-width="2"/>
    <polygon points="126,48 148,28 148,88 126,108" fill="${A}" opacity="0.14" stroke="${L}" stroke-width="2"/>
    <text x="100" y="142" text-anchor="middle" ${TA}>모든 겉면의 넓이의 합</text>
  </svg>`,

  /* 부피 */
  부피: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="부피">
    <rect x="44" y="50" width="84" height="58" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <polygon points="44,50 66,30 150,30 128,50" fill="${A}" opacity="0.16" stroke="${L}" stroke-width="2"/>
    <polygon points="128,50 150,30 150,88 128,108" fill="${A}" opacity="0.06" stroke="${L}" stroke-width="2"/>
    <text x="92" y="84" text-anchor="middle" ${T}>가로×세로×높이</text>
    <text x="100" y="140" text-anchor="middle" ${TA}>공간을 차지하는 크기</text>
  </svg>`,

  /* 둘레 — 직사각형 네 변 강조 */
  둘레: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="둘레">
    <rect x="50" y="30" width="120" height="64" fill="none" stroke="${A}" stroke-width="4"/>
    <text x="110" y="24" text-anchor="middle" ${T}>5</text>
    <text x="110" y="110" text-anchor="middle" ${T}>5</text>
    <text x="40" y="66" text-anchor="end" ${T}>3</text>
    <text x="180" y="66" ${T}>3</text>
    <text x="110" y="126" text-anchor="middle" ${TA}>네 변의 합 5+3+5+3 = 16</text>
  </svg>`,

  /* 외심 — 외접원 + 중심 */
  외심: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="외심">
    <circle cx="100" cy="74" r="56" fill="none" stroke="${L}" stroke-width="1.5" stroke-dasharray="4 3"/>
    <polygon points="100,18 152,104 48,104" fill="${A}" opacity="0.10" stroke="${L}" stroke-width="2"/>
    <circle cx="100" cy="74" r="4" fill="${A}"/>
    <text x="108" y="70" ${TA}>외심</text>
    <text x="100" y="144" text-anchor="middle" ${T}>세 꼭짓점서 거리 같음 (외접원)</text>
  </svg>`,

  /* 내심 — 내접원 + 중심 */
  내심: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="내심">
    <polygon points="100,20 168,110 32,110" fill="${A}" opacity="0.08" stroke="${L}" stroke-width="2"/>
    <circle cx="100" cy="82" r="26" fill="none" stroke="${A}" stroke-width="2"/>
    <circle cx="100" cy="82" r="4" fill="${A}"/>
    <text x="108" y="78" ${TA}>내심</text>
    <text x="100" y="144" text-anchor="middle" ${T}>세 변에서 거리 같음 (내접원)</text>
  </svg>`,

  /* 무게중심 — 세 중선 교점 */
  무게중심: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="무게중심">
    <polygon points="100,20 170,114 30,114" fill="${A}" opacity="0.08" stroke="${L}" stroke-width="2"/>
    <line x1="100" y1="20" x2="100" y2="114" stroke="${A}" stroke-width="1.5"/>
    <line x1="170" y1="114" x2="65" y2="67" stroke="${A}" stroke-width="1.5"/>
    <line x1="30" y1="114" x2="135" y2="67" stroke="${A}" stroke-width="1.5"/>
    <circle cx="100" cy="83" r="4.5" fill="${A}"/>
    <text x="100" y="144" text-anchor="middle" ${TA}>세 중선의 교점 (중선 2:1)</text>
  </svg>`,

  /* 닮음 — 크기 다른 두 닮은 삼각형 */
  닮음: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="닮음">
    <polygon points="34,32 34,96 82,96" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <polygon points="120,20 120,116 192,116" fill="${A}" opacity="0.18" stroke="${L}" stroke-width="2"/>
    <text x="100" y="74" text-anchor="middle" ${TA}>∼</text>
    <text x="110" y="134" text-anchor="middle" ${T}>모양 같고 크기 비율 일정</text>
  </svg>`,
};
