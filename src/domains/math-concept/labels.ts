/**
 * 수학 개념어 도메인의 모든 사용자 노출 텍스트.
 * 발문 독해력 + 한·영·한자 통합 어휘 학습 (초1~3).
 *
 * 1페이지 구성: 풀폭 "개념 학습 카드" (4섹션) + 미니 퀴즈 2문항 (객관식).
 */
import type { DomainLabels } from '../types';

export const MATH_CONCEPT_LABELS: DomainLabels = {
  subjectName: '수학 개념어',
  setNoun: '수학 개념어 학습지',
  newSetButtonLabel: '새 수학 개념어 set',
  searchPlaceholder: '용어 · 영어 · 정의 · 발문 검색',
  heroHeadline: '수학 발문 독해력을 키워요 🧮',
  heroSubline:
    '수학 용어를 한국어 + 영어 + 한자로 함께 익혀요\n초1~3 학생이 사고력 수학 발문을 자신 있게 해석하도록 도와줍니다.',
  slotLabels: [
    '1번 — 정의 묻기 (객관식)',
    '2번 — 수학 발문 속 단어 찾기 🔍 (객관식)',
  ],
  accentColor: '#2563EB', // 수학 개념어 블루
};
