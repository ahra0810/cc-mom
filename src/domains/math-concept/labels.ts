/**
 * 수학 개념어 도메인의 모든 사용자 노출 텍스트.
 */
import type { DomainLabels } from '../types';

export const MATH_CONCEPT_LABELS: DomainLabels = {
  subjectName: '수학 개념어',
  setNoun: '수학 개념어 학습지',
  newSetButtonLabel: '새 수학 개념어 set',
  searchPlaceholder: '개념어 · 정의 · 본문 검색',
  heroHeadline: '수학 개념어 학습지를 빠르게 만들어요 🧮',
  heroSubline:
    '수학 용어 1개 + 8문항 = A4 1페이지\n초3 ~ 중1 학생이 국어 학원에서 수학 용어의 의미를 익히도록 돕는 학습지를 자동으로 만들어 드립니다.',
  slotLabels: [
    '1번 — 개념 도입 (정의 빈칸 / 한자 풀이 / 시각 예시 中)',
    '2번 — 정의 묻기',
    '3번 — 한자 풀이 또는 어휘 변별',
    '4번 — 시각 예시 식별',
    '5번 — 관련 용어 짝 구분',
    '6번 — 올바른 사용 예 고르기',
    '7번 — 잘못 쓰인 예 / 반대 개념',
    '8번 — 개념 한 문장 설명 (서술형)',
  ],
  accentColor: '#2563EB', // 수학 개념어 블루
};
