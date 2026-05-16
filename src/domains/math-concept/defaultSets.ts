/**
 * 시드 수학 개념어 set 9개 — 1페이지 학습지 (개념 카드 + 미니 퀴즈 2문항).
 *
 * 목적: 사고력 수학 발문(예: "둘레를 구하시오")을 해석 못해 문제를 못 푸는
 *      학생들의 어휘 학습. 메타에 풍부한 개념 정보를 담아 PDF의 풀폭
 *      "개념 학습 카드"로 자세히 설명하고, 슬롯은 간단한 객관식 2문항만.
 *
 * 시드 선정 (초3~중1, "초·중등 수학 마스터팩 개념카드" 기반):
 *   - 변 (side, 초1~2)            — 도형 발문 빈출
 *   - 둘레 (perimeter, 초3)       — peri+meter 어원
 *   - 짝수 (even number, 초1~2)   — 사고력 발문 빈출
 *   - 반지름 (radius, 초3)        — 원 발문 핵심
 *   - 약수 (divisor, 초5)         — "약수를 모두 구하시오" 빈출
 *   - 배수 (multiple, 초5)        — "배수를 찾으시오" 빈출
 *   - 넓이 (area, 초5)            — 둘레와 짝, 발문 핵심
 *   - 소인수분해 (중1)            — 중등 수와 식 핵심
 *   - 절댓값 (중1)                — 정수·유리수 발문 빈출
 *
 * 슬롯 구성 (count = 2):
 *   1) multiple-choice : 친근한 정의 묻기
 *   2) multiple-choice : 🔍 수학 발문 속 단어 의미 찾기
 */
import type { QuestionSet, SetSlots } from '../../types/sets';
import type { Question } from '../../types';
import { withMcAnswerAt } from '../../services/mcShuffle';

const now = Date.now();

let qSeq = 0;
let mcSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  const built: Question = {
    id: `seed-mc-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'math-concept',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
  /* 객관식 정답 위치 ①②③④ 자동 순환 분배 */
  if (built.type === 'multiple-choice') {
    const positioned = withMcAnswerAt(built, mcSeq);
    mcSeq++;
    return positioned;
  }
  return built;
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

/* ───────────────────────────────────────────────
   4) 반지름 (radius, 초3) — 원 발문 핵심
   ─────────────────────────────────────────────── */
const set4Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"반지름"을 가장 쉽게 풀어쓴 설명은?',
    options: [
      '원의 중심에서 원 위의 한 점까지 이은 선분',
      '원 위의 두 점을 이은 가장 긴 선분',
      '원의 바깥쪽을 한 바퀴 도는 길이',
      '원 안쪽의 공간 크기',
    ],
    answer: '원의 중심에서 원 위의 한 점까지 이은 선분',
    explanation: '반지름 = 중심 → 원 위 한 점. 지름의 절반이에요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🔍 다음 수학 문제에서 "반지름"이 의미하는 것은?\n\n[문제] 반지름이 5cm인 원의 지름을 구하시오.',
    options: [
      '원의 중심에서 원까지의 거리 — 지름의 절반(5cm)',
      '원을 한 바퀴 돈 길이',
      '원 안쪽의 넓이',
      '원 위 두 점을 이은 선분 중 가장 짧은 것',
    ],
    answer: '원의 중심에서 원까지의 거리 — 지름의 절반(5cm)',
    explanation: '반지름 5cm → 지름은 그 2배인 10cm. (지름) = (반지름) × 2!',
  }),
] as const;

/* ───────────────────────────────────────────────
   5) 약수 (divisor, 초5) — "약수를 모두 구하시오" 빈출
   ─────────────────────────────────────────────── */
const set5Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"약수"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '어떤 수를 나누어떨어지게 하는 수',
      '어떤 수를 곱해서 만든 수',
      '어떤 수보다 큰 모든 수',
      '0보다 작은 수',
    ],
    answer: '어떤 수를 나누어떨어지게 하는 수',
    explanation: '6의 약수 → 1, 2, 3, 6 (모두 6을 나누어떨어지게 함). 배수와 헷갈리지 마세요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🔍 다음 수학 문제에서 "약수"가 의미하는 것은?\n\n[문제] 12의 약수를 모두 구하시오.',
    options: [
      '12를 나누어떨어지게 하는 수 (1, 2, 3, 4, 6, 12)',
      '12에 어떤 수를 곱한 수 (12, 24, 36 …)',
      '12보다 작은 모든 수',
      '12를 두 번 더한 수',
    ],
    answer: '12를 나누어떨어지게 하는 수 (1, 2, 3, 4, 6, 12)',
    explanation: '"약수를 모두 구하시오" = 그 수를 나누어떨어지게 하는 수를 전부 찾으라는 뜻.',
  }),
] as const;

/* ───────────────────────────────────────────────
   6) 배수 (multiple, 초5) — "배수를 찾으시오" 빈출
   ─────────────────────────────────────────────── */
const set6Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"배수"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '어떤 수를 1배, 2배, 3배 … 한 수',
      '어떤 수를 나누어떨어지게 하는 수',
      '어떤 수보다 작은 수',
      '소수점이 있는 수',
    ],
    answer: '어떤 수를 1배, 2배, 3배 … 한 수',
    explanation: '3의 배수 → 3, 6, 9, 12 … 끝없이 커져요. 약수와 반대 방향!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🔍 다음 수학 문제에서 "배수"가 의미하는 것은?\n\n[문제] 1부터 30까지 수 중 4의 배수를 모두 찾으시오.',
    options: [
      '4를 1배, 2배 … 한 수 (4, 8, 12, 16, 20, 24, 28)',
      '4를 나누어떨어지게 하는 수 (1, 2, 4)',
      '4보다 작은 모든 수',
      '4가 들어간 수 (4, 14, 24)',
    ],
    answer: '4를 1배, 2배 … 한 수 (4, 8, 12, 16, 20, 24, 28)',
    explanation: '"4의 배수" = 4 × (자연수). 4가 들어간 수(14 등)와 헷갈리지 마세요!',
  }),
] as const;

/* ───────────────────────────────────────────────
   7) 넓이 (area, 초5) — 둘레와 짝, 발문 핵심
   ─────────────────────────────────────────────── */
const set7Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"넓이"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '도형이 차지하는 안쪽 공간의 크기',
      '도형 바깥쪽을 한 바퀴 도는 길이',
      '도형에서 가장 긴 변',
      '두 변이 만나는 점',
    ],
    answer: '도형이 차지하는 안쪽 공간의 크기',
    explanation: '넓이 = 안쪽 공간. 둘레(바깥 길이)와 짝을 이루는 개념이에요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🔍 다음 수학 문제에서 "넓이"가 의미하는 것은?\n\n[문제] 가로 6cm, 세로 4cm인 직사각형의 넓이를 구하시오.',
    options: [
      '도형 안쪽 공간의 크기 — (가로)×(세로) = 24cm²',
      '네 변의 길이를 모두 더한 값',
      '가장 긴 변의 길이',
      '대각선의 길이',
    ],
    answer: '도형 안쪽 공간의 크기 — (가로)×(세로) = 24cm²',
    explanation: '직사각형 넓이 = 가로 × 세로. 둘레(변의 합)와 다른 점에 주의!',
  }),
] as const;

/* ───────────────────────────────────────────────
   8) 소인수분해 (중1) — 중등 수와 식 핵심
   ─────────────────────────────────────────────── */
const set8Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"소인수분해"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '자연수를 소수들의 곱으로만 나타내는 것',
      '자연수를 작은 수로 나누는 것',
      '소수점을 찍어 나타내는 것',
      '약수를 모두 더하는 것',
    ],
    answer: '자연수를 소수들의 곱으로만 나타내는 것',
    explanation: '12 = 2 × 2 × 3 = 2² × 3. 더 이상 쪼갤 수 없는 소수들의 곱!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '🔍 다음 수학 문제에서 "소인수분해"가 의미하는 것은?\n\n[문제] 36을 소인수분해 하시오.',
    options: [
      '36을 소수들의 곱으로 나타내기 (2² × 3²)',
      '36의 약수를 모두 구하기',
      '36을 2로 나눈 몫 구하기',
      '36보다 작은 소수 구하기',
    ],
    answer: '36을 소수들의 곱으로 나타내기 (2² × 3²)',
    explanation: '"소인수분해 하시오" = 소수의 곱으로 쪼개라는 뜻. 36 = 2×2×3×3.',
  }),
] as const;

/* ───────────────────────────────────────────────
   9) 절댓값 (중1) — 정수·유리수 발문 빈출
   ─────────────────────────────────────────────── */
const set9Slots: SetSlots = [
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"절댓값"을 가장 쉽게 풀어쓴 설명은?',
    options: [
      '수직선에서 0(원점)부터 그 수까지의 거리',
      '그 수에 항상 +를 붙인 것',
      '두 수를 더한 값',
      '가장 큰 수',
    ],
    answer: '수직선에서 0(원점)부터 그 수까지의 거리',
    explanation: '거리니까 항상 0 이상! |-3| = 3, |+3| = 3 (둘 다 0에서 3칸).',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '🔍 다음 수학 문제에서 "절댓값"이 의미하는 것은?\n\n[문제] -7의 절댓값을 구하시오.',
    options: [
      '0에서 -7까지의 거리 — 7',
      '-7에 -1을 곱한 값',
      '-7보다 작은 수',
      '-7과 +7을 더한 값',
    ],
    answer: '0에서 -7까지의 거리 — 7',
    explanation: '절댓값은 부호를 떼고 "0에서 떨어진 거리"만 봐요. |-7| = 7.',
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
  {
    id: 'seed-mc-4',
    title: '반지름 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '반지름',
      hanja: '',
      englishTerm: 'radius',
      englishOrigin: 'radius — 라틴어로 "바퀴살". 중심에서 뻗어 나간 살!',
      textbookDefinition: '원의 중심과 원 위의 한 점을 이은 선분. 지름의 절반.',
      definition: '원의 한가운데(중심)에서 원까지 그은 선 — 지름의 딱 절반이에요!',
      visualEmoji: '   ●━━━○\n중심  반지름  원\n지름 = 반지름 × **2**',
      visualExample: '원의 한가운데를 중심이라 하고,\n중심에서 원까지 그은 선분이 반지름이에요.\n원을 가로지르는 가장 긴 선분이 지름인데,\n지름은 반지름의 정확히 2배랍니다.',
      relatedTerms: ['지름', '원의 중심', '원주'],
      relatedTermsDetailed: [
        { emoji: '↔️', term: '지름', desc: '원을 가로지르는 가장 긴 선분.\n반지름의 2배!' },
        { emoji: '⚫', term: '원의 중심', desc: '원을 그릴 때 누름못이\n꽂혔던 한가운데 점.' },
        { emoji: '⭕', term: '원주', desc: '원의 둘레.\n원을 한 바퀴 돈 길이.' },
      ],
      textbookExample: '반지름이 5cm인 원의 지름을 구하시오.',
      grade: 3,
    },
    slots: set4Slots, tags: ['도형', '발문독해', '초3'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-5',
    title: '약수 학습지',
    domain: 'math-concept', difficulty: 'medium',
    meta: {
      domain: 'math-concept',
      term: '약수',
      hanja: '約數',
      englishTerm: 'divisor',
      textbookDefinition: '어떤 수를 나누어떨어지게 하는 수.',
      definition: '나눴을 때 딱 떨어지게 하는 수 — 나머지가 0이 되는 수예요!',
      visualEmoji: '6 ÷ 1 ✅  6 ÷ 2 ✅\n6 ÷ 3 ✅  6 ÷ 6 ✅\n6의 약수 = **1, 2, 3, 6**',
      visualExample: '6을 나누어떨어지게 하는 수를 찾아봐요.\n6÷1, 6÷2, 6÷3, 6÷6 — 모두 나머지가 0!\n그래서 6의 약수는 1, 2, 3, 6 이에요.\n배수(곱해서 커지는 수)와 반대 방향이랍니다.',
      relatedTerms: ['배수', '최대공약수', '나누어떨어진다'],
      relatedTermsDetailed: [
        { emoji: '✖️', term: '배수', desc: '곱해서 만든 수.\n약수와 반대 방향!' },
        { emoji: '🤝', term: '최대공약수', desc: '두 수의 공통 약수 중\n가장 큰 수.' },
        { emoji: '➗', term: '나누어떨어진다', desc: '나눴을 때 나머지가\n0이 되는 것.' },
      ],
      textbookExample: '12의 약수를 모두 구하시오.',
      grade: 5,
    },
    slots: set5Slots, tags: ['수', '발문독해', '초5'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-6',
    title: '배수 학습지',
    domain: 'math-concept', difficulty: 'medium',
    meta: {
      domain: 'math-concept',
      term: '배수',
      hanja: '倍數',
      englishTerm: 'multiple',
      textbookDefinition: '어떤 수를 1배, 2배, 3배 … 한 수.',
      definition: '어떤 수에 1, 2, 3 …을 곱한 수 — 끝없이 커지는 수들이에요!',
      visualEmoji: '3 × 1 = 3\n3 × 2 = 6\n3 × 3 = 9\n3의 배수 = **3, 6, 9 …**',
      visualExample: '3에 1, 2, 3 …을 차례로 곱해 봐요.\n3, 6, 9, 12 … 끝없이 이어지죠.\n이게 바로 3의 배수예요.\n약수(나눠서 떨어지는 수)와 반대 방향이랍니다.',
      relatedTerms: ['약수', '최소공배수', '곱셈'],
      relatedTermsDetailed: [
        { emoji: '➗', term: '약수', desc: '나눠서 떨어지는 수.\n배수와 반대 방향!' },
        { emoji: '🤝', term: '최소공배수', desc: '두 수의 공통 배수 중\n가장 작은 수.' },
        { emoji: '✖️', term: '곱셈', desc: '배수는 곱셈으로 만들어요.\n3×4=12 → 12는 3의 배수.' },
      ],
      textbookExample: '1부터 30까지 수 중 4의 배수를 모두 찾으시오.',
      grade: 5,
    },
    slots: set6Slots, tags: ['수', '발문독해', '초5'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-7',
    title: '넓이 학습지',
    domain: 'math-concept', difficulty: 'medium',
    meta: {
      domain: 'math-concept',
      term: '넓이',
      hanja: '',
      englishTerm: 'area',
      textbookDefinition: '평면도형이 차지하는 공간의 크기.',
      definition: '도형 안쪽이 얼마나 넓은지 나타내는 크기 — 둘레의 짝꿍이에요!',
      visualEmoji: '🟦 가로 6 × 세로 4\n= **넓이 24 cm²**\n(둘레는 바깥, 넓이는 안!)',
      visualExample: '직사각형 안쪽을 1cm 칸으로 가득 채워 봐요.\n가로 6칸 × 세로 4칸 = 24칸!\n그래서 넓이는 24cm² 예요.\n둘레가 "바깥쪽 길이"라면 넓이는 "안쪽 공간"이랍니다.',
      relatedTerms: ['둘레', '제곱센티미터', '직사각형'],
      relatedTermsDetailed: [
        { emoji: '🔲', term: '둘레', desc: '도형 바깥쪽 길이.\n넓이는 안, 둘레는 바깥!' },
        { emoji: '🟧', term: '제곱센티미터', desc: '넓이의 단위 (cm²).\n한 변 1cm 정사각형 1칸.' },
        { emoji: '📏', term: '직사각형', desc: '넓이 = 가로 × 세로.\n가장 기본 넓이 공식.' },
      ],
      textbookExample: '가로 6cm, 세로 4cm인 직사각형의 넓이를 구하시오.',
      grade: 5,
    },
    slots: set7Slots, tags: ['측정', '발문독해', '초5'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-8',
    title: '소인수분해 학습지',
    domain: 'math-concept', difficulty: 'hard',
    meta: {
      domain: 'math-concept',
      term: '소인수분해',
      hanja: '素因數分解',
      englishTerm: 'prime factorization',
      textbookDefinition: '자연수를 소인수(소수인 인수)만의 곱으로 나타내는 것.',
      definition: '수를 더 이상 못 쪼갤 때까지 소수의 곱으로 쪼개는 것이에요!',
      visualEmoji: '12\n2 × 6 → 2 × 2 × 3\n= **2² × 3**',
      visualExample: '12를 쪼개 봐요. 12 = 2 × 6.\n6은 또 2 × 3 으로 쪼개지죠.\n더는 못 쪼개는 소수만 남으면 끝!\n12 = 2 × 2 × 3 = 2² × 3 이 소인수분해예요.',
      relatedTerms: ['소수', '인수', '거듭제곱'],
      relatedTermsDetailed: [
        { emoji: '🔢', term: '소수', desc: '1과 자기 자신만 약수인 수.\n2, 3, 5, 7 …' },
        { emoji: '✖️', term: '인수', desc: 'a = b × c 일 때\nb, c 가 a의 인수.' },
        { emoji: '²', term: '거듭제곱', desc: '같은 수를 여러 번 곱한 것.\n2×2 = 2².' },
      ],
      textbookExample: '36을 소인수분해 하시오.',
      grade: 7,
    },
    slots: set8Slots, tags: ['중등 수와 식', '발문독해', '중1'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-9',
    title: '절댓값 학습지',
    domain: 'math-concept', difficulty: 'hard',
    meta: {
      domain: 'math-concept',
      term: '절댓값',
      hanja: '',
      englishTerm: 'absolute value',
      textbookDefinition: '수직선 위에서 원점(0)과 어떤 수에 대응하는 점 사이의 거리.',
      definition: '0에서 그 수까지 몇 칸 떨어졌는지 — 거리니까 항상 0 이상!',
      visualEmoji: '─3─2─1─**0**─1─2─3─\n|-3| = **3**   |+3| = **3**\n(부호 떼고 거리만!)',
      visualExample: '수직선에서 0을 기준으로 생각해요.\n-3은 0에서 왼쪽으로 3칸 → 절댓값 3.\n+3은 0에서 오른쪽으로 3칸 → 절댓값 3.\n부호(+, -)는 떼고 "떨어진 거리"만 보면 돼요.',
      relatedTerms: ['수직선', '원점', '정수'],
      relatedTermsDetailed: [
        { emoji: '📏', term: '수직선', desc: '수를 점으로 나타낸 직선.\n절댓값은 여기서 잰 거리.' },
        { emoji: '⚫', term: '원점', desc: '수직선의 기준점 0.\n절댓값은 0에서 잰 거리.' },
        { emoji: '➕', term: '정수', desc: '… -2, -1, 0, 1, 2 …\n절댓값은 부호를 뗀 크기.' },
      ],
      textbookExample: '-7의 절댓값을 구하시오.',
      grade: 7,
    },
    slots: set9Slots, tags: ['중등 수와 식', '발문독해', '중1'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
