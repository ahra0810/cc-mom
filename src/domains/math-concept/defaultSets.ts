/**
 * 시드 수학 개념어 set 3개 — 분수 관련 핵심 어휘.
 *
 * 1번 슬롯의 학습 활동을 시드별로 다양화:
 *   - 분모: 정의 빈칸 채우기
 *   - 분자: 한자 풀이 (어원 학습)
 *   - 몫:   시각 예시 식별 (순한국어, 한자 풀이 불가)
 *
 * 8슬롯 구성:
 *   1번: short-answer (시드별 학습 활동)
 *   2~7번: multiple-choice (정의·한자·시각·관련용어·올바른예·잘못된예)
 *   8번: sentence-making (개념 설명 한 문장)
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
   1) 분모 (分母) — 1번: 정의 빈칸 채우기
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: 분수에서 아래에 쓰는 수를 ___라고 한다.',
    answer: '분모',
    explanation: '분수의 가로줄 아래쪽에 위치한 수가 분모입니다. 한자 분(分)은 나누다, 모(母)는 바탕·기준을 뜻합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분모"의 뜻으로 알맞은 것은?',
    options: [
      '분수에서 아래에 쓰는 수',
      '분수에서 위에 쓰는 수',
      '두 수의 곱',
      '두 수의 합',
    ],
    answer: '분수에서 아래에 쓰는 수',
    explanation: '분모는 전체를 몇 개로 나누었는지 나타내는 분수의 아랫수입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분모(分母)"의 한자 풀이로 알맞은 것은?',
    options: [
      '나눌 분(分) · 어미 모(母)',
      '나눌 분(分) · 머리 모(冒)',
      '나눌 분(分) · 모일 모(募)',
      '나눌 분(分) · 모양 모(模)',
    ],
    answer: '나눌 분(分) · 어미 모(母)',
    explanation: '"어미 모(母)"는 바탕·기준을 뜻해 "나누는 기준"이라는 의미를 만듭니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 분수 ¾ (사분의 삼)에서 분모는?',
    options: ['3', '4', '7', '12'],
    answer: '4',
    explanation: '분수의 가로줄 아래쪽에 있는 수가 분모입니다. ¾ 에서는 "4"가 분모입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분모"와 짝을 이루는 수학 용어로 알맞은 것은?',
    options: ['분자', '약수', '배수', '소수'],
    answer: '분자',
    explanation: '분모(아래)와 분자(위)가 한 분수를 이루는 두 수입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "분모"가 알맞게 쓰인 문장은?',
    options: [
      '분수 5/8 에서 분모는 8이다.',
      '분수 5/8 에서 분모는 5이다.',
      '5와 8을 더하면 분모가 된다.',
      '5에서 8을 뺀 값이 분모이다.',
    ],
    answer: '분수 5/8 에서 분모는 8이다.',
    explanation: '분수 5/8 에서 가로줄 아래의 수 8이 분모입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "분모"를 잘못 사용한 문장은?',
    options: [
      '나눗셈의 결과를 분모라고 한다.',
      '분수 2/7 의 분모는 7이다.',
      '분모가 같은 분수끼리는 더하기 쉽다.',
      '분모가 작을수록 한 조각의 크기가 크다.',
    ],
    answer: '나눗셈의 결과를 분모라고 한다.',
    explanation: '나눗셈의 결과는 "몫"입니다. 분모는 분수의 아랫수를 가리킵니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'분모'가 무엇인지 한 문장으로 설명하세요.",
    answer: '분모는 분수에서 가로줄 아래에 쓰는 수로, 전체를 몇 개로 나누었는지 나타낸다.',
    explanation: '분모의 핵심은 "나누는 기준 = 전체를 몇 등분하는지"입니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 분자 (分子) — 1번: 한자 풀이 (어원 학습)
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '"분자(分子)"에서 한자 "자(子)"의 뜻을 한 단어로 쓰세요. (예: 아들, 새끼, 작은 것)',
    answer: '아들',
    explanation: '"아들 자(子)"는 "아들·자식·작은 것"을 뜻합니다. 분자는 "나누어진 작은 부분"이라는 의미를 담고 있습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분자"의 뜻으로 알맞은 것은?',
    options: [
      '분수에서 위에 쓰는 수',
      '분수에서 아래에 쓰는 수',
      '두 수를 더한 값',
      '두 수를 곱한 값',
    ],
    answer: '분수에서 위에 쓰는 수',
    explanation: '분자는 분수의 가로줄 위쪽에 위치한 수입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분자(分子)"의 한자 풀이로 알맞은 것은?',
    options: [
      '나눌 분(分) · 아들 자(子)',
      '나눌 분(分) · 사람 자(者)',
      '나눌 분(分) · 글자 자(字)',
      '나눌 분(分) · 스스로 자(自)',
    ],
    answer: '나눌 분(分) · 아들 자(子)',
    explanation: '"아들 자(子)"가 들어가 "나누어진 작은 부분"이라는 의미를 만듭니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 분수 5/9 (구분의 오)에서 분자는?',
    options: ['5', '9', '14', '45'],
    answer: '5',
    explanation: '분수의 가로줄 위쪽에 있는 수 5가 분자입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분자"와 가장 짝이 되는 용어는?',
    options: ['분모', '약수', '배수', '소수'],
    answer: '분모',
    explanation: '분자(위)와 분모(아래)는 한 분수를 이루는 두 수입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "분자"가 알맞게 쓰인 문장은?',
    options: [
      '분수 3/8 에서 분자는 3이다.',
      '분수 3/8 에서 분자는 8이다.',
      '두 수의 곱은 분자라고 한다.',
      '나눗셈의 결과는 분자다.',
    ],
    answer: '분수 3/8 에서 분자는 3이다.',
    explanation: '분수 3/8 의 가로줄 위에 있는 수 3이 분자입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "분자가 더 크다"는 말이 의미하는 것은?',
    options: [
      '전체에서 차지하는 부분이 더 크다',
      '나누는 기준이 더 작다',
      '나머지가 더 많다',
      '곱한 값이 더 작다',
    ],
    answer: '전체에서 차지하는 부분이 더 크다',
    explanation: '분자는 "차지하는 부분의 크기"를 나타내므로, 분자가 클수록 부분이 큽니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'분자'가 무엇인지 한 문장으로 설명하세요.",
    answer: '분자는 분수에서 가로줄 위에 쓰는 수로, 전체에서 몇 개의 부분을 차지하는지 나타낸다.',
    explanation: '분자의 핵심은 "차지하는 부분의 크기"입니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 몫 — 1번: 시각 예시 식별 (순한국어)
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: 10 ÷ 3 의 ___은 3이고, 나머지는 1이다.',
    answer: '몫',
    explanation: '나눗셈에서 "나누어 떨어진 결과"를 몫, "남은 수"를 나머지라고 합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"몫"의 뜻으로 알맞은 것은?',
    options: [
      '나눗셈에서 나누어 떨어진 결과',
      '두 수를 더한 값',
      '두 수를 곱한 값',
      '나눗셈에서 남는 수',
    ],
    answer: '나눗셈에서 나누어 떨어진 결과',
    explanation: '몫은 나누는 수만큼 묶음을 만들고 남기 전까지 만들어진 묶음의 수입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"몫"이라는 단어의 특징으로 알맞은 것은?',
    options: [
      '한자가 아닌 우리말로 된 수학 용어이다',
      '한자 "몫(沒)"에서 온 말이다',
      '영어 "more"에서 온 말이다',
      '일본어 "もっと"에서 온 말이다',
    ],
    answer: '한자가 아닌 우리말로 된 수학 용어이다',
    explanation: '"몫"은 순우리말이며 한자가 따로 없는 고유어입니다. 분모·분자·평균과 다른 점입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '13 ÷ 4 의 몫은?',
    options: ['3', '4', '13', '52'],
    answer: '3',
    explanation: '13 ÷ 4 = 3 (몫) … 1 (나머지). 4를 3번 묶고 1이 남습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"몫"과 가장 짝이 되는 용어는?',
    options: ['나머지', '분모', '약수', '평균'],
    answer: '나머지',
    explanation: '나눗셈에서 몫(나누어진 부분)과 나머지(남은 부분)는 한 짝을 이룹니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "몫"이 알맞게 쓰인 문장은?',
    options: [
      '20 ÷ 5 의 몫은 4이다.',
      '20 ÷ 5 의 몫은 5이다.',
      '5와 4를 곱하면 몫이 된다.',
      '몫이란 분수의 아랫수이다.',
    ],
    answer: '20 ÷ 5 의 몫은 4이다.',
    explanation: '20을 5씩 나누면 4묶음이 만들어지므로 몫은 4입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "몫"을 잘못 사용한 문장은?',
    options: [
      '몫이란 두 수를 곱한 값이다.',
      '몫과 나머지는 나눗셈에서 생기는 두 결과이다.',
      '15 ÷ 4 의 몫은 3이고 나머지는 3이다.',
      '나누는 수보다 작은 나머지가 남으면 그 위가 몫이 된다.',
    ],
    answer: '몫이란 두 수를 곱한 값이다.',
    explanation: '두 수를 곱한 값은 "곱"입니다. 몫은 나눗셈의 결과를 가리킵니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'몫'이 무엇인지 한 문장으로 설명하세요.",
    answer: '몫은 나눗셈에서 어떤 수를 다른 수로 나누었을 때 나누어 떨어진 결과를 뜻한다.',
    explanation: '몫의 핵심은 "나누어진 결과 = 묶음의 수"입니다.',
  }),
] as const;

/* ─── Set 객체 export ─── */
export const MATH_CONCEPT_DEFAULT_SETS: QuestionSet[] = [
  {
    id: 'seed-mc-1',
    title: '분모 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '분모',
      hanja: '分母',
      definition: '분수에서 아래에 쓰는 수 (전체를 몇 개로 나누었는지 나타냄)',
      visualExample: '예: 3/4 에서 4가 분모',
      relatedTerms: ['분자', '분수'],
    },
    slots: set1Slots, tags: ['분수', '기초'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-2',
    title: '분자 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '분자',
      hanja: '分子',
      definition: '분수에서 위에 쓰는 수 (전체에서 차지하는 부분의 크기를 나타냄)',
      visualExample: '예: 3/4 에서 3이 분자',
      relatedTerms: ['분모', '분수'],
    },
    slots: set2Slots, tags: ['분수', '기초'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-3',
    title: '몫 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '몫',
      definition: '나눗셈에서 어떤 수를 다른 수로 나누었을 때 나누어 떨어진 결과',
      visualExample: '예: 10 ÷ 3 = 3 (몫) … 1 (나머지)',
      relatedTerms: ['나머지', '나눗셈'],
    },
    slots: set3Slots, tags: ['나눗셈', '순한국어'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
