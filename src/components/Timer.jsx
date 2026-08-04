import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, ChevronDown } from 'lucide-react';

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

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-neutral-400 font-medium hidden sm:inline-block">
        Press <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md mx-1 font-sans text-[10px]">⌘B</kbd> to exit Focus Mode
      </span>
      <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-sm transition-colors" ref={dropdownRef}>
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <TimerIcon className="w-4 h-4 text-neutral-400" />
          <span className="text-sm font-medium font-mono text-neutral-700 w-11 text-center">
            {display}
          </span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>
        
        {showOptions && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden py-1 z-50 min-w-[120px]">
            {[15, 25, 45].map((m) => (
              <button 
                key={m} 
                onClick={() => setTime(m)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${duration === m ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
              >
                {m} Minutes
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center border-l border-neutral-200 pl-2 ml-1 gap-1">
          <button onClick={toggle} className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={reset} className="p-1 hover:bg-neutral-100 rounded text-neutral-500">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
