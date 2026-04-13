import { useState, useMemo } from 'react';
import {
  Search, Filter, Plus, Minus, Trash2, Wand2, PenTool, ChevronDown, ChevronRight,
  Loader2, Key, Tag, Sparkles, CheckSquare, Square,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useQuestionStore } from '../stores/questionStore';
import { useTestStore } from '../stores/testStore';
import type { Question, QuestionType, Difficulty, AISettings } from '../types';
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from '../types';
import { generateQuestions } from '../services/aiService';

const DIFF_BADGE: Record<Difficulty, string> = {
  easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard',
};
const DIFF_SHORT: Record<Difficulty, string> = {
  easy: '쉬움', medium: '보통', hard: '어려움',
};
const TYPE_ICON: Record<QuestionType, string> = {
  'multiple-choice': '\u2463', 'true-false': 'OX', 'fill-blank': '___', 'short-answer': '\u270E',
};

interface Props {
  onPreviewQuestion: (q: Question) => void;
  onManualCreate: () => void;
  onOpenSettings: () => void;
}

export default function LeftPanel({ onPreviewQuestion, onManualCreate, onOpenSettings }: Props) {
  const [activeTab, setActiveTab] = useState<'create' | 'db'>('db');

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {[
          { key: 'create', label: '문항 생성', icon: <Sparkles size={13} /> },
          { key: 'db', label: '문항 DB', icon: <Tag size={13} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === key
                ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(key as 'create' | 'db')}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'create' ? (
          <CreateTab onManualCreate={onManualCreate} onOpenSettings={onOpenSettings} />
        ) : (
          <DBTab onPreviewQuestion={onPreviewQuestion} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════ 문항 생성 탭 ═══════════════ */

function CreateTab({ onManualCreate, onOpenSettings }: { onManualCreate: () => void; onOpenSettings: () => void }) {
  const { subjects, addSubject, removeSubject, addQuestions } = useQuestionStore();
  const { currentTest, addQuestionsToTest } = useTestStore();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('\uD83D\uDCDD');
  const [aiSubject, setAiSubject] = useState(subjects[0]?.id || '');
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>('easy');
  const [aiTypes, setAiTypes] = useState<QuestionType[]>(['multiple-choice']);
  const [aiCount, setAiCount] = useState(5);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const getAISettings = (): AISettings | null => {
    try { return JSON.parse(localStorage.getItem('quiz-maker-ai-settings') || 'null'); }
    catch { return null; }
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];
    addSubject({ id: nanoid(8), name: newSubjectName.trim(), icon: newSubjectIcon, color: colors[subjects.length % colors.length] });
    setNewSubjectName('');
    setNewSubjectIcon('\uD83D\uDCDD');
  };

  const handleAIGenerate = async () => {
    const settings = getAISettings();
    if (!settings?.apiKey) { setAiError('API \uD0A4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.'); return; }
    const subject = subjects.find((s) => s.id === aiSubject);
    if (!subject) return;
    setAiLoading(true); setAiError('');
    try {
      const questions = await generateQuestions({
        subject, difficulty: aiDifficulty, questionTypes: aiTypes,
        count: aiCount, topic: aiTopic || undefined,
        apiKey: settings.apiKey, provider: settings.provider, model: settings.model,
      });
      addQuestions(questions);
      if (currentTest) addQuestionsToTest(questions);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI \uC0DD\uC131 \uC624\uB958');
    } finally { setAiLoading(false); }
  };

  const aiSettings = getAISettings();

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      <Section title="과목 관리" icon={<Tag size={13} />} collapsible>
        <div className="space-y-1.5">
          {subjects.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded px-2.5 py-1.5 text-xs">
              <span>{s.icon} {s.name}</span>
              <button onClick={() => { if (confirm(`"${s.name}" 삭제?`)) removeSubject(s.id); }}
                className="text-gray-400 hover:text-red-500 p-0.5"><Trash2 size={11} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 mt-2">
          <input className="input-field text-xs w-10 text-center !px-1" placeholder="\uD83D\uDCDD" value={newSubjectIcon}
            onChange={(e) => setNewSubjectIcon(e.target.value)} maxLength={2} />
          <input className="input-field text-xs flex-1" placeholder="과목 이름" value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()} />
          <button className="btn btn-primary !px-2 !py-1" onClick={handleAddSubject} disabled={!newSubjectName.trim()}>
            <Plus size={12} />
          </button>
        </div>
      </Section>

      <Section title="수동 생성" icon={<PenTool size={13} />}>
        <button className="btn btn-secondary w-full !text-xs" onClick={onManualCreate}>
          <PenTool size={12} /> 문항 직접 만들기
        </button>
      </Section>

      <Section title="AI 자동 생성" icon={<Wand2 size={13} />}>
        {!aiSettings?.apiKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-700">
            <Key size={11} className="inline mr-1" /> API 키 필요.
            <button className="underline ml-1 font-medium" onClick={onOpenSettings}>설정</button>
          </div>
        )}
        <select className="select-field text-xs" value={aiSubject} onChange={(e) => setAiSubject(e.target.value)}>
          {subjects.map((s) => (<option key={s.id} value={s.id}>{s.icon} {s.name}</option>))}
        </select>
        <select className="select-field text-xs" value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value as Difficulty)}>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <div>
          <label className="text-[11px] font-medium text-gray-600 mb-1 block">문제 유형</label>
          <div className="grid grid-cols-2 gap-1">
            {(Object.entries(QUESTION_TYPE_LABELS) as [QuestionType, string][]).map(([k, v]) => (
              <label key={k} className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                <input type="checkbox" checked={aiTypes.includes(k)}
                  onChange={() => setAiTypes((p) => p.includes(k) ? p.filter((t) => t !== k) : [...p, k])}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-3 h-3" />
                {v.split(' ')[0]}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium text-gray-600 mb-1 block">문항 수: {aiCount}개</label>
          <input type="range" min={1} max={20} value={aiCount} onChange={(e) => setAiCount(Number(e.target.value))} className="w-full" />
        </div>
        <input className="input-field text-xs" placeholder="특정 주제 (선택)" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} />
        {aiError && <div className="bg-red-50 border border-red-200 rounded p-1.5 text-[11px] text-red-600">{aiError}</div>}
        <button className="btn btn-primary w-full !text-xs" onClick={handleAIGenerate} disabled={aiLoading || aiTypes.length === 0}>
          {aiLoading ? <><Loader2 size={12} className="animate-spin" /> 생성 중...</> : <><Wand2 size={12} /> {aiCount}문항 생성</>}
        </button>
      </Section>
    </div>
  );
}

/* ═══════════════ 문항 DB 탭 ═══════════════ */

interface TagGroup {
  key: string; // "subjectId::tag" or "subjectId::__no_tag__"
  label: string;
  subjectIcon: string;
  subjectName: string;
  tag: string | null;
  questions: Question[];
}

function buildTagGroups(questions: Question[], subjects: { id: string; name: string; icon: string }[]): TagGroup[] {
  const map = new Map<string, TagGroup>();

  for (const q of questions) {
    const sub = subjects.find((s) => s.id === q.subjectId);
    const subIcon = sub?.icon || '';
    const subName = sub?.name || q.subjectId;
    const tags = q.tags && q.tags.length > 0 ? q.tags : [null];

    for (const tag of tags) {
      const key = `${q.subjectId}::${tag ?? '__no_tag__'}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          label: tag ? `${subName} > ${tag}` : subName,
          subjectIcon: subIcon,
          subjectName: subName,
          tag,
          questions: [],
        });
      }
      map.get(key)!.questions.push(q);
      break; // use first tag only to avoid duplicates
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function DBTab({ onPreviewQuestion }: { onPreviewQuestion: (q: Question) => void }) {
  const { filters, setFilters, subjects, getFilteredQuestions } = useQuestionStore();
  const { currentTest, addQuestionToTest, addQuestionsToTest, removeQuestionFromTest } = useTestStore();
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = getFilteredQuestions();
  const groups = useMemo(() => buildTagGroups(filtered, subjects), [filtered, subjects]);

  const testQuestionIds = useMemo(
    () => new Set(currentTest?.questions.map((q) => q.id) || []),
    [currentTest?.questions]
  );

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const toggleSelectGroup = (group: TagGroup) => {
    const groupIds = group.questions.map((q) => q.id);
    const allSelected = groupIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (allSelected) { groupIds.forEach((id) => s.delete(id)); }
      else { groupIds.forEach((id) => s.add(id)); }
      return s;
    });
  };

  const handleBatchAdd = () => {
    const toAdd = filtered.filter((q) => selectedIds.has(q.id) && !testQuestionIds.has(q.id));
    if (toAdd.length > 0) addQuestionsToTest(toAdd);
    setSelectedIds(new Set());
  };

  const handleBatchRemove = () => {
    const toRemove = filtered.filter((q) => selectedIds.has(q.id) && testQuestionIds.has(q.id));
    toRemove.forEach((q) => removeQuestionFromTest(q.id));
    setSelectedIds(new Set());
  };

  const selectedCount = selectedIds.size;
  const selectedInTest = [...selectedIds].filter((id) => testQuestionIds.has(id)).length;
  const selectedNotInTest = selectedCount - selectedInTest;

  return (
    <div className="flex flex-col h-full">
      {/* Search + Filters */}
      <div className="p-2.5 border-b border-gray-200 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">문항 목록</span>
          <span className="text-[10px] text-gray-400">{filtered.length}개</span>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-7 text-xs !py-1.5" placeholder="검색..."
            value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />
        </div>
        <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
          onClick={() => setShowFilters(!showFilters)}>
          <Filter size={11} /> 필터 {showFilters ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        {showFilters && (
          <div className="space-y-1.5 animate-fadeIn">
            <select className="select-field text-xs !py-1" value={filters.subjectId || ''}
              onChange={(e) => setFilters({ subjectId: e.target.value || null })}>
              <option value="">전체 과목</option>
              {subjects.map((s) => (<option key={s.id} value={s.id}>{s.icon} {s.name}</option>))}
            </select>
            <div className="flex gap-1.5">
              <select className="select-field text-xs !py-1 flex-1" value={filters.difficulty || ''}
                onChange={(e) => setFilters({ difficulty: (e.target.value || null) as Difficulty | null })}>
                <option value="">난이도</option>
                {Object.entries(DIFF_SHORT).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
              <select className="select-field text-xs !py-1 flex-1" value={filters.type || ''}
                onChange={(e) => setFilters({ type: (e.target.value || null) as QuestionType | null })}>
                <option value="">유형</option>
                {Object.entries(TYPE_ICON).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Batch action bar */}
      {selectedCount > 0 && currentTest && (
        <div className="px-2.5 py-2 bg-primary-50 border-b border-primary-200 flex items-center gap-1.5 flex-shrink-0 animate-fadeIn">
          <span className="text-[11px] text-primary-700 font-medium">{selectedCount}개 선택</span>
          <div className="ml-auto flex gap-1">
            {selectedNotInTest > 0 && (
              <button className="btn btn-primary !py-0.5 !px-2 !text-[10px]" onClick={handleBatchAdd}>
                <Plus size={11} /> 추가 ({selectedNotInTest})
              </button>
            )}
            {selectedInTest > 0 && (
              <button className="btn btn-danger !py-0.5 !px-2 !text-[10px]" onClick={handleBatchRemove}>
                <Minus size={11} /> 제거 ({selectedInTest})
              </button>
            )}
            <button className="btn btn-ghost !py-0.5 !px-2 !text-[10px]" onClick={() => setSelectedIds(new Set())}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-xs">문항이 없습니다.</div>
        ) : (
          groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.key);
            const groupAllSelected = group.questions.every((q) => selectedIds.has(q.id));
            const groupSomeSelected = group.questions.some((q) => selectedIds.has(q.id));
            return (
              <div key={group.key}>
                {/* Group header */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                  {currentTest && (
                    <button onClick={() => toggleSelectGroup(group)} className="flex-shrink-0">
                      {groupAllSelected
                        ? <CheckSquare size={12} className="text-primary-600" />
                        : groupSomeSelected
                          ? <CheckSquare size={12} className="text-primary-300" />
                          : <Square size={12} className="text-gray-400" />
                      }
                    </button>
                  )}
                  <button
                    className="flex items-center gap-1 flex-1 min-w-0 text-left"
                    onClick={() => toggleGroup(group.key)}
                  >
                    {isCollapsed ? <ChevronRight size={11} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={11} className="text-gray-400 flex-shrink-0" />}
                    <span className="text-[10px] flex-shrink-0">{group.subjectIcon}</span>
                    <span className="text-[11px] font-semibold text-gray-700 truncate">
                      {group.tag || group.subjectName}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-auto">{group.questions.length}</span>
                  </button>
                </div>

                {/* Questions in group */}
                {!isCollapsed && group.questions.map((q) => {
                  const inTest = testQuestionIds.has(q.id);
                  const isSelected = selectedIds.has(q.id);
                  return (
                    <div
                      key={q.id}
                      className={`flex items-center gap-2 px-2.5 py-1.5 border-b border-gray-50 cursor-pointer transition-colors group ${
                        isSelected ? 'bg-primary-50' : inTest ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onPreviewQuestion(q)}
                    >
                      {currentTest && (
                        <button
                          className="flex-shrink-0"
                          onClick={(e) => { e.stopPropagation(); toggleSelect(q.id); }}
                        >
                          {isSelected
                            ? <CheckSquare size={12} className="text-primary-600" />
                            : <Square size={12} className="text-gray-300" />
                          }
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-800 truncate">{extractKeywords(q)}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`badge text-[9px] ${DIFF_BADGE[q.difficulty]}`}>{DIFF_SHORT[q.difficulty]}</span>
                          <span className="text-[9px] text-gray-400">{TYPE_ICON[q.type]}</span>
                          {q.source === 'ai' && <span className="text-[9px] text-purple-500">AI</span>}
                        </div>
                      </div>
                      {/* In-test indicator or quick add/remove */}
                      {currentTest && (
                        inTest ? (
                          <button
                            className="p-0.5 text-emerald-400 hover:text-red-500 flex-shrink-0"
                            onClick={(e) => { e.stopPropagation(); removeQuestionFromTest(q.id); }}
                            title="시험지에서 제거"
                          >
                            <Minus size={12} />
                          </button>
                        ) : (
                          <button
                            className="p-0.5 text-gray-300 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => { e.stopPropagation(); addQuestionToTest(q); }}
                            title="시험지에 추가"
                          >
                            <Plus size={12} />
                          </button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Helpers ═══════════════ */

function extractKeywords(q: Question): string {
  if (q.tags && q.tags.length > 0) return q.tags.join(' / ');
  let text = q.question.replace(/["\u201C\u201D\u2018\u2019]/g, '').replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
  if (text.length > 30) text = text.slice(0, 30) + '...';
  return text;
}

function Section({ title, icon, children, collapsible }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; collapsible?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible);
  const isOpen = collapsible ? open : true;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 mb-2 ${collapsible ? 'cursor-pointer hover:text-primary-600' : ''}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <span className="text-primary-600">{icon}</span>
        <h3 className="text-xs font-bold text-gray-700">{title}</h3>
        {collapsible && (isOpen ? <ChevronDown size={11} className="text-gray-400" /> : <ChevronRight size={11} className="text-gray-400" />)}
      </div>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
}
