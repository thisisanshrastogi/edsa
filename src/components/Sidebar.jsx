import { X, Info, LayoutDashboard, Database, Search, Layers, Link as LinkIcon, Network, GitBranch, Share2, Lightbulb, Zap, Calculator, PenTool, Hash, BookOpen, Bookmark, Moon, Sun, Target, LayoutList } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const getTierIcon = (id) => {
  switch (id) {
    case "1": return <Database className="w-5 h-5" />; // Arrays & Strings
    case "2": return <Search className="w-5 h-5" />; // Searching & Ordering
    case "3": return <Layers className="w-5 h-5" />; // Stacks, Queues
    case "4": return <LinkIcon className="w-5 h-5" />; // Linked Lists
    case "5": return <Network className="w-5 h-5" />; // Trees & Tries
    case "6": return <GitBranch className="w-5 h-5" />; // Recursion
    case "7": return <Share2 className="w-5 h-5" />; // Graphs
    case "8": return <Lightbulb className="w-5 h-5" />; // DP
    case "9": return <Zap className="w-5 h-5" />; // Greedy
    case "10": return <Calculator className="w-5 h-5" />; // Math
    case "11": return <PenTool className="w-5 h-5" />; // Design
    case "12": return <Hash className="w-5 h-5" />; // Advanced
    default: return <BookOpen className="w-5 h-5" />;
  }
};

export default function Sidebar({ data, allData, activeTier, setActiveTier, closeSidebar, store }) {
  const tiers = Object.entries(data);
  const navigate = useNavigate();
  const location = useLocation();

  const totalProblems = allData?.problems?.length || 0;
  const completedProblems = allData?.problems?.filter(p => store.completed[p.id]).length || 0;
  const overallProgressPercent = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;
  // If > 0 but < 1, show <1%, otherwise round
  const displayProgress = completedProblems > 0 && overallProgressPercent < 1
    ? '< 1'
    : Math.round(overallProgressPercent);

  const handleTierClick = (id) => {
    setActiveTier(id);
    navigate('/');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-neutral-200/60 shrink-0 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-tight text-neutral-900">EDSA Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={store.toggleCompactMode}
              className={`p-2 hover:bg-neutral-200/50 rounded-lg transition-colors ${store.compactMode ? 'text-neutral-900 bg-neutral-200/50' : 'text-neutral-500'}`}
              title="Toggle Compact Mode"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={store.toggleTheme}
              className="p-2 text-neutral-500 hover:bg-neutral-200/50 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {store.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 -mr-2 text-neutral-500 hover:bg-neutral-200/50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Progress Widget */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs font-medium">
            <span className="text-neutral-500">Overall Progress</span>
            <div className="text-right">
              <span className="text-neutral-900">{displayProgress}%</span>
              <div className="text-[10px] text-neutral-400 font-normal">{completedProblems} / {totalProblems}</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-neutral-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-3 overflow-y-auto flex-1">
        <div className="text-xs uppercase tracking-wider font-medium text-neutral-400 px-3 pb-2 pt-4">
          Navigation
        </div>
        <div className="space-y-1 mb-6">
          <button
            onClick={() => navigate('/bookmarks')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-300
              ${location.pathname === '/bookmarks'
                ? 'bg-white shadow-sm border border-neutral-200/60 text-neutral-900 font-medium'
                : 'text-neutral-600 hover:bg-neutral-200/50 border border-transparent'
              }
            `}
          >
            <Bookmark className="w-5 h-5 opacity-80" />
            <span className="truncate flex-1 text-sm">Bookmarks</span>
          </button>
          <button
            onClick={() => navigate('/help')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-300
              ${location.pathname === '/help'
                ? 'bg-white shadow-sm border border-neutral-200/60 text-neutral-900 font-medium'
                : 'text-neutral-600 hover:bg-neutral-200/50 border border-transparent'
              }
            `}
          >
            <Info className="w-5 h-5 opacity-80" />
            <span className="truncate flex-1 text-sm">Help & Notations</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Part 1: Foundations */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 px-3 pb-2">
              Part 1: Foundations
            </div>
            <div className="space-y-0.5">
              {tiers.filter(([id]) => parseInt(id) >= 1 && parseInt(id) <= 4).map(([id, tier]) => {
                const isActive = activeTier === id && location.pathname === '/';
                return (
                  <button
                    key={id}
                    onClick={() => handleTierClick(id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-300
                      ${isActive
                        ? 'bg-white shadow-sm border border-neutral-200/60 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-200/50 border border-transparent'
                      }
                    `}
                  >
                    <div className={`opacity-80 transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {getTierIcon(id)}
                    </div>
                    <span className="truncate flex-1 text-sm">{tier.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part 2: Structures */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 px-3 pb-2">
              Part 2: Structures
            </div>
            <div className="space-y-0.5">
              {tiers.filter(([id]) => parseInt(id) >= 5 && parseInt(id) <= 7).map(([id, tier]) => {
                const isActive = activeTier === id && location.pathname === '/';
                return (
                  <button
                    key={id}
                    onClick={() => handleTierClick(id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-300
                      ${isActive
                        ? 'bg-white shadow-sm border border-neutral-200/60 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-200/50 border border-transparent'
                      }
                    `}
                  >
                    <div className={`opacity-80 transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {getTierIcon(id)}
                    </div>
                    <span className="truncate flex-1 text-sm">{tier.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part 3: Advanced */}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 px-3 pb-2">
              Part 3: Advanced
            </div>
            <div className="space-y-0.5">
              {tiers.filter(([id]) => parseInt(id) >= 8 && parseInt(id) <= 12).map(([id, tier]) => {
                const isActive = activeTier === id && location.pathname === '/';
                return (
                  <button
                    key={id}
                    onClick={() => handleTierClick(id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-300
                      ${isActive
                        ? 'bg-white shadow-sm border border-neutral-200/60 text-neutral-900 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-200/50 border border-transparent'
                      }
                    `}
                  >
                    <div className={`opacity-80 transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {getTierIcon(id)}
                    </div>
                    <span className="truncate flex-1 text-sm">{tier.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
