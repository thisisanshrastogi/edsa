import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Check, Search, Hash, Star, Folder, FolderOpen, Flag } from 'lucide-react';
import ProblemRow from './ProblemRow';
import Timer from './Timer';
import SlideOver from './SlideOver';

export default function MainContent({ tierId, data, store }) {
  const tierMeta = data.tierMeta[tierId];
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [showCanonicalOnly, setShowCanonicalOnly] = useState(false);
  const [showRevisionOnly, setShowRevisionOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [activePatternId, setActivePatternId] = useState(null);
  const [expandedPatterns, setExpandedPatterns] = useState({});
  const [activeProblem, setActiveProblem] = useState(null);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const diffMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (diffMenuRef.current && !diffMenuRef.current.contains(event.target)) {
        setShowDifficultyMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePattern = (id, forceOpen = false) => {
    setExpandedPatterns(prev => ({
      ...prev,
      [id]: forceOpen ? true : !prev[id]
    }));
  };

  const patternsInTier = useMemo(() => {
    return data.patterns.filter(p => p.tier === parseInt(tierId));
  }, [data.patterns, tierId]);

  const allProblemsInTier = useMemo(() => {
    return data.problems.filter(p => p.tier === parseInt(tierId));
  }, [data.problems, tierId]);

  const totalProblems = allProblemsInTier.length;
  const completedCount = allProblemsInTier.filter(p => store.completed[p.id]).length;
  const progressPercent = totalProblems === 0 ? 0 : Math.round((completedCount / totalProblems) * 100);

  const allCanonicalInTier = allProblemsInTier.filter(p => p.isCanonical);
  const totalCanonical = allCanonicalInTier.length;
  const completedCanonicalCount = allCanonicalInTier.filter(p => store.completed[p.id]).length;
  const canonicalMasteryUnlocked = totalCanonical > 0 && completedCanonicalCount === totalCanonical;

  const easyCompleted = allProblemsInTier.filter(p => p.difficulty === 'Easy' && store.completed[p.id]).length;
  const easyTotal = allProblemsInTier.filter(p => p.difficulty === 'Easy').length;
  const medCompleted = allProblemsInTier.filter(p => p.difficulty === 'Medium' && store.completed[p.id]).length;
  const medTotal = allProblemsInTier.filter(p => p.difficulty === 'Medium').length;
  const hardCompleted = allProblemsInTier.filter(p => p.difficulty === 'Hard' && store.completed[p.id]).length;
  const hardTotal = allProblemsInTier.filter(p => p.difficulty === 'Hard').length;

  const filterProblems = (problems, patternName) => {
    return problems.filter(p => {
      const searchMatch = searchQuery === '' || 
                          p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.companies && p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                          (patternName && patternName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!searchMatch) return false;
      if (difficultyFilter !== 'All' && p.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()) return false;
      if (showCanonicalOnly && !p.isCanonical) return false;
      if (showRevisionOnly && !store.struggled?.[p.id]) return false;
      if (hideCompleted && store.completed[p.id]) return false;
      return true;
    });
  };

  const hasActiveFilters = searchQuery !== '' || difficultyFilter !== 'All' || showCanonicalOnly || showRevisionOnly || hideCompleted;

  const searchInputRef = useRef(null);

  // Intersection Observer for Right Sidebar
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePatternId(entry.target.getAttribute('data-pattern-id'));
          }
        });
      },
      {
        root: container,
        rootMargin: '-10% 0px -50% 0px',
        threshold: 0
      }
    );

    const patternElements = container.querySelectorAll('.pattern-group');
    patternElements.forEach((el) => observer.observe(el));

    return () => {
      patternElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [patternsInTier, tierId, hasActiveFilters]);

  // Auto-expand patterns when filters are active
  useEffect(() => {
    if (hasActiveFilters) {
      const allOpen = {};
      patternsInTier.forEach(p => allOpen[p.id] = true);
      setExpandedPatterns(allOpen);
    } else {
      setExpandedPatterns({});
    }
  }, [hasActiveFilters, patternsInTier]);

  return (
    <div className="flex h-full w-full max-w-7xl mx-auto overflow-hidden">
      {/* Center Content - Scrolls */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 md:p-12 pb-32 space-y-8 md:space-y-10"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-600 shadow-sm">
              <span>Tier {tierId}</span>
            </div>
            {store.focusMode && <Timer />}
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
              {tierMeta.name}
            </h1>
            <p className="text-neutral-500 leading-relaxed max-w-2xl text-lg">
              Master the core concepts and fundamental patterns in this tier.
            </p>
          </div>

          {/* Progress bar */}
          <div 
            className="pt-4 space-y-2 max-w-md"
            title={`🟢 Easy: ${easyCompleted}/${easyTotal} | 🟡 Med: ${medCompleted}/${medTotal} | 🔴 Hard: ${hardCompleted}/${hardTotal}`}
          >
            <div className="flex justify-between items-end text-sm font-medium">
              <div>
                <span className="text-neutral-900 block">Progress</span>
                {totalCanonical > 0 && (
                  canonicalMasteryUnlocked ? (
                    <span className="text-[11px] text-amber-500 font-bold flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> Canonical Mastery Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-normal mt-0.5 flex items-center gap-1">
                      <Star className="w-3 h-3 text-neutral-400" /> {completedCanonicalCount} / {totalCanonical} Canonicals Solved
                    </span>
                  )
                )}
              </div>
              <span className="text-neutral-500">{completedCount} / {totalProblems}</span>
            </div>
            <div className="h-2 w-full bg-neutral-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 md:p-4 flex flex-wrap gap-3 md:gap-4 items-center">
          <div className="relative flex-[1_1_100%] md:flex-[1_1_250px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search problems or companies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-9 pr-14 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300 focus:bg-white transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5">
              <kbd className="font-sans text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5">⌘</kbd>
              <kbd className="font-sans text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5">K</kbd>
            </div>
          </div>
          <div className="flex overflow-x-auto pb-1 md:pb-0 flex-nowrap md:flex-wrap items-center gap-2 md:gap-3 shrink-0 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative shrink-0" ref={diffMenuRef}>
              <button
                onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
                className="flex items-center gap-2 bg-neutral-50/50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-700 font-medium min-w-[120px] justify-between hover:bg-neutral-50 transition-colors"
              >
                <span>{difficultyFilter === 'All' ? 'All Levels' : difficultyFilter}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
              {showDifficultyMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 shadow-xl rounded-xl overflow-hidden py-1 z-50 w-full min-w-[140px]">
                  {['All', 'Easy', 'Medium', 'Hard'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setDifficultyFilter(lvl);
                        setShowDifficultyMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${difficultyFilter === lvl ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-700 hover:bg-neutral-50'}`}
                    >
                      {lvl === 'All' ? 'All Levels' : lvl}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowCanonicalOnly(!showCanonicalOnly)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${showCanonicalOnly ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Star className="w-4 h-4" /> Canonical Only
            </button>

            <button
              onClick={() => setShowRevisionOnly(!showRevisionOnly)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${showRevisionOnly ? 'bg-orange-500 border-orange-500 text-white' : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
            >
              <Flag className="w-4 h-4" /> Revision
            </button>

            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${hideCompleted ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
            >
              Hide Completed
            </button>
          </div>
        </div>

        {/* Patterns List */}
        <div className="space-y-3 md:space-y-4">
          {(() => {
            const visiblePatterns = patternsInTier.filter(pattern => {
              const rawPatternProblems = allProblemsInTier.filter(p => p.patternId === pattern.id);
              const patternProblems = filterProblems(rawPatternProblems, pattern.name);
              if (hasActiveFilters && patternProblems.length === 0) return false;
              if (rawPatternProblems.length === 0) return false;
              return true;
            });

            if (visiblePatterns.length === 0 && hasActiveFilters) {
              return (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-sm">
                  <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No matches found</h3>
                  <p className="text-neutral-500 mb-6">We couldn't find any problems matching your current filters.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setDifficultyFilter('All');
                      setShowCanonicalOnly(false);
                      setShowRevisionOnly(false);
                      setHideCompleted(false);
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              );
            }

            return visiblePatterns.map(pattern => {
              const globalIndex = patternsInTier.findIndex(p => p.id === pattern.id) + 1;
              const rawPatternProblems = allProblemsInTier.filter(p => p.patternId === pattern.id);
              const patternProblems = filterProblems(rawPatternProblems, pattern.name);
              return (
                <div 
                  id={`pattern-${pattern.id}`} 
                  key={pattern.id} 
                  className="scroll-mt-6 pattern-group"
                  data-pattern-id={pattern.id}
                >
                  <PatternGroup 
                    pattern={pattern} 
                    index={globalIndex}
                    problems={patternProblems}
                    totalPatternProblems={rawPatternProblems.length} 
                    store={store}
                    isOpen={expandedPatterns[pattern.id]}
                    onToggle={() => togglePattern(pattern.id)}
                    onRowClick={(p) => {
                      setActiveProblem(p);
                      setIsSlideOverOpen(true);
                    }}
                  />
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Right Sidebar (Table of Contents) - Own Scroll */}
      {!store.focusMode && (
        <div className="hidden xl:flex flex-col w-72 shrink-0 border-l border-neutral-200/60 h-full overflow-hidden">
          <div className="px-6 py-6 border-b border-neutral-200/60 shrink-0">
          <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-400 flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" /> Subtopics
          </h4>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {patternsInTier.map((pattern, index) => {
            const patternProblemCount = allProblemsInTier.filter(p => p.patternId === pattern.id).length;
            if (patternProblemCount === 0) return null;
            
            const completedInPattern = allProblemsInTier.filter(p => p.patternId === pattern.id && store.completed[p.id]).length;
            const isDone = completedInPattern === patternProblemCount && patternProblemCount > 0;
            const isActive = activePatternId === pattern.id;

            return (
              <button 
                key={pattern.id}
                onClick={(e) => {
                  e.preventDefault();
                  // Force expand it if it's not open
                  togglePattern(pattern.id, true);
                  
                  // Wait a tick for the DOM to expand
                  setTimeout(() => {
                    const el = document.getElementById(`pattern-${pattern.id}`);
                    if (el && scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        top: el.offsetTop - 24, // 24px padding
                        behavior: 'smooth'
                      });
                    }
                  }, 50);
                }}
                className={`
                  block w-full text-left text-sm py-2 px-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-white shadow-sm border border-neutral-200 text-neutral-900 font-semibold' : 
                    isDone ? 'text-neutral-400 border border-transparent hover:bg-neutral-100' : 
                    'text-neutral-600 font-medium border border-transparent hover:bg-neutral-100'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`truncate mr-2 ${isDone && !isActive ? 'line-through' : ''}`}>
                    <span className={`font-mono text-[10px] mr-1.5 ${isActive ? 'text-neutral-500' : 'text-neutral-400'}`}>{index + 1}.</span>
                    {pattern.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 transition-colors ${isActive ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    {completedInPattern}/{patternProblemCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}
      <SlideOver 
        isOpen={isSlideOverOpen}
        problem={activeProblem}
        onClose={() => setIsSlideOverOpen(false)}
        store={store}
      />
    </div>
  );
}

function PatternGroup({ pattern, index, problems, totalPatternProblems, store, isOpen, onToggle, onRowClick }) {

  // Calculate completion based on all problems in the pattern, not just filtered ones
  const completedInPattern = problems.filter(p => store.completed[p.id]).length;
  // Note: For the checkmark UI we use the filtered problems list for completion state, 
  // but to say a pattern is "fully done" we should probably check against total?
  // Let's use the local 'problems' list for the checkmark visual in the UI to reflect what's visible.
  const isAllVisibleDone = completedInPattern === problems.length && problems.length > 0;
  
  const isActuallyOpen = store.compactMode ? true : isOpen;

  return (
    <div className={`bg-white border border-neutral-200 rounded-2xl transition-all duration-300 ${store.compactMode ? 'p-3 md:p-4' : 'overflow-hidden hover:shadow-md'}`}>
      {store.compactMode ? (
        <div className="w-full flex items-center justify-between text-left py-2 mb-1">
          <div className={`flex items-center gap-3 ${isAllVisibleDone ? 'text-neutral-400' : 'text-neutral-800'}`}>
            <FolderOpen className={`w-5 h-5 ${isAllVisibleDone ? 'text-neutral-300' : 'text-neutral-400'}`} />
            <h3 className={`font-semibold text-sm tracking-tight ${isAllVisibleDone ? 'line-through' : ''}`}>
              <span className="text-neutral-500 font-mono text-[11px] mr-1.5">{index}.</span>
              {pattern.name}
            </h3>
            <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded ml-1">{completedInPattern}/{problems.length}</span>
          </div>
        </div>
      ) : (
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-between p-3 md:px-5 md:py-4 bg-white hover:bg-neutral-50/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0
                ${isAllVisibleDone ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'}
              `}>
                {isAllVisibleDone ? <Check className="w-4 h-4" strokeWidth={3} /> : <span className="text-xs font-semibold">{completedInPattern}/{problems.length}</span>}
              </div>
              <div className="text-left">
                <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${isAllVisibleDone ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  Topic {String(index).padStart(2, '0')}
                </div>
                <h3 className={`font-semibold tracking-tight text-lg transition-colors ${isAllVisibleDone ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                  {pattern.name}
                </h3>
                {pattern.canonical > 0 && (
                  <p className="text-[11px] uppercase tracking-wider font-medium text-neutral-400 mt-1">
                    {pattern.canonical} Canonical
                  </p>
                )}
              </div>
            </div>
            <div className="text-neutral-400 shrink-0 ml-4">
              {isActuallyOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
        </button>
      )}

      {isActuallyOpen && (
        <div className={store.compactMode ? "pl-6 relative before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-neutral-200/60" : "border-t border-neutral-100"}>
          {problems.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 text-sm">
              No problems match the current filters.
            </div>
          ) : (
            <div className={store.compactMode ? "space-y-0.5" : "divide-y divide-neutral-100"}>
              {problems.map((problem, index) => (
                <ProblemRow 
                  key={problem.id} 
                  problem={problem} 
                  index={index + 1}
                  store={store} 
                  onClick={() => onRowClick && onRowClick(problem)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
