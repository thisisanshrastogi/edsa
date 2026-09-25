import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { THEMES } from '../hooks/useTheme';

export default function ThemeMenu({ store }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { theme, mode, resolvedMode, setTheme, setMode } = store;

  // Flatten items for keyboard navigation
  const items = [
    ...THEMES.map(t => ({ type: 'theme', id: t.id, action: () => setTheme(t.id) })),
    { type: 'mode', id: 'light', action: () => setMode('light') },
    { type: 'mode', id: 'dark', action: () => setMode('dark') },
    { type: 'mode', id: 'system', action: () => setMode('system') },
  ];

  useEffect(() => {
    if (!open) {
      setFocusedIndex(-1);
      return;
    }
    const onDown = (e) => { 
      if (!wrapRef.current?.contains(e.target)) setOpen(false); 
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { 
        setOpen(false); 
        triggerRef.current?.focus(); 
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(i => (i + 1) % items.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(i => (i - 1 + items.length) % items.length);
      }
      if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        items[focusedIndex].action();
      }
    };
    
    // Focus trapping loosely
    const firstFocusable = menuRef.current?.querySelector('[role="menuitemradio"]');
    if (firstFocusable && focusedIndex === -1) {
      // we can rely on up/down keys instead of actual focus, but let's sync focus visually via state
    }

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, items, focusedIndex]);

  // Determine current icon
  const Icon = mode === 'light' ? Sun : (mode === 'dark' ? Moon : Monitor);

  return (
    <div ref={wrapRef} className="relative">
      <div ref={triggerRef}>
        <IconButton
          icon={Palette}
          onClick={() => setOpen(!open)}
          aria-label="Appearance"
          aria-haspopup="menu"
          aria-expanded={open}
        />
      </div>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Appearance"
          className="absolute right-0 top-full mt-[8px] z-[45] min-w-[240px] p-[4px]
            bg-[var(--surface)] border border-[var(--line)] rounded-[10px]
            shadow-[var(--shadow-overlay)] flex flex-col"
        >
          {/* THEME Group */}
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] px-[12px] pt-[8px] pb-[4px]">
            THEME
          </div>
          {THEMES.map((t, idx) => {
            const isSelected = theme === t.id;
            const isFocused = focusedIndex === idx;
            const swatchBg = resolvedMode === 'dark' ? t.swatchDark : t.swatchLight;
            const swatchPaper = resolvedMode === 'dark' ? (t.id === 'washi' ? '#0F0F0D' : '#141414') : (t.id === 'washi' ? '#F7F5F0' : '#F2F2F0');
            return (
              <button
                key={t.id}
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => { t.action = () => setTheme(t.id); t.action(); }}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`w-full h-[32px] px-[12px] rounded-[6px] flex items-center gap-[12px]
                  text-[13px] transition-colors duration-[120ms]
                  ${isFocused ? 'bg-[var(--well)] text-[var(--ink)]' : 'text-[var(--ink-2)]'}
                  outline-none`}
              >
                <div 
                  className="w-[12px] h-[12px] rounded-[2px] border border-[var(--line)] flex-shrink-0"
                  style={{ backgroundColor: swatchBg, borderColor: resolvedMode === 'dark' ? '#34322D' : '#E6E2D9' }} 
                />
                <span className="flex-1 text-left flex items-center gap-[6px]">
                  <span className={isSelected ? 'font-medium text-[var(--ink)]' : 'font-normal'}>{t.label}</span>
                  {t.kanji && <span className="font-serif text-[14px] text-[var(--ink-3)]">{t.kanji}</span>}
                </span>
                {isSelected && <Check className="w-[16px] h-[16px] text-[var(--ink)] shrink-0" strokeWidth={2} />}
              </button>
            );
          })}

          <div className="h-px bg-[var(--line)] mx-[4px] my-[4px]" />

          {/* MODE Group */}
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] px-[12px] pt-[8px] pb-[4px]">
            MODE
          </div>
          <div className="flex bg-[var(--well)] rounded-[8px] p-[2px] mx-[4px] mb-[4px]">
            {['light', 'dark', 'system'].map((m, idxOffset) => {
              const idx = THEMES.length + idxOffset;
              const isSelected = mode === m;
              const isFocused = focusedIndex === idx;
              let MIcon = m === 'light' ? Sun : (m === 'dark' ? Moon : Monitor);
              const label = m.charAt(0).toUpperCase() + m.slice(1);
              return (
                <button
                  key={m}
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => setMode(m)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`flex-1 h-[28px] rounded-[6px] flex items-center justify-center gap-[4px] px-[2px]
                    text-[11px] font-medium transition-colors duration-[120ms] outline-none
                    ${isSelected ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm' : 'text-[var(--ink-2)]'}
                    ${isFocused && !isSelected ? 'text-[var(--ink)] bg-[var(--surface)]/50' : ''}
                  `}
                >
                  <MIcon className="w-[14px] h-[14px] shrink-0" strokeWidth={1.5} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
