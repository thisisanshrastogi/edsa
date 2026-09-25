import { useState, useMemo, useEffect } from 'react';
import ProblemRow from './ProblemRow';
import SlideOver from './SlideOver';
import FilterBar from './FilterBar';
import { PageHeader } from './ui/PageHeader';
import { GroupHeading, SectionLabel } from './ui/Headings';
import { ProgressBar, ProgressRing } from './ui/Progress';
import { Kbd } from './ui/Chips';
import { EmptyState } from './ui/EmptyState';
import { ChevronDown, MousePointer2 } from 'lucide-react';

export default function MainContent({ tierId, data, store, highlightProblemId, clearHighlight }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [showCoreOnly, setShowCoreOnly] = useState(false);
  const [showRevisionOnly, setShowRevisionOnly] = useState(false);
  const [hideSolved, setHideSolved] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [activeSection, setActiveSection] = useState(null);

  const tier = data.tierMeta[tierId];
  const allTierProblems = data.problems.filter(p => p.tier === parseInt(tierId));

  const total = allTierProblems.length;
  const done = allTierProblems.filter(p => store.completed[p.id]).length;
  const progressPercent = total > 0 ? (done / total) * 100 : 0;

  const now = Date.now();
  const dueCount = allTierProblems.filter(p => store.srsData?.[p.id]?.due <= now).length;

  const filteredProblems = useMemo(() => {
    return allTierProblems.filter(p => {
      const matchText = p.title.toLowerCase().includes(filterText.toLowerCase()) ||
        (p.companies && p.companies.some(c => c.toLowerCase().includes(filterText.toLowerCase())));
      const matchDiff = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const matchCore = !showCoreOnly || p.isCanonical;
      const matchRevision = !showRevisionOnly || store.struggled[p.id];
      const matchUnsolved = !hideSolved || !store.completed[p.id];
      return matchText && matchDiff && matchCore && matchRevision && matchUnsolved;
    });
  }, [allTierProblems, filterText, difficultyFilter, showCoreOnly, showRevisionOnly, hideSolved, store.completed, store.struggled]);

  const groups = useMemo(() => {
    const grouped = {};
    filteredProblems.forEach(p => {
      if (!grouped[p.pattern]) {
        grouped[p.pattern] = [];
      }
      grouped[p.pattern].push(p);
    });
    return grouped;
  }, [filteredProblems]);

  const toggleGroup = (pattern) => {
    setExpandedGroups(prev => ({ ...prev, [pattern]: !prev[pattern] }));
  };

  // When a problem is highlighted from search, expand its group and scroll to it
  useEffect(() => {
    if (!highlightProblemId) return;
    
    // Find which pattern group this problem belongs to
    const problem = allTierProblems.find(p => p.id === highlightProblemId);
    if (!problem) { clearHighlight?.(); return; }
    
    // Clear filters that might hide the problem
    setFilterText('');
    setDifficultyFilter('All');
    setShowCoreOnly(false);
    setShowRevisionOnly(false);
    setHideSolved(false);

    // Expand the group
    setExpandedGroups(prev => ({ ...prev, [problem.pattern]: true }));
    
    // Wait for React to render the expanded group, then scroll
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`problem-${highlightProblemId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief highlight flash
          el.style.outline = '2px solid var(--signal)';
          el.style.outlineOffset = '-2px';
          el.style.borderRadius = '10px';
          setTimeout(() => {
            el.style.outline = '';
            el.style.outlineOffset = '';
          }, 2000);
        }
        clearHighlight?.();
      }, 100);
    });
  }, [highlightProblemId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // If multiple are visible, pick the one highest on screen
          const highest = visible.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          );
          setActiveSection(highest.target.id);
        }
      },
      { rootMargin: '-120px 0px -40% 0px' }
    );

    Object.keys(groups).forEach(pattern => {
      const el = document.getElementById(`pattern-${pattern.replace(/\s+/g, '-').toLowerCase()}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groups]);

  const clearFilters = () => {
    setFilterText('');
    setDifficultyFilter('All');
    setShowCoreOnly(false);
    setShowRevisionOnly(false);
    setHideSolved(false);
  };

  const hasActiveFilters = filterText || difficultyFilter !== 'All' || showCoreOnly || showRevisionOnly || hideSolved;

  return (
    <div className="flex min-h-full w-full min-w-0">
      <div className="flex-1 min-w-0 w-full flex justify-center">
        <div className="w-full max-w-[800px] px-[24px] md:px-[64px] pb-[128px]">
          <PageHeader
            breadcrumb={`FOUNDATIONS / TIER ${tierId.padStart(2, '0')}`}
            title={tier.name}
            lede={tier.description || "Master the core patterns of data structures and algorithms."}
            metaSlot={
              <div className="flex items-center gap-[12px]">
                <ProgressBar percent={progressPercent} className="w-[160px]" />
                <div className="font-mono text-[12px] text-[var(--ink-3)]">
                  {done} / {total} solved
                </div>
                {dueCount > 0 && (
                  <div className="font-mono text-[12px] text-[var(--signal)]">
                    · {dueCount} due
                  </div>
                )}
              </div>
            }
          />

          {/* Sticky Filter Bar */}
          <FilterBar
            filterText={filterText} setFilterText={setFilterText}
            difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
            showCoreOnly={showCoreOnly} setShowCoreOnly={setShowCoreOnly}
            showRevisionOnly={showRevisionOnly} setShowRevisionOnly={setShowRevisionOnly}
            hideSolved={hideSolved} setHideSolved={setHideSolved}
            onClear={clearFilters}
          />

          {/* Groups */}
          {Object.keys(groups).length === 0 ? (
            <EmptyState
              icon={MousePointer2}
              message="No problems match these filters."
              actionText={hasActiveFilters ? "Clear filters" : null}
              onAction={clearFilters}
            />
          ) : (
            <div className="space-y-[48px]">
              {Object.entries(groups).map(([pattern, problems]) => {
                const isExpanded = hasActiveFilters || expandedGroups[pattern];
                const allInGroup = allTierProblems.filter(p => p.pattern === pattern);
                const doneInGroup = allInGroup.filter(p => store.completed[p.id]).length;
                const groupPercent = allInGroup.length > 0 ? (doneInGroup / allInGroup.length) * 100 : 0;
                const groupCompleted = doneInGroup === allInGroup.length && allInGroup.length > 0;

                return (
                  <div key={pattern} id={`pattern-${pattern.replace(/\s+/g, '-').toLowerCase()}`} className="scroll-mt-[100px]">
                    <button
                      onClick={() => toggleGroup(pattern)}
                      className="w-full min-h-[48px] py-[8px] flex items-start group outline-none rounded-[10px] focus-visible:outline-[1.5px] focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 mb-[8px]"
                    >
                      <ProgressRing percent={groupPercent} completed={groupCompleted} className="mt-[7px]" />
                      <GroupHeading className="ml-[12px] text-left">{pattern}</GroupHeading>
                      <span className="font-mono text-[12px] text-[var(--ink-3)] ml-[12px] shrink-0 pt-[9px]">
                        {doneInGroup}/{allInGroup.length}
                      </span>
                      <div className="flex-1"></div>
                      <ChevronDown className={`w-[16px] h-[16px] text-[var(--ink-icon)] transition-transform duration-[200ms] shrink-0 mt-[9px] ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                    </button>

                    {isExpanded && (
                      <div className="space-y-[2px]">
                        {problems.map((problem) => (
                          <ProblemRow
                            key={problem.id}
                            problem={problem}
                            store={store}
                            onClick={() => setSelectedProblem(problem)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Rail (xl only) */}
      <div className="hidden xl:block w-[260px] shrink-0 sticky top-0 h-screen overflow-y-auto pt-[48px] pb-[48px] px-[32px] self-start">
        <SectionLabel label="On this page" className="mb-[8px]" />
        <div className="space-y-[2px] mb-[56px]">
          {Object.keys(groups).map((pattern) => {
            const id = `pattern-${pattern.replace(/\s+/g, '-').toLowerCase()}`;
            const isActive = activeSection === id;
            return (
              <button
                key={pattern}
                onClick={() => {
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-[8px] pl-[16px] text-left border-l-[1px] text-[14px] transition-colors duration-120 outline-none focus-visible:text-[var(--ink)] focus-visible:border-[var(--ink)] truncate
                  ${isActive
                    ? 'border-[var(--rule-active)] text-[var(--ink)] font-medium'
                    : 'border-[var(--line)] text-[var(--ink-2)] font-sans hover:text-[var(--ink)] hover:border-[var(--ink)]'}
                `}
              >
                {pattern}
              </button>
            );
          })}
        </div>

        <SectionLabel label="Keys" className="mb-[12px]" />
        <div className="space-y-[12px]">
          {[
            { key: 'J K', desc: 'Next / Prev row' },
            { key: 'Space', desc: 'Grade problem' },
            { key: '1-4', desc: 'Select grade' },
            { key: 'B', desc: 'Toggle bookmark' },
            { key: 'R', desc: 'Toggle revision' },
            { key: 'Enter', desc: 'Open problem' },
          ].map((k) => (
            <div key={k.key} className="flex items-center justify-between">
              <span className="text-[13px] font-sans text-[var(--ink-2)]">{k.desc}</span>
              <Kbd>{k.key}</Kbd>
            </div>
          ))}
        </div>
      </div>

      {selectedProblem && (
        <SlideOver
          problem={selectedProblem}
          store={store}
          onClose={() => setSelectedProblem(null)}
          onNext={() => {
            const currentIdx = filteredProblems.findIndex(p => p.id === selectedProblem.id);
            if (currentIdx < filteredProblems.length - 1) setSelectedProblem(filteredProblems[currentIdx + 1]);
          }}
          onPrev={() => {
            const currentIdx = filteredProblems.findIndex(p => p.id === selectedProblem.id);
            if (currentIdx > 0) setSelectedProblem(filteredProblems[currentIdx - 1]);
          }}
          hasNext={filteredProblems.findIndex(p => p.id === selectedProblem?.id) < filteredProblems.length - 1}
          hasPrev={filteredProblems.findIndex(p => p.id === selectedProblem?.id) > 0}
        />
      )}
    </div>
  );
}