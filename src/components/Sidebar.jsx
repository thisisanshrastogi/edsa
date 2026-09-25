import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, Info, Flag, Bookmark, Calendar, Sun, Moon,
  Rows2, Rows3, LogOut, LogIn, ChevronsUpDown, User, CloudUpload, Trash2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut as fbSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { IconButton } from './ui/IconButton';
import { ProgressBar } from './ui/Progress';
import ThemeMenu from './ThemeMenu';

/* ── Shared class strings (spec §3) ───────────────────────────────────────── */

const focusRing =
  'outline-none focus-visible:outline focus-visible:outline-[1.5px] ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]';

const rowBase =
  `w-full h-[36px] px-[8px] rounded-[10px] flex items-center text-left ` +
  `transition-colors duration-[120ms] ${focusRing}`;

const rowState = (active) =>
  active
    ? 'bg-[var(--surface)] text-[var(--ink)] font-medium'
    : 'text-[var(--ink-2)] hover:text-[var(--ink)]';

const labelCls = 'font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]';
const dataCls = 'font-mono text-[12px] tabular-nums text-[var(--ink-3)]';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const TIER_GROUPS = [
  ['Foundations', [1, 2, 3]],
  ['Structures', [4, 5, 6, 7]],
  ['Advanced', [8, 9, 10, 11, 12]],
];

// Brush-stroke ensō: thick rounded head, tapering tail, open gap.
const ENSO_PATH =
  'M15.4 3.5 L15.0 3.0 L14.5 2.6 L13.9 2.2 L13.3 1.8 L12.7 1.6 L12.0 1.4 L11.3 1.3 L10.6 1.2 L10.0 1.2 L9.3 1.2 L8.6 1.3 L7.9 1.4 L7.3 1.6 L6.6 1.9 L6.0 2.1 L5.4 2.5 L4.8 2.9 L4.3 3.3 L3.8 3.8 L3.3 4.3 L2.9 4.8 L2.5 5.4 L2.2 6.0 L1.9 6.6 L1.7 7.3 L1.5 7.9 L1.4 8.6 L1.3 9.3 L1.3 10.0 L1.4 10.6 L1.5 11.3 L1.6 12.0 L1.8 12.6 L2.1 13.2 L2.4 13.8 L2.7 14.4 L3.1 14.9 L3.5 15.4 L4.0 15.9 L4.5 16.3 L5.0 16.7 L5.6 17.0 L6.2 17.3 L6.7 17.6 L7.4 17.8 L8.0 17.9 L8.6 18.0 L9.2 18.1 L9.9 18.1 L10.5 18.0 L11.1 17.9 L11.7 17.8 L12.3 17.6 L12.9 17.3 L13.4 17.1 L14.0 16.7 L14.4 16.4 L14.9 16.0 L15.3 15.5 L15.7 15.1 L16.1 14.6 L16.4 14.1 L16.6 13.6 L16.9 13.0 L17.0 12.5 L17.2 11.9 L17.3 11.3 L17.3 10.8 L17.3 10.2 L17.3 9.6 L17.2 9.1 L17.0 8.5 L16.7 8.6 L16.8 9.1 L16.8 9.6 L16.8 10.2 L16.7 10.7 L16.6 11.2 L16.5 11.7 L16.3 12.2 L16.1 12.7 L15.9 13.2 L15.6 13.6 L15.3 14.0 L15.0 14.4 L14.6 14.8 L14.2 15.1 L13.8 15.4 L13.4 15.7 L12.9 16.0 L12.4 16.2 L11.9 16.3 L11.4 16.5 L10.9 16.6 L10.4 16.6 L9.9 16.6 L9.4 16.6 L8.9 16.5 L8.4 16.4 L7.9 16.3 L7.4 16.1 L6.9 15.9 L6.5 15.6 L6.1 15.3 L5.7 15.0 L5.3 14.6 L4.9 14.2 L4.6 13.8 L4.4 13.4 L4.1 12.9 L3.9 12.5 L3.7 12.0 L3.6 11.5 L3.5 11.0 L3.5 10.5 L3.5 10.0 L3.5 9.5 L3.6 9.0 L3.7 8.5 L3.9 8.0 L4.0 7.5 L4.3 7.1 L4.5 6.6 L4.8 6.2 L5.2 5.9 L5.5 5.5 L5.9 5.2 L6.3 4.9 L6.7 4.6 L7.2 4.4 L7.6 4.3 L8.1 4.1 L8.5 4.0 L9.0 3.9 L9.5 3.9 L10.0 3.9 L10.4 4.0 L10.9 4.0 L11.4 4.2 L11.8 4.3 L12.2 4.5 L12.7 4.7 L13.1 4.9 L13.5 5.1 L13.9 5.3 L14.2 5.5 L14.5 5.6 L14.8 5.6 L15.1 5.5 L15.4 5.4 L15.6 5.2 L15.7 4.9 L15.8 4.6 L15.9 4.3 L15.8 4.0 L15.6 3.7 Z';

export function EnsoMark({ size = 22, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 20 20"
      fill="currentColor" className={className} aria-hidden="true"
    >
      <path d={ENSO_PATH} />
    </svg>
  );
}

export function Brand() {
  return (
    <div className="flex items-center gap-[10px] text-[var(--ink)] select-none">
      <EnsoMark className="text-[var(--seal)]" />
      <span className="flex items-baseline gap-[5px] leading-none">
        <span className="font-sans font-semibold text-[15px] tracking-[-0.01em]">EDSA</span>
        <span className="font-serif italic text-[17px] text-[var(--ink-2)]">tracker</span>
      </span>
    </div>
  );
}

/* ── Account (bottom of sidebar) ─────────────────────────────────────────── */

function initialsOf(user) {
  const name = user?.displayName || user?.email || '';
  const parts = name.replace(/@.*/, '').split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || 'U') + (parts[1]?.[0] || '')).toUpperCase();
}

function AccountSection({ auth, store }) {
  const { user, loading } = auth;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Prefer the hook's own functions; fall back to Firebase directly
  const signIn = async () => {
    setBusy(true);
    try {
      const fn = auth.login || auth.signIn || auth.signInWithGoogle;
      if (fn) await fn();
      else await signInWithPopup(getAuth(), new GoogleAuthProvider());
    } catch (err) {
      console.error('Sign in failed', err);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      const fn = auth.logout || auth.signOut || auth.signout;
      if (fn) await fn();
      else await fbSignOut(getAuth());
      setOpen(false);
    } catch (err) {
      console.error('Sign out failed', err);
    } finally {
      setBusy(false);
    }
  };

  const shell = 'shrink-0 border-t border-[var(--line)] p-[8px]';

  if (loading) {
    return (
      <div className={shell}>
        <div className="h-[48px] px-[8px] flex items-center gap-[12px]">
          <div className="w-[32px] h-[32px] rounded-full bg-[var(--well)]" />
          <div className="h-[10px] w-[96px] rounded-full bg-[var(--well)]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={shell}>
        <button
          onClick={signIn}
          disabled={busy}
          className={`w-full h-[48px] px-[8px] rounded-[10px] flex items-center gap-[12px] text-left
            hover:bg-[var(--surface)] transition-colors duration-[120ms] disabled:opacity-40 ${focusRing}`}
        >
          <div className="w-[32px] h-[32px] rounded-full bg-[var(--well)] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[var(--ink-icon)]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[14px] font-medium text-[var(--ink)] leading-[1.4]">Sign in with Google</span>
            <span className={`${dataCls} leading-[1.4] truncate`}>Saved on this device only</span>
          </div>
          <LogIn className="w-4 h-4 text-[var(--ink-icon)] shrink-0" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`${shell} relative`}>
      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute left-[8px] right-[8px] bottom-full mb-[8px] z-[45] p-[4px]
            bg-[var(--surface)] border border-[var(--line)] rounded-[10px]
            shadow-[var(--shadow-overlay)]"
        >
          <div className="px-[12px] py-[8px]">
            <div className={`${dataCls} truncate`}>{user.email || 'Signed in'}</div>
          </div>
          <div className="h-px bg-[var(--line)] mx-[4px] my-[4px]" />

          {store?.unsyncedDiff && (
            <>
              <button
                role="menuitem"
                onClick={async () => {
                  setBusy(true);
                  try {
                    await store.mergeUnsyncedData();
                    setOpen(false);
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
                className={`w-full h-[32px] px-[12px] rounded-[6px] flex items-center gap-[12px]
                  text-[13px] text-[var(--ink)] hover:bg-[var(--well)]
                  transition-colors duration-[120ms] disabled:opacity-40 font-medium ${focusRing}`}
              >
                <CloudUpload className="w-4 h-4" strokeWidth={1.5} />
                {busy ? 'Merging…' : 'Merge local progress'}
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  store.clearUnsyncedData();
                  setOpen(false);
                }}
                className={`w-full h-[32px] px-[12px] rounded-[6px] flex items-center gap-[12px]
                  text-[13px] text-[var(--ink-2)] hover:bg-[var(--well)] hover:text-[var(--ink)]
                  transition-colors duration-[120ms] ${focusRing}`}
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                Discard local data
              </button>
              <div className="h-px bg-[var(--line)] mx-[4px] my-[4px]" />
            </>
          )}

          <button
            role="menuitem"
            onClick={signOut}
            disabled={busy}
            className={`w-full h-[32px] px-[12px] rounded-[6px] flex items-center gap-[12px]
              text-[13px] text-[var(--ink-2)] hover:bg-[var(--well)] hover:text-[var(--ink)]
              transition-colors duration-[120ms] disabled:opacity-40 ${focusRing}`}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}

      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`w-full h-[48px] px-[8px] rounded-[10px] flex items-center gap-[12px] text-left
          transition-colors duration-[120ms]
          ${open ? 'bg-[var(--surface)]' : 'hover:bg-[var(--surface)]'} ${focusRing}`}
      >
        <div className="w-[32px] h-[32px] rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-medium text-[12px] shrink-0">
          {initialsOf(user)}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[14px] font-medium text-[var(--ink)] truncate leading-[1.4]">
            {user.displayName || user.email}
          </span>
          <span className={`${dataCls} leading-[1.4] ${store?.unsyncedDiff ? 'text-[var(--grade-again-text)] font-medium' : ''}`}>
            {store?.unsyncedDiff ? 'Unsynced data' : 'Synced'}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-[var(--ink-icon)] shrink-0" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */

export default function Sidebar({
  data, allData, activeTier, setActiveTier, closeSidebar, store, onOpenSearch,
}) {
  const tiers = Object.entries(data || {});
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const problems = allData?.problems || [];
  const flagged = store.flagged ?? store.struggled ?? {};

  const { total, done, dueCount, revisionCount, bookmarkCount, perTier } = useMemo(() => {
    const now = Date.now();
    const perTier = {};
    let done = 0;
    for (const p of problems) {
      const t = (perTier[p.tier] ||= { total: 0, done: 0 });
      t.total += 1;
      if (store.completed?.[p.id]) { t.done += 1; done += 1; }
    }
    return {
      total: problems.length,
      done,
      dueCount: Object.values(store.srsData || {}).filter((s) => s && s.due <= now).length,
      revisionCount: problems.filter((p) => flagged[p.id]).length,
      bookmarkCount: problems.filter((p) => store.bookmarks?.[p.id]).length,
      perTier,
    };
  }, [problems, store.completed, store.srsData, store.bookmarks, flagged]);

  const go = (path) => {
    navigate(path);
    closeSidebar?.();
  };

  const handleTierClick = (id) => {
    setActiveTier(id);
    go('/');
  };

  const openSearch = () => {
    if (onOpenSearch) return onOpenSearch();
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: isMac, ctrlKey: !isMac, bubbles: true }),
    );
  };

  const navItems = [
    { id: 'today', icon: Calendar, label: 'Today', path: '/due', count: dueCount, isDue: true },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', path: '/bookmarks', count: bookmarkCount },
    { id: 'revision', icon: Flag, label: 'Needs revision', path: '/revision', count: revisionCount },
    { id: 'guide', icon: Info, label: 'Guide', path: '/help', count: null },
  ];

  return (
    <nav aria-label="Main" className="h-full w-full flex flex-col bg-[var(--paper-sunk)]">
      {/* Brand bar */}
      <div className="h-[56px] px-[16px] flex items-center justify-between shrink-0">
        <Brand />
        <div className="flex items-center gap-[4px]">
          <IconButton
            icon={Search}
            onClick={openSearch}
            aria-label={`Search (${isMac ? '⌘K' : 'Ctrl K'})`}
            title={`Search  ${isMac ? '⌘K' : 'Ctrl K'}`}
          />
          <ThemeMenu store={store} />
        </div>
      </div>

      {/* Overall progress */}
      <div className="px-[16px] pt-[8px] pb-[24px] shrink-0">
        <div className="flex items-center justify-between mb-[8px]">
          <span className={labelCls}>Overall</span>
          <span className={dataCls}>{done} / {total}</span>
        </div>
        <ProgressBar percent={total ? (done / total) * 100 : 0} />
      </div>

      {/* Scrollable: nav + tiers */}
      <div className="flex-1 min-h-0 overflow-y-auto px-[8px] pb-[32px]">
        <div className="flex flex-col gap-[2px]">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => go(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`${rowBase} gap-[12px] relative ${rowState(active)}`}
              >
                {active && (
                  <div className="absolute left-[-8px] w-[2px] h-[20px] rounded-full bg-[var(--nav-marker)]" />
                )}
                <item.icon
                  className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-icon)]'}`}
                  strokeWidth={1.5}
                />
                <span className="flex-1 text-[14px] truncate">{item.label}</span>
                {item.count > 0 && (
                  <span className={`font-mono text-[12px] tabular-nums font-normal
                    ${item.isDue ? 'text-[var(--signal)]' : 'text-[var(--ink-3)]'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {TIER_GROUPS.map(([groupName, ids]) => {
          const groupTiers = tiers.filter(([id]) => ids.includes(parseInt(id, 10)));
          if (!groupTiers.length) return null;
          return (
            <section key={groupName} className="mt-[32px]" aria-label={groupName}>
              <h3 className={`${labelCls} px-[8px] mb-[8px] font-normal`}>{groupName}</h3>
              <div className="flex flex-col gap-[2px]">
                {groupTiers.map(([id, tier]) => {
                  const active = activeTier === id && location.pathname === '/';
                  const stats = perTier[parseInt(id, 10)] || { total: 0, done: 0 };
                  const complete = stats.total > 0 && stats.done === stats.total;
                  return (
                    <button
                      key={id}
                      onClick={() => handleTierClick(id)}
                      aria-current={active ? 'page' : undefined}
                      className={`${rowBase} gap-[12px] relative ${rowState(active)}`}
                    >
                      {active && (
                        <div className="absolute left-[-8px] w-[2px] h-[20px] rounded-full bg-[var(--nav-marker)]" />
                      )}
                      <span className={`${dataCls} w-[20px] shrink-0 font-normal`}>
                        {String(id).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[14px] truncate">{tier.name}</span>
                      {complete ? (
                        <svg
                          className="w-[12px] h-[12px] text-[var(--ink-3)] shrink-0"
                          viewBox="0 0 12 12" fill="none" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                          aria-label="Complete"
                        >
                          <polyline points="2.5 6 5 8.5 9.5 3.5" />
                        </svg>
                      ) : (
                        <span className={`${dataCls} shrink-0 font-normal`}>
                          {stats.done}/{stats.total}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <AccountSection auth={auth} store={store} />
    </nav>
  );
}