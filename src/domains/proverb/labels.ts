/**
 * 속담 도메인의 모든 사용자 노출 텍스트.
 * v2: 시각 카드 + 일상 응용 + 미니 퀴즈 3문항.
 */
import type { DomainLabels } from '../types';

export const PROVERB_LABELS: DomainLabels = {
  subjectName: '속담',
  setNoun: '속담 학습지',
  newSetButtonLabel: '새 속담 set',
  searchPlaceholder: '속담 · 뜻 · 일상 사용 검색',
  heroHeadline: '속담을 시각으로 친숙하게 🌾',
  heroSubline:
    '속담 1개 + 풍부한 시각 카드 + 미니 퀴즈 3문항 = A4 1페이지\n초3 ~ 중1 학생이 속담을 만화·일상 사용으로 친근하게 익히도록 도와줍니다.',
  slotLabels: [
    '1번 — 친근한 뜻 묻기 (객관식)',
    '2번 — 어울리는 상황 찾기 (객관식)',
    '3번 — 직접 응용한 문장 만들기 (서술형)',
  ],
  accentColor: '#0F766E', // 속담 청록
};
