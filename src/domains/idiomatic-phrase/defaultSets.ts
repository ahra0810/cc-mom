/**
 * 시드 관용어 set 3개 — 8문항 2페이지 (Bloom's Taxonomy).
 *
 * 슬롯 구성 (count = 8, pageBreaks: [3]):
 *   페이지 1 (인지·이해)
 *     0) short-answer       : 빈칸 채우기 (신체 부위)
 *     1) multiple-choice    : 친근한 뜻
 *     2) multiple-choice    : 교과서 정의
 *     3) multiple-choice    : 비슷한 관용어 (네트워크)
 *   페이지 2 (적용·산출)
 *     4) multiple-choice    : 어울리는 일상 상황
 *     5) multiple-choice    : 잘못 쓰인 예 찾기
 *     6) multiple-choice    : 비유의 의미 — 왜 이 신체 부위?
 *     7) sentence-making    : 직접 응용
 *
 * 시드 3종 (초3~중1, 신체 부위 비유):
 *   - 발이 넓다 (사교성)
 *   - 손이 크다 (씀씀이)
 *   - 입이 무겁다 (비밀 잘 지킴)
 */
import type { QuestionSet, SetSlots } from '../../types/sets';
import type { Question } from '../../types';
import { withMcAnswerAt } from '../../services/mcShuffle';
import { PHRASE_SVG } from '../_shared/idiomSvg';

const now = Date.now();

let qSeq = 0;
let mcSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  const built: Question = {
    id: `seed-ip-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'idiomatic-phrase',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
  if (built.type === 'multiple-choice') {
    const positioned = withMcAnswerAt(built, mcSeq);
    mcSeq++;
    return positioned;
  }
  return built;
}

/* ───────────────────────────────────────────────
   1) 발이 넓다 (사교성, 초3·4)
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  /* P1 — 인지·이해 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '🌱 다음 빈칸을 채우세요:\n___이 넓다 (아는 사람이 많다는 뜻)',
    answer: '발',
    explanation: '"발"이 가는 곳이 넓다 = 사람 만나는 범위가 넓다는 비유예요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"발이 넓다"의 친근한 뜻은?',
    options: [
      '아는 사람이 많아 사교 범위가 넓다',
      '발의 크기가 크다',
      '멀리까지 갈 수 있다',
      '신발이 잘 맞지 않는다',
    ],
    answer: '아는 사람이 많아 사교 범위가 넓다',
    explanation: '"발"이 닿는 곳이 넓다 = 사람 만나는 범위가 넓다는 비유.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '사귀어 아는 사람이 많다.',
      '발이 크다.',
      '걸음이 빠르다.',
      '신발 사이즈가 크다.',
    ],
    answer: '사귀어 아는 사람이 많다.',
    explanation: '관용어는 글자 그대로의 뜻이 아닌 비유적 의미를 가져요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "발이 넓다"와 가장 비슷한 뜻의 관용어는?',
    options: [
      '얼굴이 넓다',
      '입이 무겁다',
      '귀가 얇다',
      '코가 높다',
    ],
    answer: '얼굴이 넓다',
    explanation: '두 표현 모두 "아는 사람이 많다"는 뜻 — 신체 부위는 다르지만 의미는 같아요!',
  }),
  /* P2 — 적용·산출 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🌟 다음 상황에 가장 어울리는 관용어는?\n\n[상황] 새 동아리에 갔는데 거의 모든 학생이 "어! 너 알아!" 하며 반갑게 인사했어요.',
    options: ['발이 넓다', '입이 무겁다', '손이 크다', '코가 높다'],
    answer: '발이 넓다',
    explanation: '많은 사람과 친해서 어디 가도 아는 사람이 있다 = 발이 넓다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⚠️ 다음 중 "발이 넓다"가 **잘못 쓰인** 예는?',
    options: [
      '민수는 발이 넓어서 어느 학원에 가도 아는 친구가 있어.',
      '내 신발이 작아서 발이 넓다.',
      '형은 발이 넓어서 모임에서 늘 인기가 많아.',
      '엄마는 발이 넓으셔서 동네 분들과 다 친하셔.',
    ],
    answer: '내 신발이 작아서 발이 넓다.',
    explanation: '관용어는 비유적 의미만 사용해요. 글자 그대로 "발 크기가 크다"는 뜻으로 쓰면 안 됨.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🤔 왜 "발"을 사용해 "사교성"을 표현했을까요?',
    options: [
      '발은 사람을 만나러 다니는 신체 부위니까',
      '발이 가장 큰 신체 부위라서',
      '발은 빠르게 움직이니까',
      '발이 두 개 있어서',
    ],
    answer: '발은 사람을 만나러 다니는 신체 부위니까',
    explanation: '발이 닿는 곳이 많다 = 다양한 곳에서 다양한 사람을 만난다는 비유.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 "발이 넓다"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '우리 형은 발이 넓어서 어느 학원에 가도 아는 형이 한 명씩은 꼭 있어요.',
    explanation: '실제 인물 + 관용어 자연스럽게 결합!',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 손이 크다 (씀씀이, 초3·4)
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '🌱 다음 빈칸을 채우세요:\n___이 크다 (씀씀이가 후하다는 뜻)',
    answer: '손',
    explanation: '"손" = 베푸는 행동의 비유. 한 번에 많이 베푸는 모습을 "손이 크다"로 표현!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"손이 크다"의 친근한 뜻은?',
    options: [
      '씀씀이가 후하고 넉넉하다',
      '손가락이 길다',
      '글씨를 잘 쓴다',
      '힘이 세다',
    ],
    answer: '씀씀이가 후하고 넉넉하다',
    explanation: '한 번 쓸 때 많이 쓰고 푸짐하게 베푸는 사람을 "손이 크다"고 해요!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '씀씀이가 후하고 넉넉하다.',
      '손바닥이 크다.',
      '손재주가 좋다.',
      '손가락이 길다.',
    ],
    answer: '씀씀이가 후하고 넉넉하다.',
    explanation: '인심이 후한 사람의 모습을 비유한 관용어.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "손이 크다"와 가장 비슷한 뜻의 관용어는?',
    options: [
      '통이 크다',
      '입이 무겁다',
      '발이 넓다',
      '귀가 얇다',
    ],
    answer: '통이 크다',
    explanation: '"통이 크다"도 마음 씀씀이가 큰 사람을 가리켜요. 인심·도량을 강조하는 표현.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🌟 다음 상황에 가장 어울리는 관용어는?\n\n[상황] 할머니께서 우리 집에 오시면 늘 한 솥 가득 떡을 만드시고 동네 친구들에게도 다 나눠 주세요.',
    options: ['손이 크다', '발이 넓다', '입이 짧다', '귀가 얇다'],
    answer: '손이 크다',
    explanation: '음식을 푸짐하게 만들고 인심 좋게 나눠 주는 모습 — "손이 크다"!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⚠️ 다음 중 "손이 크다"가 **잘못 쓰인** 예는?',
    options: [
      '엄마는 손이 커서 김밥 한 번 싸시면 옆집까지 다 나눠 주실 만큼 만드세요.',
      '농구 선수라 손이 크다.',
      '할머니는 손이 커서 친척이 오면 음식이 한 상 가득해.',
      '아빠는 손이 크셔서 추석에 친지들에게 선물을 듬뿍 보내세요.',
    ],
    answer: '농구 선수라 손이 크다.',
    explanation: '관용어 "손이 크다"는 신체 크기가 아닌 "씀씀이"를 가리켜요. 글자 그대로 쓰면 안 됨.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🤔 왜 "손"을 사용해 "씀씀이"를 표현했을까요?',
    options: [
      '손은 무엇을 주거나 베풀 때 사용하는 부위니까',
      '손이 가장 빠르게 움직이니까',
      '손에 돈을 쥐고 있으니까',
      '손가락이 다섯 개라서',
    ],
    answer: '손은 무엇을 주거나 베풀 때 사용하는 부위니까',
    explanation: '손으로 음식을 차리고 선물을 건네죠. "손이 크다" = 베푸는 양이 많다는 비유!',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 "손이 크다"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '엄마는 손이 커서 김밥 한 번 싸시면 옆집까지 다 나눠 줄 만큼 만드세요.',
    explanation: '음식·선물·돈 등 푸짐한 상황과 자연스럽게 결합!',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 입이 무겁다 (비밀 잘 지킴, 초5·6)
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'medium',
    question: '🌱 다음 빈칸을 채우세요:\n___이 무겁다 (비밀을 잘 지킨다는 뜻)',
    answer: '입',
    explanation: '"입"이 무거우면 함부로 열리지 않아요. 비밀을 새지 않게 잘 지킨다는 비유!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"입이 무겁다"의 친근한 뜻은?',
    options: [
      '말이 적고 비밀을 잘 지킨다',
      '말을 더듬거린다',
      '음식을 많이 먹는다',
      '소리가 크다',
    ],
    answer: '말이 적고 비밀을 잘 지킨다',
    explanation: '입이 무거워서 함부로 열지 않는다 = 비밀을 새지 않게 잘 지킨다!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '말이 적고 비밀을 잘 지킨다.',
      '입이 잘 다물어지지 않는다.',
      '음식을 천천히 먹는다.',
      '발음이 분명하다.',
    ],
    answer: '말이 적고 비밀을 잘 지킨다.',
    explanation: '신뢰할 수 있는 사람을 가리키는 대표 관용어.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '👯 "입이 무겁다"의 **반대** 의미를 가진 관용어는?',
    options: [
      '입이 가볍다',
      '발이 넓다',
      '손이 크다',
      '귀가 밝다',
    ],
    answer: '입이 가볍다',
    explanation: '"입이 가볍다" = 말을 함부로 한다, 비밀을 새게 만든다. "입이 무겁다"의 반대.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🌟 다음 상황에 가장 어울리는 관용어는?\n\n[상황] 친한 친구에게 가족 비밀을 털어놨는데, 한 달이 지나도 누구에게도 말한 적이 없다고 모두 들어 보지 못했대요.',
    options: ['입이 무겁다', '발이 넓다', '손이 크다', '입이 가볍다'],
    answer: '입이 무겁다',
    explanation: '비밀을 끝까지 지켜주는 신뢰할 수 있는 친구 — "입이 무겁다"!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '⚠️ 다음 중 "입이 무겁다"가 **잘못 쓰인** 예는?',
    options: [
      '내 짝꿍은 입이 무거워서 비밀을 끝까지 지켜줘.',
      '입이 무거워서 음식을 잘 못 씹어.',
      '저 어른은 입이 무거우셔서 회사 일을 절대 새지 않으세요.',
      '진짜 친한 친구일수록 입이 무거운 사람을 골라야 해.',
    ],
    answer: '입이 무거워서 음식을 잘 못 씹어.',
    explanation: '관용어 "입이 무겁다"는 비유적으로 "비밀을 잘 지킨다"는 뜻이에요. 무게의 의미로 쓰면 안 됨.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🤔 왜 "입"을 사용해 "비밀 지킴"을 표현했을까요?',
    options: [
      '입은 말을 하는 부위라서, 입이 무거우면 함부로 열리지 않으니까',
      '입이 신체에서 가장 무거워서',
      '입을 다물면 음식을 못 먹어서',
      '입은 두 개라서',
    ],
    answer: '입은 말을 하는 부위라서, 입이 무거우면 함부로 열리지 않으니까',
    explanation: '입의 핵심 기능 = 말하기. "무겁다" = 쉽게 안 열린다 → 비밀 안 새는 비유!',
  }),
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: '🤝 "입이 무겁다"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '내 짝꿍은 입이 무거워서 내가 부탁한 비밀을 지금까지 한 번도 말한 적이 없어요.',
    explanation: '신뢰할 수 있는 사람에 대해 "입이 무겁다" — 자연스러운 응용!',
  }),
] as const;

/* ─── Set 객체 (원본) ─── */
const _IDIOMATIC_RAW: QuestionSet[] = [
  {
    id: 'seed-ip-1',
    title: '발이 넓다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'easy',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '발이 넓다',
      textbookMeaning: '사귀어 아는 사람이 많다.',
      meaning: '아는 사람이 정말정말 많아요!\n어디 가도 인사할 친구가 가득해요.',
      visualEmoji: '👫 👫 👫 👫 👫 👫 👫\n         ↑\n         나\n= **친구가 많은 사람** !',
      visualExample: '학교에서 어느 반에 가도 인사할 친구가 많아요.\n사교성이 좋고 활발한 사람을 가리켜요.',
      relatedPhrases: ['얼굴이 넓다', '손이 닳도록', '입을 다물다'],
      relatedPhrasesDetailed: [
        { emoji: '👫', term: '얼굴이 넓다', desc: '많은 사람과 친해요.\n발이 넓다와 비슷한 뜻!' },
        { emoji: '🤝', term: '손이 닳도록', desc: '부지런히 사람을 만나요.\n사교성과 통하는 표현.' },
        { emoji: '🚪', term: '입을 다물다', desc: '(대비) 말을 안 함.\n사교성과는 반대되는 모습!' },
      ],
      usageExample: '민수는 학교에서 발이 넓어서 어느 반에 가도 인사하는 친구가 있어.',
      example: '민수는 학교에서 발이 넓어서 모두와 친하다.',
      grade: 4,
    },
    slots: set1Slots, tags: ['신체비유', '사교성', '초3·4'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-ip-2',
    title: '손이 크다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'easy',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '손이 크다',
      textbookMeaning: '씀씀이가 후하고 넉넉하다.',
      meaning: '한 번 쓸 때 푸짐하게 쓰고 넉넉히 베풀어요!\n인심이 좋아서 받는 사람도 기분이 좋답니다.',
      visualEmoji: '🍱 🍱 🍱 🍱 🍱\n     ↓\n  "다 같이 먹자!"\n= **푸짐한 인심** !',
      visualExample: '한 솥 가득 떡을 만들어 동네 친구들에게 다 나눠 주세요.\n음식이든 선물이든 통 크게 베푸는 모습이에요.',
      relatedPhrases: ['통이 크다', '인심이 후하다', '손이 야무지다'],
      relatedPhrasesDetailed: [
        { emoji: '💝', term: '통이 크다', desc: '마음 씀씀이가 큼.\n손이 크다와 비슷한 인심!' },
        { emoji: '🤲', term: '인심이 후하다', desc: '사람을 후하게 대해요.\n많이 베푸는 마음.' },
        { emoji: '✋', term: '손이 야무지다', desc: '(대비) 일을 꼼꼼히 함.\n인심이 아닌 솜씨를 가리켜요.' },
      ],
      usageExample: '할머니는 손이 커서 한 솥 가득 떡을 만들고 옆집까지 다 나눠 주세요.',
      example: '할머니는 손이 크셔서 음식을 늘 푸짐하게 차려 주신다.',
      grade: 4,
    },
    slots: set2Slots, tags: ['신체비유', '씀씀이', '초3·4'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-ip-3',
    title: '입이 무겁다 학습지',
    domain: 'idiomatic-phrase', difficulty: 'medium',
    meta: {
      domain: 'idiomatic-phrase',
      phrase: '입이 무겁다',
      textbookMeaning: '말이 적고 비밀을 잘 지킨다.',
      meaning: '함부로 입을 열지 않고 비밀을 끝까지 지켜요!\n신뢰할 수 있는 사람을 가리키는 표현이에요.',
      visualEmoji: '🤐  "비밀이야!"\n      ↓\n🔒 끝까지 지켜요\n= **신뢰할 수 있는 사람** !',
      visualExample: '친구가 부탁한 비밀을 한 달이 지나도 누구에게도 말하지 않아요.\n믿을 수 있는 친구를 "입이 무겁다"고 해요.',
      relatedPhrases: ['비밀을 지키다', '입이 가볍다', '귀가 얇다'],
      relatedPhrasesDetailed: [
        { emoji: '🤐', term: '비밀을 지키다', desc: '약속한 비밀을\n끝까지 지켜요.' },
        { emoji: '💬', term: '입이 가볍다', desc: '(대비) 말을 함부로 함.\n비밀을 새게 만들죠.' },
        { emoji: '🦻', term: '귀가 얇다', desc: '(대비) 남의 말을\n쉽게 믿어요.' },
      ],
      usageExample: '친한 친구에게 가족 비밀을 털어놨는데, 한 달이 지나도 누구에게도 말한 적이 없대요.',
      example: '내 짝꿍은 입이 무거워서 비밀을 잘 지켜준다.',
      grade: 5,
    },
    slots: set3Slots, tags: ['신체비유', '신뢰·비밀', '초5·6'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];

/* 본문 일치 시 자체 제작 SVG 장면 그림 자동 주입 (없으면 visualEmoji fallback) */
export const IDIOMATIC_DEFAULT_SETS: QuestionSet[] = _IDIOMATIC_RAW.map((s) => {
  const m = s.meta as { phrase?: string };
  const svg = m.phrase ? PHRASE_SVG[m.phrase] : undefined;
  return svg ? { ...s, meta: { ...s.meta, visualSvg: svg } } : s;
});
