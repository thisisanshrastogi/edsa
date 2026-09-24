import { useState, useRef } from 'react';
import { Bookmark, Flag, FileText } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { ProgressRing } from './ui/Progress';
import { DueChip } from './ui/Chips';
import GradePicker from './GradePicker';

export default function ProblemRow({ problem, store, onClick, compact = false }) {
  const isCompleted = store.completed[problem.id];
  const isBookmarked = store.bookmarks[problem.id];
  const isStruggled = store.struggled?.[problem.id];
  const note = store.notes[problem.id] || "";
  const hasNote = note.trim().length > 0;
  const srs = store.srsData?.[problem.id];
  const [showPicker, setShowPicker] = useState(false);
  const rowRef = useRef(null);

  const getDueStatus = () => {
    if (!isCompleted || !srs) return null;
    const now = Date.now();
    const isDueToday = new Date(srs.due).toDateString() === new Date().toDateString();
    const isLate = srs.due < now && !isDueToday;
    const daysLate = Math.floor((now - srs.due) / (1000 * 60 * 60 * 24));
    const daysUntil = Math.max(1, Math.ceil((srs.due - now) / (1000 * 60 * 60 * 24)));

    if (isDueToday) {
      return <DueChip>Due today</DueChip>;
    } else if (isLate) {
      return <DueChip>{daysLate}d late</DueChip>;
    } else {
      return <span className="font-mono text-[12px] text-[var(--ink-3)]">in {daysUntil}d</span>;
    }
  };

  return (
    <div ref={rowRef} id={`problem-${problem.id}`} className={`flex flex-col rounded-[10px] transition-colors duration-120 outline-none
      ${showPicker ? 'bg-[var(--surface)] border-[var(--line)] border' : 'border border-transparent hover:bg-[var(--surface)] focus-within:bg-[var(--surface)] focus-within:border-[var(--line)]'}
    `}>
      <div 
        className={`flex items-center px-[8px] group cursor-pointer ${compact ? 'h-[44px]' : 'h-[56px]'}`}
        onClick={() => setShowPicker(!showPicker)}
      >
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setShowPicker(!showPicker);
          }}
          className="w-[44px] h-[44px] shrink-0 flex items-center justify-center outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] rounded-[10px]"
          aria-label={isCompleted ? "Completed, click to grade again" : "Mark completed"}
        >
          <ProgressRing percent={isCompleted ? 100 : 0} completed={isCompleted} />
        </button>

        <div className="flex flex-col justify-center flex-1 min-w-0 pr-[8px]">
          <div className="flex items-center gap-[8px]">
            <a 
              href={problem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`text-[15px] font-medium tracking-[-0.01em] truncate hover:underline underline-offset-[3px] outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] rounded-[4px]
                ${isCompleted ? 'text-[var(--ink-3)]' : 'text-[var(--ink)]'}`}
            >
              {problem.title}
            </a>
            {getDueStatus()}
          </div>
          {!compact && (
            <div className="font-mono text-[12px] text-[var(--ink-3)] flex items-center gap-[4px] mt-[2px] truncate">
              <span>{problem.difficulty}</span>
              {problem.isCanonical && <span>· Core</span>}
              {problem.companies?.length > 0 && <span className="truncate max-w-[120px] md:max-w-[200px]">· {problem.companies.join(', ')}</span>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-120">
          <IconButton 
            icon={FileText} 
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} 
            active={hasNote} 
            aria-label="Notes" 
            className={hasNote ? 'sm:opacity-100 !opacity-100' : ''}
          />
          <IconButton 
            icon={Flag} 
            onClick={(e) => { e.stopPropagation(); store.toggleStruggled(problem.id); }} 
            active={isStruggled} 
            aria-label="Needs revision" 
            className={isStruggled ? 'sm:opacity-100 !opacity-100' : ''}
          />
          <IconButton 
            icon={Bookmark} 
            onClick={(e) => { e.stopPropagation(); store.toggleBookmark(problem.id); }} 
            active={isBookmarked} 
            aria-label="Bookmark" 
            className={isBookmarked ? 'sm:opacity-100 !opacity-100' : ''}
          />
        </div>
      </div>

      {/* Expanded Picker */}
      {showPicker && (
        <GradePicker 
          onSelect={(grade) => {
            store.recordAttempt(problem.id, grade);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
          isCompleted={isCompleted}
          onMarkUnsolved={() => {
            store.toggleComplete(problem.id);
            setShowPicker(false);
          }}
          onMarkSolved={() => {
            if (!isCompleted) store.toggleComplete(problem.id);
            if (srs) store.removeSrs(problem.id);
            setShowPicker(false);
          }}
          parentRef={rowRef}
          srs={srs}
        />
      )}
    </div>
  );
}
