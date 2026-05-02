/**
 * Domain Registry — 다중 과목 추상화의 핵심 타입.
 *
 * 새 과목을 추가하려면 `src/domains/<id>/index.ts`에서 DomainConfig를 구현하고
 * `src/domains/registry.ts`에 등록하면 됩니다. 그 외 파일은 건드리지 않아도
 * 검증·PDF·UI·AI 프롬프트가 도메인별로 동작합니다.
 */
import type { ReactNode, ComponentType } from 'react';
import type { Difficulty, Question } from '../types';
import type { QuestionSet, SetMeta, SetValidationError } from '../types/sets';
import type { SetTemplate } from '../services/setPdfTemplates';

/* ─── 도메인 라벨 (모든 UI 텍스트의 단일 원천) ─── */
export interface DomainLabels {
  /** "사자성어" / "속담" — 메타 주제 단수 */
  subjectName: string;
  /** "사자성어 학습지" — 카드/제목 등 */
  setNoun: string;
  /** "+ 새 사자성어 set" 버튼 라벨 */
  newSetButtonLabel: string;
  /** 좌측 패널 검색 placeholder */
  searchPlaceholder: string;
  /** EmptySetHero 헤드라인·서브라인 */
  heroHeadline: string;
  heroSubline: string;
  /** 슬롯 인덱스별 라벨 (length === slotConfig.count) */
  slotLabels: readonly string[];
  /** 도메인 컬러 칩 (좌측 카드 배지·필터 pill 색상). 추후 phase 7에서 활용 */
  accentColor: string;
}

/* ─── 슬롯 구성 ─── */
export interface DomainSlotConfig {
  /** 1 set 안의 슬롯 개수 (현재 모든 도메인 8) */
  count: number;
  /** 슬롯별 강제 QuestionType (length === count) */
  requiredTypes: readonly Question['type'][];
  /** 메타 변경 시 자동 동기화되는 슬롯 인덱스. 비면 sync 안 함. */
  autoSyncedSlots: readonly number[];
  /**
   * 다중 페이지 분할 — 슬롯 인덱스 i 가 들어 있으면 슬롯 i 다음에 새 페이지 시작.
   * 비어 있으면 (기본) 1페이지에 모두 들어감. 예: [3] = 슬롯 0~3 까지가 페이지 1, 슬롯 4~ 가 페이지 2.
   */
  pageBreaks?: readonly number[];
  /**
   * 페이지별 상단 헤더 문구. length === pageBreaks.length + 1.
   * 비어 있으면 헤더 없이 렌더. 수포자 방지 격려 메시지 등.
   */
  pageHeaders?: readonly string[];
  /** 페이지 2 이후에도 메타 박스를 다시 표시할지. 기본 false (페이지 1에만). */
  repeatMetaOnEachPage?: boolean;
}

/* ─── PDF 카드 표시용 요약 ─── */
export interface DomainCardSummary {
  /** 좌측 카드 헤드라인 (큰 글자) — idiom의 경우 "동문서답" */
  headline: string;
  /** 좌측 카드 서브 (작은 글자, 한자/원문 등) — idiom의 경우 "東問西答" */
  subhead: string;
  /** 좌측 카드 본문 한 줄 (의미 등) */
  body: string;
}

/* ─── AI 프롬프트 (도메인별 누설 안티패턴 포함) ─── */
export interface DomainAiPrompts {
  /** "내가 키워드 지정 → AI가 문항만" */
  userKeyword: string;
  /** "AI가 키워드 선정부터 → 문항까지" */
  aiSelect: string;
}

/* ─── DomainConfig — 도메인 1개의 모든 동작 ─── */
export interface DomainConfig<TMeta extends SetMeta = SetMeta> {
  /** 'four-char-idiom' | 'proverb' | ... */
  id: TMeta['domain'];

  /** 모든 사용자 노출 텍스트 */
  labels: DomainLabels;

  /** 슬롯 구성 */
  slotConfig: DomainSlotConfig;

  /* ─── 메타 lifecycle ─── */
  /** 빈 메타 인스턴스 생성 (createEmptySet에서 사용) */
  createEmptyMeta(): TMeta;
  /** 메타 검증 (validateSet 안에서 호출) */
  validateMeta(meta: TMeta): SetValidationError[];
  /** 메타 변경 시 자동 title 생성 ("동문서답 학습지" 등) */
  deriveTitle(meta: TMeta, currentTitle: string): string;
  /** 메타 → 슬롯 자동 동기화. autoSyncedSlots에 포함된 idx만 호출됨 */
  syncSlotFromMeta(slotIdx: number, slot: Question, meta: TMeta): Question;
  /** 좌측 패널 검색용 haystack (idiom + hanja + meaning + origin 등 합치기) */
  getSearchHaystack(meta: TMeta): string;
  /** 좌측 카드 / 우측 출력 카드의 요약 정보 */
  getCardSummary(meta: TMeta): DomainCardSummary;

  /* ─── 프레젠테이션 ─── */
  /** SetEditor의 좌측 메타 입력 폼 */
  MetaEditor: ComponentType<MetaEditorProps>;
  /** PDF 메타 박스 렌더링 (4 metaStyle 분기 포함) */
  renderMetaBlock(meta: TMeta, template: SetTemplate, baseFs: number): string;
  /** (선택) 슬롯 인덱스별 PDF 렌더링 override — 도메인 특수 슬롯에 사용.
   *  null 반환 시 기본 슬롯 렌더러로 폴백. */
  renderSlot?(
    slotIdx: number,
    q: Question,
    meta: TMeta,
    showAnswer: boolean,
    template: SetTemplate,
    baseFs: number,
  ): string | null;

  /* ─── AI ─── */
  aiPrompts: DomainAiPrompts;

  /* ─── 시드 데이터 ─── */
  defaultSets: QuestionSet[];

  /* ─── 옵션: 작성 안내 / 도움말 ─── */
  /** SetEditor 상단의 작성 가이드 한 줄 */
  editorHint?: ReactNode;
}

/* MetaEditor 컴포넌트가 받는 props */
export interface MetaEditorProps {
  meta: SetMeta;
  /** 부분 업데이트 — useSetStore.updateDraftMeta 위임 */
  onUpdate: (updates: Partial<SetMeta>) => void;
  /** 메타 검증 에러 (인라인 표시용) */
  errors: SetValidationError[];
}

/* 도메인 ID 타입 (추후 union 확장) — 현재는 sets.ts의 SetDomain 그대로 */
export type DomainId = SetMeta['domain'];

/* 유틸: difficulty re-export로 도메인 모듈이 types/index에 의존하지 않게 */
export type { Difficulty };
