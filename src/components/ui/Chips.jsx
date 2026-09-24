import React from 'react';

export function FilterChip({ active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-[40px] rounded-full px-[16px] text-[13px] font-sans transition-colors duration-120 outline-none flex items-center
        ${active ? 'bg-[var(--ink)] border border-[var(--ink)] text-[var(--paper)]' : 'bg-transparent border border-[var(--line-strong)] text-[var(--ink-2)]'}
        focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function DueChip({ children, className = '' }) {
  return (
    <span className={`h-[24px] px-[8px] rounded-full font-mono text-[12px] bg-[var(--signal-bg)] text-[var(--signal)] flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
}

export function Kbd({ children, className = '' }) {
  return (
    <span className={`min-w-[20px] h-[20px] px-[6px] rounded-[6px] font-mono text-[11px] bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`min-w-[20px] h-[20px] px-[6px] rounded-[6px] font-mono text-[12px] bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
}
