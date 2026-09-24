import { useEffect, useRef } from 'react';
import { Button } from './ui/Button';

const grades = [
  { value: 1, label: 'Again', sub: '<1d', colorClass: 'border-grade-again-line bg-grade-again-bg text-grade-again-text' },
  { value: 2, label: 'Hard', sub: '2d', colorClass: 'border-grade-hard-line bg-grade-hard-bg text-grade-hard-text' },
  { value: 3, label: 'Good', sub: '4d', colorClass: 'border-grade-good-line bg-grade-good-bg text-grade-good-text' },
  { value: 4, label: 'Easy', sub: '9d', colorClass: 'border-grade-easy-line bg-grade-easy-bg text-grade-easy-text' }
];

export default function GradePicker({ onSelect, onClose, isCompleted, onMarkUnsolved, onMarkSolved, parentRef, srs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (['1', '2', '3', '4'].includes(e.key)) {
        onSelect(parseInt(e.key));
      }
    };
    const handleClickOutside = (e) => {
      // If the click is inside the parent ProblemRow, ignore it. Let the parent's onClick handle toggling.
      if (parentRef && parentRef.current && parentRef.current.contains(e.target)) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSelect, onClose, parentRef]);

  return (
    <div ref={containerRef} className="pl-[16px] md:pl-[52px] pr-[16px] py-[12px] border-t border-[var(--line)] flex flex-col xl:flex-row xl:items-center gap-[12px] xl:gap-[16px] animate-fade-in" style={{ animationDuration: '200ms' }}>
      <div className="flex justify-between items-center w-full xl:w-auto xl:shrink-0">
        <div className="font-sans text-[13px] text-[var(--ink-3)]">How did it feel?</div>
        {/* On mobile, show cancel button in the top right to save space */}
        <div className="xl:hidden">
          <Button variant="text" onClick={isCompleted ? onMarkUnsolved : onClose}>
            {isCompleted ? 'Mark unsolved' : 'Cancel'}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-[8px] w-full">
        {onMarkSolved && (
          <button
            onClick={onMarkSolved}
            className={`h-[48px] rounded-[10px] border flex flex-col items-center justify-center transition-colors duration-120 outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 col-span-2 sm:col-span-1 text-[var(--ink)] ${isCompleted && !srs ? '!border-[var(--ink-2)] bg-[var(--surface)]' : 'border-[var(--line)] bg-[var(--well)] hover:border-[var(--line-strong)]'}`}
          >
            <span className={`font-sans text-[13px] leading-[1.2] ${isCompleted && !srs ? 'font-bold' : 'font-medium'}`}>Done</span>
            <span className={`font-mono text-[12px] leading-[1.2] mt-[2px] ${isCompleted && !srs ? 'opacity-100 font-semibold' : 'opacity-80'}`}>never</span>
          </button>
        )}
        {grades.map((g) => {
          const isActive = srs?.lastGrade === g.label.toUpperCase();
          return (
            <button
              key={g.value}
              onClick={() => onSelect(g.value)}
              className={`h-[48px] rounded-[10px] border flex flex-col items-center justify-center transition-all duration-120 hover:opacity-90 outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 ${g.colorClass} col-span-1 ${isActive ? '!border-[var(--ink-2)]' : ''}`}
            >
              <span className={`font-sans text-[13px] leading-[1.2] ${isActive ? 'font-bold' : 'font-medium'}`}>{g.label}</span>
              <span className={`font-mono text-[12px] leading-[1.2] mt-[2px] ${isActive ? 'opacity-100 font-semibold' : 'opacity-80'}`}>{g.sub}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden xl:flex justify-end shrink-0">
        <Button variant="text" onClick={isCompleted ? onMarkUnsolved : onClose}>
          {isCompleted ? 'Mark unsolved' : 'Cancel'}
        </Button>
      </div>
    </div>
  );
}
