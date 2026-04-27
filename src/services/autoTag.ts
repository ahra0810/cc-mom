/**
 * 가져오기(import)된 문항의 과목을 자동으로 매칭/생성하는 로직.
 *
 * 매칭 우선순위:
 *   1) 정확한 subjectId 일치
 *   2) 정규화된 subjectId 일치 (대소문자/언더스코어/하이픈/공백 무시)
 *   3) 과목 이름 부분 일치 (예: "literature" → "중학 국어 (문학)")
 *   4) 키워드 패턴 매칭 (작품명·작가·태그·문제 본문 검색)
 *   5) workTitle이 있으면 → 문학으로 간주
 *   6) subjectId 힌트로 새 과목 자동 생성
 *   7) 마지막 fallback → '미분류' 과목
 */
import type { Question, Subject } from '../types';
import { nanoid } from 'nanoid';

/* ─── 키워드 패턴 — 기존 과목으로 분류하는 데 사용 ─── */
const SUBJECT_KEYWORDS: Record<string, { keywords: string[]; weight?: number }> = {
  'middle-literature': {
    keywords: [
      '소나기', '황순원', '동백꽃', '김유정', '먼 후일', '김소월', '청포도', '이육사',
      '운수 좋은 날', '현진건', '수난이대', '하근찬', '엄마야 누나야', '방망이 깎던 노인',
      '단편소설', '서정시', '갈래', '시점', '서술자', '화자',
      '비유', '상징', '운율', '반어', '역설', '의인법',
      '인물 심리', '인물의 성격', '갈등', '주제 의식', '서술상 특징',
      '문학', '소설의 구성', '내포', '서정',
    ],
  },
  'world-history': {
    keywords: [
      '이집트', '피라미드', '파라오', '나일', '메소포타미아', '함무라비',
      '고대 그리스', '아테네', '스파르타', '올림픽', '파르테논',
      '로마', '콜로세움', '카이사르', '비잔틴',
      '중국', '만리장성', '한나라', '당나라', '진시황', '4대 발명',
      '인도', '타지마할', '간디', '카스트',
      '콜럼버스', '대항해', '아메리카 대륙', '신대륙',
      '프랑스 혁명', '루이 16세', '나폴레옹',
      '산업혁명', '증기기관',
      '세계사', '고대문명', '중세',
    ],
  },
  'four-char-idiom': {
    keywords: [
      '죽마고우', '일석이조', '자화자찬', '동문서답', '오리무중',
      '대기만성', '구사일생', '일취월장', '전화위복', '감언이설',
      '사자성어',
    ],
  },
  idiom: {
    keywords: [
      '발이 넓다', '귀가 얇다', '입이 가볍다', '눈이 높다', '손이 크다',
      '간이 크다', '배가 아프다', '쇠귀에 경',
      '관용구', '관용 표현',
    ],
  },
  proverb: {
    keywords: [
      '가는 말이 고와야', '소 잃고 외양간', '낮말은 새', '백지장도 맞들면',
      '빈 수레가 요란', '우물 안 개구리', '세 살 버릇', '원숭이도 나무에서',
      '속담',
    ],
  },
  spelling: {
    keywords: [
      '맞춤법', '됐어', '됬어', '왠지', '웬지', '어이없다', '어의없다',
      '갈게', '갈께', '이따가', '있다가', '금세', '금새', '일찍이', '맞히다', '맞추다',
    ],
  },
  vocabulary: {
    keywords: [
      '유의어', '반의어', '비슷한 뜻', '반대되는 뜻', '비슷한 말',
      '꼼꼼하다', '덤벙대다', '호기심', '공감', '절약', '용기',
      '어휘', '낱말의 뜻',
    ],
  },
};

/* ─── 과목명 자동 생성용 색상 팔레트 ─── */
const AUTO_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#6366F1', '#EF4444', '#14B8A6', '#F97316', '#A855F7',
  '#0EA5E9', '#84CC16',
];

/* ─── 정규화 ─── */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[-_\s]/g, '').trim();
}

/* ─── 과목 ID로 사람 친화적인 이름 생성 ─── */
function humanize(subjectId: string): string {
  // kebab/snake/camelCase → 사람이 읽기 쉬운 이름
  const cleaned = subjectId
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/* ─── 작품명에서 추론한 과목 이름 ─── */
function inferLiteratureSubjectName(workTitle?: string): string | null {
  if (!workTitle) return null;
  return '중학 국어 (문학)';
}

/* ─── 새 과목 객체 생성 ─── */
function createSubject(
  subjectId: string | undefined,
  name: string,
  existingCount: number
): Subject {
  const id = subjectId && subjectId.trim() ? subjectId.trim() : nanoid(8);
  return {
    id,
    name,
    icon: '📝',
    color: AUTO_COLORS[existingCount % AUTO_COLORS.length],
  };
}

/* ─── 매칭 결과 ─── */
export interface ResolveResult {
  subjectId: string;
  newSubject?: Subject;
  matchedBy: 'exact' | 'normalized' | 'name' | 'keyword' | 'work-title' | 'created' | 'fallback';
}

/* ─── 메인 매칭 함수 ─── */
export function resolveSubjectForQuestion(
  q: Partial<Question>,
  existingSubjects: Subject[],
  pendingSubjects: Subject[]
): ResolveResult {
  const all = [...existingSubjects, ...pendingSubjects];

  /* 1) 정확 일치 */
  if (q.subjectId) {
    const exact = all.find((s) => s.id === q.subjectId);
    if (exact) return { subjectId: exact.id, matchedBy: 'exact' };
  }

  /* 2) 정규화 일치 */
  if (q.subjectId) {
    const targetN = normalize(q.subjectId);
    const fuzzy = all.find((s) => {
      const sn = normalize(s.id);
      return sn === targetN || sn.includes(targetN) || targetN.includes(sn);
    });
    if (fuzzy) return { subjectId: fuzzy.id, matchedBy: 'normalized' };
  }

  /* 3) 과목명 부분 일치 (subjectId가 사람 친화적 이름일 수 있음) */
  if (q.subjectId) {
    const targetN = normalize(q.subjectId);
    const nameMatch = all.find((s) => {
      const nameN = normalize(s.name);
      return nameN.includes(targetN) || targetN.includes(nameN);
    });
    if (nameMatch) return { subjectId: nameMatch.id, matchedBy: 'name' };
  }

  /* 4) 키워드 매칭 — 문제 본문/지문/작품명/태그 모두 검색 */
  const haystack = [
    q.question,
    q.passage,
    q.workTitle,
    q.workAuthor,
    ...(q.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (haystack) {
    let bestId: string | null = null;
    let bestScore = 0;
    for (const [subjectId, def] of Object.entries(SUBJECT_KEYWORDS)) {
      const sub = all.find((s) => s.id === subjectId);
      if (!sub) continue;
      const score = def.keywords.reduce(
        (acc, kw) => (haystack.includes(kw.toLowerCase()) ? acc + 1 : acc),
        0
      );
      if (score > bestScore) {
        bestScore = score;
        bestId = subjectId;
      }
    }
    if (bestId) return { subjectId: bestId, matchedBy: 'keyword' };
  }

  /* 5) workTitle이 있으면 문학으로 분류 (없으면 새로 생성) */
  if (q.workTitle) {
    const lit = all.find((s) => s.id === 'middle-literature');
    if (lit) return { subjectId: lit.id, matchedBy: 'work-title' };
    const litName = inferLiteratureSubjectName(q.workTitle) || '문학';
    const newSub = createSubject('middle-literature', litName, all.length);
    newSub.icon = '📕';
    newSub.color = '#7C3AED';
    return { subjectId: newSub.id, newSubject: newSub, matchedBy: 'created' };
  }

  /* 6) subjectId 힌트로 새 과목 생성 */
  if (q.subjectId && q.subjectId.trim()) {
    const newSub = createSubject(
      q.subjectId,
      humanize(q.subjectId),
      all.length
    );
    return { subjectId: newSub.id, newSubject: newSub, matchedBy: 'created' };
  }

  /* 7) 마지막 fallback — 미분류 */
  let unknown = all.find((s) => s.id === 'unclassified');
  if (!unknown) {
    unknown = {
      id: 'unclassified',
      name: '미분류',
      icon: '❓',
      color: '#6B7280',
    };
    return {
      subjectId: unknown.id,
      newSubject: unknown,
      matchedBy: 'fallback',
    };
  }
  return { subjectId: unknown.id, matchedBy: 'fallback' };
}

/* ─── 통계 — UI 토스트에 사용 ─── */
export interface TaggingStats {
  total: number;
  matched: number;       // 기존 과목에 매칭된 수
  newSubjects: Subject[]; // 새로 생성된 과목 목록
  byMethod: Record<ResolveResult['matchedBy'], number>;
}
