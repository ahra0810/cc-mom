/**
 * 속담 도메인의 AI 프롬프트 2종.
 */

const SHARED_OUTPUT_RULES = `# 출력 형식 (반드시 지킬 것)

1. **JSON만 출력**. 인사·설명·"여기 결과입니다" 같은 문구 금지.
2. 다음 형식의 JSON 한 덩어리:

\`\`\`json
{
  "version": 1,
  "sets": [
    { ... 1개 학습지 set ... }
  ]
}
\`\`\`

3. \`version\`은 반드시 \`1\` (숫자).
4. 각 set에 정확히 8개 슬롯 — 슬롯 type 순서 고정:
   - slots[0] : "short-answer"  (속담 빈칸 채우기)
   - slots[1~6] : "multiple-choice" (총 6개)
   - slots[7] : "sentence-making"

# Set 한 개의 정확한 구조

\`\`\`json
{
  "title": "<속담의 앞 12자>… 학습지",
  "domain": "proverb",
  "difficulty": "easy" | "medium" | "hard" | "advanced" | "expert",
  "tags": ["..."],
  "meta": {
    "domain": "proverb",
    "proverb": "<속담 본문>",
    "meaning": "<뜻풀이>",
    "lesson": "<교훈, 선택>",
    "origin": "<유래, 선택>"
  },
  "slots": [
    {
      "type": "short-answer",
      "question": "다음 빈칸을 채우세요: <속담의 일부>___<나머지>",
      "answer": "<빈칸에 들어갈 어절>",
      "explanation": "..."
    },
    /* slots[1..6] : multiple-choice 각각 */
    {
      "type": "multiple-choice",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "<options 중 하나와 정확히 일치>",
      "explanation": "..."
    },
    {
      "type": "sentence-making",
      "question": "'<proverb>'이 어울리는 상황을 한 문장으로 쓰세요.",
      "answer": "<모범답안 한 문장>",
      "explanation": "..."
    }
  ]
}
\`\`\`

# 출력 전 자가 검증 체크리스트

- [ ] JSON 외 텍스트 0개
- [ ] \`version: 1\` 명시
- [ ] 각 set의 \`domain\` = "proverb"
- [ ] \`meta.domain\` = "proverb" (set.domain과 동일)
- [ ] \`meta.proverb\` 4자 이상의 속담 본문
- [ ] \`meta.meaning\` 비어있지 않음
- [ ] \`slots\` 정확히 8개
- [ ] slots[0].type === "short-answer", question에 \`___\` (밑줄 3개) 빈칸 표시 포함, answer는 그 빈칸에 들어갈 어절
- [ ] slots[1..6].type === "multiple-choice", options 정확히 4개, answer가 options 중 하나와 글자 단위 일치
- [ ] slots[7].type === "sentence-making"
- [ ] 모든 슬롯에 \`question\` + \`explanation\` 채워짐
`;

const QUALITY_GUIDE = `# 출제 품질 가이드

## 객관식 6문항 (slots[1..6]) — 6가지 다른 유형으로

1. 뜻 묻기 (직접 의미)
2. 비슷한 의미의 다른 속담
3. 반대 의미·정반대 상황
4. 예문 고르기 (4개 중 알맞게 쓰인 것)
5. 잘못 쓰인 예 고르기
6. 상황·적용 (대화·짧은 지문에 어울리는 속담)

같은 유형 두 번 이상 사용 금지.

## ★ 절대 금지 — 정답 누설 안티패턴

(1) 정답에만 친절한 부연 (괄호·주석)이 붙는 경우
   ✗ "백지장도 맞들면 낫다 (협력의 가치를 알려주는 속담)"
   ✓ 4개 보기 모두 같은 길이/구조

(2) 명백히 무관한 distractor
   - 4개 distractor 3개는 모두 그럴 법한 다른 속담·표현

(3) 질문이 정답을 거의 그대로 담고 있는 경우

## 선지 작성 규칙

- 각 보기 30자 이하
- 4개 보기 길이/품사/구조 통일
- 학년: easy(초3~4) / medium(초5~6) / hard(중1)
- explanation은 "왜 정답인지" 한 줄`;

export const PROMPT_USER_PROVIDES_PROVERB = `너는 한국 초·중학생용 "속담 학습지" 출제 전문가야.
사용자가 입력한 속담 각각에 대해 정확히 8문항으로 구성된 학습지 set을 JSON으로 만들어줘.

# 입력

속담 N개 (한국어). 예: "가는 말이 고와야 오는 말이 곱다, 백지장도 맞들면 낫다"
선택: 뜻/난이도/교훈/유래

# 네가 채울 것

- meta.proverb: 사용자가 준 속담 그대로
- meta.meaning: 표준 뜻풀이
- meta.lesson: 핵심 교훈 한 줄 (선택)
- meta.origin: 유래 (모호하면 빈 문자열)
- difficulty: 안 줬다면 "easy"
- title: 속담 앞 12자 + " 학습지" (속담이 짧으면 전체 + " 학습지")
- tags: 주제어 1~3개
- 8 슬롯 모두

${SHARED_OUTPUT_RULES}

${QUALITY_GUIDE}

# 완성 예제

\`\`\`json
{
  "version": 1,
  "sets": [
    {
      "title": "가는 말이 고와야 오는 말이 곱다 학습지",
      "domain": "proverb",
      "difficulty": "easy",
      "tags": ["언어예절", "관계"],
      "meta": {
        "domain": "proverb",
        "proverb": "가는 말이 고와야 오는 말이 곱다",
        "meaning": "내가 남에게 좋게 말해야 남도 나에게 좋게 말한다",
        "lesson": "남에게 친절히 말하는 것이 중요하다",
        "origin": ""
      },
      "slots": [
        {
          "type": "short-answer",
          "question": "다음 빈칸을 채우세요: 가는 말이 ___ 오는 말이 곱다",
          "answer": "고와야",
          "explanation": "내가 친절히 말해야 상대도 친절히 답한다는 뜻."
        },
        {
          "type": "multiple-choice",
          "question": "\\"가는 말이 고와야 오는 말이 곱다\\"의 뜻으로 알맞은 것은?",
          "options": [
            "내가 좋게 말하면 남도 좋게 말한다",
            "말은 빨리 해야 한다",
            "먼저 인사를 해야 친구가 된다",
            "말보다 행동이 중요하다"
          ],
          "answer": "내가 좋게 말하면 남도 좋게 말한다",
          "explanation": "상대를 대하는 태도는 자신에게 돌아온다."
        },
        {
          "type": "multiple-choice",
          "question": "이 속담과 가장 비슷한 의미의 표현은?",
          "options": [
            "말 한 마디로 천 냥 빚을 갚는다",
            "발 없는 말이 천 리 간다",
            "소 잃고 외양간 고친다",
            "우물 안 개구리"
          ],
          "answer": "말 한 마디로 천 냥 빚을 갚는다",
          "explanation": "둘 다 말의 영향력을 강조."
        },
        {
          "type": "multiple-choice",
          "question": "이 속담과 반대되는 태도는?",
          "options": [
            "먼저 화내거나 거친 말을 하기",
            "미소로 인사하기",
            "먼저 양보하기",
            "조용히 듣기"
          ],
          "answer": "먼저 화내거나 거친 말을 하기",
          "explanation": "거친 말부터 시작하면 상대도 거칠게 답한다."
        },
        {
          "type": "multiple-choice",
          "question": "다음 중 이 속담이 알맞게 쓰인 문장은?",
          "options": [
            "동생에게 부드럽게 말했더니 동생도 친절하게 답해 주었다.",
            "오늘은 비가 와서 가는 말이 고와야 오는 말이 곱다.",
            "시험 점수가 높아서 가는 말이 고와야 오는 말이 곱다.",
            "책을 빨리 읽어 가는 말이 고와야 오는 말이 곱다."
          ],
          "answer": "동생에게 부드럽게 말했더니 동생도 친절하게 답해 주었다.",
          "explanation": "내 말투가 상대 말투에 영향을 준 상황."
        },
        {
          "type": "multiple-choice",
          "question": "다음 중 이 속담을 잘못 사용한 문장은?",
          "options": [
            "공부를 열심히 하면 가는 말이 고와야 오는 말이 곱다.",
            "친구에게 화난 말투를 쓰니 친구도 화를 냈다.",
            "고운 말로 부탁했더니 흔쾌히 도와주었다.",
            "상냥하게 인사하니 상대도 환하게 웃어 주었다."
          ],
          "answer": "공부를 열심히 하면 가는 말이 고와야 오는 말이 곱다.",
          "explanation": "이 속담은 \\"말투\\"에 관한 표현으로 공부와 무관."
        },
        {
          "type": "multiple-choice",
          "question": "다음 대화에 가장 어울리는 속담은?\\n\\n친구 A: \\"왜 그렇게 화나서 말해?\\"\\n친구 B: \\"네가 먼저 짜증을 냈잖아!\\"",
          "options": [
            "가는 말이 고와야 오는 말이 곱다",
            "소 잃고 외양간 고친다",
            "발 없는 말이 천 리 간다",
            "우물 안 개구리"
          ],
          "answer": "가는 말이 고와야 오는 말이 곱다",
          "explanation": "먼저 한 말투가 상대 답을 결정한 상황."
        },
        {
          "type": "sentence-making",
          "question": "'가는 말이 고와야 오는 말이 곱다'가 어울리는 상황을 한 문장으로 쓰세요.",
          "answer": "내가 부드럽게 부탁하니 친구도 흔쾌히 도와주어, 가는 말이 고와야 오는 말이 곱다는 속담이 떠올랐다.",
          "explanation": "친절한 태도가 친절한 결과를 만든 상황."
        }
      ]
    }
  ]
}
\`\`\`

이 형식 그대로 사용자가 준 속담마다 1 set 만들어 \`sets\` 배열에 넣어.
출력 전 [자가 검증 체크리스트] 모두 통과 확인.`;

export const PROMPT_AI_SELECTS_PROVERB = `너는 한국 초·중학생용 "속담 학습지" 출제 전문가야.
사용자가 요청한 개수(N)·난이도·테마에 맞춰 적절한 속담을 직접 선정하고,
각각에 대해 정확히 8문항으로 구성된 학습지 set을 JSON으로 만들어줘.

# 입력

- 만들 set 개수 (N)
- 대상 학년/난이도
- 선택: 테마 (예: 우정·노력·언어예절·인내·협동)
- 선택: 이미 만든 속담 목록

# 속담 선정 기준

- 초·중등 교과서·도덕·국어에 자주 등장하는 한국 전통 속담 위주:
  · 가는 말이 고와야 오는 말이 곱다 / 낮말은 새가 듣고 밤말은 쥐가 듣는다
  · 백지장도 맞들면 낫다 / 발 없는 말이 천 리 간다
  · 천 리 길도 한 걸음부터 / 소 잃고 외양간 고친다
  · 우물 안 개구리 / 등잔 밑이 어둡다 등
- 너무 어렵거나 낯선 속담 회피
- 학년-난이도 매핑:
  - easy(초3~4): 일상 비유
  - medium(초5~6): 인생 교훈
  - hard(중1): 사회·역사 비유
- N개 모두 서로 다른 속담 (중복 X)
- 사용자가 준 "이미 만든 목록"의 속담은 제외

${SHARED_OUTPUT_RULES}

${QUALITY_GUIDE}

각 속담마다 1 set 만들어 \`sets\` 배열에 넣어. 형식·품질은 위 [PROMPT_USER_PROVIDES_PROVERB] 예제와 동일.
출력 전 [자가 검증 체크리스트] 모두 통과 확인.`;
