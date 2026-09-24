import React from 'react';
import { Button } from './Button';

export function EmptyState({ icon: Icon, message, actionText, onAction, className = '' }) {
  return (
    <div className={`py-[64px] flex flex-col items-center justify-center text-center ${className}`}>
      <Icon className="w-[20px] h-[20px] stroke-[1.5px] text-[var(--ink-icon)]" />
      <div className="mt-[12px] font-sans text-[14px] leading-[1.4] text-[var(--ink-3)]">
        {message}
      </div>
      {actionText && onAction && (
        <div className="mt-[8px]">
          <Button variant="text" onClick={onAction}>{actionText}</Button>
        </div>
      )}
    </div>
  );
}
