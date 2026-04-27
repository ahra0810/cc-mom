import type { Question } from '../types';

export const defaultQuestions: Question[] = [
  // === 세계사 (World History) ===
  {
    id: 'wh-001', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'easy',
    question: '이집트에서 가장 유명한 건축물로, 왕의 무덤으로 만들어진 것은?',
    options: ['피라미드', '콜로세움', '만리장성', '타지마할'],
    answer: '피라미드',
    explanation: '피라미드는 고대 이집트의 파라오(왕)를 위한 무덤으로 지어졌습니다.',
    tags: ['이집트', '고대문명'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-002', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'easy',
    question: '중국에서 만든 아주 긴 벽의 이름은 무엇일까요?',
    options: ['만리장성', '베를린 장벽', '통곡의 벽', '하드리아누스 방벽'],
    answer: '만리장성',
    explanation: '만리장성은 중국 북쪽의 적을 막기 위해 만든 아주 긴 성벽입니다.',
    tags: ['중국', '고대문명'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-003', type: 'true-false', subjectId: 'world-history', difficulty: 'easy',
    question: '콜럼버스는 아메리카 대륙을 발견한 탐험가이다.',
    answer: 'O',
    explanation: '크리스토퍼 콜럼버스는 1492년 아메리카 대륙에 도착한 탐험가입니다.',
    tags: ['탐험', '아메리카'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-004', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'medium',
    question: '고대 그리스에서 시작된, 4년마다 열리는 스포츠 대회는?',
    options: ['올림픽', '월드컵', '아시안게임', '패럴림픽'],
    answer: '올림픽',
    explanation: '올림픽은 고대 그리스의 올림피아에서 시작되어 지금까지 이어지고 있습니다.',
    tags: ['그리스', '스포츠'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-005', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'medium',
    question: '로마의 유명한 원형 경기장 이름은?',
    options: ['콜로세움', '파르테논', '판테온', '아크로폴리스'],
    answer: '콜로세움',
    explanation: '콜로세움은 고대 로마에서 검투사 경기가 열렸던 거대한 원형 경기장입니다.',
    tags: ['로마', '건축물'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-006', type: 'short-answer', subjectId: 'world-history', difficulty: 'medium',
    question: '종이, 나침반, 화약, 인쇄술은 모두 어느 나라에서 발명되었을까요?',
    answer: '중국',
    explanation: '이 네 가지를 중국의 4대 발명이라고 합니다.',
    tags: ['중국', '발명'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-007', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'hard',
    question: '프랑스 혁명이 일어난 해는?',
    options: ['1789년', '1776년', '1815년', '1804년'],
    answer: '1789년',
    explanation: '프랑스 혁명은 1789년에 시작되어 자유, 평등, 박애를 외쳤습니다.',
    tags: ['프랑스', '혁명'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-008', type: 'true-false', subjectId: 'world-history', difficulty: 'easy',
    question: '공룡은 사람보다 훨씬 먼저 지구에 살았다.',
    answer: 'O',
    explanation: '공룡은 약 2억 3천만 년 전에 나타났고, 약 6천 6백만 년 전에 멸종했습니다.',
    tags: ['선사시대'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-009', type: 'fill-blank', subjectId: 'world-history', difficulty: 'medium',
    question: '이집트 문명은 (   ) 강 주변에서 발전하였다.',
    answer: '나일',
    explanation: '나일 강은 아프리카에서 가장 긴 강으로, 이집트 문명의 젖줄이었습니다.',
    tags: ['이집트', '강'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'wh-010', type: 'multiple-choice', subjectId: 'world-history', difficulty: 'hard',
    question: '인도의 유명한 흰 대리석 건물 타지마할을 세운 이유는?',
    options: ['사랑하는 아내를 기리기 위해', '신에게 제사를 지내기 위해', '왕의 권력을 보여주기 위해', '외적의 침입을 막기 위해'],
    answer: '사랑하는 아내를 기리기 위해',
    explanation: '무굴제국의 샤 자한 황제가 세상을 떠난 아내 뭄타즈 마할을 기리기 위해 지었습니다.',
    tags: ['인도', '건축물'], createdAt: Date.now(), source: 'preset'
  },

  // === 사자성어 (Four-character idioms) ===
  {
    id: 'fc-001', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'easy',
    question: '"마음이 맞는 친한 친구"를 뜻하는 사자성어는?',
    options: ['죽마고우', '일석이조', '자화자찬', '동문서답'],
    answer: '죽마고우',
    explanation: '죽마고우(竹馬故友): 대나무 말을 타고 놀던 옛 친구라는 뜻입니다.',
    tags: ['친구', '관계'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-002', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'easy',
    question: '"하나의 돌을 던져 두 마리의 새를 잡는다"는 뜻의 사자성어는?',
    options: ['일석이조', '일거양득', '죽마고우', '오합지졸'],
    answer: '일석이조',
    explanation: '일석이조(一石二鳥): 돌 하나로 새 두 마리를 잡는다는 뜻으로, 한 가지 일로 두 가지 이득을 얻음을 의미합니다.',
    tags: ['이득', '효율'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-003', type: 'fill-blank', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '자기가 한 일을 자기 스스로 칭찬하는 것을 (    )(이)라 한다.',
    answer: '자화자찬',
    explanation: '자화자찬(自畫自讚): 자기가 그린 그림을 자기가 칭찬한다는 뜻입니다.',
    tags: ['자기', '칭찬'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-004', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '동쪽을 물었는데 서쪽을 대답한다는 뜻의 사자성어는?',
    options: ['동문서답', '자화자찬', '일석이조', '오리무중'],
    answer: '동문서답',
    explanation: '동문서답(東問西答): 묻는 말에 전혀 엉뚱한 대답을 한다는 뜻입니다.',
    tags: ['대화', '엉뚱'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-005', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'easy',
    question: '"입에서 나오는 대로 지어낸 말"을 뜻하는 사자성어는?',
    options: ['감언이설', '대기만성', '구사일생', '일취월장'],
    answer: '감언이설',
    explanation: '감언이설(甘言利說): 달콤한 말과 이로운 조건을 내세워 꾀는 말입니다.',
    tags: ['말', '거짓'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-006', type: 'true-false', subjectId: 'four-char-idiom', difficulty: 'easy',
    question: '"오리무중"은 길을 잃어 방향을 모르는 상태를 뜻한다.',
    answer: 'O',
    explanation: '오리무중(五里霧中): 5리나 되는 짙은 안개 속에 있다는 뜻으로, 상황을 알 수 없음을 의미합니다.',
    tags: ['상황', '모름'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-007', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'hard',
    question: '"큰 그릇은 늦게 완성된다"는 뜻으로, 크게 될 사람은 오래 걸린다는 의미의 사자성어는?',
    options: ['대기만성', '구사일생', '일취월장', '전화위복'],
    answer: '대기만성',
    explanation: '대기만성(大器晩成): 큰 그릇을 만드는 데는 시간이 오래 걸린다는 뜻입니다.',
    tags: ['성장', '인내'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-008', type: 'short-answer', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '"아홉 번 죽을 뻔하다 한 번 살아남다"라는 뜻의 사자성어는?',
    answer: '구사일생',
    explanation: '구사일생(九死一生): 거의 죽을 뻔한 위험에서 겨우 살아남음을 뜻합니다.',
    tags: ['위험', '생존'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-009', type: 'multiple-choice', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '"날마다 달마다 발전한다"는 뜻의 사자성어는?',
    options: ['일취월장', '대기만성', '일석이조', '전화위복'],
    answer: '일취월장',
    explanation: '일취월장(日就月將): 날로 달로 성장하고 발전한다는 뜻입니다.',
    tags: ['성장', '발전'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'fc-010', type: 'true-false', subjectId: 'four-char-idiom', difficulty: 'hard',
    question: '"전화위복"은 나쁜 일이 바뀌어 오히려 좋은 일이 된다는 뜻이다.',
    answer: 'O',
    explanation: '전화위복(轉禍爲福): 재앙이 바뀌어 오히려 복이 된다는 뜻입니다.',
    tags: ['변화', '긍정'], createdAt: Date.now(), source: 'preset'
  },

  // === 관용구 (Idioms) ===
  {
    id: 'id-001', type: 'multiple-choice', subjectId: 'idiom', difficulty: 'easy',
    question: '"발이 넓다"는 무슨 뜻일까요?',
    options: ['아는 사람이 많다', '발이 크다', '걸음이 빠르다', '여행을 많이 다닌다'],
    answer: '아는 사람이 많다',
    explanation: '"발이 넓다"는 아는 사람이 많고 활동 범위가 넓다는 뜻입니다.',
    tags: ['신체', '관계'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-002', type: 'multiple-choice', subjectId: 'idiom', difficulty: 'easy',
    question: '"귀가 얇다"는 무슨 뜻일까요?',
    options: ['다른 사람의 말에 쉽게 넘어간다', '귀가 작다', '소리를 잘 듣는다', '비밀을 잘 지킨다'],
    answer: '다른 사람의 말에 쉽게 넘어간다',
    explanation: '"귀가 얇다"는 남의 말을 잘 믿고 쉽게 솔깃해한다는 뜻입니다.',
    tags: ['신체', '성격'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-003', type: 'fill-blank', subjectId: 'idiom', difficulty: 'medium',
    question: '비밀을 말해버리는 것을 "입이 (    )"고 한다.',
    answer: '가볍다',
    explanation: '"입이 가볍다"는 비밀을 쉽게 다른 사람에게 말해버린다는 뜻입니다.',
    tags: ['신체', '말'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-004', type: 'multiple-choice', subjectId: 'idiom', difficulty: 'medium',
    question: '"눈이 높다"는 무슨 뜻일까요?',
    options: ['기준이 까다롭다', '키가 크다', '시력이 좋다', '자존심이 세다'],
    answer: '기준이 까다롭다',
    explanation: '"눈이 높다"는 사물을 보는 기준이 높아서 쉽게 만족하지 못한다는 뜻입니다.',
    tags: ['신체', '기준'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-005', type: 'true-false', subjectId: 'idiom', difficulty: 'easy',
    question: '"손이 크다"는 씀씀이가 크고 후하다는 뜻이다.',
    answer: 'O',
    explanation: '"손이 크다"는 음식을 만들거나 물건을 살 때 양이 많고 넉넉하다는 뜻입니다.',
    tags: ['신체', '성격'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-006', type: 'multiple-choice', subjectId: 'idiom', difficulty: 'easy',
    question: '"배가 아프다" (관용적 표현)는 무슨 뜻일까요?',
    options: ['남이 잘되는 것이 샘이 나다', '배탈이 났다', '배가 고프다', '슬프다'],
    answer: '남이 잘되는 것이 샘이 나다',
    explanation: '"배가 아프다"는 관용적으로 다른 사람이 잘되는 것이 부럽고 시기가 난다는 뜻입니다.',
    tags: ['신체', '감정'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-007', type: 'multiple-choice', subjectId: 'idiom', difficulty: 'medium',
    question: '"간이 크다"는 무슨 뜻일까요?',
    options: ['겁이 없고 대담하다', '건강하다', '욕심이 많다', '마음이 넓다'],
    answer: '겁이 없고 대담하다',
    explanation: '"간이 크다"는 무서움을 모르고 대담하게 행동한다는 뜻입니다.',
    tags: ['신체', '성격'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'id-008', type: 'fill-blank', subjectId: 'idiom', difficulty: 'hard',
    question: '아무리 해도 효과가 없는 것을 "쇠귀에 (    ) 읽기"라고 한다.',
    answer: '경',
    explanation: '"쇠귀에 경 읽기"는 소의 귀에 대고 경을 읽어봐야 알아듣지 못하듯, 아무리 말해도 소용없다는 뜻입니다.',
    tags: ['동물', '무의미'], createdAt: Date.now(), source: 'preset'
  },

  // === 속담 (Proverbs) ===
  {
    id: 'pv-001', type: 'fill-blank', subjectId: 'proverb', difficulty: 'easy',
    question: '가는 말이 고와야 (     )이 곱다.',
    answer: '오는 말',
    explanation: '남에게 말을 좋게 해야 남도 나에게 좋은 말을 한다는 뜻입니다.',
    tags: ['말', '예절'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-002', type: 'multiple-choice', subjectId: 'proverb', difficulty: 'easy',
    question: '"원숭이도 나무에서 떨어진다"는 무슨 뜻일까요?',
    options: ['아무리 잘하는 사람도 실수할 수 있다', '원숭이는 나무를 잘 탄다', '높은 곳에서 떨어지면 위험하다', '동물은 실수를 한다'],
    answer: '아무리 잘하는 사람도 실수할 수 있다',
    explanation: '나무 타기를 잘하는 원숭이도 떨어질 때가 있듯이, 아무리 잘하는 사람도 실수할 수 있다는 뜻입니다.',
    tags: ['실수', '겸손'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-003', type: 'fill-blank', subjectId: 'proverb', difficulty: 'easy',
    question: '세 살 버릇 (     )까지 간다.',
    answer: '여든',
    explanation: '어릴 때 몸에 밴 버릇은 늙어서도 고치기 어렵다는 뜻입니다.',
    tags: ['습관', '교훈'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-004', type: 'multiple-choice', subjectId: 'proverb', difficulty: 'medium',
    question: '"소 잃고 외양간 고친다"는 무슨 뜻일까요?',
    options: ['일이 이미 잘못된 뒤에 대책을 세운다', '소를 잘 키워야 한다', '외양간을 튼튼하게 지어야 한다', '미리 준비하면 좋다'],
    answer: '일이 이미 잘못된 뒤에 대책을 세운다',
    explanation: '소를 도둑맞은 후에야 외양간을 고치는 것처럼, 이미 일을 그르친 뒤에 뒤늦게 대비한다는 뜻입니다.',
    tags: ['준비', '교훈'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-005', type: 'true-false', subjectId: 'proverb', difficulty: 'easy',
    question: '"낮말은 새가 듣고 밤말은 쥐가 듣는다"는 말을 조심하라는 뜻이다.',
    answer: 'O',
    explanation: '아무리 비밀스럽게 한 말도 남에게 들릴 수 있으니 항상 말을 조심하라는 뜻입니다.',
    tags: ['말', '조심'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-006', type: 'fill-blank', subjectId: 'proverb', difficulty: 'medium',
    question: '백지장도 맞들면 (     ).',
    answer: '낫다',
    explanation: '아무리 쉬운 일이라도 서로 협력하면 더 잘 된다는 뜻입니다.',
    tags: ['협력', '도움'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-007', type: 'multiple-choice', subjectId: 'proverb', difficulty: 'medium',
    question: '"빈 수레가 요란하다"는 무슨 뜻일까요?',
    options: ['실속 없는 사람이 떠들기 좋아한다', '수레는 시끄럽다', '빈 것은 가볍다', '소리가 큰 것이 좋다'],
    answer: '실속 없는 사람이 떠들기 좋아한다',
    explanation: '빈 수레가 더 시끄럽듯이, 아는 것이 없는 사람이 더 떠들어댄다는 뜻입니다.',
    tags: ['겸손', '행동'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'pv-008', type: 'multiple-choice', subjectId: 'proverb', difficulty: 'hard',
    question: '"우물 안 개구리"는 무슨 뜻일까요?',
    options: ['세상 물정을 모르는 사람', '개구리는 우물에 산다', '좁은 곳에 사는 동물', '시원한 곳을 좋아한다'],
    answer: '세상 물정을 모르는 사람',
    explanation: '우물 안에서만 사는 개구리처럼 좁은 세계만 알고 넓은 세상을 모르는 사람을 뜻합니다.',
    tags: ['시야', '겸손'], createdAt: Date.now(), source: 'preset'
  },

  // === 맞춤법 (Spelling) ===
  {
    id: 'sp-001', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'easy',
    question: '맞춤법이 올바른 것은?',
    options: ['안녕하세요', '안녕하새요', '안영하세요', '안녕하셰요'],
    answer: '안녕하세요',
    explanation: '"안녕하세요"가 올바른 표기입니다.',
    tags: ['인사', '기본'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-002', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'easy',
    question: '맞춤법이 올바른 것은?',
    options: ['됐어', '됬어', '댔어', '되써'],
    answer: '됐어',
    explanation: '"되었어"를 줄인 말은 "됐어"가 맞습니다.',
    tags: ['줄임말', '기본'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-003', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'medium',
    question: '"어의( )다"의 올바른 표기는?',
    options: ['어이없다', '어의없다', '어이업다', '어의업다'],
    answer: '어이없다',
    explanation: '"어이없다"가 올바른 표기입니다. "어이"는 일이 너무 뜻밖이어서 기가 막힌다는 뜻입니다.',
    tags: ['혼동', '감정'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-004', type: 'true-false', subjectId: 'spelling', difficulty: 'easy',
    question: '"금새"가 아니라 "금세"가 맞는 표현이다.',
    answer: 'O',
    explanation: '"금시에"가 줄어든 말이므로 "금세"가 맞습니다. "금새"는 물건의 값을 뜻하는 다른 단어입니다.',
    tags: ['혼동', '부사'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-005', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'medium',
    question: '맞춤법이 올바른 것은?',
    options: ['왠지', '웬지', '왠디', '웬디'],
    answer: '왠지',
    explanation: '"왠지"는 "왜인지"가 줄어든 말입니다. "웬"은 "웬일이니"처럼 쓰입니다.',
    tags: ['혼동', '부사'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-006', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'medium',
    question: '올바른 문장은?',
    options: ['나는 집에 갈게.', '나는 집에 갈께.', '나는 집에 갈개.', '나는 집에 갈깨.'],
    answer: '나는 집에 갈게.',
    explanation: '"-ㄹ게"는 약속이나 의지를 나타내는 어미로, "갈게"가 맞습니다.',
    tags: ['어미', '약속'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-007', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'hard',
    question: '맞춤법이 올바른 것은?',
    options: ['오랜만이야', '오랫만이야', '오랜만이야', '오래간만이야'],
    answer: '오래간만이야',
    explanation: '"오래간만"이 올바른 표기이며, 흔히 "오랜만"으로 잘못 씁니다. "오랜만에"가 아닌 "오래간만에"가 맞습니다.',
    tags: ['혼동', '인사'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-008', type: 'true-false', subjectId: 'spelling', difficulty: 'easy',
    question: '"일찍이"가 맞고 "일찌기"는 틀린 표현이다.',
    answer: 'O',
    explanation: '"일찍이"가 표준어입니다.',
    tags: ['부사', '기본'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-009', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'medium',
    question: '다음 중 "맞추다"를 써야 하는 문장은?',
    options: ['정답을 맞추다', '비에 마추다', '시간을 맞히다', '과녁을 맞추다'],
    answer: '정답을 맞추다',
    explanation: '"맞추다"는 서로 비교하거나 조절한다는 뜻이고, "맞히다"는 적중시킨다는 뜻입니다.',
    tags: ['혼동', '동사'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sp-010', type: 'multiple-choice', subjectId: 'spelling', difficulty: 'hard',
    question: '맞춤법이 올바른 문장은?',
    options: ['이따가 만나자.', '있다가 만나자.', '이따 만나자.', '있다 만나자.'],
    answer: '이따가 만나자.',
    explanation: '"이따가"는 "조금 후에"라는 뜻의 부사입니다.',
    tags: ['혼동', '부사'], createdAt: Date.now(), source: 'preset'
  },

  // === 어휘 (Vocabulary) ===
  {
    id: 'vc-001', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'easy',
    question: '"꼼꼼하다"와 반대되는 뜻을 가진 단어는?',
    options: ['덤벙대다', '조심하다', '차분하다', '깔끔하다'],
    answer: '덤벙대다',
    explanation: '"꼼꼼하다"는 빈틈이 없다는 뜻이고, "덤벙대다"는 침착하지 못하고 경솔하게 행동한다는 뜻입니다.',
    tags: ['반의어', '성격'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-002', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'easy',
    question: '"자랑"과 비슷한 뜻을 가진 단어는?',
    options: ['뽐내기', '겸손', '부끄러움', '비밀'],
    answer: '뽐내기',
    explanation: '"자랑"과 "뽐내기"는 모두 잘난 체하며 보여준다는 비슷한 뜻입니다.',
    tags: ['유의어', '행동'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-003', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'medium',
    question: '"진심으로 고마워하는 마음"을 뜻하는 단어는?',
    options: ['감사', '후회', '원망', '칭찬'],
    answer: '감사',
    explanation: '"감사"는 고맙게 여기는 마음이나 그 표현을 뜻합니다.',
    tags: ['감정', '정의'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-004', type: 'fill-blank', subjectId: 'vocabulary', difficulty: 'medium',
    question: '"쉽지 않고 힘든 것"을 한 단어로 (    )(이)라고 한다.',
    answer: '어려움',
    explanation: '"어려움"은 하기 힘들거나 복잡한 상태를 뜻하는 명사입니다.',
    tags: ['명사', '정의'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-005', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'easy',
    question: '"매우 기쁘고 신나는 것"을 나타내는 단어는?',
    options: ['즐겁다', '슬프다', '화나다', '지루하다'],
    answer: '즐겁다',
    explanation: '"즐겁다"는 마음이 기쁘고 흐뭇하다는 뜻입니다.',
    tags: ['감정', '형용사'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-006', type: 'short-answer', subjectId: 'vocabulary', difficulty: 'medium',
    question: '"생각지도 않았던 일을 당하여 놀라다"를 나타내는 두 글자 단어는?',
    answer: '깜짝',
    explanation: '"깜짝"은 갑자기 놀라는 모양을 나타내는 부사입니다.',
    tags: ['부사', '감정'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-007', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'hard',
    question: '"호기심"의 뜻으로 알맞은 것은?',
    options: ['새롭고 신기한 것에 끌리는 마음', '무서운 것을 좋아하는 마음', '다른 사람을 돕고 싶은 마음', '예쁜 것을 좋아하는 마음'],
    answer: '새롭고 신기한 것에 끌리는 마음',
    explanation: '"호기심(好奇心)"은 새롭고 신기한 것을 좋아하는 마음입니다.',
    tags: ['한자어', '감정'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-008', type: 'true-false', subjectId: 'vocabulary', difficulty: 'easy',
    question: '"용기"란 씩씩하고 굳센 기운이라는 뜻이다.',
    answer: 'O',
    explanation: '"용기(勇氣)"는 겁을 내지 않는 씩씩한 기운을 뜻합니다.',
    tags: ['한자어', '성격'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-009', type: 'multiple-choice', subjectId: 'vocabulary', difficulty: 'medium',
    question: '"물건을 아껴 쓰고 돈을 모으는 것"을 뜻하는 단어는?',
    options: ['절약', '낭비', '소비', '투자'],
    answer: '절약',
    explanation: '"절약"은 돈이나 물건 등을 아껴서 쓰는 것입니다.',
    tags: ['경제', '행동'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'vc-010', type: 'fill-blank', subjectId: 'vocabulary', difficulty: 'hard',
    question: '다른 사람의 마음을 헤아리고 함께 느끼는 것을 (    )(이)라고 한다.',
    answer: '공감',
    explanation: '"공감(共感)"은 다른 사람의 감정이나 의견에 대해 자기도 그렇다고 느끼는 것입니다.',
    tags: ['한자어', '감정'], createdAt: Date.now(), source: 'preset'
  },

  // === 서술형: 사자성어 사용 문장 만들기 ===
  {
    id: 'sm-fc-001', type: 'sentence-making', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '다음 사자성어를 사용해서 문장을 만들어 보세요: 죽마고우',
    answer: '나와 민호는 어릴 때부터 함께 놀던 죽마고우다.',
    explanation: '죽마고우(竹馬故友): 어릴 때부터 함께 놀던 친한 친구.',
    tags: ['친구', '관계', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-fc-002', type: 'sentence-making', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '다음 사자성어를 사용해서 문장을 만들어 보세요: 일석이조',
    answer: '운동을 하면 건강도 좋아지고 체중도 줄어드니 일석이조다.',
    explanation: '일석이조(一石二鳥): 한 가지 일로 두 가지 이득을 얻음.',
    tags: ['이득', '효율', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-fc-003', type: 'sentence-making', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '다음 사자성어를 사용해서 문장을 만들어 보세요: 자화자찬',
    answer: '오늘 발표를 잘했다고 누나가 자화자찬했다.',
    explanation: '자화자찬(自畫自讚): 자기가 한 일을 스스로 칭찬함.',
    tags: ['자기', '칭찬', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-fc-004', type: 'sentence-making', subjectId: 'four-char-idiom', difficulty: 'hard',
    question: '다음 사자성어를 사용해서 문장을 만들어 보세요: 대기만성',
    answer: '꾸준히 노력하면 대기만성이라는 말처럼 큰 인물이 될 수 있다.',
    explanation: '대기만성(大器晩成): 큰 그릇은 늦게 완성된다는 뜻으로, 큰 사람은 천천히 이루어짐.',
    tags: ['성장', '인내', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-fc-005', type: 'sentence-making', subjectId: 'four-char-idiom', difficulty: 'medium',
    question: '다음 사자성어를 사용해서 문장을 만들어 보세요: 일취월장',
    answer: '동생은 한 달 만에 피아노 실력이 일취월장했다.',
    explanation: '일취월장(日就月將): 날마다 달마다 발전함.',
    tags: ['성장', '발전', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },

  // === 서술형: 관용구 사용 문장 만들기 ===
  {
    id: 'sm-id-001', type: 'sentence-making', subjectId: 'idiom', difficulty: 'easy',
    question: '다음 관용구를 사용해서 문장을 만들어 보세요: 발이 넓다',
    answer: '우리 삼촌은 발이 넓어서 어디를 가도 아는 사람이 많다.',
    explanation: '"발이 넓다"는 아는 사람이 많고 활동 범위가 넓다는 뜻입니다.',
    tags: ['신체', '관계', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-id-002', type: 'sentence-making', subjectId: 'idiom', difficulty: 'medium',
    question: '다음 관용구를 사용해서 문장을 만들어 보세요: 손이 크다',
    answer: '엄마는 손이 커서 친구들이 놀러 오면 음식을 가득 차려 주신다.',
    explanation: '"손이 크다"는 씀씀이가 크고 후하다는 뜻입니다.',
    tags: ['신체', '성격', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-id-003', type: 'sentence-making', subjectId: 'idiom', difficulty: 'medium',
    question: '다음 관용구를 사용해서 문장을 만들어 보세요: 귀가 얇다',
    answer: '내 동생은 귀가 얇아서 광고를 보면 다 사고 싶어한다.',
    explanation: '"귀가 얇다"는 다른 사람의 말에 쉽게 넘어간다는 뜻입니다.',
    tags: ['신체', '성격', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },

  // === 서술형: 속담 사용 문장 만들기 ===
  {
    id: 'sm-pv-001', type: 'sentence-making', subjectId: 'proverb', difficulty: 'medium',
    question: '다음 속담을 사용해서 문장을 만들어 보세요: 백지장도 맞들면 낫다',
    answer: '백지장도 맞들면 낫다고, 친구들과 함께 청소를 했더니 금방 끝났다.',
    explanation: '쉬운 일도 협력하면 더 잘 된다는 뜻입니다.',
    tags: ['협력', '도움', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-pv-002', type: 'sentence-making', subjectId: 'proverb', difficulty: 'medium',
    question: '다음 속담을 사용해서 문장을 만들어 보세요: 가는 말이 고와야 오는 말이 곱다',
    answer: '가는 말이 고와야 오는 말이 곱다는 말처럼, 친구에게 친절하게 말하니 친구도 다정하게 답해 주었다.',
    explanation: '내가 좋게 말해야 상대방도 좋게 말한다는 뜻입니다.',
    tags: ['말', '예절', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },

  // === 서술형: 어휘 사용 문장 만들기 ===
  {
    id: 'sm-vc-001', type: 'sentence-making', subjectId: 'vocabulary', difficulty: 'easy',
    question: '다음 단어를 사용해서 문장을 만들어 보세요: 호기심',
    answer: '나는 우주에 대한 호기심이 많아서 별에 관한 책을 자주 읽는다.',
    explanation: '"호기심"은 새롭고 신기한 것에 끌리는 마음입니다.',
    tags: ['감정', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-vc-002', type: 'sentence-making', subjectId: 'vocabulary', difficulty: 'medium',
    question: '다음 단어를 사용해서 문장을 만들어 보세요: 공감',
    answer: '친구가 슬퍼할 때 옆에서 이야기를 들어 주며 공감해 주었다.',
    explanation: '"공감"은 다른 사람의 감정을 함께 느끼는 것입니다.',
    tags: ['감정', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
  {
    id: 'sm-vc-003', type: 'sentence-making', subjectId: 'vocabulary', difficulty: 'medium',
    question: '다음 단어를 사용해서 문장을 만들어 보세요: 절약',
    answer: '용돈을 절약해서 모은 돈으로 좋아하는 책을 샀다.',
    explanation: '"절약"은 물건이나 돈을 아껴 쓰는 것입니다.',
    tags: ['경제', '행동', '문장만들기'], createdAt: Date.now(), source: 'preset'
  },
];
