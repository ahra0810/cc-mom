/**
 * 시드 속담 set 3개 — 첫 부팅 시 setStore에 자동 주입.
 *
 * 8슬롯 고정 구조:
 *   1번: short-answer (속담 빈칸 채우기)
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
    id: `seed-pv-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'proverb',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
}

/* ───────────────────────────────────────────────
   1) 가는 말이 고와야 오는 말이 곱다
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: 가는 말이 ___ 오는 말이 곱다',
    answer: '고와야',
    explanation: '내가 친절하게 말해야 상대방도 친절하게 답한다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"가는 말이 고와야 오는 말이 곱다"의 뜻으로 알맞은 것은?',
    options: [
      '내가 좋게 말하면 남도 좋게 말한다',
      '말은 빨리 해야 한다',
      '먼저 인사를 해야 친구가 된다',
      '말보다 행동이 중요하다',
    ],
    answer: '내가 좋게 말하면 남도 좋게 말한다',
    explanation: '상대를 대하는 태도는 결국 자신에게 돌아온다는 뜻입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담이 가르치는 가치로 가장 알맞은 것은?',
    options: ['언어 예절', '신속한 행동', '용감한 결정', '꼼꼼한 관찰'],
    answer: '언어 예절',
    explanation: '말 한 마디의 중요성과 예의를 강조한 속담입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 이 속담이 알맞게 쓰인 문장은?',
    options: [
      '동생에게 부드럽게 말했더니 동생도 친절하게 답해 주었다.',
      '오늘은 비가 와서 가는 말이 고와야 오는 말이 곱다.',
      '시험 점수가 높아서 가는 말이 고와야 오는 말이 곱다.',
      '책을 빨리 읽어 가는 말이 고와야 오는 말이 곱다.',
    ],
    answer: '동생에게 부드럽게 말했더니 동생도 친절하게 답해 주었다.',
    explanation: '내 말투가 상대 말투에 영향을 준 상황입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담과 가장 비슷한 의미의 표현은?',
    options: [
      '말 한 마디로 천 냥 빚을 갚는다',
      '발 없는 말이 천 리 간다',
      '소 잃고 외양간 고친다',
      '우물 안 개구리',
    ],
    answer: '말 한 마디로 천 냥 빚을 갚는다',
    explanation: '둘 다 말의 영향력과 친절한 말투의 가치를 강조합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담과 반대되는 태도는?',
    options: ['먼저 화내거나 거친 말을 하기', '미소로 인사하기', '먼저 양보하기', '조용히 듣기'],
    answer: '먼저 화내거나 거친 말을 하기',
    explanation: '거친 말부터 시작하면 상대도 거칠게 답하게 됩니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 대화에 가장 어울리는 속담은?\n\n친구 A: "왜 그렇게 화나서 말해?"\n친구 B: "네가 먼저 짜증을 냈잖아!"',
    options: [
      '가는 말이 고와야 오는 말이 곱다',
      '소 잃고 외양간 고친다',
      '발 없는 말이 천 리 간다',
      '우물 안 개구리',
    ],
    answer: '가는 말이 고와야 오는 말이 곱다',
    explanation: '먼저 한 말투가 상대의 답을 결정한 상황입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'가는 말이 고와야 오는 말이 곱다'가 어울리는 상황을 한 문장으로 쓰세요.",
    answer: '내가 부드럽게 부탁하니 친구도 흔쾌히 도와주어, 가는 말이 고와야 오는 말이 곱다는 속담이 떠올랐다.',
    explanation: '친절한 태도가 상호 친절한 결과를 만든 상황을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 백지장도 맞들면 낫다
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '다음 빈칸을 채우세요: 백지장도 ___ 낫다',
    answer: '맞들면',
    explanation: '아무리 가벼운 종이도 둘이 들면 더 쉽다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"백지장도 맞들면 낫다"의 뜻으로 알맞은 것은?',
    options: [
      '아무리 쉬운 일도 협력하면 더 쉬워진다',
      '혼자 하는 일이 더 빠르다',
      '큰 일도 한 사람이 해야 한다',
      '백지장은 가벼워서 쓸모없다',
    ],
    answer: '아무리 쉬운 일도 협력하면 더 쉬워진다',
    explanation: '협동·협력의 가치를 강조한 속담입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담이 강조하는 가치는?',
    options: ['협동', '경쟁', '인내', '도전'],
    answer: '협동',
    explanation: '함께 힘을 모으면 일이 쉬워진다는 협력의 가치를 강조합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 이 속담이 알맞게 쓰인 문장은?',
    options: [
      '청소를 친구와 같이 했더니 빨리 끝났어. 백지장도 맞들면 낫다더라.',
      '혼자 책을 읽었더니 백지장도 맞들면 낫다.',
      '시험을 봤더니 백지장도 맞들면 낫다.',
      '놀이공원에서 백지장도 맞들면 낫다.',
    ],
    answer: '청소를 친구와 같이 했더니 빨리 끝났어. 백지장도 맞들면 낫다더라.',
    explanation: '협동으로 일이 쉬워진 상황을 표현했습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담과 비슷한 의미의 사자성어는?',
    options: ['일심동체', '동문서답', '대기만성', '자화자찬'],
    answer: '일심동체',
    explanation: '일심동체는 "한 마음으로 함께"라는 협동의 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '이 속담과 반대되는 태도는?',
    options: ['혼자만 하려고 함', '먼저 양보함', '함께 의논함', '서로 도움'],
    answer: '혼자만 하려고 함',
    explanation: '협동의 반대는 모든 것을 혼자 하려는 태도입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 대화에 가장 어울리는 속담은?\n\n선생님: "이 책상을 옮겨 줄래?"\n학생: "혼자는 무거우니 친구랑 같이 들게요."',
    options: [
      '백지장도 맞들면 낫다',
      '소 잃고 외양간 고친다',
      '우물 안 개구리',
      '하늘이 무너져도 솟아날 구멍이 있다',
    ],
    answer: '백지장도 맞들면 낫다',
    explanation: '함께 들면 더 쉽다는 협력의 본보기입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'백지장도 맞들면 낫다'가 어울리는 상황을 한 문장으로 쓰세요.",
    answer: '교실 책상을 친구와 함께 옮겼더니 금방 끝나, 백지장도 맞들면 낫다는 말이 와닿았다.',
    explanation: '협력으로 일이 쉽게 끝난 상황을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 천 리 길도 한 걸음부터
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'medium',
    question: '다음 빈칸을 채우세요: 천 리 길도 ___ 부터',
    answer: '한 걸음',
    explanation: '아무리 큰 일도 시작이 있어야 이루어진다는 뜻입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"천 리 길도 한 걸음부터"의 뜻으로 알맞은 것은?',
    options: [
      '큰 일도 작은 시작에서 비롯된다',
      '먼 길은 빠르게 가야 한다',
      '한 걸음에 천 리를 갈 수 있다',
      '꾸준한 사람만 천 리를 간다',
    ],
    answer: '큰 일도 작은 시작에서 비롯된다',
    explanation: '시작의 중요성을 강조한 속담입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '이 속담이 강조하는 가치는?',
    options: ['시작과 꾸준함', '빠른 결과', '큰 도전', '경쟁'],
    answer: '시작과 꾸준함',
    explanation: '한 걸음씩 꾸준히 나아가는 것이 핵심입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 중 이 속담이 알맞게 쓰인 문장은?',
    options: [
      '운동을 매일 30분씩 시작했어. 천 리 길도 한 걸음부터니까.',
      '오늘 점심은 천 리 길도 한 걸음부터로 했다.',
      '날씨가 추워서 천 리 길도 한 걸음부터다.',
      '시험 결과가 좋아서 천 리 길도 한 걸음부터다.',
    ],
    answer: '운동을 매일 30분씩 시작했어. 천 리 길도 한 걸음부터니까.',
    explanation: '큰 목표를 작은 한 걸음씩 시작하는 상황입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '이 속담과 비슷한 의미의 사자성어는?',
    options: ['대기만성', '일석이조', '동문서답', '자화자찬'],
    answer: '대기만성',
    explanation: '대기만성도 시간을 들여 꾸준히 노력해야 큰 그릇이 된다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '이 속담과 가장 어울리지 않는 상황은?',
    options: [
      '하루 만에 두꺼운 책을 다 읽으려 한다',
      '매일 단어 10개씩 외우기 시작한다',
      '큰 그림을 작은 부분부터 그린다',
      '꾸준히 매일 일기를 쓴다',
    ],
    answer: '하루 만에 두꺼운 책을 다 읽으려 한다',
    explanation: '한 번에 끝내려는 태도는 이 속담의 가르침과 반대입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 대화에 가장 어울리는 속담은?\n\n친구: "수영을 잘하고 싶은데 어디서부터 시작해야 해?"\n선생님: "오늘부터 매일 30분씩 연습해 봐."',
    options: [
      '천 리 길도 한 걸음부터',
      '소 잃고 외양간 고친다',
      '발 없는 말이 천 리 간다',
      '등잔 밑이 어둡다',
    ],
    answer: '천 리 길도 한 걸음부터',
    explanation: '큰 목표를 작은 한 걸음씩 시작하라는 조언입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: "'천 리 길도 한 걸음부터'가 어울리는 상황을 한 문장으로 쓰세요.",
    answer: '피아노를 잘 치고 싶어 매일 한 곡씩 연습하기로 했다. 천 리 길도 한 걸음부터다.',
    explanation: '큰 목표를 위해 작은 시작을 한 상황을 표현했습니다.',
  }),
] as const;

/* ─── Set 객체 export ─── */
export const PROVERB_DEFAULT_SETS: QuestionSet[] = [
  {
    id: 'seed-pv-1',
    title: '가는 말이 고와야 오는 말이 곱다 학습지',
    domain: 'proverb', difficulty: 'easy',
    meta: {
      domain: 'proverb',
      proverb: '가는 말이 고와야 오는 말이 곱다',
      meaning: '내가 남에게 좋게 말해야 남도 나에게 좋게 말한다',
      lesson: '남에게 친절히 말하는 것이 중요하다',
    },
    slots: set1Slots, tags: ['언어예절', '관계'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-pv-2',
    title: '백지장도 맞들면 낫다 학습지',
    domain: 'proverb', difficulty: 'easy',
    meta: {
      domain: 'proverb',
      proverb: '백지장도 맞들면 낫다',
      meaning: '아무리 쉬운 일도 협력하면 더 쉬워진다',
      lesson: '함께 힘을 모으면 일이 가벼워진다',
    },
    slots: set2Slots, tags: ['협동', '관계'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-pv-3',
    title: '천 리 길도 한 걸음부터 학습지',
    domain: 'proverb', difficulty: 'medium',
    meta: {
      domain: 'proverb',
      proverb: '천 리 길도 한 걸음부터',
      meaning: '큰 일도 작은 시작에서 비롯된다',
      lesson: '꾸준히 한 걸음씩 나아가야 큰 목표를 이룬다',
    },
    slots: set3Slots, tags: ['시작', '꾸준함'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
