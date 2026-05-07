/**
 * 객관식(multiple-choice) 정답 위치를 ①②③④ 에 고루 분배하는 헬퍼.
 *
 * 시드 작성 시 (가독성을 위해) 정답을 첫 번째 보기에 두는 경향이 있는데,
 * 그대로 학생에게 노출되면 "항상 ①번이 정답" 패턴 학습이 일어남.
 *
 * 이 헬퍼는 결정적(deterministic) 으로 정답 위치를 회전시켜 균등 분배를 보장.
 * 같은 input 은 항상 같은 output → 시드/PDF/미리보기 모두 일관됨.
 *
 * 사용법:
 *   const shuffled = withMcAnswerAt(question, targetIndex);
 *   // targetIndex 0~3 — 정답이 위치할 0-based 인덱스
 *
 * 시드 q() 팩토리에서 (qSeq - 1) % 4 등으로 호출하면 자동 순환 분배.
 */

import type { Question } from '../types';

/**
 * 객관식 보기를 재배열해 정답이 targetIdx 위치에 오도록 한다.
 * - 비multiple-choice 또는 options 가 없으면 원본 그대로 반환
 * - answer 가 options 안에 없으면 원본 그대로 (안전)
 * - targetIdx 가 0~options.length-1 범위 밖이면 mod 로 정규화
 */
export function withMcAnswerAt(q: Question, targetIdx: number): Question {
  if (q.type !== 'multiple-choice' || !q.options || q.options.length === 0) {
    return q;
  }
  const len = q.options.length;
  const target = ((targetIdx % len) + len) % len;
  const currentIdx = q.options.indexOf(q.answer || '');
  if (currentIdx === -1 || currentIdx === target) return q;

  const newOptions = [...q.options];
  [newOptions[currentIdx], newOptions[target]] = [newOptions[target], newOptions[currentIdx]];
  return { ...q, options: newOptions };
}

/**
 * 시드 q() 팩토리에서 사용하기 좋은 wrapper —
 * mc 슬롯 카운터 (1, 2, 3, ...) 를 받아 0/1/2/3 위치로 순환 분배.
 *
 * 사용 예 (defaultSets.ts):
 *   let mcSeq = 0;
 *   const mc = (partial) => withMcAnswerAt(q(partial), mcSeq++);
 */
export function makeMcCycler() {
  let mcSeq = 0;
  return (q: Question): Question => {
    if (q.type !== 'multiple-choice') return q;
    const positioned = withMcAnswerAt(q, mcSeq);
    mcSeq++;
    return positioned;
  };
}
