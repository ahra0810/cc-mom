import type { Question, Difficulty, QuestionType, Subject } from '../types';
import { nanoid } from 'nanoid';

export interface AIGenerateOptions {
  subject: Subject;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  count: number;
  topic?: string;
  apiKey: string;
  provider: 'anthropic' | 'openai' | 'google';
  model?: string;
}

const DIFFICULTY_KR: Record<Difficulty, string> = {
  easy: '쉬움 (초등 3학년 수준)',
  medium: '보통 (초등 4학년 수준)',
  hard: '어려움 (초등 5~6학년 수준)',
};

const TYPE_KR: Record<QuestionType, string> = {
  'multiple-choice': '객관식 (4지선다)',
  'true-false': 'OX 퀴즈 (O 또는 X로 답)',
  'fill-blank': '빈칸 채우기',
  'short-answer': '단답형',
};

function buildPrompt(options: AIGenerateOptions): string {
  const typeList = options.questionTypes.map((t) => TYPE_KR[t]).join(', ');
  const topicNote = options.topic ? `\n특히 "${options.topic}" 주제에 관련된 문제를 만들어주세요.` : '';

  return `당신은 초등학생을 위한 교육 퀴즈 전문가입니다.
다음 조건에 맞는 퀴즈 문제를 ${options.count}개 생성해주세요.

과목: ${options.subject.name}
난이도: ${DIFFICULTY_KR[options.difficulty]}
문제 유형: ${typeList}${topicNote}

반드시 다음 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:

[
  {
    "type": "multiple-choice" | "true-false" | "fill-blank" | "short-answer",
    "question": "문제 내용",
    "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
    "answer": "정답",
    "explanation": "해설"
  }
]

규칙:
- 객관식(multiple-choice)은 반드시 4개의 선택지(options)를 포함하세요.
- OX 퀴즈(true-false)의 answer는 반드시 "O" 또는 "X"로만 답하세요. options는 필요 없습니다.
- 빈칸 채우기(fill-blank)는 문제에 (   ) 또는 빈칸을 포함하세요. options는 필요 없습니다.
- 단답형(short-answer)은 짧은 단어나 구로 답할 수 있는 문제를 만드세요. options는 필요 없습니다.
- 모든 문제에 해설(explanation)을 포함하세요.
- 초등학생이 이해할 수 있는 쉬운 단어와 문장을 사용하세요.
- JSON 배열만 반환하세요.`;
}

async function callAnthropic(prompt: string, apiKey: string, model?: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API 오류: ${res.status} - ${err}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAI(prompt: string, apiKey: string, model?: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API 오류: ${res.status} - ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGoogle(prompt: string, apiKey: string, model?: string): Promise<string> {
  const m = model || 'gemini-2.0-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google AI API 오류: ${res.status} - ${err}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

function parseResponse(text: string, subjectId: string, difficulty: Difficulty): Question[] {
  // Extract JSON from the response
  let jsonStr = text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) jsonStr = jsonMatch[0];

  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) throw new Error('응답이 배열 형식이 아닙니다.');

  return parsed.map((item: Record<string, unknown>) => ({
    id: nanoid(),
    type: (item.type as QuestionType) || 'multiple-choice',
    subjectId,
    difficulty,
    question: item.question as string,
    options: item.options as string[] | undefined,
    answer: item.answer as string,
    explanation: item.explanation as string | undefined,
    tags: [],
    createdAt: Date.now(),
    source: 'ai' as const,
  }));
}

export async function generateQuestions(options: AIGenerateOptions): Promise<Question[]> {
  const prompt = buildPrompt(options);

  let responseText: string;
  switch (options.provider) {
    case 'anthropic':
      responseText = await callAnthropic(prompt, options.apiKey, options.model);
      break;
    case 'openai':
      responseText = await callOpenAI(prompt, options.apiKey, options.model);
      break;
    case 'google':
      responseText = await callGoogle(prompt, options.apiKey, options.model);
      break;
    default:
      throw new Error('지원하지 않는 AI 제공자입니다.');
  }

  return parseResponse(responseText, options.subject.id, options.difficulty);
}
