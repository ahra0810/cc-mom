/**
 * 시드 수학 개념어 set 3개 — 1페이지 학습지 (개념 카드 + 미니 퀴즈 2문항).
 *
 * 목적: 사고력 수학 발문(예: "둘레를 구하시오")을 해석 못해 문제를 못 푸는
 *      어린 학생들의 어휘 학습. 메타에 풍부한 개념 정보를 담아 PDF의 풀폭
 *      "개념 학습 카드"로 자세히 설명하고, 슬롯은 간단한 객관식 2문항만.
 *
 * 시드 선정:
 *   - 변 (side, 초1~2)         — 도형 발문 빈출
 *   - 둘레 (perimeter, 초3)    — 사용자가 직접 든 예 + peri+meter 어원
 *   - 짝수 (even number, 초1~2) — 사고력 발문 빈출 ("짝수번째 칸")
 *
 * 슬롯 구성 (count = 2):
 *   1) multiple-choice : 친근한 정의 묻기
 *   2) multiple-choice : 🔍 수학 발문 속 단어 의미 찾기
 */
import type { QuestionSet, SetSlots } from '../../types/sets';
import type { Question } from '../../types';

const now = Date.now();

let qSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  return {
    id: `seed-mc-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'math-concept',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
}

/* ───────────────────────────────────────────────
   1) 변 (side, 초1~2) — 도형 발문 핵심 어휘
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"변"을 가장 쉽게 풀어쓴 설명은?',
    options: [
      '도형을 이루는 곧은 선분',
      '두 선이 만나는 점',
      '도형 안쪽 공간',
      '도형의 색깔',
    ],
    answer: '도형을 이루는 곧은 선분',
    explanation: '"변"은 도형의 가장자리를 이루는 곧은 선분이에요. 네모는 변이 4개, 세모는 3개!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🔍 다음 수학 문제에서 "변"이 의미하는 것은?\n\n[문제] 다음 사각형의 가장 긴 변의 길이를 구하시오.',
    options: [
      '사각형을 이루는 4개 곧은 선분 중 하나',
      '사각형 안쪽 공간',
      '사각형 모서리의 점',
      '사각형의 색깔',
    ],
    answer: '사각형을 이루는 4개 곧은 선분 중 하나',
    explanation: '발문에서 "변"은 도형을 이루는 곧은 선분을 가리켜요.',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 둘레 (perimeter, 초3) — 사용자가 직접 든 예
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"둘레"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '도형 바깥쪽을 한 바퀴 도는 길의 길이',
      '도형 안쪽의 공간 크기',
      '도형의 가장 긴 부분',
      '도형의 가장 높은 곳',
    ],
    answer: '도형 바깥쪽을 한 바퀴 도는 길의 길이',
    explanation: '둘레 = 도형의 모든 변의 길이를 합한 값이에요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🔍 다음 수학 문제에서 "둘레"가 의미하는 것은?\n\n[문제] 정원의 둘레를 구하시오. 정원은 가로 5m, 세로 3m인 직사각형입니다.',
    options: [
      '정원 바깥쪽을 둘러싼 모든 변의 길이의 합',
      '정원의 가로 길이만',
      '정원 안쪽의 공간 크기 (땅 면적)',
      '정원의 대각선 길이',
    ],
    answer: '정원 바깥쪽을 둘러싼 모든 변의 길이의 합',
    explanation: '"둘레를 구하시오"는 모든 변의 길이를 더하라는 뜻이에요.',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 짝수 (even number, 초1~2) — 사고력 발문 빈출
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"짝수"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '둘로 똑같이 나눌 수 있는 수',
      '셋으로 똑같이 나누어지는 수',
      '아주 큰 수',
      '0보다 작은 수',
    ],
    answer: '둘로 똑같이 나눌 수 있는 수',
    explanation: '짝수는 2개씩 짝지을 수 있어 남는 게 없어요. 2, 4, 6, 8 모두 짝수!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🔍 다음 수학 문제에서 "짝수"가 의미하는 것은?\n\n[문제] 1부터 10까지 수 중에서 짝수만 골라 합을 구하시오.',
    options: [
      '2, 4, 6, 8, 10 같이 둘로 나누어 떨어지는 수',
      '1, 3, 5, 7, 9 같이 홀로 남는 수',
      '1부터 10까지 모든 수',
      '가장 큰 수와 가장 작은 수',
    ],
    answer: '2, 4, 6, 8, 10 같이 둘로 나누어 떨어지는 수',
    explanation: '발문에서 "짝수만 골라"는 2의 배수만 고르라는 뜻이에요.',
  }),
] as const;

/* ─── Set 객체 export ─── */
export const MATH_CONCEPT_DEFAULT_SETS: QuestionSet[] = [
  {
    id: 'seed-mc-1',
    title: '변 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '변',
      hanja: '',
      englishTerm: 'side',
      textbookDefinition: '다각형을 이루는 각각의 곧은 선분.',
      definition: '도형의 가장자리를 이루는 곧은 선 하나하나 — 네모는 변이 4개, 세모는 3개!',
      visualEmoji: '△  →  변 **3개**\n□  →  변 **4개**\n⬠  →  변 **5개**',
      visualExample: '도형의 곧은 선분 한 개 한 개를 "변"이라고 불러요.\n삼각형은 변이 3개, 사각형은 4개, 오각형은 5개!\n원은 곧은 선이 하나도 없으니까 변이 0개랍니다.',
      relatedTerms: ['꼭짓점', '도형', '다각형'],
      relatedTermsDetailed: [
        { emoji: '🔺', term: '꼭짓점', desc: '두 변이 만나는 뾰족한 점.\n삼각형은 꼭짓점 3개!' },
        { emoji: '⬜', term: '도형', desc: '점·선·면이 모여 만든 모양.\n변은 도형의 일부예요.' },
        { emoji: '⬠', term: '다각형', desc: '변이 3개 이상인 곧은 선 도형.\n삼·사·오각형 등.' },
      ],
      textbookExample: '다음 사각형의 가장 긴 변의 길이를 구하시오.',
      grade: 1,
    },
    slots: set1Slots, tags: ['도형', '발문독해', '초1·2'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-2',
    title: '둘레 학습지',
    domain: 'math-concept', difficulty: 'medium',
    meta: {
      domain: 'math-concept',
      term: '둘레',
      hanja: '',
      englishTerm: 'perimeter',
      englishOrigin: 'peri-(주변) + meter(재다) — "주변을 잰 길이"',
      textbookDefinition: '평면도형의 가장자리를 따라 한 바퀴 돈 길이. 모든 변의 길이의 합.',
      definition: '도형 바깥쪽을 한 바퀴 도는 길의 길이 — 모든 변을 다 더하면 돼요!',
      visualEmoji: '🔲 직사각형 (가로 5cm, 세로 3cm)\n5cm + 3cm + 5cm + 3cm\n= **둘레 16cm** !',
      visualExample: '직사각형 운동장을 한 바퀴 돈다고 생각해 보세요!\n가로 5cm, 세로 3cm 인 직사각형이라면\n네 변(5+3+5+3)을 모두 더한 16cm 가 둘레예요.\n넓이는 "안쪽 공간"이고, 둘레는 "바깥쪽 길이"랍니다.',
      relatedTerms: ['넓이', '변', '꼭짓점'],
      relatedTermsDetailed: [
        { emoji: '🟦', term: '넓이', desc: '도형 안쪽 공간의 크기.\n둘레는 바깥, 넓이는 안!' },
        { emoji: '📏', term: '변', desc: '도형을 이루는 곧은 선분.\n둘레는 모든 변의 합.' },
        { emoji: '🔺', term: '꼭짓점', desc: '두 변이 만나는 점.\n직사각형은 꼭짓점 4개.' },
      ],
      textbookExample: '정원의 둘레를 구하시오. 정원은 가로 5m, 세로 3m인 직사각형입니다.',
      grade: 3,
    },
    slots: set2Slots, tags: ['측정', '발문독해', '초3'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-3',
    title: '짝수 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '짝수',
      hanja: '',
      englishTerm: 'even number',
      textbookDefinition: '2로 나누어 떨어지는 자연수. 즉 2의 배수.',
      definition: '둘로 똑같이 나눌 수 있는 수 — 짝지어 보면 남는 게 없어요!',
      visualEmoji: '2  →  🟡🟡\n4  →  🟡🟡 🟡🟡\n6  →  🟡🟡 🟡🟡 🟡🟡\n모두 둘씩 짝! **짝수**예요.',
      visualExample: '사탕 6개를 친구 두 명이 똑같이 나누면 3개씩!\n어느 쪽도 모자라거나 남지 않으니까 "짝수"예요.\n2, 4, 6, 8, 10 … 둘로 나누어 떨어지는 수가 짝수랍니다.\n반대로 1, 3, 5, 7, 9 처럼 하나가 홀로 남는 수는 "홀수"!',
      relatedTerms: ['홀수', '배수', '자연수'],
      relatedTermsDetailed: [
        { emoji: '🔵', term: '홀수', desc: '둘로 나누면 1이 남는 수.\n1, 3, 5, 7, 9 …' },
        { emoji: '✖️', term: '배수', desc: '어떤 수를 곱해 만든 수.\n짝수 = 2의 배수!' },
        { emoji: '🔢', term: '자연수', desc: '1부터 시작하는 셈수.\n짝수·홀수는 자연수의 두 짝.' },
      ],
      textbookExample: '1부터 10까지 수 중에서 짝수만 골라 합을 구하시오.',
      origin: '"짝"은 둘이 함께 있다는 우리말 — "짝이 있는 수"',
      grade: 1,
    },
    slots: set3Slots, tags: ['수', '발문독해', '초1·2'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
