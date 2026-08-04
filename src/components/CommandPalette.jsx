import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, Moon, Sun, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose, store, data }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allProblems = data.problems || [];
  
  const results = [];
  
  if (query.trim() === '') {
    results.push({ type: 'action', title: 'Toggle Dark Mode', icon: store.theme === 'dark' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>, action: () => store.toggleTheme() });
    results.push({ type: 'action', title: 'Toggle Compact Mode', icon: <Target className="w-4 h-4"/>, action: () => store.toggleCompactMode() });
    results.push({ type: 'action', title: 'Toggle Focus Mode', icon: <Target className="w-4 h-4"/>, action: () => store.toggleFocusMode() });
  } else {
    const q = query.toLowerCase();
    
    // Commands
    if ('dark mode'.includes(q) || 'theme'.includes(q)) {
      results.push({ type: 'action', title: 'Toggle Dark Mode', icon: <Sun className="w-4 h-4"/>, action: () => store.toggleTheme() });
    }
    
    // Tiers
    Object.entries(data.tierMeta).forEach(([id, meta]) => {
      if (meta.name.toLowerCase().includes(q) || `tier ${id}`.includes(q)) {
        results.push({ type: 'tier', title: `Tier ${id}: ${meta.name}`, id, action: () => { navigate('/'); onClose(); } });
      }
    });

    // Problems
    const matchedProblems = allProblems.filter(p => p.title.toLowerCase().includes(q) || (p.companies && p.companies.some(c => c.toLowerCase().includes(q))));
    matchedProblems.slice(0, 10).forEach(p => {
      results.push({ type: 'problem', title: p.title, tier: p.tier, problem: p, action: () => window.open(p.url, '_blank') });
    });
  }

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % results.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + results.length) % results.length);
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].action();
        if (results[selectedIndex].type !== 'action') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        <div className="flex items-center px-4 py-3 border-b border-neutral-200">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input 
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search problems, commands, or jump to tiers..."
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-400"
          />
          <span className="text-xs font-medium text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">ESC</span>
        </div>
        
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((item, i) => (
              <div 
                key={i}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => { item.action(); if (item.type !== 'action') onClose(); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${i === selectedIndex ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50'}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon ? item.icon : <ChevronRight className="w-4 h-4 opacity-50" />}
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                {item.type === 'problem' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                    Tier {item.tier}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
