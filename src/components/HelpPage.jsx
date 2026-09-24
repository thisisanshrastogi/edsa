import { PageHeader } from './ui/PageHeader';
import { GroupHeading } from './ui/Headings';
import { Kbd } from './ui/Chips';

export default function HelpPage() {
  return (
    <div className="flex h-full w-full justify-center pb-[128px]">
      <div className="w-full max-w-[800px] px-[24px] md:px-[64px]">
        <PageHeader 
          breadcrumb="REFERENCE / HOW IT WORKS"
          title="Guide"
          lede="Learn how to use EDSA tracker effectively."
        />

        <div className="space-y-[48px]">
          {/* Shortcuts */}
          <div>
            <GroupHeading className="mb-[16px]">Shortcuts</GroupHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[12px]">
              {[
                { k: 'J K', desc: 'Next / Prev row' },
                { k: 'Space', desc: 'Grade problem' },
                { k: '1-4', desc: 'Select grade' },
                { k: 'B', desc: 'Toggle bookmark' },
                { k: 'R', desc: 'Toggle revision' },
                { k: 'Enter', desc: 'Open problem' },
                { k: '⌘ K', desc: 'Command palette' },
                { k: '⌘ B', desc: 'Toggle focus mode' },
                { k: '/', desc: 'Focus filter' }
              ].map(s => (
                <div key={s.k} className="flex items-center">
                  <div className="w-[120px] shrink-0">
                    <Kbd>{s.k}</Kbd>
                  </div>
                  <div className="font-sans text-[14px] leading-[1.6] text-[var(--ink-2)]">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spaced repetition */}
          <div>
            <GroupHeading className="mb-[16px]">Spaced repetition</GroupHeading>
            <p className="font-sans text-[16px] leading-[1.6] text-[var(--ink-2)] mb-[24px]">
              When you complete a problem, grade how hard it was to solve. The system will schedule your next review based on your choice.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px]">
              {[
                { label: 'Again', sub: '<1d', colorClass: 'border-[var(--grade-again-line)] bg-[var(--grade-again-bg)] text-[var(--grade-again-text)]' },
                { label: 'Hard', sub: '2d', colorClass: 'border-[var(--grade-hard-line)] bg-[var(--grade-hard-bg)] text-[var(--grade-hard-text)]' },
                { label: 'Good', sub: '4d', colorClass: 'border-[var(--grade-good-line)] bg-[var(--grade-good-bg)] text-[var(--grade-good-text)]' },
                { label: 'Easy', sub: '9d', colorClass: 'border-[var(--grade-easy-line)] bg-[var(--grade-easy-bg)] text-[var(--grade-easy-text)]' }
              ].map(g => (
                <div key={g.label} className={`h-[48px] rounded-[10px] border flex flex-col items-center justify-center ${g.colorClass}`}>
                  <span className="font-sans font-medium text-[13px] leading-[1.2]">{g.label}</span>
                  <span className="font-mono text-[12px] opacity-80 leading-[1.2] mt-[2px]">{g.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <GroupHeading className="mb-[16px]">Difficulty</GroupHeading>
            <p className="font-sans text-[16px] leading-[1.6] text-[var(--ink-2)]">
              Easy, Medium and Hard are LeetCode's official labels and are shown as plain text without colors to avoid confusion with your SRS grades.
            </p>
          </div>

          {/* Tiers */}
          <div>
            <GroupHeading className="mb-[16px]">Tiers</GroupHeading>
            <p className="font-sans text-[16px] leading-[1.6] text-[var(--ink-2)] mb-[16px]">
              Problems are organized into three main groups to build your skills progressively:
            </p>
            <ul className="list-disc pl-[24px] font-sans text-[16px] leading-[1.6] text-[var(--ink-2)] space-y-[8px]">
              <li><strong>FOUNDATIONS (Tiers 1-3):</strong> Core data structures and basic algorithms.</li>
              <li><strong>STRUCTURES (Tiers 4-7):</strong> Intermediate patterns and more complex data structures.</li>
              <li><strong>ADVANCED (Tiers 8-12):</strong> Complex algorithms, dynamic programming, and advanced topics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
