/**
 * 사자성어 set 전용 PDF 템플릿 — Phase 7에서 3종 완성.
 *
 *  - idiom-classic        : 깔끔한 메타 박스 + 보통 본문
 *  - idiom-hanja-emphasis : 한자 4자 큰 가로 박스 (서예 풍) + meaning 작게
 *  - idiom-low-grade      : 초3~4 친화 — 큰 폰트, 둥근 모서리, 별 장식
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
  metaStyle: 'classic' | 'hanja-emphasis' | 'big-friendly';

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
];

export function getSetTemplate(id?: string): SetTemplate {
  return SET_TEMPLATES.find((t) => t.id === id) || SET_TEMPLATES[0];
}
