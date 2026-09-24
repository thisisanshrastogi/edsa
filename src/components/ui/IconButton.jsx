import React from 'react';

export function IconButton({ icon: Icon, onClick, active, 'aria-label': ariaLabel, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`p-[6px] rounded-[10px] outline-none group shrink-0 ${className}`}
    >
      <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors duration-120
        ${active ? 'bg-[var(--ink)] text-[var(--paper)]' : 'text-[var(--ink-icon)] group-hover:bg-[var(--well)] group-hover:text-[var(--ink)]'}
        group-focus-visible:outline-[1.5px] group-focus-visible:outline-[var(--ink)] group-focus-visible:outline-offset-2
      `}>
        <Icon className={`w-4 h-4 stroke-[1.5px] ${active ? 'fill-current' : 'fill-transparent'}`} />
      </div>
    </button>
  );
}
