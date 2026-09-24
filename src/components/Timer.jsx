import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';

export default function Timer() {
  const [duration, setDuration] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };
  const setTime = (mins) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
    setShowOptions(false);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isFinished = timeLeft === 0;

  return (
    <div className="absolute top-[16px] right-[24px] flex items-center gap-[12px] z-20">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)] hidden sm:inline-block">
        FOCUS · ⌘B TO EXIT
      </span>
      <div className="relative" ref={dropdownRef}>
        <div className="h-[32px] px-[4px] rounded-full flex items-center bg-transparent border border-[var(--line-strong)]">
          <button onClick={toggle} className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[var(--ink-icon)] hover:bg-[var(--well)] hover:text-[var(--ink)] transition-colors duration-120 outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2">
            {isActive ? <Pause className="w-[14px] h-[14px] stroke-[1.5px]" /> : <Play className="w-[14px] h-[14px] stroke-[1.5px] fill-current" />}
          </button>
          
          <span className={`w-[44px] text-center font-mono text-[14px] ${isFinished ? 'text-[var(--signal)]' : 'text-[var(--ink)]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {display}
          </span>
          
          <button onClick={reset} className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[var(--ink-icon)] hover:bg-[var(--well)] hover:text-[var(--ink)] transition-colors duration-120 outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2">
            <RotateCcw className="w-[14px] h-[14px] stroke-[1.5px]" />
          </button>
          <button onClick={() => setShowOptions(!showOptions)} className="w-[24px] h-[24px] flex items-center justify-center rounded-full text-[var(--ink-icon)] hover:bg-[var(--well)] hover:text-[var(--ink)] transition-colors duration-120 outline-none focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2">
            <ChevronDown className="w-[14px] h-[14px] stroke-[1.5px]" />
          </button>
        </div>
        
        {showOptions && (
          <div className="absolute top-[100%] right-0 mt-[8px] bg-[var(--surface)] border border-[var(--line)] shadow-[var(--shadow-overlay)] rounded-[10px] p-[4px] min-w-[120px] z-[45]">
            {[15, 25, 45].map((m) => (
              <button 
                key={m} 
                onClick={() => setTime(m)}
                className={`w-full text-left h-[32px] px-[12px] rounded-[6px] text-[13px] font-sans transition-colors duration-120 outline-none
                  ${duration === m ? 'bg-[var(--well)] text-[var(--ink)]' : 'text-[var(--ink-2)] hover:bg-[var(--well)]'}
                  focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2
                `}
              >
                {m} minutes
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
