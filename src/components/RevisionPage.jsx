import { useState, useMemo } from 'react';
import ProblemRow from './ProblemRow';
import SlideOver from './SlideOver';
import { PageHeader } from './ui/PageHeader';
import { SectionLabel } from './ui/Headings';
import { EmptyState } from './ui/EmptyState';
import { Flag } from 'lucide-react';

export default function RevisionPage({ data, store }) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const flaggedProblems = useMemo(() => {
    return data.problems.filter(p => store.struggled?.[p.id]);
  }, [data.problems, store.struggled]);

  const groups = useMemo(() => {
    const grouped = {};
    flaggedProblems.forEach(p => {
      const tierId = String(p.tier);
      if (!grouped[tierId]) grouped[tierId] = [];
      grouped[tierId].push(p);
    });
    return grouped;
  }, [flaggedProblems]);

  const groupKeys = Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="flex h-full w-full justify-center pb-[128px]">
      <div className="w-full max-w-[800px] px-[24px] md:px-[64px]">
        <PageHeader 
          breadcrumb={`LIBRARY / ${flaggedProblems.length} FLAGGED`}
          title="Needs revision"
          lede="Problems you flagged as shaky. Clear the flag once they feel solid."
        />

        {flaggedProblems.length === 0 ? (
          <EmptyState icon={Flag} message="Nothing flagged. Press R on any problem." />
        ) : (
          <div className="space-y-[48px]">
            {groupKeys.map(tierId => {
              const tierGroupName = 
                parseInt(tierId) <= 3 ? 'FOUNDATIONS' :
                parseInt(tierId) <= 7 ? 'STRUCTURES' : 'ADVANCED';
              const label = `${tierGroupName} · TIER ${tierId.padStart(2, '0')}`;

              return (
                <div key={tierId}>
                  <SectionLabel label={label} count={groups[tierId].length} className="mb-[16px]" />
                  <div className="space-y-[2px]">
                    {groups[tierId].map(p => (
                      <ProblemRow 
                        key={p.id} 
                        problem={p} 
                        store={store} 
                        onClick={() => setSelectedProblem(p)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProblem && (
          <SlideOver 
            problem={selectedProblem} 
            store={store} 
            onClose={() => setSelectedProblem(null)} 
          />
        )}
      </div>
    </div>
  );
}
