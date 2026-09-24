import React from 'react';

export function ProgressBar({ percent, className = '' }) {
  return (
    <div className={`h-[2px] w-full bg-[var(--line)] rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-[var(--ink)] transition-all duration-[200ms]" style={{ width: `${percent}%` }} />
    </div>
  );
}

export function ProgressRing({ percent, completed, className = '' }) {
  const radius = 9.25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={`relative w-[20px] h-[20px] flex items-center justify-center shrink-0 ${className}`}>
      {completed ? (
        <div className="w-full h-full rounded-full bg-[var(--ink)] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="var(--paper)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2.5 5.5 4.5 7.5 8.5 3.5"></polyline>
          </svg>
        </div>
      ) : (
        <svg className="w-[20px] h-[20px] -rotate-90">
          <circle cx="10" cy="10" r={radius} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <circle cx="10" cy="10" r={radius} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-[200ms]" />
        </svg>
      )}
    </div>
  );
}
