/**
 * 시드 사자성어 set 5개 — 첫 부팅 시 setStore에 자동 주입.
 *
 * 8슬롯 고정 구조:
 *   1번: hanja-writing (한자 따라쓰기 + 한글음)
 *   2~7번: multiple-choice (4지선다)
 *   8번: sentence-making (사용 문장 만들기)
 */
import type { QuestionSet, SetSlots } from '../types/sets';
import type { Question } from '../types';

const now = Date.now();

/* 헬퍼: ID 일관성 + boilerplate 제거 */
let qSeq = 0;
function q(partial: Omit<Question, 'id' | 'createdAt' | 'source' | 'subjectId'>): Question {
  qSeq++;
  return {
    id: `seed-q-${qSeq.toString().padStart(3, '0')}`,
    subjectId: 'four-char-idiom',
    createdAt: now,
    source: 'preset',
    ...partial,
  };
}

/* ───────────────────────────────────────────────
   1) 동문서답 (東問西答)
   ─────────────────────────────────────────────── */
const set1Slots: SetSlots = [
  q({
    type: 'hanja-writing',
    difficulty: 'medium',
    question: '다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: 묻는 말에 엉뚱한 답을 함',
    answer: '동문서답',
    hanjaTrace: '東問西答',
    explanation: '동문서답(東問西答): 동쪽을 물었는데 서쪽으로 답한다는 뜻으로, 묻는 말에 전혀 다른 엉뚱한 대답을 하는 것을 비유하는 말.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"동문서답"의 뜻으로 알맞은 것은?',
    options: ['묻는 말에 엉뚱하게 답함', '같은 말을 반복함', '말을 안 함', '이해를 잘 함'],
    answer: '묻는 말에 엉뚱하게 답함',
    explanation: '엉뚱한 답을 한다는 뜻입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"동문서답"에서 "동(東)"과 "서(西)"가 뜻하는 것은?',
    options: ['방향의 반대', '날씨', '시간', '계절'],
    answer: '방향의 반대',
    explanation: '동쪽과 서쪽은 정반대 방향이므로, 묻는 것과 답이 정반대로 어긋난다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 중 "동문서답"이 가장 알맞게 쓰인 문장은?',
    options: [
      '점심 메뉴를 묻자 친구가 영화 이야기를 했다.',
      '친구와 사이좋게 지내려면 동문서답이 필요하다.',
      '시험 점수가 잘 나와서 동문서답을 했다.',
      '동문서답 덕분에 정답을 맞혔다.',
    ],
    answer: '점심 메뉴를 묻자 친구가 영화 이야기를 했다.',
    explanation: '묻는 말과 전혀 다른 엉뚱한 답을 한 상황이 동문서답에 해당합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"동문서답"과 비슷한 뜻의 표현은?',
    options: ['엉뚱한 대답', '정확한 대답', '재치 있는 대답', '간단한 대답'],
    answer: '엉뚱한 대답',
    explanation: '"엉뚱한 대답"이 동문서답의 핵심 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 중 "동문서답"의 한자 표기로 올바른 것은?',
    options: ['東問西答', '同文書答', '童門小答', '銅紋誓答'],
    answer: '東問西答',
    explanation: '東(동녘 동) · 問(물을 문) · 西(서녘 서) · 答(답할 답)이 바른 표기입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 대화에 가장 어울리는 사자성어는?\n\n선생님: 오늘 숙제 가져왔니?\n학생: 어제는 비가 많이 왔어요.',
    options: ['동문서답', '일석이조', '대기만성', '죽마고우'],
    answer: '동문서답',
    explanation: '"숙제"를 물었는데 "날씨"로 답하는 전형적인 동문서답입니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: "'동문서답'을(를) 사용해 한 문장을 만드세요.",
    answer: '선생님 질문에 친구가 자기 강아지 이야기를 늘어놓아서 동문서답이라며 모두 웃었다.',
    explanation: '묻는 말과 무관한 엉뚱한 답을 한 상황을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   2) 일석이조 (一石二鳥)
   ─────────────────────────────────────────────── */
const set2Slots: SetSlots = [
  q({
    type: 'hanja-writing', difficulty: 'easy',
    question: '다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: 한 번에 두 가지 이익을 얻음',
    answer: '일석이조',
    hanjaTrace: '一石二鳥',
    explanation: '일석이조(一石二鳥): 돌 하나로 새 두 마리를 잡는다는 뜻. 한 가지 일로 두 가지 이득을 얻을 때 씁니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"일석이조"의 뜻으로 알맞은 것은?',
    options: ['한 번에 두 가지 이익', '두 번에 한 가지 이익', '아주 어려운 일', '돌을 던지는 놀이'],
    answer: '한 번에 두 가지 이익',
    explanation: '"한 가지 행동으로 두 가지 이득"이 핵심입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"일석이조"에서 "일석(一石)"이 뜻하는 것은?',
    options: ['하나의 돌', '하나의 손', '한 사람', '하루'],
    answer: '하나의 돌',
    explanation: '一(하나)·石(돌). 즉 "돌 하나"입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "일석이조"가 알맞게 쓰인 문장은?',
    options: [
      '운동을 하니 건강해지고 살도 빠져 일석이조다.',
      '오늘은 정말 일석이조로 비가 많이 왔다.',
      '시험을 못 봐서 일석이조가 되었다.',
      '친구와 싸워서 일석이조 기분이다.',
    ],
    answer: '운동을 하니 건강해지고 살도 빠져 일석이조다.',
    explanation: '한 가지 행동(운동)으로 두 가지 이익(건강·체중)을 얻은 전형적인 예입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"일석이조"와 비슷한 뜻의 사자성어는?',
    options: ['일거양득', '동문서답', '오리무중', '대기만성'],
    answer: '일거양득',
    explanation: '일거양득(一擧兩得)도 한 가지 일로 두 가지를 얻는다는 같은 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "일석이조"의 한자 표기로 올바른 것은?',
    options: ['一石二鳥', '日石二鳥', '一夕二鳥', '一石異鳥'],
    answer: '一石二鳥',
    explanation: '一(하나), 石(돌), 二(둘), 鳥(새). 다른 보기는 한자가 잘못됨.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "일석이조"의 예로 알맞지 않은 상황은?',
    options: [
      '집에 와서 종일 텔레비전만 보았다.',
      '걸어 다녀 운동도 하고 차비도 아꼈다.',
      '책을 읽으며 영어 단어도 함께 외웠다.',
      '청소를 하며 방 정리도 같이 했다.',
    ],
    answer: '집에 와서 종일 텔레비전만 보았다.',
    explanation: '한 가지 행동으로 두 가지 이익을 얻은 상황이 아닙니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'일석이조'을(를) 사용해 한 문장을 만드세요.",
    answer: '도서관에서 공부도 하고 더위도 피할 수 있으니 일석이조다.',
    explanation: '하나의 행동으로 두 가지 이득을 얻는 상황을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   3) 자화자찬 (自畫自讚)
   ─────────────────────────────────────────────── */
const set3Slots: SetSlots = [
  q({
    type: 'hanja-writing', difficulty: 'medium',
    question: '다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: 자기가 한 일을 자기 스스로 칭찬함',
    answer: '자화자찬',
    hanjaTrace: '自畫自讚',
    explanation: '자화자찬(自畫自讚): 자기가 그린 그림을 자기가 칭찬한다는 뜻. 자기 일을 스스로 자랑할 때 쓰는 말.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"자화자찬"의 뜻으로 알맞은 것은?',
    options: ['스스로를 칭찬함', '남을 칭찬함', '겸손함', '비판함'],
    answer: '스스로를 칭찬함',
    explanation: '"자(自)"는 "스스로"를 뜻합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"자화자찬"에서 "찬(讚)"이 뜻하는 것은?',
    options: ['칭찬함', '비난함', '의심함', '무시함'],
    answer: '칭찬함',
    explanation: '讚은 "기리다·칭찬하다"는 뜻의 한자입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 중 "자화자찬"이 알맞게 쓰인 문장은?',
    options: [
      '발표 후 자기가 정말 잘했다며 자화자찬을 했다.',
      '친구의 발표를 보며 자화자찬을 해 주었다.',
      '자화자찬이 어려워서 시험을 못 봤다.',
      '엄마가 만든 음식을 자화자찬했다.',
    ],
    answer: '발표 후 자기가 정말 잘했다며 자화자찬을 했다.',
    explanation: '자기 자신을 스스로 칭찬한 상황이므로 적절합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"자화자찬"과 반대되는 태도는?',
    options: ['겸손', '자만', '무관심', '용감'],
    answer: '겸손',
    explanation: '스스로 자랑하는 태도(자화자찬)의 반대는 겸손입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '다음 중 "자화자찬"의 한자 표기로 올바른 것은?',
    options: ['自畫自讚', '子和子餐', '自火自參', '紫禾茲讚'],
    answer: '自畫自讚',
    explanation: '自(스스로 자) · 畫(그림 화) · 自(스스로 자) · 讚(기릴 찬)이 바른 표기입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'medium',
    question: '"자화자찬"을 자주 하는 사람의 모습으로 가장 알맞은 것은?',
    options: [
      '자기 자랑이 많고 겸손하지 못함',
      '늘 친구를 칭찬해 줌',
      '말이 없고 조용함',
      '남의 의견을 잘 듣고 따름',
    ],
    answer: '자기 자랑이 많고 겸손하지 못함',
    explanation: '스스로를 자주 칭찬하는 모습은 겸손하지 못한 자만에 가깝습니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'medium',
    question: "'자화자찬'을(를) 사용해 한 문장을 만드세요.",
    answer: '아직 결과도 안 나왔는데 형은 벌써부터 자화자찬을 하고 있다.',
    explanation: '자기가 한 일을 스스로 자랑하는 상황을 표현했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   4) 대기만성 (大器晩成)
   ─────────────────────────────────────────────── */
const set4Slots: SetSlots = [
  q({
    type: 'hanja-writing', difficulty: 'hard',
    question: '다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: 큰 그릇은 늦게 만들어진다',
    answer: '대기만성',
    hanjaTrace: '大器晩成',
    explanation: '대기만성(大器晩成): 큰 그릇은 늦게 완성된다는 뜻. 큰 인물은 시간이 오래 걸려 이루어진다는 비유.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"대기만성"의 뜻으로 알맞은 것은?',
    options: ['크게 될 사람은 늦게 이루어짐', '크게 실패함', '늦게 일어남', '큰 그릇은 비싸다'],
    answer: '크게 될 사람은 늦게 이루어짐',
    explanation: '큰 인물·성취는 시간이 걸린다는 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"대기만성"의 "만(晩)"이 뜻하는 것은?',
    options: ['늦다', '아침', '많다', '저녁밥'],
    answer: '늦다',
    explanation: '晩은 "늦을 만"으로 "늦다"는 뜻입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '다음 중 "대기만성"이 알맞게 쓰인 문장은?',
    options: [
      '꾸준히 노력하면 대기만성으로 큰 인물이 될 것이다.',
      '오늘 시험을 망쳐서 대기만성이다.',
      '대기만성이 빨라서 좋다.',
      '대기만성으로 화가 났다.',
    ],
    answer: '꾸준히 노력하면 대기만성으로 큰 인물이 될 것이다.',
    explanation: '시간이 걸려도 큰 사람이 된다는 의미로 알맞게 쓰였습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"대기만성"의 교훈으로 가장 알맞은 것은?',
    options: [
      '꾸준한 노력이 큰 결과를 부른다',
      '빠른 성공이 가장 중요하다',
      '재능보다 운이 결정한다',
      '큰 그릇은 가격이 비싸다',
    ],
    answer: '꾸준한 노력이 큰 결과를 부른다',
    explanation: '시간이 걸리더라도 꾸준히 노력하면 큰 성취를 이룬다는 가르침입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '다음 중 "대기만성"의 한자 표기로 올바른 것은?',
    options: ['大器晩成', '代氣萬星', '對寄滿誠', '大氣萬城'],
    answer: '大器晩成',
    explanation: '大(클 대) · 器(그릇 기) · 晩(늦을 만) · 成(이룰 성)이 바른 표기입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'hard',
    question: '"대기만성"과 가장 의미가 비슷한 속담은?',
    options: [
      '천 리 길도 한 걸음부터',
      '발 없는 말이 천 리 간다',
      '소 잃고 외양간 고친다',
      '등잔 밑이 어둡다',
    ],
    answer: '천 리 길도 한 걸음부터',
    explanation: '큰 일을 이루려면 시간을 두고 꾸준히 노력해야 한다는 점이 닮아 있습니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'hard',
    question: "'대기만성'을(를) 사용해 한 문장을 만드세요.",
    answer: '지금은 실력이 부족해도 대기만성이라는 말처럼 꾸준히 연습하면 좋은 결과가 있을 것이다.',
    explanation: '시간이 걸려도 큰 성취를 이룬다는 의미로 사용했습니다.',
  }),
] as const;

/* ───────────────────────────────────────────────
   5) 죽마고우 (竹馬故友)
   ─────────────────────────────────────────────── */
const set5Slots: SetSlots = [
  q({
    type: 'hanja-writing', difficulty: 'easy',
    question: '다음 한자를 따라 쓰고, 옆 칸에 한글음을 쓰세요.\n\n뜻: 어릴 때부터 같이 놀던 친한 친구',
    answer: '죽마고우',
    hanjaTrace: '竹馬故友',
    explanation: '죽마고우(竹馬故友): 대나무로 만든 말을 타고 놀던 옛 친구. 어릴 적부터 함께 자란 친한 친구를 가리킵니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"죽마고우"의 뜻으로 알맞은 것은?',
    options: ['어릴 때부터 친한 친구', '오늘 처음 만난 친구', '말을 잘 타는 친구', '대나무를 좋아하는 친구'],
    answer: '어릴 때부터 친한 친구',
    explanation: '오랫동안 함께한 절친한 친구를 의미합니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"죽마고우"에서 "죽마(竹馬)"가 뜻하는 것은?',
    options: ['대나무로 만든 말', '진짜 살아 있는 말', '대나무가 자라는 숲', '말을 그린 그림'],
    answer: '대나무로 만든 말',
    explanation: '어린 아이들이 대나무 막대를 말처럼 타고 놀던 데서 유래한 표현입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "죽마고우"가 알맞게 쓰인 문장은?',
    options: [
      '민호와 나는 유치원 때부터 자란 죽마고우다.',
      '오늘 처음 만난 친구가 죽마고우 같다.',
      '동물원에서 죽마고우를 보았다.',
      '죽마고우로 시험 공부를 했다.',
    ],
    answer: '민호와 나는 유치원 때부터 자란 죽마고우다.',
    explanation: '어릴 적부터 함께한 친구라는 의미로 알맞습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"죽마고우"와 비슷한 뜻의 표현은?',
    options: ['소꿉친구', '낯선 사람', '학원 친구', '같은 반 친구'],
    answer: '소꿉친구',
    explanation: '소꿉친구(어릴 적 친구)가 가장 가까운 의미입니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '"죽마고우"의 한자 표기로 올바른 것은?',
    options: ['竹馬故友', '竹馬古牛', '粥馬故友', '竹麻故友'],
    answer: '竹馬故友',
    explanation: '竹(대), 馬(말), 故(옛), 友(벗). 다른 보기는 한자가 잘못되었습니다.',
  }),
  q({
    type: 'multiple-choice', difficulty: 'easy',
    question: '다음 중 "죽마고우" 관계라고 보기 어려운 사람은?',
    options: [
      '며칠 전 처음 만난 친구',
      '유치원 때부터 지낸 단짝',
      '어릴 적 같은 동네 단짝',
      '초등학교 1학년부터 단짝',
    ],
    answer: '며칠 전 처음 만난 친구',
    explanation: '죽마고우는 어릴 적부터 오랜 시간을 함께한 친구를 가리킵니다.',
  }),
  q({
    type: 'sentence-making', difficulty: 'easy',
    question: "'죽마고우'을(를) 사용해 한 문장을 만드세요.",
    answer: '준수와 나는 다섯 살 때부터 함께 자란 죽마고우라서 서로의 마음을 잘 안다.',
    explanation: '어릴 적부터 친한 친구 관계를 표현했습니다.',
  }),
] as const;

/* ─── Set 객체 export ─── */
export const DEFAULT_SETS: QuestionSet[] = [
  {
    id: 'seed-set-1', title: '동문서답 학습지', domain: 'four-char-idiom', difficulty: 'medium',
    meta: { domain: 'four-char-idiom', idiom: '동문서답', hanja: '東問西答', meaning: '묻는 말에 엉뚱한 답을 함' },
    slots: set1Slots, tags: ['대화', '엉뚱'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-set-2', title: '일석이조 학습지', domain: 'four-char-idiom', difficulty: 'easy',
    meta: { domain: 'four-char-idiom', idiom: '일석이조', hanja: '一石二鳥', meaning: '한 번에 두 가지 이익을 얻음' },
    slots: set2Slots, tags: ['이익', '효율'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-set-3', title: '자화자찬 학습지', domain: 'four-char-idiom', difficulty: 'medium',
    meta: { domain: 'four-char-idiom', idiom: '자화자찬', hanja: '自畫自讚', meaning: '자기가 한 일을 자기 스스로 칭찬함' },
    slots: set3Slots, tags: ['자기', '칭찬'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-set-4', title: '대기만성 학습지', domain: 'four-char-idiom', difficulty: 'hard',
    meta: { domain: 'four-char-idiom', idiom: '대기만성', hanja: '大器晩成', meaning: '큰 그릇은 늦게 만들어짐' },
    slots: set4Slots, tags: ['성장', '인내'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
  {
    id: 'seed-set-5', title: '죽마고우 학습지', domain: 'four-char-idiom', difficulty: 'easy',
    meta: { domain: 'four-char-idiom', idiom: '죽마고우', hanja: '竹馬故友', meaning: '어릴 때부터 같이 놀던 친한 친구' },
    slots: set5Slots, tags: ['친구', '관계'],
    createdAt: now, updatedAt: now, source: 'preset',
  },
];
