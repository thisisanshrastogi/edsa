import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/Input';
import { SegmentedControl } from './ui/SegmentedControl';
import { Search, SlidersHorizontal, Check, X } from 'lucide-react';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function FilterBar({
    filterText, setFilterText,
    difficultyFilter, setDifficultyFilter,
    showCoreOnly, setShowCoreOnly,
    showRevisionOnly, setShowRevisionOnly,
    hideSolved, setHideSolved,
    onClear,
}) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);
    const sentinelRef = useRef(null);

    // Border appears once the bar is stuck (one observer, cleaned up properly)
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Close on outside click / Escape
    useEffect(() => {
        if (!open) return;
        const onDown = (e) => { if (!menuRef.current?.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const toggles = [
        { label: 'Core only', value: showCoreOnly, set: setShowCoreOnly },
        { label: 'Needs revision', value: showRevisionOnly, set: setShowRevisionOnly },
        { label: 'Hide solved', value: hideSolved, set: setHideSolved },
    ];

    const activeChips = [
        difficultyFilter !== 'All' && { label: difficultyFilter, clear: () => setDifficultyFilter('All') },
        ...toggles.filter(t => t.value).map(t => ({ label: t.label, clear: () => t.set(false) })),
    ].filter(Boolean);

    return (
        <>
            <div ref={sentinelRef} aria-hidden className="h-px" />
            <div
                className={`sticky top-0 z-10 bg-[var(--paper)] py-[8px] mb-[32px] border-b transition-colors duration-[120ms]
          ${scrolled ? 'border-[var(--line)]' : 'border-transparent'}`}
            >
                <div className="flex items-center gap-[8px]">
                    <div className="flex-1 min-w-0">
                        <Input
                            icon={Search}
                            kbd="/"
                            placeholder="Filter this tier"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Difficulty stays inline on wider screens, moves into the menu on small ones */}
                    <div className="hidden md:block shrink-0">
                        <SegmentedControl options={DIFFICULTIES} value={difficultyFilter} onChange={setDifficultyFilter} />
                    </div>

                    <div className="relative shrink-0" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setOpen(o => !o)}
                            aria-haspopup="true"
                            aria-expanded={open}
                            className={`h-[32px] px-[10px] flex items-center gap-[6px] rounded-[8px] border text-[13px] font-sans
                transition-colors duration-[120ms] outline-none
                focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
                ${open || activeChips.length
                                    ? 'border-[var(--ink)] text-[var(--ink)]'
                                    : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink)]'}`}
                        >
                            <SlidersHorizontal className="w-[14px] h-[14px]" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeChips.length > 0 && (
                                <span className="font-mono text-[11px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center">
                                    {activeChips.length}
                                </span>
                            )}
                        </button>

                        {open && (
                            <div
                                role="menu"
                                className="absolute right-0 top-[calc(100%+6px)] w-[260px] rounded-[10px] border border-[var(--line)]
                  bg-[var(--paper)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] p-[6px]"
                            >
                                <div className="md:hidden p-[6px] pb-[10px] mb-[4px] border-b border-[var(--line)]">
                                    <div className="text-[12px] text-[var(--ink-3)] mb-[6px]">Difficulty</div>
                                    <SegmentedControl options={DIFFICULTIES} value={difficultyFilter} onChange={setDifficultyFilter} />
                                </div>

                                {toggles.map(t => (
                                    <button
                                        key={t.label}
                                        type="button"
                                        role="menuitemcheckbox"
                                        aria-checked={t.value}
                                        onClick={() => t.set(!t.value)}
                                        className="w-full h-[34px] px-[8px] flex items-center gap-[10px] rounded-[6px] text-[14px] font-sans text-left
                      text-[var(--ink-2)] hover:bg-[var(--line)] hover:text-[var(--ink)] outline-none
                      focus-visible:bg-[var(--line)] focus-visible:text-[var(--ink)]"
                                    >
                                        <span className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center
                      ${t.value ? 'bg-[var(--ink)] border-[var(--ink)]' : 'border-[var(--ink-3)]'}`}>
                                            {t.value && <Check className="w-[11px] h-[11px] text-[var(--paper)]" strokeWidth={3} />}
                                        </span>
                                        {t.label}
                                    </button>
                                ))}

                                {activeChips.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => { onClear(); setOpen(false); }}
                                        className="w-full mt-[4px] pt-[8px] pb-[4px] px-[8px] border-t border-[var(--line)] text-left
                      text-[13px] text-[var(--ink-3)] hover:text-[var(--ink)] outline-none focus-visible:text-[var(--ink)]"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active filters wrap instead of scrolling */}
                {activeChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-[6px] mt-[8px]">
                        {activeChips.map(c => (
                            <button
                                key={c.label}
                                type="button"
                                onClick={c.clear}
                                className="h-[24px] pl-[8px] pr-[6px] flex items-center gap-[4px] rounded-full border border-[var(--line)]
                  text-[12px] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink)] outline-none
                  focus-visible:border-[var(--ink)]"
                                aria-label={`Remove ${c.label} filter`}
                            >
                                {c.label}
                                <X className="w-[12px] h-[12px]" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}