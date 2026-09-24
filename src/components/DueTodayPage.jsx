import { useState, useMemo } from 'react';
import ProblemRow from './ProblemRow';
import SlideOver from './SlideOver';
import { PageHeader } from './ui/PageHeader';
import { SectionLabel } from './ui/Headings';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { Calendar, Play, Shuffle } from 'lucide-react';

export default function DueTodayPage({ data, store }) {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const now = Date.now();
  const next7Days = now + 7 * 24 * 60 * 60 * 1000;

  const { dueNow, comingUp } = useMemo(() => {
    const due = [];
    const upcoming = [];
    
    Object.entries(store.srsData || {}).forEach(([id, srs]) => {
      const p = data.problems.find(p => p.id === parseInt(id));
      if (p && srs && srs.due) {
        if (srs.due <= now) due.push(p);
        else if (srs.due <= next7Days) upcoming.push(p);
      }
    });
    
    return { dueNow: due, comingUp: upcoming };
  }, [store.srsData, data.problems, now, next7Days]);

  const lede = dueNow.length > 0 
    ? `${dueNow.length} reviews waiting. Re-solve each from scratch, then grade how it felt.` 
    : "Nothing due. Next review is tomorrow.";

  const handleStart = () => {
    if (dueNow.length > 0) setSelectedProblem(dueNow[0]);
  };
  
  const handleShuffle = () => {
    if (dueNow.length > 0) {
       const random = dueNow[Math.floor(Math.random() * dueNow.length)];
       setSelectedProblem(random);
    }
  };

  return (
    <div className="flex h-full w-full justify-center pb-[128px]">
      <div className="w-full max-w-[800px] px-[24px] md:px-[64px]">
        <PageHeader 
          breadcrumb="REVIEW / TODAY"
          title="Today"
          lede={lede}
          metaSlot={
            <div className="flex items-center gap-[8px]">
              <Button icon={Play} onClick={handleStart} disabled={dueNow.length === 0}>Start review</Button>
              <Button variant="secondary" icon={Shuffle} onClick={handleShuffle} disabled={dueNow.length === 0}>Shuffle</Button>
            </div>
          }
        />

        {dueNow.length === 0 && comingUp.length === 0 ? (
            <EmptyState icon={Calendar} message="You're all caught up." />
        ) : (
          <div className="space-y-[48px]">
            {dueNow.length > 0 && (
              <div>
                <SectionLabel label="DUE NOW" count={dueNow.length} className="mb-[16px]" />
                <div className="space-y-[2px]">
                  {dueNow.map(p => (
                    <ProblemRow 
                      key={p.id} 
                      problem={p} 
                      store={store} 
                      onClick={() => setSelectedProblem(p)}
                    />
                  ))}
                </div>
              </div>
            )}

            {comingUp.length > 0 && (
              <div className="opacity-60 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-120">
                <SectionLabel label="COMING UP" count={comingUp.length} className="mb-[16px]" />
                <div className="space-y-[2px]">
                  {comingUp.map(p => (
                    <ProblemRow 
                      key={p.id} 
                      problem={p} 
                      store={store} 
                      onClick={() => setSelectedProblem(p)}
                    />
                  ))}
                </div>
              </div>
            )}
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
