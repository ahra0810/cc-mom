/**
 * 시드 수학 개념어 set 3개 — 분수 관련 핵심 어휘 (친근한 특강 톤).
 *
 * 목적: 수포자 방지. 국어 학원 방학 특강에서 학생이 수학 용어에 대한
 *      거부감을 풀고 "어, 이거 어렵지 않네!" 라는 안도감을 갖도록.
 *
 * 2페이지 구성:
 *   📄 Page 1 — 친근한 만남 (1~4번):
 *      1) 흥미 도입 — "너도 이미 매일 쓰고 있어!"
 *      2) 쉬운 정의 — 사전식이 아니라 친근하게 풀어쓰기
 *      3) 이름의 비밀 — 어원/한자 이야기
 *      4) 시각으로 만나기 — 그림·예시 식별
 *   📄 Page 2 — 내 것으로 만들기 (5~8번):
 *      5) 단짝 친구 — 관련 용어 짝
 *      6) 일상에서 찾기 — 적용 상황
 *      7) 앗, 잘못 쓰면! — 잘못된 사용 변별 (안심 톤)
 *      8) 친구에게 알려주기 — 서술형
 *
 * 1번 슬롯의 학습 활동 다양화:
 *   - 분모: 흥미 도입 빈칸
 *   - 분자: 한자 어원 흥미 (이름의 비밀과 연결)
 *   - 몫:   시각 예시 빈칸 (순한국어)
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
   1) 분모 (分母) — 친근한 만남부터 단짝 분자까지
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question:
      '🌱 우리가 피자를 4조각으로 나눌 때, 그중 3조각을 먹으면 "3/4 조각 먹었다"고 해요.\n이때 가로줄 아래에 적힌 "4" 처럼, 분수에서 아래에 쓰는 수를 ___라고 한답니다.',
    answer: '분모',
    explanation: '분모는 "전체를 몇 조각으로 나누었는지" 알려주는 수예요. 어렵지 않죠?',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분모"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '전체를 몇 조각으로 나누었는지 알려주는 수',
      '두 수를 곱한 결과',
      '나눗셈에서 남는 수',
      '두 수를 더한 결과',
    ],
    answer: '전체를 몇 조각으로 나누었는지 알려주는 수',
    explanation: '"전체를 몇 등분했는지" 가 핵심이에요. 분수 5/8 이면 8등분 했다는 뜻이죠.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분모(分母)"는 한자로 적으면 "나눌 분 + 어미 모"예요. 왜 "어미 모(母)"를 썼을까요?',
    options: [
      '"바탕"·"기준"이라는 뜻이 있어서 "나누는 기준"이라는 의미를 만들기 때문',
      '실제 어머니가 분수를 처음 만들었다는 전설이 있어서',
      '한자에 다른 글자가 없었기 때문',
      '한자 "母"가 "큰 수"를 뜻해서',
    ],
    answer: '"바탕"·"기준"이라는 뜻이 있어서 "나누는 기준"이라는 의미를 만들기 때문',
    explanation: '한자 "母"는 어머니뿐 아니라 "바탕·기준"이라는 의미도 있어요. 분모 = "나누는 기준"인 셈!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🍕 피자 한 판을 8조각으로 나누었어요. 분수로 표현하면 7/8 처럼 쓸 때, 분모는 어디에 있을까요?',
    options: ['가로줄 아래의 8', '가로줄 위의 7', '가로줄 자체', '7과 8을 합친 15'],
    answer: '가로줄 아래의 8',
    explanation: '가로줄 아래 = 분모, 가로줄 위 = 분자. 분모가 8이면 "8조각으로 나눴다"는 뜻이에요.',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 분모랑 가장 친한 단짝 친구 같은 용어는?',
    options: ['분자', '약수', '배수', '소수'],
    answer: '분자',
    explanation: '분모(아래) ↔ 분자(위) — 두 친구가 함께 다녀야 분수가 완성돼요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🧁 일상에서 "분모"가 자연스럽게 쓰이는 상황은?',
    options: [
      '"케이크를 8등분했으니 분모는 8이야"',
      '"오늘 비가 많이 와서 분모가 컸어"',
      '"점심 메뉴를 정할 때 분모를 썼다"',
      '"노래가 분모처럼 들렸다"',
    ],
    answer: '"케이크를 8등분했으니 분모는 8이야"',
    explanation: '"몇 조각으로 나눴는지" 말할 때 자연스럽게 쓰여요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '😅 다음 중 "분모"를 잘못 사용한 친구는? (헷갈리는 친구 많아요, 괜찮아요!)',
    options: [
      '"나눗셈 결과를 분모라고 한다고 들었어." (← 진짜?)',
      '"분수 2/7 의 분모는 7이야."',
      '"분모가 같으면 분수끼리 더하기 쉬워."',
      '"분모가 작을수록 한 조각이 커."',
    ],
    answer: '"나눗셈 결과를 분모라고 한다고 들었어." (← 진짜?)',
    explanation: '나눗셈 결과는 "몫"이에요. 분모는 분수의 아랫수만 가리켜요. 한 번 들으면 안 잊어버려요!',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 친구가 "분모가 뭐야?" 라고 물어봐요. 한 문장으로 친근하게 알려줘 보세요.',
    answer: '분수에서 아래 적는 수가 분모인데, 전체를 몇 조각으로 나눴는지 알려주는 수야!',
    explanation: '"분수의 아랫수 = 전체를 몇 등분"이라는 두 핵심을 친구 말투로 풀어쓰면 완벽!',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 분자 (分子) — 1번에서 한자 어원 흥미 도입
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question:
      '🌱 "분자(分子)"라는 한자 이름에서 "자(子)"는 "아들" 또는 "____"이라는 뜻이 있어요.\n("작은 것"이라고 답해도 정답이에요!)\n빈칸에 들어갈 한 단어를 쓰세요.',
    answer: '작은 것',
    explanation: '한자 "子"는 "아들·자식"뿐 아니라 "작은 것·새끼"도 뜻해요. 분자 = "나누어진 작은 부분" 이라는 그림이 그려지죠?',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분자"를 가장 쉽게 풀어쓴 설명은?',
    options: [
      '전체에서 차지하는 부분의 크기를 나타내는 수',
      '두 수를 더한 결과',
      '나눗셈에서 남는 수',
      '곱셈의 결과',
    ],
    answer: '전체에서 차지하는 부분의 크기를 나타내는 수',
    explanation: '분자는 "내가 차지한 조각의 크기"를 알려줘요. 3/8 이면 8조각 중 3조각이 내 거!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"분자(分子)"의 한자 의미는?',
    options: [
      '나눌 분(分) + 아들 자(子)',
      '나눌 분(分) + 사람 자(者)',
      '나눌 분(分) + 글자 자(字)',
      '나눌 분(分) + 스스로 자(自)',
    ],
    answer: '나눌 분(分) + 아들 자(子)',
    explanation: '"아들 자(子)"가 들어가서 "나누어진 작은 부분"이라는 뜻이 만들어졌어요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🍰 5/9 (구분의 오) 라는 분수에서 분자는 어디 있을까요?',
    options: ['위에 있는 5', '아래에 있는 9', '가로줄 자체', '5와 9를 더한 14'],
    answer: '위에 있는 5',
    explanation: '분자 = 위, 분모 = 아래. 분자 5는 "9조각 중 5조각이 내 거" 라는 뜻!',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 분자와 가장 친한 단짝은?',
    options: ['분모', '약수', '배수', '소수'],
    answer: '분모',
    explanation: '분자(위) ↔ 분모(아래) — 두 친구가 같이 있어야 분수가 돼요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🍕 친구가 "분자가 더 크다"고 했어요. 무슨 뜻일까요?',
    options: [
      '전체에서 내가 차지한 부분이 더 크다',
      '나누는 기준이 더 작다',
      '나머지가 더 많다',
      '곱한 값이 더 작다',
    ],
    answer: '전체에서 내가 차지한 부분이 더 크다',
    explanation: '분자는 "차지하는 부분의 크기" 라서, 분자가 클수록 내 조각이 더 커요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '😅 다음 중 "분자"를 잘못 쓴 문장은? (헷갈려도 괜찮아요!)',
    options: [
      '"분수 3/8 에서 분자는 8이야." (← 응? 진짜?)',
      '"분수 3/8 에서 분자는 3이야."',
      '"분자가 클수록 차지하는 조각이 많아."',
      '"분자가 0이면 0이야."',
    ],
    answer: '"분수 3/8 에서 분자는 8이야." (← 응? 진짜?)',
    explanation: '3/8 에서 위에 있는 3이 분자고, 아래의 8은 분모예요. 위/아래 헷갈리지 말기!',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 친구가 "분자랑 분모 차이가 뭐야?" 라고 물어봐요. 한 문장으로 알려주세요.',
    answer: '분자는 분수에서 위에 적는 수로 차지하는 부분의 크기를, 분모는 아래 적는 수로 전체를 몇 조각으로 나눴는지를 나타내!',
    explanation: '두 친구를 같이 설명하면 더 잘 외워져요. 위 = 분자(차지한 조각) / 아래 = 분모(나눈 기준)!',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 몫 — 1번에서 시각 예시 (순한국어)
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  /* Page 1 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question:
      '🌱 사탕 10개를 친구 3명에게 똑같이 나눠줄 때, 한 명이 3개씩 받고 1개가 남아요.\n이때 한 명이 받은 개수 "3"을 ___이라고 부른답니다.',
    answer: '몫',
    explanation: '몫 = 나누어 떨어진 결과(한 명이 받은 개수) / 나머지 = 남은 1개. 어렵지 않죠?',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"몫"을 가장 쉽게 풀어쓴 설명은?',
    options: [
      '나눗셈에서 똑같이 나누어 떨어진 결과',
      '두 수를 더한 결과',
      '두 수를 곱한 결과',
      '나누고 남은 부분',
    ],
    answer: '나눗셈에서 똑같이 나누어 떨어진 결과',
    explanation: '"한 명이 몇 개씩 받았는지"가 바로 몫. 남은 부분은 "나머지"예요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"몫"이라는 단어의 재미있는 점은?',
    options: [
      '한자가 없는 우리말 단어 — "몫(沒)" 같은 한자에서 온 게 아니에요!',
      '한자 "沒"에서 왔어요',
      '영어 "more"가 변한 말이에요',
      '일본어가 바뀐 말이에요',
    ],
    answer: '한자가 없는 우리말 단어 — "몫(沒)" 같은 한자에서 온 게 아니에요!',
    explanation: '"몫"은 순우리말이에요. 분모·분자처럼 한자에서 온 게 아니라 옛날부터 쓰던 우리말!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🧮 13 ÷ 4 의 몫은 얼마일까요? (4명에게 13개를 나눠준다고 생각해 봐요)',
    options: ['3', '4', '13', '52'],
    answer: '3',
    explanation: '4를 3번 묶으면 12, 1이 남으니까 몫은 3, 나머지는 1!',
  }),
  /* Page 2 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 몫과 가장 친한 단짝은?',
    options: ['나머지', '분모', '약수', '평균'],
    answer: '나머지',
    explanation: '나눗셈에서 몫(나누어진 부분) ↔ 나머지(남은 부분) — 두 짝이 함께 있어요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🍪 일상에서 "몫"이 자연스럽게 쓰이는 상황은?',
    options: [
      '"쿠키 20개를 5명에게 나눠줬더니 몫이 4야"',
      '"오늘 날씨가 몫이 컸어"',
      '"수업이 끝나서 몫을 만들었어"',
      '"연필이 몫과 어울려"',
    ],
    answer: '"쿠키 20개를 5명에게 나눠줬더니 몫이 4야"',
    explanation: '나눗셈을 할 때 "한 명이 받은 개수"를 말할 때 몫이 쓰여요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '😅 다음 중 "몫"을 잘못 쓴 문장은? (모두가 한 번쯤 헷갈리는 부분!)',
    options: [
      '"몫이란 두 수를 곱한 결과야." (← 응?)',
      '"20 ÷ 5 의 몫은 4야."',
      '"몫과 나머지는 나눗셈에서 같이 나오는 짝꿍이야."',
      '"나누는 수보다 작은 수가 남으면 그게 나머지야."',
    ],
    answer: '"몫이란 두 수를 곱한 결과야." (← 응?)',
    explanation: '곱한 결과는 "곱"이에요. 몫은 나눗셈에서만 나와요.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 친구가 "몫이 뭔지 모르겠어" 라고 해요. 한 문장으로 친근하게 알려주세요.',
    answer: '쿠키 20개를 5명에게 똑같이 나누면 한 명이 4개씩 받는데, 이때 그 4가 바로 몫이야!',
    explanation: '구체적인 일상 예(쿠키·친구)로 풀어 설명하면 친구도 금방 이해해요.',
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
      definition: '분수에서 아래에 쓰는 수 — 전체를 몇 조각으로 나누었는지 알려주는 수',
      visualExample: '예: 3/4 에서 4가 분모 (피자를 4조각으로 나눈 셈)',
      relatedTerms: ['분자', '분수'],
    },
    slots: set1Slots, tags: ['분수', '기초', '친근특강'],
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
      definition: '분수에서 위에 쓰는 수 — 전체에서 차지하는 부분의 크기를 알려주는 수',
      visualExample: '예: 3/4 에서 3이 분자 (4조각 중 3조각이 내 거)',
      relatedTerms: ['분모', '분수'],
    },
    slots: set2Slots, tags: ['분수', '기초', '친근특강'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-mc-3',
    title: '몫 학습지',
    domain: 'math-concept', difficulty: 'easy',
    meta: {
      domain: 'math-concept',
      term: '몫',
      definition: '나눗셈에서 똑같이 나누어 떨어진 결과 — 한 명이 받은 개수',
      visualExample: '예: 10 ÷ 3 = 3 (몫) … 1 (나머지)',
      relatedTerms: ['나머지', '나눗셈'],
    },
    slots: set3Slots, tags: ['나눗셈', '순한국어', '친근특강'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
