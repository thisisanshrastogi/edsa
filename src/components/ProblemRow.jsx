import { useState } from 'react';
import { Bookmark, FileText, Check, ExternalLink, MessageSquare, Star, Lock, Flag } from 'lucide-react';

export default function ProblemRow({ problem, index, store, onClick }) {
  const isCompleted = store.completed[problem.id];
  const isBookmarked = store.bookmarks[problem.id];
  const isStruggled = store.struggled?.[problem.id];
  const note = store.notes[problem.id] || "";
  const hasNote = note.trim().length > 0;

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-50/50 text-green-700 border-green-200';
      case 'medium': return 'bg-amber-50/50 text-amber-700 border-amber-200';
      case 'hard': return 'bg-red-50/50 text-red-700 border-red-200';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div 
      className={`transition-colors relative ${store.compactMode ? 'px-3 py-1.5 rounded-lg' : 'p-3 md:px-4 md:py-3'} ${isStruggled ? 'bg-orange-50/30 hover:bg-orange-50/50' : (isCompleted ? 'bg-neutral-50/30' : 'hover:bg-neutral-50/50')}`}
    >
      <div className={`flex ${store.compactMode ? 'items-center gap-3' : 'items-start gap-3'}`}>
        {/* Custom Checkbox */}
          <button 
          onClick={(e) => { e.stopPropagation(); store.toggleComplete(problem.id); }}
          className={`
            shrink-0 rounded-full border flex items-center justify-center transition-all duration-300
            ${store.compactMode ? 'w-4 h-4' : 'mt-0.5 w-5 h-5'}
            ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-300 hover:border-neutral-400 bg-white'}
          `}
        >
          {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </button>

        <div className={`flex-1 min-w-0 flex ${store.compactMode ? 'flex-col lg:flex-row lg:items-center gap-2 lg:gap-3' : 'flex-col space-y-1'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <a 
              href={problem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-medium tracking-tight hover:underline underline-offset-4 decoration-neutral-300 transition-colors ${store.compactMode ? 'text-sm' : ''} ${isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}
            >
              {problem.lcNum ? `${problem.lcNum}. ` : ''}{problem.title}
            </a>
            
            {/* Badges */}
            <div className="flex items-center gap-1.5 mt-1 md:mt-0 md:ml-2 flex-wrap">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBadge(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              
              {problem.isCanonical && (
                <span title="Canonical - Core problem for this pattern" className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-800 border-neutral-300">
                  <Star className="w-3 h-3 fill-neutral-800" /> Canonical
                </span>
              )}

              {problem.priority && (
                <span title={`Priority: ${problem.priority}`} className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  problem.priority.toLowerCase() === 'core' ? 'bg-red-50 text-red-700 border-red-200' :
                  problem.priority.toLowerCase() === 'important' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {problem.priority}
                </span>
              )}

              {problem.freq && (
                <span title={`Frequency: ${problem.freq}`} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200">
                  Freq: {problem.freq}
                </span>
              )}

              {problem.indianFav && (
                <span title="Favored by Indian product companies" className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-orange-50 text-orange-700 border-orange-200">
                  IN
                </span>
              )}

              {problem.isPremium && (
                <span title="Premium Locked" className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
          
          <div className={`flex items-center gap-4 text-sm text-neutral-500 ${store.compactMode ? 'lg:ml-auto mt-1 lg:mt-0' : ''}`}>
            {!store.compactMode && problem.companies?.length > 0 && (
              <span className="truncate max-w-[200px]">
                {problem.companies.join(', ')}
              </span>
            )}
            
            <div className={`flex items-center gap-3 opacity-70 ${!store.compactMode ? 'ml-auto' : ''}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
                className={`hover:text-neutral-900 transition-colors ${hasNote ? 'text-blue-600 opacity-100' : ''}`}
                title={hasNote ? "View Note" : "Add Note"}
              >
                <MessageSquare className="w-4 h-4" strokeWidth={2} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); store.toggleStruggled(problem.id); }}
                className={`hover:text-orange-500 transition-colors ${isStruggled ? 'text-orange-500 fill-orange-500 opacity-100' : ''}`}
                title="Needs Revision (Struggled)"
              >
                <Flag className="w-4 h-4" strokeWidth={2} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); store.toggleBookmark(problem.id); }}
                className={`hover:text-neutral-900 transition-colors ${isBookmarked ? 'text-amber-500 fill-amber-500 opacity-100' : ''}`}
                title="Bookmark"
              >
                <Bookmark className="w-4 h-4" strokeWidth={2} />
              </button>
              <a 
                href={problem.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-neutral-900 transition-colors"
                title="Open Link"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
