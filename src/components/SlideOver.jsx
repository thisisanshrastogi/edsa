import { useState, useEffect, useRef } from 'react';
import { X, ArrowUp, ArrowDown, ExternalLink, Bookmark, Flag, Play } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { Button } from './ui/Button';
import { Kbd } from './ui/Chips';

const GRADE_MAP = {
  1: { label: 'Again', dot: 'bg-[var(--grade-again-text)]' },
  2: { label: 'Hard', dot: 'bg-[var(--grade-hard-text)]' },
  3: { label: 'Good', dot: 'bg-[var(--grade-good-text)]' },
  4: { label: 'Easy', dot: 'bg-[var(--grade-easy-text)]' },
};

export default function SlideOver({ problem, store, onClose, onNext, onPrev, hasNext, hasPrev }) {
  const [note, setNote] = useState(store.notes[problem.id] || "");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const saveTimeoutRef = useRef(null);
  const panelRef = useRef(null);
  const srs = store.srsData?.[problem.id];
  const history = store.srsHistory?.[problem.id] || [];

  const isBookmarked = store.bookmarks[problem.id];
  const isStruggled = store.struggled?.[problem.id];

  useEffect(() => {
    setNote(store.notes[problem.id] || "");
    setSaveStatus("Saved");
  }, [problem.id, store.notes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowUp' && onPrev) onPrev();
      if (e.key === 'ArrowDown' && onNext) onNext();
      
      // We don't want to capture B/R if the user is typing in the notes
      const isTyping = e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT';
      if (!isTyping) {
        if (e.key.toLowerCase() === 'b') store.toggleBookmark(problem.id);
        if (e.key.toLowerCase() === 'r') store.toggleStruggled(problem.id);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, problem.id, store]);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    setSaveStatus("Saving…");
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      store.updateNote(problem.id, val);
      setSaveStatus("Saved");
    }, 800);
  };

  const handleNoteBlur = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    store.updateNote(problem.id, note);
    setSaveStatus("Saved");
  };

  const getSrsStats = () => {
    if (!srs) return { next: '-', interval: '-', ease: '-' };
    
    const now = Date.now();
    const isDue = srs.due <= now;
    
    let nextStr = '-';
    if (isDue) {
      nextStr = 'Due now';
    } else {
      const days = Math.ceil((srs.due - now) / (1000 * 60 * 60 * 24));
      nextStr = `in ${days}d`;
    }
    
    return {
      next: nextStr,
      interval: `${Math.round(srs.interval)} days`,
      ease: srs.ease.toFixed(2),
      isDue
    };
  };

  const stats = getSrsStats();

  const tierId = problem.tier.toString().padStart(2, '0');

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-[var(--scrim)] backdrop-blur-[4px] transition-opacity animate-fade-in"
        style={{ animationDuration: '280ms' }}
        onClick={onClose}
      />
      <div 
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-[41] w-[min(560px,100vw)] bg-[var(--surface)] border-l border-[var(--line)] shadow-[var(--shadow-overlay)] flex flex-col transform transition-transform duration-[280ms] ease-[var(--ease)] translate-x-0"
        style={{ animation: 'slideInRight 280ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
      >
        {/* Top bar */}
        <div className="h-[56px] px-[24px] border-b border-[var(--line)] flex items-center justify-between shrink-0">
          <div className="font-mono text-[11px] leading-[1.3] uppercase tracking-[0.08em] text-[var(--ink-3)] truncate mr-[16px]">
            TIER {tierId} / {problem.pattern.toUpperCase()}
          </div>
          <div className="flex items-center gap-[4px] shrink-0">
            <IconButton icon={ArrowUp} onClick={onPrev} disabled={!hasPrev} aria-label="Previous problem" className={!hasPrev ? 'opacity-30' : ''} />
            <IconButton icon={ArrowDown} onClick={onNext} disabled={!hasNext} aria-label="Next problem" className={!hasNext ? 'opacity-30' : ''} />
            <div className="w-[1px] h-[16px] bg-[var(--line-strong)] mx-[4px]"></div>
            <IconButton icon={X} onClick={onClose} aria-label="Close" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[32px] space-y-[24px]">
          
          {/* Heading */}
          <div>
            <h2 className="font-serif text-[32px] leading-[1.15] tracking-[-0.01em] text-[var(--ink)]">
              {problem.title}
            </h2>
            <div className="font-mono text-[12px] leading-[1.4] text-[var(--ink-3)] mt-[8px]">
              {problem.difficulty} · {problem.isCanonical && 'Core · '} {problem.companies ? problem.companies.join(', ') : ''}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-[8px]">
            <Button className="flex-1" icon={Play} onClick={() => {
              store.recordAttempt(problem.id, 3); // simplistic "Review now"
            }}>
              Review now
            </Button>
            <Button variant="secondary" className="flex-1" icon={ExternalLink} onClick={() => window.open(problem.url, '_blank')}>
              Open on LeetCode
            </Button>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-[8px]">
            <button 
              onClick={() => store.toggleBookmark(problem.id)}
              className={`h-[48px] rounded-[10px] px-[16px] flex items-center border outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 transition-colors duration-120
                ${isBookmarked ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)] bg-transparent hover:border-[var(--line-strong)] text-[var(--ink)]'}
              `}
            >
              <Bookmark className={`w-[16px] h-[16px] stroke-[1.5px] ${isBookmarked ? 'text-[var(--paper)] fill-current' : 'text-[var(--ink)]'}`} />
              <span className="font-sans text-[14px] ml-[8px] flex-1 text-left">Bookmark</span>
              <Kbd>B</Kbd>
            </button>
            <button 
              onClick={() => store.toggleStruggled(problem.id)}
              className={`h-[48px] rounded-[10px] px-[16px] flex items-center border outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 transition-colors duration-120
                ${isStruggled ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)] bg-transparent hover:border-[var(--line-strong)] text-[var(--ink)]'}
              `}
            >
              <Flag className={`w-[16px] h-[16px] stroke-[1.5px] ${isStruggled ? 'text-[var(--paper)] fill-current' : 'text-[var(--ink)]'}`} />
              <span className="font-sans text-[14px] ml-[8px] flex-1 text-left">Needs revision</span>
              <Kbd>R</Kbd>
            </button>
          </div>

          {/* SRS card */}
          <div className="bg-[var(--well)] rounded-[16px] p-[20px]">
            <div className="grid grid-cols-3 gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <span className="font-sans text-[13px] text-[var(--ink-3)] leading-[1.45]">Next review</span>
                <span className={`font-mono text-[15px] font-medium leading-[1.35] ${stats.isDue ? 'text-[var(--signal)]' : 'text-[var(--ink)]'}`}>{stats.next}</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="font-sans text-[13px] text-[var(--ink-3)] leading-[1.45]">Interval</span>
                <span className="font-mono text-[15px] font-medium leading-[1.35] text-[var(--ink)]">{stats.interval}</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="font-sans text-[13px] text-[var(--ink-3)] leading-[1.45]">Ease</span>
                <span className="font-mono text-[15px] font-medium leading-[1.35] text-[var(--ink)]">{stats.ease}</span>
              </div>
            </div>
            
            {history.length > 0 && (
              <div className="mt-[16px] flex flex-wrap gap-[8px]">
                {history.slice(-5).map((attempt, i) => {
                  const grade = GRADE_MAP[attempt.grade];
                  return (
                    <div key={i} className="h-[24px] px-[8px] rounded-[6px] bg-[var(--surface)] border border-[var(--line)] flex items-center gap-[6px]">
                      <div className={`w-[6px] h-[6px] rounded-full ${grade.dot}`}></div>
                      <span className="font-mono text-[12px] text-[var(--ink-2)]">{grade.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="font-sans font-medium text-[14px] text-[var(--ink)]">Notes</span>
              <span className="font-mono text-[12px] text-[var(--ink-3)]">{saveStatus}</span>
            </div>
            <textarea
              value={note}
              onChange={handleNoteChange}
              onBlur={handleNoteBlur}
              placeholder="Add your notes, solution ideas, or things to remember..."
              className="w-full min-h-[280px] p-[16px] rounded-[10px] bg-[var(--paper)] border border-[var(--line)] text-[var(--ink)] font-mono text-[13px] leading-[1.7] placeholder-[var(--ink-icon)] outline-none focus:border-[var(--ink)] resize-y"
            />
          </div>

        </div>
      </div>
    </>
  );
}
