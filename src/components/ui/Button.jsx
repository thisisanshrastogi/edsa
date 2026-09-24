import React from 'react';

export function Button({ variant = 'primary', icon: Icon, children, onClick, disabled, className = '' }) {
  const base = "inline-flex items-center justify-center font-sans transition-colors duration-120 outline-none";
  const variants = {
    primary: "h-[40px] px-[16px] bg-[var(--ink)] text-[var(--paper)] text-[14px] font-medium rounded-[10px] hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2",
    secondary: "h-[40px] px-[16px] bg-transparent border border-[var(--line-strong)] text-[var(--ink)] text-[14px] font-normal rounded-[10px] hover:bg-[var(--well)] disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2",
    text: "h-auto text-[13px] text-[var(--ink-3)] font-normal hover:underline underline-offset-[3px] disabled:opacity-40 focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4 mr-[8px] stroke-[1.5px] shrink-0" />}
      {children}
    </button>
  );
}
