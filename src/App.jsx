import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import problemsData from './data/problems.json';
import { useStore } from './hooks/useStore';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import HelpPage from './components/HelpPage';
import BookmarksPage from './components/BookmarksPage';
import RevisionPage from './components/RevisionPage';
import DueTodayPage from './components/DueTodayPage';
import CommandPalette from './components/CommandPalette';
import { IconButton } from './components/ui/IconButton';
import Timer from './components/Timer';
import AuthPrompt from './components/AuthPrompt';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTier, setActiveTier] = useState("1");
  const store = useStore();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [highlightProblemId, setHighlightProblemId] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + B to toggle Focus Mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        store.toggleFocusMode();
      }
      // Cmd/Ctrl + K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-[var(--paper)] transition-colors duration-[200ms]">
      {/* Mobile Header (below lg) */}
      <div className="lg:hidden h-[56px] px-[16px] bg-[var(--paper)] border-b border-[var(--line)] sticky top-0 z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[8px]">
          <div className="w-[20px] h-[20px] rounded-full bg-[var(--ink)] flex items-center justify-center text-[var(--paper)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.6 5.4A8.5 8.5 0 1 0 20.3 13" />
            </svg>
          </div>
          <span className="font-sans font-medium text-[15px] text-[var(--ink)] tracking-tight">EDSA</span>
          <span className="font-serif italic text-[16px] text-[var(--ink-2)] ml-[4px]">tracker</span>
        </div>
        <IconButton icon={Menu} onClick={() => setSidebarOpen(true)} aria-label="Open menu" />
      </div>

      {/* Sidebar Overlay (below lg) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-[var(--scrim)] backdrop-blur-[4px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {!store.focusMode && (
        <div 
          className={`
            fixed inset-y-0 left-0 z-[31] w-[min(272px,85vw)] shrink-0 bg-[var(--paper-sunk)] border-r border-[var(--line)] transform transition-transform duration-[280ms] ease-[var(--ease)]
            lg:relative lg:translate-x-0 lg:w-[272px]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar 
            data={problemsData.tierMeta} 
            allData={problemsData}
            activeTier={activeTier} 
            setActiveTier={(t) => { setActiveTier(t); setSidebarOpen(false); }} 
            closeSidebar={() => setSidebarOpen(false)}
            store={store}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden">
        {store.focusMode && <Timer />}
        
        <Routes>
          <Route path="/" element={<MainContent tierId={activeTier} data={problemsData} store={store} highlightProblemId={highlightProblemId} clearHighlight={() => setHighlightProblemId(null)} />} />
          <Route path="/due" element={<DueTodayPage data={problemsData} store={store} />} />
          <Route path="/bookmarks" element={<BookmarksPage data={problemsData} store={store} />} />
          <Route path="/revision" element={<RevisionPage data={problemsData} store={store} />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        store={store} 
        data={problemsData}
        setActiveTier={(t) => { setActiveTier(t); setSidebarOpen(false); }}
        onSelectProblem={(problemId) => setHighlightProblemId(problemId)}
      />

      <AuthPrompt 
        isOpen={store.showAuthPrompt} 
        onClose={() => store.setShowAuthPrompt(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
