import { FileText, Database, Share2, Lightbulb, Zap, Info, Star, LayoutList } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-12 space-y-12 pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
          Help & Notations
        </h1>
        <p className="text-neutral-500 leading-relaxed text-lg max-w-2xl">
          A quick guide to understanding the taxonomy, priority markers, and system layout of EDSA Tracker.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Features & Shortcuts */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neutral-400" /> Features & Shortcuts
          </h2>
          <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
            
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="flex items-center gap-1 font-sans text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded px-2 py-1 w-fit shrink-0">
                <kbd>⌘</kbd> + <kbd>K</kbd>
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Command Palette:</strong> Instantly search for any problem by name, company, or concept across all tiers without leaving your keyboard.
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="flex items-center gap-1 font-sans text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded px-2 py-1 w-fit shrink-0">
                <kbd>⌘</kbd> + <kbd>B</kbd>
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Zen / Focus Mode:</strong> Hides the sidebar and expands the view to remove all distractions. Pairs perfectly with the built-in Pomodoro timer in the header.
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200 w-fit shrink-0">
                <LayoutList className="w-3.5 h-3.5" /> Compact View
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Compact Mode:</strong> Toggle this via the sidebar icon to flatten the interface into a dense, continuous list similar to an IDE file tree. Hides company tags to maximize vertical space.
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200 w-fit shrink-0">
                <FileText className="w-3.5 h-3.5" /> Slide-over Notes
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Notes & Review:</strong> Click on any problem row to slide out the side panel. From there, you can write Markdown notes, bookmark the problem, or flag it for revision.
              </p>
            </div>

          </div>
        </section>

        {/* Difficulties */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-neutral-400" /> Difficulty Levels
          </h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-green-50/50 text-green-700 border-green-200 inline-block">Easy</span>
              <p className="text-sm text-neutral-600">Fundamental concepts, basic implementations, and warm-up problems.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-50/50 text-amber-700 border-amber-200 inline-block">Medium</span>
              <p className="text-sm text-neutral-600">Standard interview questions requiring combination of techniques or clever observations.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-50/50 text-red-700 border-red-200 inline-block">Hard</span>
              <p className="text-sm text-neutral-600">Complex problems, often combining multiple patterns or requiring advanced optimisations.</p>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-neutral-400" /> Special Markers
          </h2>
          <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
            
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-neutral-100 text-neutral-800 border-neutral-300 w-fit shrink-0">
                <Star className="w-3 h-3 fill-neutral-800" /> Canonical
              </span>
              <p className="text-sm text-neutral-600">
                The absolute core problem for a given pattern. If you only have time to solve one problem in a category, make it this one. It perfectly embodies the technique.
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-red-50 text-red-700 border-red-200 w-fit shrink-0">
                Core
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Priority (Core / Important / Edge):</strong> Indicates how essential the problem is for general interview preparation. Core problems show up constantly, Important ones are regularly asked, and Edge problems are for top-tier companies or extra practice.
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200 w-fit shrink-0">
                Freq: H
              </span>
              <p className="text-sm text-neutral-600">
                <strong>Frequency (H / M / L):</strong> Historical frequency of the problem in real interviews (High, Medium, Low).
              </p>
            </div>

            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-start">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-200 w-fit shrink-0">
                IN
              </span>
              <p className="text-sm text-neutral-600">
                Favoured by Indian product companies.
              </p>
            </div>

          </div>
        </section>

        {/* Tiers Explanation */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-neutral-400" /> Tier Progression
          </h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-sm text-neutral-600 space-y-4 leading-relaxed">
            <p>
              The taxonomy is broken down into progressive <strong>Tiers</strong>. You should generally master lower tiers before moving to higher ones.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Tier 1-4 (Foundations):</strong> Arrays, HashMaps, Two Pointers, Linked Lists.</li>
              <li><strong>Tier 5-7 (Structures):</strong> Trees, Recursion, Backtracking, Graphs.</li>
              <li><strong>Tier 8-12 (Advanced):</strong> DP, Greedy, Math, System Design, Advanced Tries/Strings.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
