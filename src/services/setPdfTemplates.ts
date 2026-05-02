/**
 * PDF 템플릿 카탈로그.
 *
 * 공통 4종 (도메인 무관):
 *  - idiom-classic        : 깔끔한 메타 박스 + 보통 본문
 *  - idiom-hanja-emphasis : 한자 4자 큰 가로 박스 (서예 풍) + meaning 작게
 *  - idiom-low-grade      : 초3~4 친화 — 큰 폰트, 둥근 모서리, 별 장식
 *  - idiom-quiz-banner    : 민트 리본 + 큰 한글 제목 활동지
 *
 * 도메인별 발랄 4종 (festive — 도메인이 자기 추천 템플릿으로 지정):
 *  - idiom-festive    : 사자성어 — 📜 한자 두루마리 (보라+골드)
 *  - proverb-festive  : 속담     — 🌾 우리말 보따리 (청록+황금벼)
 *  - phrase-festive   : 관용어   — ✋ 우리 몸으로 배우는 (앰버+핑크)
 *  - math-festive     : 수학     — 🧮 수학 마법사의 친근한 노트 (블루+라임)
 *
 * festive 템플릿은 metaStyle='festive'를 사용하며, 각 도메인의 pdfMeta.ts에
 * festive 분기가 정의되어 도메인 컨셉(이모지·캐릭터·배너 문구)을 표현합니다.
 */

export interface SetTemplate {
  id: string;
  name: string;
  description: string;

  /* 색상 */
  primaryColor: string;
  accentColor: string;
  bgAccent: string;
  textColor: string;

  /* 폰트 */
  fontStack: string;
  /* 본문 기본 폰트 사이즈 (pt). 자동 축소 시 setPdfService가 11→10→9.5pt로 낮춤 */
  baseFontSize: number;

  /* 메타 박스 스타일 */
  metaStyle: 'classic' | 'hanja-emphasis' | 'big-friendly' | 'quiz-banner' | 'festive';

  /* 미리보기 카드 색상 스와치 */
  swatch: string[];
}

export const SET_TEMPLATES: SetTemplate[] = [
  {
    id: 'idiom-classic',
    name: '클래식',
    description: '깔끔한 메타 박스 + 기본 8문항 레이아웃',
    primaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    bgAccent: '#F5F3FF',
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'classic',
    swatch: ['#7C3AED', '#A78BFA', '#F5F3FF'],
  },
  {
    id: 'idiom-hanja-emphasis',
    name: '한자 강조',
    description: '한자 4자를 가로 큰 박스로 강조한 서예 스타일',
    primaryColor: '#0F172A',
    accentColor: '#94A3B8',
    bgAccent: '#F8FAFC',
    textColor: '#1F2937',
    fontStack: "'Noto Serif KR','Nanum Myeongjo',serif",
    baseFontSize: 11,
    metaStyle: 'hanja-emphasis',
    swatch: ['#0F172A', '#94A3B8', '#F8FAFC'],
  },
  {
    id: 'idiom-low-grade',
    name: '저학년 친화',
    description: '초3~4 친화 — 큰 폰트, 둥근 모서리, 친근한 색감',
    primaryColor: '#EA580C',
    accentColor: '#FDBA74',
    bgAccent: '#FFF7ED',
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 12,
    metaStyle: 'big-friendly',
    swatch: ['#EA580C', '#FDBA74', '#FFF7ED'],
  },
  {
    id: 'idiom-quiz-banner',
    name: '퀴즈 배너',
    description: '민트 리본 + 큰 한글 제목 + 한자 4박스 활동지 — "퀴즈로 배워나가는 사자성어" 스타일',
    primaryColor: '#0F766E',  /* 민트 다크 */
    accentColor: '#5EEAD4',   /* 민트 라이트 */
    bgAccent: '#F0FDFA',      /* 민트 매우 옅음 */
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'quiz-banner',
    swatch: ['#5EEAD4', '#FB923C', '#FCD34D'],
  },

  /* ─── 도메인별 발랄 (festive) — 도메인이 자기 추천 템플릿으로 사용 ─── */
  {
    id: 'idiom-festive',
    name: '한자 두루마리 📜',
    description: '사자성어 — 옛 두루마리 분위기. 보라 + 골드 + 한자 강조',
    primaryColor: '#7C3AED',
    accentColor: '#F59E0B',  /* 골드 */
    bgAccent: '#FEF3C7',     /* 베이지 */
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'festive',
    swatch: ['#7C3AED', '#F59E0B', '#FEF3C7'],
  },
  {
    id: 'proverb-festive',
    name: '우리말 보따리 🌾',
    description: '속담 — 옛 정자 분위기. 청록 + 황금벼 + 따옴표 강조',
    primaryColor: '#0F766E',
    accentColor: '#FBBF24',  /* 황금 벼 */
    bgAccent: '#FEFCE8',     /* 크림 */
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'festive',
    swatch: ['#0F766E', '#FBBF24', '#FEFCE8'],
  },
  {
    id: 'phrase-festive',
    name: '몸으로 배우는 관용어 ✋',
    description: '관용어 — 만화 캐릭터 분위기. 앰버 + 핑크 + 신체 이모지',
    primaryColor: '#D97706',
    accentColor: '#EC4899',  /* 핑크 */
    bgAccent: '#FFE4E6',     /* 코랄 */
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'festive',
    swatch: ['#D97706', '#EC4899', '#FFE4E6'],
  },
  {
    id: 'math-festive',
    name: '수학 마법사 노트 🧮',
    description: '수학 개념어 — 마법사 노트 분위기. 블루 + 라임 + 별·이모지',
    primaryColor: '#2563EB',
    accentColor: '#84CC16',  /* 라임 */
    bgAccent: '#ECFDF5',     /* 민트 화이트 */
    textColor: '#1F2937',
    fontStack: "'NanumSquareNeo','Pretendard','Noto Sans KR',sans-serif",
    baseFontSize: 11,
    metaStyle: 'festive',
    swatch: ['#2563EB', '#84CC16', '#FACC15'],
  },
];

export function getSetTemplate(id?: string): SetTemplate {
  return SET_TEMPLATES.find((t) => t.id === id) || SET_TEMPLATES[0];
}
