import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronRight, Moon, Sun, Target, Calendar, Bookmark, Flag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Kbd } from './ui/Chips';

export default function CommandPalette({ isOpen, onClose, store, data, setActiveTier, onSelectProblem }) {
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
  
  const results = useMemo(() => {
    const res = [];
    const q = query.toLowerCase();
    
    // Commands
    const commands = [];
    if ('toggle dark mode theme'.includes(q)) commands.push({ type: 'action', title: 'Toggle theme', icon: store.theme === 'dark' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>, action: () => store.toggleTheme() });
    if ('toggle compact mode'.includes(q)) commands.push({ type: 'action', title: 'Toggle compact mode', icon: <Target className="w-4 h-4"/>, action: () => store.toggleCompactMode() });
    if ('toggle focus mode'.includes(q)) commands.push({ type: 'action', title: 'Toggle focus mode', icon: <Target className="w-4 h-4"/>, action: () => store.toggleFocusMode(), kbd: '⌘B' });
    if ('go to today due'.includes(q)) commands.push({ type: 'action', title: 'Go to Today', icon: <Calendar className="w-4 h-4"/>, action: () => { navigate('/due'); onClose(); } });
    if ('go to bookmarks saved'.includes(q)) commands.push({ type: 'action', title: 'Go to Bookmarks', icon: <Bookmark className="w-4 h-4"/>, action: () => { navigate('/bookmarks'); onClose(); } });
    if ('go to needs revision flagged'.includes(q)) commands.push({ type: 'action', title: 'Go to Needs revision', icon: <Flag className="w-4 h-4"/>, action: () => { navigate('/revision'); onClose(); } });
    if ('go to guide help'.includes(q)) commands.push({ type: 'action', title: 'Go to Guide', icon: <Info className="w-4 h-4"/>, action: () => { navigate('/help'); onClose(); } });
    
    if (commands.length > 0) res.push({ group: 'Commands', items: commands });

    // Tiers
    const tiers = [];
    Object.entries(data.tierMeta).forEach(([id, meta]) => {
      if (meta.name.toLowerCase().includes(q) || `tier ${id}`.includes(q)) {
        tiers.push({ type: 'tier', title: `Tier ${id}: ${meta.name}`, id, action: () => { setActiveTier(id); navigate('/'); onClose(); } });
      }
    });
    if (tiers.length > 0) res.push({ group: 'Tiers', items: tiers });

    // Problems
    if (q.trim() !== '') {
      const matchedProblems = allProblems.filter(p => p.title.toLowerCase().includes(q) || (p.companies && p.companies.some(c => c.toLowerCase().includes(q))));
      const problems = matchedProblems.slice(0, 10).map(p => ({
        type: 'problem', title: p.title, tier: p.tier, problem: p, action: () => { setActiveTier(String(p.tier)); onSelectProblem?.(p.id); navigate('/'); onClose(); }
      }));
      if (problems.length > 0) res.push({ group: 'Problems', items: problems });
    }

    return res;
  }, [query, store, data.tierMeta, allProblems, navigate, onClose]);

  const flatResults = useMemo(() => results.flatMap(g => g.items), [results]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % flatResults.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + flatResults.length) % flatResults.length);
      }
      if (e.key === 'Enter' && flatResults[selectedIndex]) {
        e.preventDefault();
        flatResults[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, onClose]);

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-[50] flex justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-[var(--scrim)] backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative w-[min(640px,calc(100vw-32px))] bg-[var(--surface)] rounded-[16px] border border-[var(--line)] shadow-[var(--shadow-overlay)] flex flex-col max-h-[80vh] overflow-hidden z-[51]">
        
        {/* Input row */}
        <div className="flex items-center h-[56px] px-[20px] border-b border-[var(--line)] shrink-0">
          <Search className="w-[16px] h-[16px] stroke-[1.5px] text-[var(--ink-icon)] shrink-0" />
          <input 
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search problems, tiers, or commands..."
            className="flex-1 bg-transparent border-none outline-none font-sans text-[16px] text-[var(--ink)] placeholder-[var(--ink-icon)] ml-[12px]"
          />
          <Kbd>esc</Kbd>
        </div>
        
        {/* Results */}
        {results.length > 0 && (
          <div className="flex-1 overflow-y-auto p-[8px]">
            {results.map((group, gIdx) => (
              <div key={gIdx} className="mb-[8px] last:mb-0">
                <div className="px-[12px] pt-[12px] pb-[4px]">
                  <span className="font-mono text-[11px] leading-[1.3] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                    {group.group}
                  </span>
                </div>
                {group.items.map((item) => {
                  const isSelected = globalIndex === selectedIndex;
                  const currentIndex = globalIndex++;
                  return (
                    <div 
                      key={currentIndex}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      onClick={() => item.action()}
                      className={`flex items-center justify-between h-[40px] px-[12px] rounded-[10px] cursor-pointer transition-colors duration-120
                        ${isSelected ? 'bg-[var(--well)] text-[var(--ink)]' : 'text-[var(--ink-2)] hover:bg-[var(--well)] hover:text-[var(--ink)]'}
                      `}
                    >
                      <div className="flex items-center gap-[12px]">
                        {item.icon ? item.icon : <ChevronRight className="w-4 h-4 stroke-[1.5px]" />}
                        <span className={`font-sans text-[14px] ${isSelected ? 'font-medium text-[var(--ink)]' : 'font-normal text-[var(--ink-2)]'}`}>
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        {item.type === 'problem' && (
                          <>
                            <Badge>T{item.tier}</Badge>
                            {item.problem.isCanonical && <Badge>CORE</Badge>}
                          </>
                        )}
                        {item.kbd && <Kbd>{item.kbd}</Kbd>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="h-[36px] px-[16px] border-t border-[var(--line)] shrink-0 flex items-center bg-[var(--surface)]">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
            ↑↓ Navigate · ↵ Open · Esc Close
          </span>
        </div>
      </div>
    </div>
  );
}
