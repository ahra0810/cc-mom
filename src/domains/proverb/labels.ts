/**
 * 속담 도메인의 모든 사용자 노출 텍스트.
 * v3: 8문항 2페이지 (양면 인쇄) — Bloom's Taxonomy 기반 학습 사이클.
 */
import type { DomainLabels } from '../types';

export const PROVERB_LABELS: DomainLabels = {
  subjectName: '속담',
  setNoun: '속담 학습지',
  newSetButtonLabel: '새 속담 set',
  searchPlaceholder: '속담 · 뜻 · 일상 사용 검색',
  heroHeadline: '속담을 시각으로 친숙하게 🌾',
  heroSubline:
    '속담 1개 + 시각 카드 + 8문항 = A4 2페이지 (양면 인쇄)\n초3 ~ 중1 학생이 속담을 인지·이해·적용·산출 단계로 깊이 익히도록 설계된 학습지.',
  slotLabels: [
    '1번 — 빈칸 채우기 (인지)',
    '2번 — 친근한 뜻 (이해)',
    '3번 — 교과서 정의 (이해)',
    '4번 — 비슷한 속담 (분석)',
    '5번 — 어울리는 일상 상황 (적용)',
    '6번 — 잘못 쓰인 예 찾기 (분석)',
    '7번 — 핵심 교훈 (종합)',
    '8번 — 직접 응용한 문장 만들기 (산출)',
  ],
  accentColor: '#0F766E', // 속담 청록
};
