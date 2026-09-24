import React from 'react';

export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`h-[40px] bg-[var(--well)] rounded-[10px] p-1 flex items-center shrink-0 ${className}`}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`h-[32px] px-[12px] rounded-[6px] text-[13px] font-medium transition-colors duration-120 outline-none
              ${active 
                ? 'bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)]' 
                : 'border border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]'}
              focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
