import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Info, LayoutDashboard, Target } from 'lucide-react';
import problemsData from './data/problems.json';
import { useStore } from './hooks/useStore';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import HelpPage from './components/HelpPage';
import BookmarksPage from './components/BookmarksPage';
import CommandPalette from './components/CommandPalette';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTier, setActiveTier] = useState("1");
  const store = useStore();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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
    <div className="h-screen w-full overflow-hidden font-sans flex flex-col md:flex-row transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center text-white">
            <Target className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">EDSA Tracker</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -mr-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {!store.focusMode && (
        <div 
          className={`
            fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out shrink-0
            md:relative md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{ backgroundColor: 'var(--bg-sidebar)' }}
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

      {/* Main Routes */}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <Routes>
          <Route path="/" element={<MainContent tierId={activeTier} data={problemsData} store={store} />} />
          <Route path="/bookmarks" element={<BookmarksPage data={problemsData} store={store} />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        store={store} 
        data={problemsData} 
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
