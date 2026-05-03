/**
 * 시드 수학 개념어 set 3개 — 발문 독해력 + 한·영·한자 통합 학습 (초1~3).
 *
 * 목적: 사고력 수학 발문(예: "둘레를 구하시오")을 해석 못해 문제를 못 푸는
 *      어린 학생들의 어휘 학습. 한국어 + 영어 + (가능한 경우) 한자.
 *
 * 시드 선정:
 *   - 변 (side, 초1~2)         — 도형 발문 빈출
 *   - 둘레 (perimeter, 초3)    — 사용자가 직접 든 예 + peri+meter 어원
 *   - 짝수 (even number, 초1~2) — 사고력 발문 빈출 ("짝수번째 칸")
 *
 * 8슬롯 구성:
 *   📄 Page 1 — 한·영·한자 만남
 *      1) 흥미 도입 (short-answer) — 일상 비유 빈칸
 *      2) 친근한 정의 (mc)
 *      3) 영어 짝꿍 🇬🇧 (mc) — 영어 단어 4개 중
 *      4) 이름의 비밀 (mc) — 한자/영어 어원
 *   📄 Page 2 — 적용·발문 독해
 *      5) 시각으로 만나기 (mc)
 *      6) 단짝 친구 (mc) — 관련 용어
 *      7) 수학 발문 속 단어 찾기 🔍 (mc) — 실제 발문 4개 중 의미
 *      8) 친구에게 알려주기 (sentence-making)
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
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question:
      '🌱 네모(사각형)는 곧은 선 4개로 이루어져 있어요.\n이렇게 도형의 가장자리를 이루는 곧은 선 하나하나를 ___이라고 해요.',
    answer: '변',
    explanation: '"변"은 도형을 이루는 곧은 선분이에요. 네모는 변이 4개, 세모는 3개죠!',
  }),
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
    explanation: '"변"은 곧은 선분 하나하나를 가리켜요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🇬🇧 "변"을 영어로 뭐라고 할까요?',
    options: ['side', 'angle', 'point', 'circle'],
    answer: 'side',
    explanation: '"side"는 영어로 "옆·곁"이라는 뜻이에요. 도형의 옆면을 가리키죠!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"변"이라는 단어의 재미있는 점은?',
    options: [
      '한자가 없는 우리말이에요',
      '한자 "邊"에서 왔어요',
      '영어 "var"에서 왔어요',
      '일본어가 변한 말이에요',
    ],
    answer: '한자가 없는 우리말이에요',
    explanation: '"변"은 도형을 가리킬 때는 순우리말이에요. 따로 한자가 없답니다!',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🔺 다음 도형 중 변이 가장 많은 것은?',
    options: ['오각형', '삼각형', '사각형', '원'],
    answer: '오각형',
    explanation: '오각형은 변이 5개 — 가장 많아요. 원은 곧은 선이 없어 변 0개!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "변"과 단짝이 되는 도형 용어는?',
    options: ['꼭짓점', '둘레', '넓이', '대각선'],
    answer: '꼭짓점',
    explanation: '두 변이 만나는 점이 "꼭짓점"이에요. 변과 꼭짓점은 도형의 단짝!',
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
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "🤝 친구가 \"변이 뭐야?\" 물어봐요. 한 문장으로 친근하게 알려주세요.",
    answer: '변은 도형을 이루는 곧은 선분 하나하나를 부르는 말이야 — 네모는 변이 4개야!',
    explanation: '"도형의 곧은 선분 = 변"이라는 핵심을 친근한 예로 설명!',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 둘레 (perimeter, 초3) — 사용자가 직접 든 예
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'medium',
    question:
      '🌱 우리가 운동장 한 바퀴를 돌면, 그 도는 길의 길이가 있어요.\n도형 바깥쪽을 한 바퀴 도는 길의 길이를 ___라고 해요.',
    answer: '둘레',
    explanation: '"둘레"는 도형 바깥을 한 바퀴 도는 길의 전체 길이예요!',
  }),
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
    question: '🇬🇧 "둘레"를 영어로 뭐라고 할까요?',
    options: ['perimeter', 'area', 'volume', 'length'],
    answer: 'perimeter',
    explanation: 'perimeter [퍼-리-미-터] = "둘레". area는 넓이!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"perimeter"는 두 단어의 합으로 만들어졌어요. 어떤 두 단어일까요?',
    options: [
      'peri-(주변) + meter(재다)',
      'per-(완전히) + meter(키)',
      'pe-(작다) + rimeter(빛)',
      'p-(첫) + erimeter(끝)',
    ],
    answer: 'peri-(주변) + meter(재다)',
    explanation: '"주변을 잰다" → 둘레! 영어 어원도 한국어 뜻과 똑같아요.',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🔺 가로 5cm, 세로 3cm 직사각형의 둘레는?',
    options: ['16cm', '8cm', '15cm', '30cm'],
    answer: '16cm',
    explanation: '둘레 = (5+3) × 2 = 16cm. 네 변을 모두 더해요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '👯 "둘레"와 짝이 되는 측정 용어는?',
    options: ['넓이', '꼭짓점', '대각선', '각'],
    answer: '넓이',
    explanation: '둘레(바깥 길이) ↔ 넓이(안쪽 크기) — 측정의 두 짝!',
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
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: "🤝 친구가 \"둘레가 뭐야?\" 물어봐요. 한 문장으로 친근하게 알려주세요.",
    answer: '둘레는 도형 바깥쪽을 한 바퀴 도는 길의 길이야 — 모든 변을 다 더하면 돼!',
    explanation: '"바깥 한 바퀴 길이 = 모든 변의 합"이라는 두 핵심을 풀어쓰면 완벽!',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 짝수 (even number, 초1~2) — 사고력 발문 빈출
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question:
      '🌱 사탕 6개가 있어요. 친구 둘이 똑같이 나누어 가지면 한 명에 3개씩 — 딱 떨어져요!\n이렇게 둘로 똑같이 나눌 수 있는 수를 ___라고 해요.',
    answer: '짝수',
    explanation: '"짝수"는 2로 나누어 떨어지는 수예요. 2, 4, 6, 8 모두 짝수!',
  }),
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
    explanation: '짝수는 2개씩 짝지을 수 있어 남는 게 없어요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🇬🇧 "짝수"를 영어로 뭐라고 할까요?',
    options: ['even number', 'odd number', 'big number', 'small number'],
    answer: 'even number',
    explanation: '"even"은 영어로 "고른·균등한". 짝지어 균등하게 나뉜다는 뜻!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"짝수"라는 우리말 단어의 재미있는 점은?',
    options: [
      '"짝(둘이 함께)"이 있는 수라는 뜻',
      '한자 "雀(참새)"에서 왔어요',
      '영어 "jjak"에서 왔어요',
      '일본어가 변한 말이에요',
    ],
    answer: '"짝(둘이 함께)"이 있는 수라는 뜻',
    explanation: '"짝"은 둘이 함께 있다는 우리말. "짝수 = 짝이 있는 수" 라고 외우면 쉽죠!',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🔢 다음 중 짝수만 모인 줄은?',
    options: ['2, 4, 6, 8', '1, 3, 5, 7', '1, 2, 3, 4', '5, 10, 15, 20'],
    answer: '2, 4, 6, 8',
    explanation: '2의 배수 = 짝수. 1·3·5·7은 홀수, 5·10·15·20은 짝홀 섞임.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "짝수"와 가장 짝이 되는 용어는?',
    options: ['홀수', '소수', '약수', '배수'],
    answer: '홀수',
    explanation: '짝수(둘로 나뉘는 수) ↔ 홀수(둘로 나누면 1이 남는 수) — 한 짝!',
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
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "🤝 친구가 \"짝수가 뭐야?\" 물어봐요. 한 문장으로 친근하게 알려주세요.",
    answer: '짝수는 둘로 똑같이 나눌 수 있는 수야 — 2, 4, 6 같이 짝이 있는 수지!',
    explanation: '"둘로 나뉘는 수 = 짝이 있는 수"라는 핵심을 일상 예로 풀어쓰면 완벽!',
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
      definition: '도형을 이루는 곧은 선분 하나하나',
      visualExample: '예: 사각형은 변이 4개, 삼각형은 3개',
      relatedTerms: ['꼭짓점', '도형', '다각형'],
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
      definition: '도형 바깥쪽을 한 바퀴 도는 길의 길이 (모든 변의 길이의 합)',
      visualExample: '예: 가로 5cm, 세로 3cm 직사각형의 둘레는 (5+3)×2=16cm',
      relatedTerms: ['넓이', '변', '도형'],
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
      definition: '둘로 똑같이 나눌 수 있는 수 (2의 배수: 2, 4, 6, 8 …)',
      visualExample: '예: 사탕 6개를 두 명에게 똑같이 나누면 3개씩 — 딱 떨어져요',
      relatedTerms: ['홀수', '배수'],
      textbookExample: '1부터 10까지 수 중에서 짝수만 골라 합을 구하시오.',
      origin: '"짝"은 둘이 함께 있다는 우리말 — "짝이 있는 수"',
      grade: 1,
    },
    slots: set3Slots, tags: ['수', '발문독해', '초1·2'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
