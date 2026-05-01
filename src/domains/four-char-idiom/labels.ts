/**
 * 사자성어 도메인의 모든 사용자 노출 텍스트.
 * 다른 컴포넌트는 이 파일을 직접 참조하지 않고 DomainConfig.labels를 통해 접근합니다.
 */
import type { DomainLabels } from '../types';

export const IDIOM_LABELS: DomainLabels = {
  subjectName: '사자성어',
  setNoun: '사자성어 학습지',
  newSetButtonLabel: '새 사자성어 set',
  searchPlaceholder: '사자성어 · 한자 · 뜻 · 본문 검색',
  heroHeadline: '사자성어 학습지를 빠르게 만들어요 📜',
  heroSubline:
    '사자성어 1개 + 8문항 = A4 1페이지\n초3 ~ 중1 학생용 학습지를 자동으로 만들어 드립니다.',
  slotLabels: [
    '1번 — 한자 쓰기 (한글음 + 따라쓰기)',
    '2번 — 객관식',
    '3번 — 객관식',
    '4번 — 객관식',
    '5번 — 객관식',
    '6번 — 객관식',
    '7번 — 객관식',
    '8번 — 문장 만들기 (서술형)',
  ],
  accentColor: '#7C3AED', // 사자성어 보라
};
