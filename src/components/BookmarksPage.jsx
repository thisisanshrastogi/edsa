import { useMemo } from 'react';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import ProblemRow from './ProblemRow';

export default function BookmarksPage({ data, store }) {
  const allProblems = data.problems;
  
  const bookmarkedProblems = useMemo(() => {
    return allProblems.filter(p => store.bookmarks[p.id]);
  }, [allProblems, store.bookmarks]);

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10 pb-20">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-sm font-medium text-neutral-600 shadow-sm">
            <BookmarkIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Bookmarks</span>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-2">
              Bookmarked Problems
            </h1>
            <p className="text-neutral-500 leading-relaxed max-w-2xl text-lg">
              Review all the problems you've saved for later or marked as important.
            </p>
          </div>
        </div>

        {bookmarkedProblems.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
            <BookmarkIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No bookmarks yet</h3>
            <p className="text-neutral-500">Click the bookmark icon on any problem to save it here.</p>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100 shadow-sm">
            {bookmarkedProblems.map((problem, index) => (
              <ProblemRow 
                key={problem.id} 
                problem={problem} 
                index={index + 1}
                store={store} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
