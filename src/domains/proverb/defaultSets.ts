/**
 * 시드 속담 set 3개 — 8문항 2페이지 (Bloom's Taxonomy).
 *
 * 슬롯 구성 (count = 8, pageBreaks: [3]):
 *   페이지 1 (인지·이해)
 *     0) short-answer       : 빈칸 채우기 (본문 암기)
 *     1) multiple-choice    : 친근한 뜻
 *     2) multiple-choice    : 교과서 정의 (사전식)
 *     3) multiple-choice    : 비슷한 속담 (분석·네트워크)
 *   페이지 2 (적용·산출)
 *     4) multiple-choice    : 어울리는 일상 상황 (적용)
 *     5) multiple-choice    : 잘못 쓰인 예 찾기 (역방향 분석)
 *     6) multiple-choice    : 핵심 교훈 (종합)
 *     7) sentence-making    : 직접 응용한 문장 만들기 (산출)
 *
 * 시드 3종 (초3~중1 핵심):
 *   - 가는 말이 고와야 오는 말이 곱다 (관계·예의)
 *   - 백지장도 맞들면 낫다 (협동)
 *   - 천 리 길도 한 걸음부터 (꾸준함·시작)
 */
import type { QuestionSet, SetSlots } from '../../types/sets';
import type { Question } from '../../types';
import { withMcAnswerAt } from '../../services/mcShuffle';
import { PROVERB_SVG } from '../_shared/idiomSvg';

const now = Date.now();

let qSeq = 0;
let mcSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  const built: Question = {
    id: `seed-pv-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'proverb',
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
   1) 가는 말이 고와야 오는 말이 곱다 (관계·예의, 초3·4)
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  /* P1 — 인지·이해 */
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '🌱 다음 빈칸을 채우세요:\n가는 말이 ___ 오는 말이 곱다',
    answer: '고와야',
    explanation: '"고와야" = (말이) 고와야 한다 — 내가 곱게 말해야 상대도 곱게 답해요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"가는 말이 고와야 오는 말이 곱다"의 친근한 뜻으로 알맞은 것은?',
    options: [
      '내가 친절하게 말하면 상대도 친절하게 답한다',
      '빠르게 말하면 빠르게 답이 온다',
      '큰 소리로 말해야 잘 들린다',
      '말하지 않는 게 가장 좋다',
    ],
    answer: '내가 친절하게 말하면 상대도 친절하게 답한다',
    explanation: '상대를 대하는 태도는 결국 자신에게 돌아온다는 뜻이에요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '자기가 남에게 말이나 행동을 좋게 해야 남도 자기에게 좋게 한다.',
      '말은 적게 하는 것이 좋다.',
      '먼저 인사하는 사람이 이긴다.',
      '말과 행동이 일치해야 한다.',
    ],
    answer: '자기가 남에게 말이나 행동을 좋게 해야 남도 자기에게 좋게 한다.',
    explanation: '사전식 정의 — 인간관계에서 상호작용의 원리를 표현한 속담.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "가는 말이 고와야…"와 가장 비슷한 뜻의 속담은?',
    options: [
      '오는 정이 있어야 가는 정이 있다',
      '발 없는 말이 천 리 간다',
      '백지장도 맞들면 낫다',
      '천 리 길도 한 걸음부터',
    ],
    answer: '오는 정이 있어야 가는 정이 있다',
    explanation: '두 속담 모두 "주고받는" 상호 관계를 강조해요. 마음을 주고받는 게 비슷하답니다.',
  }),
  /* P2 — 적용·산출 */
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🌟 다음 상황에 가장 어울리는 속담은?\n\n[상황] 친구가 인사를 안 받아주자 화가 나서 다음 날 다른 친구도 인사를 안 했어요. 그러자 그 친구도 화내며 "너도 인사 안 받지!" 하고 외면했어요.',
    options: [
      '가는 말이 고와야 오는 말이 곱다',
      '백지장도 맞들면 낫다',
      '천 리 길도 한 걸음부터',
      '우물에서 숭늉 찾는다',
    ],
    answer: '가는 말이 고와야 오는 말이 곱다',
    explanation: '내가 화내며 대하면 상대도 화내며 답해요. 곱게 대하면 곱게 돌아온답니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⚠️ 다음 중 "가는 말이 고와야 오는 말이 곱다"가 **잘못 쓰인** 예는?',
    options: [
      '동생에게 부드럽게 말했더니 동생도 친절히 답했어. 가는 말이 고와야 오는 말이 곱구나.',
      '오늘 비가 와서 가는 말이 고와야 오는 말이 곱다.',
      '친구한테 화내며 말했더니 친구도 화났어. 가는 말이 고와야 오는 말이 곱다는 게 맞아.',
      '예쁘게 부탁했더니 형이 흔쾌히 들어줬어. 가는 말이 고와야 오는 말이 곱다더라.',
    ],
    answer: '오늘 비가 와서 가는 말이 고와야 오는 말이 곱다.',
    explanation: '날씨와 인간관계는 무관해요. 이 속담은 "사람 사이의 말 주고받기"에만 어울립니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⭐ 이 속담이 우리에게 주는 핵심 교훈은?',
    options: [
      '먼저 친절하게 말하고 행동하자',
      '말을 빨리 하자',
      '큰 소리로 말하자',
      '말을 적게 하자',
    ],
    answer: '먼저 친절하게 말하고 행동하자',
    explanation: '친절은 친절을 부른다 — 먼저 곱게 말하는 것이 좋은 인간관계의 시작.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 "가는 말이 고와야 오는 말이 곱다"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '동생에게 부드럽게 말하니 동생도 부드럽게 답했어요. 가는 말이 고와야 오는 말이 곱다는 게 정말 맞아요!',
    explanation: '실제 경험과 속담을 자연스럽게 연결하면 응용 끝!',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 백지장도 맞들면 낫다 (협동, 초3·4)
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'easy',
    question: '🌱 다음 빈칸을 채우세요:\n___도 맞들면 낫다',
    answer: '백지장',
    explanation: '"백지장" = 아주 가벼운 종이 한 장. 가벼운 일도 함께하면 더 쉽다는 비유!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"백지장도 맞들면 낫다"의 친근한 뜻은?',
    options: [
      '아무리 쉬운 일도 함께하면 더 쉬워진다',
      '종이는 가벼우니까 혼자 들어야 한다',
      '하얀 종이가 가장 좋다',
      '둘이 들면 종이가 찢어진다',
    ],
    answer: '아무리 쉬운 일도 함께하면 더 쉬워진다',
    explanation: '백지장(가벼운 종이) 같은 쉬운 일도 함께 들면 더 쉬워진다 — 협동의 힘!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '아무리 쉬운 일이라도 서로 협력하여 같이 하면 더 쉽다.',
      '종이를 잘 다루어야 한다.',
      '가벼운 짐은 혼자 든다.',
      '둘이 가면 위험하다.',
    ],
    answer: '아무리 쉬운 일이라도 서로 협력하여 같이 하면 더 쉽다.',
    explanation: '협동의 가치를 가르치는 대표 속담.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '👯 "백지장도 맞들면 낫다"와 가장 비슷한 뜻의 속담은?',
    options: [
      '두 손뼉이 마주쳐야 소리가 난다',
      '발 없는 말이 천 리 간다',
      '천 리 길도 한 걸음부터',
      '우물에서 숭늉 찾는다',
    ],
    answer: '두 손뼉이 마주쳐야 소리가 난다',
    explanation: '두 속담 모두 "혼자가 아닌 함께"의 가치를 강조해요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '🌟 다음 상황에 가장 어울리는 속담은?\n\n[상황] 청소 시간에 한 친구가 무거운 책상을 혼자 옮기려다가 끙끙댔어요. 옆 친구가 같이 들어주니 금방 옮겼답니다.',
    options: [
      '백지장도 맞들면 낫다',
      '가는 말이 고와야 오는 말이 곱다',
      '발 없는 말이 천 리 간다',
      '낮말은 새가 듣고 밤말은 쥐가 듣는다',
    ],
    answer: '백지장도 맞들면 낫다',
    explanation: '함께 하니 쉬워진 상황 — 협동의 가치를 그대로 보여줘요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⚠️ 다음 중 "백지장도 맞들면 낫다"가 **잘못 쓰인** 예는?',
    options: [
      '모둠 발표 자료를 친구들과 나눠 만드니 빨리 끝났어. 백지장도 맞들면 낫다더라.',
      '오늘 점심은 김밥이 좋아. 백지장도 맞들면 낫다.',
      '이사 짐은 혼자 못 옮기니까 친구들과 같이 들자. 백지장도 맞들면 낫다잖아.',
      '청소 같이 하니 30분 만에 끝났어. 백지장도 맞들면 낫다는 말이 딱이야.',
    ],
    answer: '오늘 점심은 김밥이 좋아. 백지장도 맞들면 낫다.',
    explanation: '음식 선택과 협동은 무관해요. "함께 일하기" 상황에만 어울리는 속담입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '⭐ 이 속담이 우리에게 주는 핵심 교훈은?',
    options: [
      '함께하면 어려운 일도 쉬워진다',
      '혼자서도 다 할 수 있다',
      '종이는 소중히 다뤄야 한다',
      '가벼운 일은 미루어도 된다',
    ],
    answer: '함께하면 어려운 일도 쉬워진다',
    explanation: '"협동의 가치" — 친구·가족과 힘을 합치면 더 잘할 수 있어요.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: '🤝 "백지장도 맞들면 낫다"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '모둠 숙제를 친구들과 나눠 했더니 30분 만에 끝났어요. 백지장도 맞들면 낫다더니 정말 맞아요!',
    explanation: '협동 경험과 속담을 자연스럽게 결합하면 응용 완료!',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 천 리 길도 한 걸음부터 (꾸준함·시작, 초5·6)
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'short-answer', difficulty: 'medium',
    question: '🌱 다음 빈칸을 채우세요:\n천 리 길도 한 ___부터',
    answer: '걸음',
    explanation: '"한 걸음" — 작은 시작을 의미해요. 큰 목표(천 리)도 작은 시작(한 걸음)에서 출발!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"천 리 길도 한 걸음부터"의 친근한 뜻은?',
    options: [
      '아무리 큰 일도 작은 시작에서 시작된다',
      '천 리는 너무 멀어서 갈 수 없다',
      '걸음을 빨리 걸어야 한다',
      '한 번에 천 걸음을 가야 한다',
    ],
    answer: '아무리 큰 일도 작은 시작에서 시작된다',
    explanation: '큰 목표도 작은 한 걸음에서 시작돼요. 시작하는 용기와 꾸준함이 핵심!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '📖 교과서·사전 풀이로 알맞은 것은?',
    options: [
      '아무리 큰 일이라도 작은 일에서부터 시작된다.',
      '천 리는 약 393km 정도이다.',
      '걸음을 멀리 떼어야 빨리 간다.',
      '작은 길이 큰 길로 합쳐진다.',
    ],
    answer: '아무리 큰 일이라도 작은 일에서부터 시작된다.',
    explanation: '큰 목표 앞에서 망설이는 사람에게 격려가 되는 속담.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '👯 "천 리 길도 한 걸음부터"와 가장 비슷한 뜻의 속담은?',
    options: [
      '시작이 반이다',
      '발 없는 말이 천 리 간다',
      '백지장도 맞들면 낫다',
      '가는 말이 고와야 오는 말이 곱다',
    ],
    answer: '시작이 반이다',
    explanation: '두 속담 모두 "시작의 중요성"을 강조해요. 일단 첫걸음을 떼면 절반은 한 셈!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '🌟 다음 상황에 가장 어울리는 속담은?\n\n[상황] 두꺼운 영어책 한 권을 다 외우려니 막막했지만, 매일 하루 한 페이지씩 외웠더니 한 달 만에 절반을 끝냈어요.',
    options: [
      '천 리 길도 한 걸음부터',
      '가는 말이 고와야 오는 말이 곱다',
      '백지장도 맞들면 낫다',
      '발 없는 말이 천 리 간다',
    ],
    answer: '천 리 길도 한 걸음부터',
    explanation: '큰 일도 작게 나눠 꾸준히 하면 해낼 수 있어요. 시작이 반!',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '⚠️ 다음 중 "천 리 길도 한 걸음부터"가 **잘못 쓰인** 예는?',
    options: [
      '피아노 연주가 어렵지만 매일 10분씩 연습하기로 했어. 천 리 길도 한 걸음부터니까.',
      '책을 한꺼번에 다 읽었어. 천 리 길도 한 걸음부터지.',
      '운동을 매일 5분씩 시작했어. 천 리 길도 한 걸음부터잖아.',
      '한자 외우기 매일 5개씩 하기로 했어. 천 리 길도 한 걸음부터다!',
    ],
    answer: '책을 한꺼번에 다 읽었어. 천 리 길도 한 걸음부터지.',
    explanation: '한꺼번에 끝내는 상황은 "천 리 길도 한 걸음부터"의 의미(작게 시작·꾸준)와 반대예요.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '⭐ 이 속담이 우리에게 주는 핵심 교훈은?',
    options: [
      '큰 일도 작은 시작과 꾸준함으로 이루어진다',
      '천천히 가는 사람이 반드시 진다',
      '한 번에 끝내는 것이 가장 좋다',
      '먼 길은 가지 않는 것이 좋다',
    ],
    answer: '큰 일도 작은 시작과 꾸준함으로 이루어진다',
    explanation: '시작의 용기 + 꾸준함 = 큰 성과. 어려운 목표 앞에서도 포기하지 말자!',
  }),
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: '🤝 "천 리 길도 한 걸음부터"를 사용해서 짧은 문장을 만들어 보세요.',
    answer: '피아노가 어렵게 느껴졌지만 매일 10분씩 연습했어요. 천 리 길도 한 걸음부터라는 말처럼 점점 잘하게 됐답니다.',
    explanation: '꾸준한 노력 경험을 속담과 연결!',
  }),
] as const;

/* ─── Set 객체 (원본) ─── */
const _PROVERB_RAW: QuestionSet[] = [
  {
    id: 'seed-pv-1',
    title: '가는 말이 고와야… 학습지',
    domain: 'proverb', difficulty: 'easy',
    meta: {
      domain: 'proverb',
      proverb: '가는 말이 고와야 오는 말이 곱다',
      textbookMeaning: '자기가 남에게 말이나 행동을 좋게 해야 남도 자기에게 좋게 한다는 뜻.',
      meaning: '내가 곱게 말하면 친구도 곱게 답해줘요!\n먼저 친절하게 대하면 마음이 돌아온답니다.',
      visualEmoji: '😊 "안녕!"  →  😊 "안녕!"\n😠 "야!"   →   😠 "뭐?"\n= 곱게 말하면 **곱게 돌아와요** !',
      visualExample: '친구에게 부드럽게 말하면 친구도 부드럽게 답해요.\n화내며 말하면 친구도 화내며 답하지요.',
      relatedProverbs: ['오는 정이 있어야 가는 정이 있다', '말 한 마디에 천 냥 빚도 갚는다', '발 없는 말이 천 리 간다'],
      relatedProverbsDetailed: [
        { emoji: '🌷', term: '오는 정이 있어야 가는 정이 있다', desc: '받아야 주고 싶어요!\n마음을 주고받는 건 비슷해요.' },
        { emoji: '🤝', term: '말 한 마디에 천 냥 빚도 갚는다', desc: '말의 힘이 그만큼 커요.\n좋은 말이 큰 일을 해결하죠.' },
        { emoji: '💔', term: '발 없는 말이 천 리 간다', desc: '(대비) 말은 빨리 퍼져요.\n조심해서 써야 해요!' },
      ],
      usageExample: '동생이 화내며 말하니까 형도 화를 냈어. 그래서 둘 다 마음이 상해버렸지.',
      lesson: '친절은 친절을 부른다. 먼저 곱게 말하자.',
      grade: 4,
    },
    slots: set1Slots, tags: ['관계·예의', '일상', '초3·4'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-pv-2',
    title: '백지장도 맞들면 낫다 학습지',
    domain: 'proverb', difficulty: 'easy',
    meta: {
      domain: 'proverb',
      proverb: '백지장도 맞들면 낫다',
      textbookMeaning: '아무리 쉬운 일이라도 서로 협력하여 같이 하면 더 쉽다.',
      meaning: '아무리 가벼운 일도 함께하면 더 쉬워져요!\n혼자보다 둘이, 둘보다 셋이 힘이 됩니다.',
      visualEmoji: '👤 "끙... 무거워!"\n👤👤 "같이 들자!"\n= **함께하면 가벼워져요** !',
      visualExample: '혼자 들기 어려운 책상도 친구와 같이 들면 금방 옮겨요.\n협동이 큰 힘이 된답니다.',
      relatedProverbs: ['두 손뼉이 마주쳐야 소리가 난다', '여럿이 가면 길이 된다', '사공이 많으면 배가 산으로 간다'],
      relatedProverbsDetailed: [
        { emoji: '👏', term: '두 손뼉이 마주쳐야 소리가 난다', desc: '혼자서는 안 되는 일도\n함께하면 이뤄져요.' },
        { emoji: '👫', term: '여럿이 가면 길이 된다', desc: '많은 사람이 함께하면\n없던 길도 만들어요.' },
        { emoji: '⚠️', term: '사공이 많으면 배가 산으로 간다', desc: '(대비) 의견만 많으면\n오히려 일이 안 돼요.' },
      ],
      usageExample: '청소 시간에 무거운 책상을 혼자 옮기려다 친구가 같이 들어주니 금방 끝났어.',
      lesson: '함께하면 어려운 일도 쉬워진다.',
      grade: 4,
    },
    slots: set2Slots, tags: ['협동', '일상', '초3·4'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-pv-3',
    title: '천 리 길도 한 걸음부터 학습지',
    domain: 'proverb', difficulty: 'medium',
    meta: {
      domain: 'proverb',
      proverb: '천 리 길도 한 걸음부터',
      textbookMeaning: '아무리 큰 일이라도 작은 일에서부터 시작된다.',
      meaning: '아무리 큰 목표도 작은 한 걸음에서 시작돼요!\n포기하지 말고 매일 조금씩 해 나가요.',
      visualEmoji: '🚶 1걸음\n🚶🚶 10걸음\n🚶🚶🚶 100걸음 …\n= **꾸준히 가면 천 리** !',
      visualExample: '한 번에 천 리를 갈 수는 없어요.\n하지만 매일 한 걸음씩 가면 언젠가 천 리에 닿아요.',
      relatedProverbs: ['시작이 반이다', '티끌 모아 태산', '우물에서 숭늉 찾는다'],
      relatedProverbsDetailed: [
        { emoji: '🌱', term: '시작이 반이다', desc: '일단 시작하면\n절반은 한 거예요!' },
        { emoji: '🏔️', term: '티끌 모아 태산', desc: '작은 것도 모이면\n큰 것이 됩니다.' },
        { emoji: '⏳', term: '우물에서 숭늉 찾는다', desc: '(대비) 너무 서두르면\n안 돼요. 차근차근!' },
      ],
      usageExample: '두꺼운 영어책 외우기가 막막했는데, 하루 한 페이지씩 했더니 한 달 만에 절반을 끝냈어.',
      lesson: '큰 일도 작은 시작에서 출발한다.',
      grade: 5,
    },
    slots: set3Slots, tags: ['꾸준함·시작', '동기부여', '초5·6'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];

/* 본문 일치 시 자체 제작 SVG 장면 그림 자동 주입 (없으면 visualEmoji fallback) */
export const PROVERB_DEFAULT_SETS: QuestionSet[] = _PROVERB_RAW.map((s) => {
  const m = s.meta as { proverb?: string };
  const svg = m.proverb ? PROVERB_SVG[m.proverb] : undefined;
  return svg ? { ...s, meta: { ...s.meta, visualSvg: svg } } : s;
});
