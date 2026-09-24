import { forwardRef } from 'react';
import { Kbd } from './Chips';

export const Input = forwardRef(({ icon: Icon, kbd, className = '', ...props }, ref) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {Icon && <Icon className="absolute left-[12px] w-4 h-4 text-[var(--ink-icon)] stroke-[1.5px] pointer-events-none" />}
      <input
        ref={ref}
        className={`w-full h-[40px] rounded-[10px] bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--ink)] text-[14px] font-sans placeholder-[var(--ink-icon)] outline-none focus:border-[var(--ink)] transition-colors duration-120 ${Icon ? 'pl-[36px]' : 'pl-[12px]'} ${kbd && !props.value ? 'pr-[40px]' : 'pr-[12px]'}`}
        {...props}
      />
      {kbd && !props.value && (
        <div className="absolute right-[12px] pointer-events-none">
          <Kbd>{kbd}</Kbd>
        </div>
      )}
    </div>
  );
});
