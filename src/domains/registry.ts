/**
 * Domain Registry — 등록된 모든 도메인의 단일 lookup 지점.
 *
 * 새 과목을 추가하려면:
 *   1) `src/domains/<id>/index.ts`에 DomainConfig 구현 + export
 *   2) 이 파일에서 import 후 DOMAIN_REGISTRY에 추가
 *   3) `src/types/sets.ts`의 SetDomain union에 새 id 추가
 *      (메타 타입은 같은 파일에서 SetMeta union으로 합치기)
 *
 * 검증/스토어/PDF/UI는 모두 getDomain(id)를 통해 도메인 동작을 가져오므로,
 * 도메인 외부 코드는 새 과목 추가 시 수정 불필요.
 */
import type { DomainConfig, DomainId } from './types';
import { idiomDomainConfig } from './four-char-idiom';
import { proverbDomainConfig } from './proverb';

/* ─── 등록된 모든 도메인 ─── */
export const DOMAIN_REGISTRY = {
  'four-char-idiom': idiomDomainConfig,
  'proverb': proverbDomainConfig,
} as const satisfies Record<DomainId, DomainConfig>;

/* ─── lookup ─── */
export function getDomain<D extends DomainId>(id: D): DomainConfig {
  const cfg = DOMAIN_REGISTRY[id];
  if (!cfg) {
    /* 안전장치 — 알 수 없는 도메인은 사자성어로 폴백 */
    console.warn(`[domain] Unknown domain id "${id}" — falling back to four-char-idiom`);
    return DOMAIN_REGISTRY['four-char-idiom'];
  }
  return cfg as DomainConfig;
}

/* ─── 등록된 도메인 목록 — UI 도메인 피커·필터에 사용 ─── */
export function listDomains(): DomainConfig[] {
  return Object.values(DOMAIN_REGISTRY);
}
