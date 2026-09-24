import React from 'react';

export function GroupHeading({ children, className = '' }) {
  return (
    <h2 className={`font-serif text-[24px] leading-[1.25] text-[var(--ink)] ${className}`}>
      {children}
    </h2>
  );
}

export function SectionLabel({ label, count, className = '' }) {
  return (
    <div className={`flex items-center gap-[4px] ${className}`}>
      <span className="font-mono text-[11px] leading-[1.3] uppercase tracking-[0.08em] text-[var(--ink-3)]">
        {label}
      </span>
      {count !== undefined && (
        <span className="font-mono text-[11px] leading-[1.3] uppercase tracking-[0.08em] text-[var(--ink-3)]">
          · {count}
        </span>
      )}
      <div className="flex-1 h-px bg-[var(--line)] ml-[12px]"></div>
    </div>
  );
}
