import { useEffect, useState } from 'react';
import { X, ExternalLink, Bookmark, Check, Flag, Code2 } from 'lucide-react';

export default function SlideOver({ isOpen, onClose, problem, store }) {
  const [note, setNote] = useState('');
  const [localProblem, setLocalProblem] = useState(problem);

  useEffect(() => {
    if (problem) setLocalProblem(problem);
  }, [problem]);

  useEffect(() => {
    if (isOpen && problem) {
      setNote(store.notes[problem.id] || '');
    }
  }, [isOpen, problem, store.notes]);

  const p = problem || localProblem;
  if (!p) return null;

  const isCompleted = store.completed[p.id];
  const isBookmarked = store.bookmarks[p.id];
  const isStruggled = store.struggled?.[p.id];

  const handleSave = () => {
    store.saveNote(p.id, note);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-200 ease-out border-l border-neutral-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="font-semibold text-lg truncate flex-1 pr-4">{p.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600">
              {p.difficulty}
            </span>
            {p.companies?.map(c => (
              <span key={c} className="px-2.5 py-1 text-xs font-medium rounded-full border border-neutral-200 text-neutral-500">
                {c}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => store.toggleComplete(p.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-medium transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              <Check className="w-4 h-4" /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            <button 
              onClick={() => window.open(p.url, '_blank')}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-neutral-900 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Solve <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-around py-4 border-y border-neutral-200">
            <button onClick={() => store.toggleBookmark(p.id)} className={`flex flex-col items-center gap-1.5 transition-colors ${isBookmarked ? 'text-amber-500' : 'text-neutral-400 hover:text-neutral-600'}`}>
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider">Bookmark</span>
            </button>
            <button onClick={() => store.toggleStruggled(p.id)} className={`flex flex-col items-center gap-1.5 transition-colors ${isStruggled ? 'text-orange-500' : 'text-neutral-400 hover:text-neutral-600'}`}>
              <Flag className={`w-5 h-5 ${isStruggled ? 'fill-orange-500' : ''}`} />
              <span className="text-[10px] font-medium uppercase tracking-wider">Revise</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold">
              <Code2 className="w-4 h-4" /> 
              <h3>Notes & Code Snippet</h3>
            </div>
            <p className="text-sm text-neutral-500">
              Save your intuition, time complexities, or paste your optimal solution code here.
            </p>
            <div className="relative">
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSave}
                placeholder="Write markdown or paste code snippet..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-300 min-h-[300px] resize-y transition-all text-neutral-800"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
