import React from 'react';

export function PageHeader({ breadcrumb, title, lede, metaSlot, className = '' }) {
  return (
    <div className={`pt-[48px] pb-[32px] shrink-0 ${className}`}>
      <div className="font-mono text-[11px] leading-[1.3] uppercase tracking-[0.08em] text-[var(--ink-3)]">
        {breadcrumb}
      </div>
      <h1 className="mt-[12px] font-serif text-[40px] leading-[1.05] md:text-[64px] md:leading-[1.0] tracking-[-0.01em] text-[var(--ink)]">
        {title}
      </h1>
      <p className="mt-[16px] max-w-[560px] font-sans text-[16px] leading-[1.6] text-[var(--ink-2)]">
        {lede}
      </p>
      {metaSlot && (
        <div className="mt-[24px]">
          {metaSlot}
        </div>
      )}
    </div>
  );
}
