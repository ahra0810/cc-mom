/**
 * PDF 시험지 템플릿 정의
 *
 * 각 템플릿은 색상·타이포그래피·레이아웃·장식 토큰을 조합하여
 * 시각적으로 구별되는 시험지를 만들어냅니다.
 *
 * 초등(elementary)용 10종 + 중학(middle)용 10종 = 총 20종
 */

export type TemplateAudience = 'elementary' | 'middle';

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  audience: TemplateAudience;

  /* 색상 */
  primaryColor: string;      // 헤더·강조 색
  accentColor: string;       // 보조 색 (섹션 구분 등)
  bgAccent: string;          // 매우 옅은 배경색 (지문 박스 등)
  textColor: string;         // 본문 색상

  /* 타이포그래피 */
  fontStack: string;         // CSS font-family
  baseFontSize: number;      // pt
  headerWeight: number;      // 제목 굵기

  /* 헤더 */
  headerStyle: 'classic' | 'banner' | 'minimal' | 'side-stripe' | 'rounded' | 'school' | 'newspaper';

  /* 문항 */
  questionStyle: 'plain' | 'boxed' | 'shaded' | 'circle-num' | 'square-num' | 'pill-num';

  /* 지문 */
  passageStyle: 'side-border' | 'boxed' | 'shaded' | 'paper-fold' | 'double-line';

  /* 장식 */
  decoration: 'none' | 'dots' | 'stars' | 'corner-marks' | 'page-border' | 'wave-top';

  /* 밀도 */
  density: 'loose' | 'normal' | 'dense';
}

/* ═══════════════════════════════════════════════════════════
   초등학생용 템플릿 10종
   ─ 친근한 색감, 큰 글씨, 둥근 모서리, 장식 요소
   ═══════════════════════════════════════════════════════════ */

export const ELEMENTARY_TEMPLATES: PDFTemplate[] = [
  {
    id: 'elem-classic',
    name: '클래식',
    description: '깔끔한 기본 스타일 (모든 과목)',
    audience: 'elementary',
    primaryColor: '#2563EB', accentColor: '#3B82F6', bgAccent: '#EFF6FF', textColor: '#1E293B',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'classic', questionStyle: 'plain', passageStyle: 'boxed',
    decoration: 'none', density: 'loose',
  },
  {
    id: 'elem-star',
    name: '별빛 노트',
    description: '노란빛 별 장식 — 즐거운 분위기',
    audience: 'elementary',
    primaryColor: '#F59E0B', accentColor: '#FBBF24', bgAccent: '#FEF3C7', textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'banner', questionStyle: 'circle-num', passageStyle: 'shaded',
    decoration: 'stars', density: 'loose',
  },
  {
    id: 'elem-rainbow',
    name: '무지개 헤더',
    description: '다채로운 헤더 띠로 시선 집중',
    audience: 'elementary',
    primaryColor: '#7C3AED', accentColor: '#EC4899', bgAccent: '#FDF4FF', textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 900,
    headerStyle: 'rounded', questionStyle: 'pill-num', passageStyle: 'boxed',
    decoration: 'wave-top', density: 'normal',
  },
  {
    id: 'elem-blue',
    name: '맑은 하늘',
    description: '시원한 파란색 단색 톤',
    audience: 'elementary',
    primaryColor: '#0EA5E9', accentColor: '#38BDF8', bgAccent: '#F0F9FF', textColor: '#0C4A6E',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'side-stripe', questionStyle: 'square-num', passageStyle: 'side-border',
    decoration: 'none', density: 'normal',
  },
  {
    id: 'elem-pink',
    name: '벚꽃 분홍',
    description: '부드러운 분홍빛, 아기자기',
    audience: 'elementary',
    primaryColor: '#EC4899', accentColor: '#F472B6', bgAccent: '#FDF2F8', textColor: '#831843',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'rounded', questionStyle: 'circle-num', passageStyle: 'shaded',
    decoration: 'dots', density: 'loose',
  },
  {
    id: 'elem-forest',
    name: '숲속 친구',
    description: '초록 자연 테마',
    audience: 'elementary',
    primaryColor: '#16A34A', accentColor: '#22C55E', bgAccent: '#F0FDF4', textColor: '#14532D',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'banner', questionStyle: 'circle-num', passageStyle: 'side-border',
    decoration: 'corner-marks', density: 'normal',
  },
  {
    id: 'elem-notebook',
    name: '연습장',
    description: '노트 줄이 있는 손글씨 느낌',
    audience: 'elementary',
    primaryColor: '#0F766E', accentColor: '#14B8A6', bgAccent: '#F0FDFA', textColor: '#134E4A',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 700,
    headerStyle: 'minimal', questionStyle: 'plain', passageStyle: 'paper-fold',
    decoration: 'none', density: 'loose',
  },
  {
    id: 'elem-cute',
    name: '귀여운 워크북',
    description: '둥글고 푹신한 박스',
    audience: 'elementary',
    primaryColor: '#A855F7', accentColor: '#C084FC', bgAccent: '#FAF5FF', textColor: '#581C87',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 13, headerWeight: 900,
    headerStyle: 'rounded', questionStyle: 'pill-num', passageStyle: 'boxed',
    decoration: 'page-border', density: 'loose',
  },
  {
    id: 'elem-grid',
    name: '모눈종이',
    description: '모눈 배경의 차분한 학습지',
    audience: 'elementary',
    primaryColor: '#475569', accentColor: '#64748B', bgAccent: '#F8FAFC', textColor: '#1E293B',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'classic', questionStyle: 'square-num', passageStyle: 'double-line',
    decoration: 'dots', density: 'normal',
  },
  {
    id: 'elem-orange',
    name: '주황빛 활기',
    description: '에너지 넘치는 따뜻한 톤',
    audience: 'elementary',
    primaryColor: '#EA580C', accentColor: '#F97316', bgAccent: '#FFF7ED', textColor: '#7C2D12',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 12, headerWeight: 800,
    headerStyle: 'side-stripe', questionStyle: 'circle-num', passageStyle: 'shaded',
    decoration: 'stars', density: 'normal',
  },
];

/* ═══════════════════════════════════════════════════════════
   중학생용 템플릿 10종
   ─ 정형화된 시험지 디자인, 작은 글씨, 절제된 색
   ═══════════════════════════════════════════════════════════ */

export const MIDDLE_TEMPLATES: PDFTemplate[] = [
  {
    id: 'mid-formal',
    name: '정식 시험지',
    description: '학교 시험 양식 — 가장 일반적',
    audience: 'middle',
    primaryColor: '#0F172A', accentColor: '#334155', bgAccent: '#F1F5F9', textColor: '#0F172A',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Serif KR',serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'school', questionStyle: 'plain', passageStyle: 'boxed',
    decoration: 'none', density: 'normal',
  },
  {
    id: 'mid-mock',
    name: '모의고사',
    description: '수능형 — 큰 지문 박스',
    audience: 'middle',
    primaryColor: '#1E40AF', accentColor: '#3B82F6', bgAccent: '#EFF6FF', textColor: '#0F172A',
    fontStack: "'Noto Serif KR','NanumSquareNeo',serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'newspaper', questionStyle: 'square-num', passageStyle: 'double-line',
    decoration: 'corner-marks', density: 'normal',
  },
  {
    id: 'mid-classic',
    name: '클래식 흑백',
    description: '인쇄·복사 친화적인 단색',
    audience: 'middle',
    primaryColor: '#000000', accentColor: '#374151', bgAccent: '#F9FAFB', textColor: '#111827',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 11, headerWeight: 700,
    headerStyle: 'classic', questionStyle: 'plain', passageStyle: 'boxed',
    decoration: 'none', density: 'normal',
  },
  {
    id: 'mid-essay',
    name: '서술형 중심',
    description: '쓰기 공간이 넉넉한 논술형',
    audience: 'middle',
    primaryColor: '#7E22CE', accentColor: '#A855F7', bgAccent: '#FAF5FF', textColor: '#1F2937',
    fontStack: "'Noto Serif KR','NanumSquareNeo',serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'banner', questionStyle: 'plain', passageStyle: 'side-border',
    decoration: 'none', density: 'loose',
  },
  {
    id: 'mid-modern',
    name: '모던',
    description: '미니멀한 산세리프',
    audience: 'middle',
    primaryColor: '#0891B2', accentColor: '#06B6D4', bgAccent: '#ECFEFF', textColor: '#0F172A',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 11, headerWeight: 700,
    headerStyle: 'minimal', questionStyle: 'pill-num', passageStyle: 'side-border',
    decoration: 'none', density: 'normal',
  },
  {
    id: 'mid-literature',
    name: '국어 문학',
    description: '지문 박스 강조 — 문학·국어용',
    audience: 'middle',
    primaryColor: '#7C2D12', accentColor: '#9A3412', bgAccent: '#FFF7ED', textColor: '#1F2937',
    fontStack: "'Noto Serif KR','NanumSquareNeo',serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'side-stripe', questionStyle: 'square-num', passageStyle: 'paper-fold',
    decoration: 'corner-marks', density: 'normal',
  },
  {
    id: 'mid-academic',
    name: '학원 정기고사',
    description: '회당·시간 영역 강조',
    audience: 'middle',
    primaryColor: '#B91C1C', accentColor: '#DC2626', bgAccent: '#FEF2F2', textColor: '#0F172A',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'school', questionStyle: 'square-num', passageStyle: 'boxed',
    decoration: 'page-border', density: 'normal',
  },
  {
    id: 'mid-newspaper',
    name: '신문 칼럼',
    description: '제목 영역이 신문 헤드라인풍',
    audience: 'middle',
    primaryColor: '#1E293B', accentColor: '#475569', bgAccent: '#F8FAFC', textColor: '#0F172A',
    fontStack: "'Noto Serif KR','Times New Roman',serif",
    baseFontSize: 11, headerWeight: 900,
    headerStyle: 'newspaper', questionStyle: 'plain', passageStyle: 'double-line',
    decoration: 'none', density: 'dense',
  },
  {
    id: 'mid-green',
    name: '청록 깊이',
    description: '차분한 청록색 강조',
    audience: 'middle',
    primaryColor: '#0F766E', accentColor: '#14B8A6', bgAccent: '#F0FDFA', textColor: '#134E4A',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 11, headerWeight: 800,
    headerStyle: 'side-stripe', questionStyle: 'circle-num', passageStyle: 'side-border',
    decoration: 'none', density: 'normal',
  },
  {
    id: 'mid-dense',
    name: '집약형',
    description: '한 페이지에 많은 문항',
    audience: 'middle',
    primaryColor: '#3F3F46', accentColor: '#52525B', bgAccent: '#FAFAFA', textColor: '#18181B',
    fontStack: "'NanumSquareNeo','Pretendard',sans-serif",
    baseFontSize: 10.5, headerWeight: 700,
    headerStyle: 'minimal', questionStyle: 'plain', passageStyle: 'boxed',
    decoration: 'none', density: 'dense',
  },
];

export const ALL_TEMPLATES: PDFTemplate[] = [...ELEMENTARY_TEMPLATES, ...MIDDLE_TEMPLATES];

export function getTemplate(id: string): PDFTemplate {
  return ALL_TEMPLATES.find((t) => t.id === id) || ELEMENTARY_TEMPLATES[0];
}

export function getDefaultTemplateForDifficulty(difficulty: string): PDFTemplate {
  // hard/advanced/expert → middle, otherwise elementary
  const isMiddle = ['hard', 'advanced', 'expert'].includes(difficulty);
  return isMiddle ? MIDDLE_TEMPLATES[0] : ELEMENTARY_TEMPLATES[0];
}

/* ═══════════════════════════════════════════════════════════
   템플릿 → CSS 생성기
   ═══════════════════════════════════════════════════════════ */

export function buildTemplateCSS(t: PDFTemplate): string {
  const densityVars = {
    loose: { qGap: '20px', qPad: '0', headerPad: '16px' },
    normal: { qGap: '14px', qPad: '0', headerPad: '14px' },
    dense: { qGap: '10px', qPad: '0', headerPad: '10px' },
  }[t.density];

  return `
/* ═══ Base ═══ */
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: ${t.fontStack};
  color: ${t.textColor}; font-size: ${t.baseFontSize}pt; line-height: 1.65;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  word-break: keep-all; overflow-wrap: break-word;
}
.page { max-width: 170mm; margin: 0 auto; ${
  t.decoration === 'page-border'
    ? `border: 2px dashed ${t.primaryColor}; padding: 14px 20px; border-radius: 8px;`
    : ''
}}

/* ═══ Header ═══ */
${buildHeaderCSS(t, densityVars)}

/* ═══ Info row & Banner ═══ */
.info-row {
  display: flex; justify-content: space-between; align-items: center;
  border: 1.5px solid ${t.accentColor}; border-radius: 4px;
  padding: 7px 14px; margin: 10px 0 14px;
  font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor};
  background: ${t.bgAccent};
}
.info-row .field { display: flex; align-items: center; gap: 4px; }
.info-row .blank { display: inline-block; width: 90px; border-bottom: 1px solid ${t.accentColor}; margin-left: 2px; height: 16px; }
.info-row .score-blank { display: inline-block; width: 36px; border-bottom: 1px solid ${t.accentColor}; margin: 0 2px; height: 16px; text-align: center; }
.answer-banner {
  text-align: center; font-size: ${t.baseFontSize}pt; font-weight: 800; color: ${t.primaryColor};
  border: 2px solid ${t.primaryColor}; padding: 7px 0; margin: 10px 0 14px;
  letter-spacing: 4px; background: ${t.bgAccent};
}

/* ═══ Section title ═══ */
.sec-title {
  font-size: ${t.baseFontSize - 0.5}pt; font-weight: 700; color: ${t.primaryColor};
  padding: 5px 0 4px; margin: 14px 0 6px; border-bottom: 1.5px solid ${t.primaryColor};
}

/* ═══ Question ═══ */
.q { display: flex; gap: 8px; margin-bottom: ${densityVars.qGap}; page-break-inside: avoid; }
${buildQuestionNumCSS(t)}
.q-body { flex: 1; min-width: 0; }
.q-text { font-size: ${t.baseFontSize}pt; font-weight: 600; line-height: 1.7; margin-bottom: 5px; color: ${t.textColor}; }

/* ═══ Passage ═══ */
${buildPassageCSS(t)}

/* ═══ Options ═══ */
.opts { display: grid; grid-template-columns: 1fr 1fr; gap: 1px 20px; padding-left: 2px;
  font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.7; color: ${t.textColor}; }
.opts-tf { grid-template-columns: auto auto; justify-content: start; gap: 1px 32px; }
.opts .correct { font-weight: 800; color: ${t.primaryColor}; }

.answer-line { width: 60%; height: 1px; border-bottom: 1px solid ${t.accentColor}; margin: 6px 0 4px 2px; }
.writing-lines {
  height: 72px; margin: 6px 0 6px 2px;
  background-image: repeating-linear-gradient(transparent, transparent 23px, ${t.accentColor}88 23px, ${t.accentColor}88 24px);
}
.answer-box {
  display: inline-block; font-size: ${t.baseFontSize - 1}pt; font-weight: 700;
  color: ${t.primaryColor}; margin-top: 2px;
  border-bottom: 1.5px solid ${t.primaryColor}; padding-bottom: 1px;
}
.explain {
  margin-top: 5px; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}cc;
  line-height: 1.6; padding: 5px 8px; background: ${t.bgAccent}; border-left: 3px solid ${t.accentColor};
}
.explain-label { display: inline-block; font-weight: 800; color: ${t.primaryColor}; margin-right: 6px; font-size: ${t.baseFontSize - 2}pt; }

/* ═══ Memo (오답 정리) ═══ */
.memo {
  margin-top: 24px; border: 1.5px solid ${t.accentColor}; border-radius: 4px;
  padding: 12px 14px; background: ${t.bgAccent}40;
}
.memo-title {
  font-size: ${t.baseFontSize - 1.5}pt; font-weight: 800; color: ${t.primaryColor};
  margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid ${t.accentColor};
}
.memo-lines {
  height: 120px;
  background-image: repeating-linear-gradient(transparent, transparent 23px, ${t.accentColor}88 23px, ${t.accentColor}88 24px);
}

${buildDecorationCSS(t)}
`;
}

function buildHeaderCSS(t: PDFTemplate, d: { headerPad: string }): string {
  switch (t.headerStyle) {
    case 'banner':
      return `.header { background: linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor}); color: white; padding: 16px ${d.headerPad}; border-radius: 8px; margin-bottom: 12px; text-align: center; }
.header h1 { font-size: ${t.baseFontSize + 8}pt; font-weight: ${t.headerWeight}; letter-spacing: 0.5px; margin-bottom: 5px; color: white; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: rgba(255,255,255,.9); }
.header-sub span { margin: 0 6px; }`;

    case 'rounded':
      return `.header { background: ${t.bgAccent}; border: 3px solid ${t.primaryColor}; padding: 14px ${d.headerPad}; border-radius: 16px; margin-bottom: 12px; text-align: center; }
.header h1 { font-size: ${t.baseFontSize + 8}pt; font-weight: ${t.headerWeight}; color: ${t.primaryColor}; margin-bottom: 5px; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}aa; }
.header-sub span { margin: 0 6px; }
.header-sub span:not(:last-child)::after { content: '·'; margin-left: 12px; color: ${t.accentColor}; }`;

    case 'side-stripe':
      return `.header { display: flex; align-items: center; gap: 14px; padding: 12px 0 12px 14px; border-left: 8px solid ${t.primaryColor}; margin-bottom: 14px; }
.header-text { flex: 1; }
.header h1 { font-size: ${t.baseFontSize + 7}pt; font-weight: ${t.headerWeight}; color: ${t.primaryColor}; margin-bottom: 4px; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}aa; }
.header-sub span { margin-right: 10px; }`;

    case 'minimal':
      return `.header { padding: 8px 0; margin-bottom: 12px; border-bottom: 1px solid ${t.accentColor}; }
.header h1 { font-size: ${t.baseFontSize + 6}pt; font-weight: ${t.headerWeight}; color: ${t.textColor}; margin-bottom: 3px; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}99; }
.header-sub span { margin-right: 12px; }`;

    case 'school':
      return `.header { padding: 8px 0 12px; border-top: 3px double ${t.primaryColor}; border-bottom: 3px double ${t.primaryColor}; margin-bottom: 14px; text-align: center; }
.header h1 { font-size: ${t.baseFontSize + 7}pt; font-weight: ${t.headerWeight}; color: ${t.textColor}; margin-bottom: 6px; letter-spacing: 2px; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}99; }
.header-sub span { margin: 0 8px; }
.header-sub span:not(:last-child)::after { content: '|'; margin-left: 16px; color: ${t.accentColor}; }`;

    case 'newspaper':
      return `.header { padding-bottom: 14px; border-bottom: 4px solid ${t.primaryColor}; margin-bottom: 14px; position: relative; }
.header::after { content: ''; position: absolute; left: 0; right: 0; bottom: -8px; height: 1px; background: ${t.primaryColor}; }
.header h1 { font-size: ${t.baseFontSize + 9}pt; font-weight: ${t.headerWeight}; color: ${t.textColor}; text-align: center; margin-bottom: 6px; letter-spacing: 1px; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}aa; text-align: center; font-style: italic; }
.header-sub span { margin: 0 6px; }
.header-sub span:not(:last-child)::after { content: '·'; margin-left: 12px; }`;

    case 'classic':
    default:
      return `.header { text-align: center; padding-bottom: 14px; border-bottom: 2.5px solid ${t.textColor}; margin-bottom: 12px; }
.header h1 { font-size: ${t.baseFontSize + 7}pt; font-weight: ${t.headerWeight}; letter-spacing: 0.5px; margin-bottom: 5px; color: ${t.textColor}; }
.header-sub { font-size: ${t.baseFontSize - 2}pt; color: ${t.textColor}99; letter-spacing: 0.3px; }
.header-sub span { margin: 0 6px; }
.header-sub span:not(:last-child)::after { content: '|'; margin-left: 12px; color: ${t.accentColor}; }`;
  }
}

function buildQuestionNumCSS(t: PDFTemplate): string {
  switch (t.questionStyle) {
    case 'circle-num':
      return `.q-num { flex-shrink: 0; width: 24px; height: 24px; line-height: 24px; text-align: center; font-size: ${t.baseFontSize - 1}pt; font-weight: 800; color: white; background: ${t.primaryColor}; border-radius: 50%; }`;
    case 'square-num':
      return `.q-num { flex-shrink: 0; width: 24px; height: 24px; line-height: 24px; text-align: center; font-size: ${t.baseFontSize - 1}pt; font-weight: 800; color: white; background: ${t.primaryColor}; border-radius: 3px; }`;
    case 'pill-num':
      return `.q-num { flex-shrink: 0; min-width: 32px; height: 22px; line-height: 22px; padding: 0 8px; text-align: center; font-size: ${t.baseFontSize - 2}pt; font-weight: 800; color: white; background: ${t.primaryColor}; border-radius: 11px; }`;
    case 'boxed':
      return `.q-num { flex-shrink: 0; width: 24px; height: 24px; line-height: 22px; text-align: center; font-size: ${t.baseFontSize - 1}pt; font-weight: 700; color: ${t.primaryColor}; border: 2px solid ${t.primaryColor}; border-radius: 3px; }`;
    case 'shaded':
      return `.q-num { flex-shrink: 0; min-width: 24px; padding: 1px 6px; font-size: ${t.baseFontSize - 1}pt; font-weight: 800; color: ${t.primaryColor}; background: ${t.bgAccent}; border-radius: 3px; text-align: center; }`;
    case 'plain':
    default:
      return `.q-num { flex-shrink: 0; width: 22px; font-size: ${t.baseFontSize - 1}pt; font-weight: 700; color: ${t.primaryColor}; padding-top: 1px; text-align: right; }`;
  }
}

function buildPassageCSS(t: PDFTemplate): string {
  switch (t.passageStyle) {
    case 'side-border':
      return `.passage { border-left: 4px solid ${t.primaryColor}; padding: 6px 12px; margin-bottom: 8px; background: ${t.bgAccent}; font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.75; page-break-inside: avoid; }
.passage-text { color: ${t.textColor}; } .passage-cite { margin-top: 6px; padding-top: 5px; border-top: 1px dashed ${t.accentColor}; text-align: right; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}99; font-style: italic; }`;
    case 'shaded':
      return `.passage { background: ${t.bgAccent}; padding: 8px 12px; margin-bottom: 8px; border-radius: 6px; font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.75; page-break-inside: avoid; }
.passage-text { color: ${t.textColor}; } .passage-cite { margin-top: 6px; padding-top: 5px; border-top: 1px dashed ${t.accentColor}; text-align: right; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}99; font-style: italic; }`;
    case 'paper-fold':
      return `.passage { border: 1px solid ${t.accentColor}; border-top: 4px solid ${t.primaryColor}; padding: 10px 12px 8px; margin-bottom: 8px; background: white; font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.75; page-break-inside: avoid; box-shadow: 0 1px 2px ${t.accentColor}44; }
.passage-text { color: ${t.textColor}; } .passage-cite { margin-top: 6px; padding-top: 5px; border-top: 1px dashed ${t.accentColor}; text-align: right; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}99; font-style: italic; }`;
    case 'double-line':
      return `.passage { border-top: 3px double ${t.primaryColor}; border-bottom: 3px double ${t.primaryColor}; padding: 8px 12px; margin-bottom: 8px; font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.75; page-break-inside: avoid; }
.passage-text { color: ${t.textColor}; } .passage-cite { margin-top: 6px; text-align: right; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}99; font-style: italic; }`;
    case 'boxed':
    default:
      return `.passage { border: 1px solid ${t.accentColor}; border-left: 3px solid ${t.primaryColor}; padding: 8px 12px; margin-bottom: 8px; background: ${t.bgAccent}66; font-size: ${t.baseFontSize - 0.5}pt; line-height: 1.75; page-break-inside: avoid; }
.passage-text { color: ${t.textColor}; } .passage-cite { margin-top: 6px; padding-top: 5px; border-top: 1px dashed ${t.accentColor}; text-align: right; font-size: ${t.baseFontSize - 1.5}pt; color: ${t.textColor}99; font-style: italic; }`;
  }
}

function buildDecorationCSS(t: PDFTemplate): string {
  switch (t.decoration) {
    case 'stars':
      return `.header::before { content: '★ ★ ★'; display: block; font-size: ${t.baseFontSize - 2}pt; color: ${t.accentColor}; letter-spacing: 8px; margin-bottom: 4px; }`;
    case 'dots':
      return `.header::after { content: '· · · · · · · · · · · · · · · · · · · · · · · ·'; display: block; font-size: ${t.baseFontSize}pt; color: ${t.accentColor}; letter-spacing: 4px; margin-top: 4px; }`;
    case 'corner-marks':
      return `.page { position: relative; }
.page::before, .page::after { content: ''; position: absolute; width: 24px; height: 24px; border: 2px solid ${t.primaryColor}; }
.page::before { top: 0; left: 0; border-right: none; border-bottom: none; }
.page::after { bottom: 0; right: 0; border-left: none; border-top: none; }`;
    case 'wave-top':
      return `.header { position: relative; }
.header::before {
  content: ''; display: block; height: 8px; margin: -8px -8px 8px;
  background: repeating-linear-gradient(90deg, ${t.primaryColor} 0 8px, ${t.accentColor} 8px 16px);
  border-radius: 4px 4px 0 0;
}`;
    case 'page-border':
    case 'none':
    default:
      return '';
  }
}
