import { useState, useEffect, useRef } from 'react';
import { Search, X, Type } from 'lucide-react';

/**
 * 카테고리별 이모지 큐레이션.
 * 학습/과목과 자주 어울리는 것만 모았으며, "+ 직접 입력" 옵션도 제공합니다.
 */
const CATEGORIES: { id: string; label: string; emojis: string[] }[] = [
  {
    id: 'recommend',
    label: '추천',
    emojis: ['📚','📖','📕','📗','📘','📙','📓','📔','📒','📝','✏️','✒️','🖊️','🖋️','🔖','🏷️','📋','📌','📎','📏','📐','🧮','🎓','🎒','🏫','📐'],
  },
  {
    id: 'subjects',
    label: '과목',
    emojis: ['🌍','🌏','🌎','🗺️','📜','💬','🗣️','📖','✏️','📝','📚','🔢','📐','📏','🧮','🔬','🧪','⚗️','🔭','🧬','🌱','🌿','🐝','🦋','🐠','🦊','🐅','🐧','🎵','🎶','🎼','🎨','🖌️','🖼️','⚽','🏃','💪','🥋','💻','🖥️','📱','⌨️','🤖','🧠'],
  },
  {
    id: 'history',
    label: '역사·인물',
    emojis: ['🏛️','🏯','🏰','⛩️','🗿','👑','⚔️','🛡️','🏺','📜','🎖️','🪖','🪙','💰','🗝️','⚖️','🕊️','🌅','🚢','🛶','🐎'],
  },
  {
    id: 'literature',
    label: '문학·언어',
    emojis: ['📕','📖','📚','📓','📔','✒️','🖋️','✍️','📝','🎭','🎬','📰','📑','💌','💭','🗯️','💬','🗨️','📢','📣','🔤','🔡','🔠','🔣','🌸','🍂','☔','🌧️','🌹','🌼'],
  },
  {
    id: 'science',
    label: '과학·자연',
    emojis: ['🔬','🧪','⚗️','🧫','🧬','🔭','🛰️','🌟','⭐','✨','💫','🌙','☀️','🌈','🌊','💧','❄️','🔥','⚡','🌪️','🌋','🏔️','🌳','🌲','🌴','🌵','🌾','🍃','🍀','🌷','🌻','🌺','🐛','🐝','🦋','🐞','🐠','🐟','🐬','🐢','🦔','🦊','🐺','🐯','🦁','🐘','🦒','🦓','🐰','🐹'],
  },
  {
    id: 'math',
    label: '수학·논리',
    emojis: ['🔢','➕','➖','✖️','➗','♾️','📐','📏','🧮','📊','📈','📉','🎲','♠️','♥️','♦️','♣️','🔠','🔡','💡','🧠','🎯','🏆','🥇','🥈','🥉','🔍','🔎','🧩'],
  },
  {
    id: 'art',
    label: '예술·체육',
    emojis: ['🎨','🖌️','🖍️','✂️','🧵','🧶','🎭','🎬','🎤','🎧','🎵','🎶','🎼','🎹','🎸','🥁','🎺','🎻','🪕','🪘','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','🛹','🏊','🤸','🏃','🧗','🚴','⛹️','🤾'],
  },
  {
    id: 'feeling',
    label: '감정·아이콘',
    emojis: ['😀','😊','🤓','🧐','😎','🤔','🥳','🤩','😍','🥰','😇','🌟','⭐','✨','💯','🎉','🎊','🏆','🥇','💎','🔥','⚡','💪','👍','✅','✔️','🎯','💡','🔔','📣','🌈','❤️','💛','💚','💙','💜','🖤','🤍','🤎','🧡','♥️','💖','💕','💞'],
  },
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
  onClose?: () => void;
}

export default function EmojiPicker({ value, onChange, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState('recommend');
  const [search, setSearch] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  /* 외부 클릭 시 닫기 */
  useEffect(() => {
    if (!onClose) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    /* 다음 tick에 등록 — open 트리거 클릭이 닫지 않도록 */
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  /* 검색어가 있으면 모든 카테고리에서 매칭 */
  const visibleEmojis = (() => {
    if (search.trim()) {
      const allEmojis = new Set<string>();
      CATEGORIES.forEach((c) => c.emojis.forEach((e) => allEmojis.add(e)));
      return [...allEmojis];
    }
    return CATEGORIES.find((c) => c.id === activeCategory)?.emojis || [];
  })();

  const handleCustomApply = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    /* 첫 한 두 글자/이모지만 사용 (이모지는 보통 1~2 코드포인트) */
    const segments = [...trimmed]; // 코드포인트 단위 split
    const emoji = segments.slice(0, 4).join(''); // 복합 이모지(피부톤·ZWJ) 허용
    onChange(emoji);
    setShowCustom(false);
    if (onClose) onClose();
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-72 overflow-hidden animate-fadeIn"
      style={{ marginTop: 4 }}
    >
      {/* Search */}
      <div className="p-2 border-b border-gray-100">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="이모지 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search.trim() && (
        <div className="flex gap-0.5 px-2 py-1.5 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-md transition-colors ${
                activeCategory === c.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-0.5 p-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {visibleEmojis.length === 0 ? (
          <div className="col-span-8 text-center text-[11px] text-gray-400 py-6">
            결과가 없습니다
          </div>
        ) : (
          visibleEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onChange(emoji);
                if (onClose) onClose();
              }}
              className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 active:bg-gray-200 text-base transition-colors ${
                value === emoji ? 'bg-primary-100 ring-1 ring-primary-400' : ''
              }`}
              title={emoji}
            >
              {emoji}
            </button>
          ))
        )}
      </div>

      {/* Custom input */}
      <div className="border-t border-gray-100">
        {showCustom ? (
          <div className="p-2 space-y-1.5 bg-gray-50">
            <label className="text-[10px] text-gray-500 font-medium">
              직접 붙여넣기 (이모지·한글·영문 모두 가능)
            </label>
            <div className="flex gap-1">
              <input
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="예: 🦕 / 韓 / Hi"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomApply()}
                autoFocus
              />
              <button
                onClick={handleCustomApply}
                className="px-2 py-1 text-[10px] font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                적용
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className="px-1.5 py-1 text-gray-400 hover:text-gray-600"
                aria-label="닫기"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              💡 <strong>팁:</strong> 윈도우 키 + 마침표(.) → 시스템 이모지 패널 열림
              <br />또는 <a href="https://emojipedia.org/ko/" target="_blank" rel="noreferrer" className="underline text-primary-600">Emojipedia</a>에서 복사
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowCustom(true)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-primary-600 hover:bg-primary-50 font-medium"
          >
            <Type size={11} /> 직접 붙여넣기 / 한글·영문 사용
          </button>
        )}
      </div>
    </div>
  );
}
