/**
 * 시드 관용어 set 3개 — 첫 부팅 시 setStore에 자동 주입.
 *
 * 8슬롯 고정 구조:
 *   1번: short-answer (관용어 빈칸 채우기 — 신체 부위)
 *   2~7번: multiple-choice (4지선다)
 *   8번: sentence-making (사용 문장 만들기)
 */
import type { QuestionSet, SetSlots } from '../../types/sets';
import type { Question } from '../../types';

const now = Date.now();

let qSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  return {
    id: `seed-ip-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'idiomatic-phrase',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
}

/* ───────────────────────────────────────────────
   1) 발이 넓다
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: ___이 넓다 (아는 사람이 많아 사교 범위가 넓다)',
    answer: '발',
    explanation: '"발이 넓다"는 신체 부위 "발"로 사람 사이의 폭넓은 관계를 비유한 관용어입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"발이 넓다"의 뜻으로 알맞은 것은?',
    options: [
      '아는 사람이 많아 사교 범위가 넓다',
      '많이 걸어 다닌다',
      '발의 크기가 크다',
      '운동을 잘한다',
    ],
    answer: '아는 사람이 많아 사교 범위가 넓다',
    explanation: '신체 부위 "발"이 사람 사이의 관계망을 비유합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "발이 넓다"가 알맞게 쓰인 문장은?',
    options: [
      '민수는 친구가 많아서 학교에서 발이 넓다.',
      '오늘 비가 많이 와서 발이 넓다.',
      '책을 읽으면 발이 넓다.',
      '시험 점수가 좋아서 발이 넓다.',
    ],
    answer: '민수는 친구가 많아서 학교에서 발이 넓다.',
    explanation: '많은 사람과 친한 상황을 표현한 자연스러운 예입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"발이 넓다"와 가장 비슷한 의미의 표현은?',
    options: ['인맥이 두텁다', '입이 무겁다', '눈이 높다', '귀가 얇다'],
    answer: '인맥이 두텁다',
    explanation: '둘 다 인간관계 폭이 넓다는 의미를 공유합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"발이 넓다"와 가장 반대되는 모습은?',
    options: [
      '아는 사람이 거의 없다',
      '운동을 자주 한다',
      '책을 많이 읽는다',
      '말이 많다',
    ],
    answer: '아는 사람이 거의 없다',
    explanation: '인간관계가 좁은 상태가 정반대 상황입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"발이 넓다"가 어울리지 않는 사람은?',
    options: [
      '학교에 와서 처음으로 친구를 사귀려는 학생',
      '여러 동아리에서 활동하는 학생',
      '학년 친구 모두와 인사하는 학생',
      '동네 어른들과도 자주 인사하는 학생',
    ],
    answer: '학교에 와서 처음으로 친구를 사귀려는 학생',
    explanation: '아직 인간관계를 넓히기 시작한 단계로 발이 넓다고 표현하기 어렵습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 대화에 가장 어울리는 관용어는?\n\n친구: "민호는 어느 반에 가도 다 아는 사이래."\n나: "맞아, 정말 ___."',
    options: ['발이 넓어', '입이 무거워', '눈이 높아', '귀가 얇아'],
    answer: '발이 넓어',
    explanation: '많은 사람과 친한 상황을 표현하는 관용어입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'발이 넓다'을(를) 사용해 한 문장을 만드세요.",
    answer: '언니는 동아리·학원·학교 모두에서 친구가 많아 정말 발이 넓다.',
    explanation: '아는 사람이 많은 인간관계 폭을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 손이 크다
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: ___이 크다 (씀씀이가 후하고 넉넉하다)',
    answer: '손',
    explanation: '"손이 크다"는 신체 부위 "손"으로 베푸는 양이 넉넉함을 비유합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"손이 크다"의 뜻으로 알맞은 것은?',
    options: [
      '씀씀이가 후하고 넉넉하다',
      '손의 크기가 크다',
      '글씨를 크게 쓴다',
      '힘이 세다',
    ],
    answer: '씀씀이가 후하고 넉넉하다',
    explanation: '신체 "손"이 베푸는 양·씀씀이를 비유합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "손이 크다"가 알맞게 쓰인 문장은?',
    options: [
      '엄마는 음식을 만들 때마다 손이 커서 항상 넉넉하다.',
      '손이 커서 키가 크다.',
      '손이 커서 운동을 잘한다.',
      '손이 커서 노래를 잘한다.',
    ],
    answer: '엄마는 음식을 만들 때마다 손이 커서 항상 넉넉하다.',
    explanation: '음식을 넉넉히 베푸는 모습이 손이 큰 자연스러운 예입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"손이 크다"와 비슷한 뜻의 표현은?',
    options: ['후하다', '인색하다', '꼼꼼하다', '예민하다'],
    answer: '후하다',
    explanation: '"후하다"는 베푸는 양이 넉넉하다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"손이 크다"와 반대되는 사람의 모습은?',
    options: [
      '쓰는 양을 너무 아끼는 사람',
      '말을 많이 하는 사람',
      '운동을 좋아하는 사람',
      '책을 빨리 읽는 사람',
    ],
    answer: '쓰는 양을 너무 아끼는 사람',
    explanation: '인색하게 쓰는 것이 손이 큰 모습의 반대입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "손이 크다"의 예로 알맞지 않은 상황은?',
    options: [
      '받은 용돈을 모두 저금만 하는 사람',
      '잔치 때 음식을 넉넉하게 준비하는 사람',
      '친구들에게 간식을 듬뿍 나눠주는 사람',
      '손님을 맞을 때 넉넉히 차리는 사람',
    ],
    answer: '받은 용돈을 모두 저금만 하는 사람',
    explanation: '베푸는 양이 적거나 없는 상황은 손이 크다고 보기 어렵습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 대화에 가장 어울리는 관용어는?\n\n나: "할머니가 떡을 한가득 만들어 주셨어."\n친구: "와, 할머니가 정말 ___."',
    options: ['손이 크셔', '발이 넓으셔', '귀가 얇으셔', '입이 무거우셔'],
    answer: '손이 크셔',
    explanation: '음식을 넉넉히 만들어 주는 모습이 손이 큰 모습입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'손이 크다'을(를) 사용해 한 문장을 만드세요.",
    answer: '이모는 손이 커서 친척들이 모일 때마다 음식을 푸짐하게 준비하신다.',
    explanation: '베푸는 양이 넉넉한 모습을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 입이 무겁다
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: ___이 무겁다 (말이 적고 비밀을 잘 지킨다)',
    answer: '입',
    explanation: '"입이 무겁다"는 "입"으로 말의 신중함과 비밀 지킴을 비유합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"입이 무겁다"의 뜻으로 알맞은 것은?',
    options: [
      '말이 적고 비밀을 잘 지킨다',
      '말을 빨리 한다',
      '음식을 많이 먹는다',
      '목소리가 크다',
    ],
    answer: '말이 적고 비밀을 잘 지킨다',
    explanation: '"입이 무겁다"는 신중하게 말하고 비밀을 지킨다는 뜻입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "입이 무겁다"가 알맞게 쓰인 문장은?',
    options: [
      '민호는 입이 무거워서 우리 비밀을 절대 말하지 않아.',
      '오늘 입이 무거워서 점심을 못 먹었다.',
      '입이 무거워서 노래를 잘한다.',
      '입이 무거워서 시험 점수가 잘 나왔다.',
    ],
    answer: '민호는 입이 무거워서 우리 비밀을 절대 말하지 않아.',
    explanation: '비밀을 잘 지키는 친구의 모습이 자연스러운 예입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"입이 무겁다"와 가장 반대되는 표현은?',
    options: ['입이 가볍다', '발이 넓다', '눈이 높다', '귀가 얇다'],
    answer: '입이 가볍다',
    explanation: '"입이 가볍다"는 말이 헤프고 비밀을 잘 흘린다는 정반대 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"입이 무거운" 친구에게 어울리는 모습은?',
    options: [
      '내가 한 비밀 이야기를 다른 친구들에게 옮긴다',
      '친구가 부탁한 비밀을 끝까지 지킨다',
      '쉬는 시간마다 큰 소리로 떠든다',
      '여러 사람에게 같은 이야기를 반복한다',
    ],
    answer: '친구가 부탁한 비밀을 끝까지 지킨다',
    explanation: '말의 무게를 알고 비밀을 지키는 모습이 핵심입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"입이 무겁다"와 가장 비슷한 의미의 표현은?',
    options: ['신중하다', '시끄럽다', '활발하다', '가볍다'],
    answer: '신중하다',
    explanation: '말을 함부로 하지 않는 신중한 태도가 핵심입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 대화에 가장 어울리는 관용어는?\n\n나: "이건 비밀인데 너만 알고 있어."\n친구: "걱정 마, 나는 ___."',
    options: ['입이 무거워', '발이 넓어', '손이 커', '눈이 높아'],
    answer: '입이 무거워',
    explanation: '비밀을 지킨다는 약속에 어울리는 관용어입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'입이 무겁다'을(를) 사용해 한 문장을 만드세요.",
    answer: '준수는 입이 무거워서 누가 어떤 비밀을 말해도 절대 다른 사람에게 옮기지 않는다.',
    explanation: '말의 신중함과 비밀 지킴을 표현했습니다.',
  }),
] as const;

/* ─── Set 객체 export ─── */
export const IDIOMATIC_DEFAULT_SETS: QuestionSet[] = [
  {
    id: 'seed-ip-1',
    title: '발이 넓다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'easy',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '발이 넓다',
      meaning: '아는 사람이 많아 사교 범위가 넓다',
      example: '민수는 학교에서 발이 넓어서 모두와 친하다.',
    },
    slots: set1Slots, tags: ['인간관계', '신체비유'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-ip-2',
    title: '손이 크다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'easy',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '손이 크다',
      meaning: '씀씀이가 후하고 넉넉하다',
      example: '엄마는 손이 커서 잔치 때마다 음식을 푸짐하게 차리신다.',
    },
    slots: set2Slots, tags: ['성격', '신체비유'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-ip-3',
    title: '입이 무겁다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'easy',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '입이 무겁다',
      meaning: '말이 적고 비밀을 잘 지킨다',
      example: '민호는 입이 무거워서 비밀을 부탁해도 안심이 된다.',
    },
    slots: set3Slots, tags: ['성격', '신체비유'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
