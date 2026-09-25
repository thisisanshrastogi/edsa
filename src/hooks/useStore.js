import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { schedule, snapToStartOfDay, GRADES } from '../lib/srs';
import { useTheme } from './useTheme';

export function useStore() {
  const { user } = useAuth();
  
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('dsa_completed');
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('dsa_bookmarks');
    return saved ? JSON.parse(saved) : {};
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('dsa_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [struggled, setStruggled] = useState(() => {
    const saved = localStorage.getItem('dsa_struggled');
    return saved ? JSON.parse(saved) : {};
  });

  const [srsData, setSrsData] = useState(() => {
    const saved = localStorage.getItem('dsa_srs');
    return saved ? JSON.parse(saved) : {};
  });

  const [isInitializing, setIsInitializing] = useState(false);
  const loadingRef = useRef(false); // Synchronous guard — blocks sync effects immediately
  const [unsyncedDiff, setUnsyncedDiff] = useState(null);
  
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const authPromptShownRef = useRef(false);

  const checkAuthPrompt = () => {
    if (!user && !authPromptShownRef.current) {
      setShowAuthPrompt(true);
      authPromptShownRef.current = true;
    }
  };

  // Fetch from Firestore on user login
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      loadingRef.current = true; // Instant — sync effects see this in the same render cycle
      setIsInitializing(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        
        let loadedCompleted = completed;
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Detect if local storage has progress that Firestore doesn't
          const hasLocalCompleted = Object.keys(completed).some(k => completed[k] && !data.completed?.[k]);
          const hasLocalBookmarks = Object.keys(bookmarks).some(k => bookmarks[k] && !data.bookmarks?.[k]);
          const hasLocalStruggled = Object.keys(struggled).some(k => struggled[k] && !data.struggled?.[k]);
          const hasLocalNotes = Object.keys(notes).some(k => notes[k] && !data.notes?.[k]);
          
          if (hasLocalCompleted || hasLocalBookmarks || hasLocalStruggled || hasLocalNotes) {
            setUnsyncedDiff({
              completed: { ...completed },
              bookmarks: { ...bookmarks },
              notes: { ...notes },
              struggled: { ...struggled },
              srsData: { ...srsData }
            });
          }

          if (data.completed) { setCompleted(data.completed); loadedCompleted = data.completed; }
          if (data.bookmarks) setBookmarks(data.bookmarks);
          if (data.notes) setNotes(data.notes);
          if (data.struggled) setStruggled(data.struggled);
        } else {
          // New user — start with a clean account.
          // If localStorage has leftover progress, offer the merge banner instead of auto-pushing.
          const hasLocalData =
            Object.values(completed).some(Boolean) ||
            Object.values(bookmarks).some(Boolean) ||
            Object.values(struggled).some(Boolean) ||
            Object.values(notes).some(Boolean);

          if (hasLocalData || Object.keys(srsData).length > 0) {
            setUnsyncedDiff({
              completed: { ...completed },
              bookmarks: { ...bookmarks },
              notes: { ...notes },
              struggled: { ...struggled },
              srsData: { ...srsData }
            });
          }

          // Reset local state to empty for the fresh account
          setCompleted({});
          setBookmarks({});
          setNotes({});
          setStruggled({});
          loadedCompleted = {};
        }

        // Load SRS data
        const problemsRef = collection(db, 'users', user.uid, 'problems');
        const problemsSnap = await getDocs(problemsRef);
        const loadedSrsData = {};
        problemsSnap.forEach(d => {
          loadedSrsData[d.id] = d.data();
        });

        // Legacy completed problems without SRS stay as simple "done" marks
        // — no SRS cards are created for them, they won't appear in review queues.
        setSrsData(loadedSrsData);
      } catch (e) {
        console.error("Error loading user data from Firestore:", e);
      } finally {
        setIsInitializing(false);
        loadingRef.current = false;
      }
    }
    loadUserData();
  }, [user]);

  // Sync state to local storage and Firestore
  useEffect(() => {
    if (isInitializing || loadingRef.current) return;
    localStorage.setItem('dsa_completed', JSON.stringify(completed));
    if (user) {
      setDoc(doc(db, 'users', user.uid), { completed }, { merge: true });
    }
  }, [completed, user, isInitializing]);

  useEffect(() => {
    if (isInitializing || loadingRef.current) return;
    localStorage.setItem('dsa_bookmarks', JSON.stringify(bookmarks));
    if (user) {
      setDoc(doc(db, 'users', user.uid), { bookmarks }, { merge: true });
    }
  }, [bookmarks, user, isInitializing]);

  useEffect(() => {
    if (isInitializing || loadingRef.current) return;
    localStorage.setItem('dsa_notes', JSON.stringify(notes));
    if (user) {
      setDoc(doc(db, 'users', user.uid), { notes }, { merge: true });
    }
  }, [notes, user, isInitializing]);

  useEffect(() => {
    if (isInitializing || loadingRef.current) return;
    localStorage.setItem('dsa_struggled', JSON.stringify(struggled));
    if (user) {
      setDoc(doc(db, 'users', user.uid), { struggled }, { merge: true });
    }
  }, [struggled, user, isInitializing]);

  useEffect(() => {
    if (isInitializing || loadingRef.current) return;
    localStorage.setItem('dsa_srs', JSON.stringify(srsData));
  }, [srsData, isInitializing]);

  const { theme, mode, resolvedMode, setTheme, setMode } = useTheme();

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('dsa_compact');
    return saved ? JSON.parse(saved) : false;
  });

  const [focusMode, setFocusMode] = useState(false); // Session only

  useEffect(() => {
    localStorage.setItem('dsa_compact', JSON.stringify(compactMode));
  }, [compactMode]);


  const recordAttempt = async (problemId, grade, timeTakenMinutes = null, notes = null) => {
    checkAuthPrompt();
    let mappedGrade = grade;
    if (grade === 1) mappedGrade = GRADES.AGAIN;
    else if (grade === 2) mappedGrade = GRADES.HARD;
    else if (grade === 3) mappedGrade = GRADES.GOOD;
    else if (grade === 4) mappedGrade = GRADES.EASY;

    const currentSrs = srsData[problemId] || null;
    const nextSrs = schedule(currentSrs, mappedGrade, Date.now());
    
    // Update local SRS state
    setSrsData(prev => ({ ...prev, [problemId]: nextSrs }));
    
    // Ensure completed is checked visually
    if (!completed[problemId]) {
      setCompleted(prev => ({ ...prev, [problemId]: true }));
    }

    if (user) {
      try {
        const probRef = doc(db, 'users', user.uid, 'problems', String(problemId));
        await setDoc(probRef, nextSrs, { merge: true });
        
        const attemptsRef = collection(probRef, 'attempts');
        await addDoc(attemptsRef, {
          grade,
          timestamp: Date.now(),
          ...(timeTakenMinutes && { timeTakenMinutes }),
          ...(notes && { notes })
        });
      } catch (err) {
        console.error("Failed to record attempt in Firestore:", err);
      }
    }
  };

  const removeSrs = async (problemId) => {
    setSrsData(prev => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
    if (user) {
      try {
        const probRef = doc(db, 'users', user.uid, 'problems', String(problemId));
        await deleteDoc(probRef);
      } catch (err) {
        console.error("Failed to remove SRS from Firestore:", err);
      }
    }
  };


  const seedMockData = () => {
    const mockSrs = { ...srsData };
    [1, 2, 3].forEach(id => {
      mockSrs[id] = {
        ease: 2.5,
        interval: 3,
        reps: 1,
        lapses: 0,
        due: Date.now() - 24 * 60 * 60 * 1000, // Due yesterday
        lastReviewed: Date.now() - 4 * 24 * 60 * 60 * 1000
      };
      if (user) {
        setDoc(doc(db, 'users', user.uid, 'problems', String(id)), mockSrs[id], { merge: true });
      }
    });
    setSrsData(mockSrs);
    const mockCompleted = { ...completed, 1: true, 2: true, 3: true };
    setCompleted(mockCompleted);
    if (user) {
       setDoc(doc(db, 'users', user.uid), { completed: mockCompleted }, { merge: true });
    }
  };

  const toggleStruggled = (id) => {
    checkAuthPrompt();
    setStruggled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompactMode = () => setCompactMode(prev => !prev);
  const toggleFocusMode = () => setFocusMode(prev => !prev);

  // Still exposing toggleComplete for legacy/un-grading purposes if needed, 
  // though recordAttempt should be the primary entry point now for completions.
  const toggleComplete = (id) => {
    checkAuthPrompt();
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id) => {
    checkAuthPrompt();
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveNote = (id, note) => {
    checkAuthPrompt();
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  const toggleTheme = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('light'); // The prompt says: "Keep the existing 'Toggle theme' command, now cycling light ↔ dark (and leaving system mode if it was on)."
    } else {
      setMode(resolvedMode === 'light' ? 'dark' : 'light');
    }
  };

  const mergeUnsyncedData = async () => {
    if (!user || !unsyncedDiff) return;
    
    // Merge local diff into current state
    const newCompleted = { ...completed, ...unsyncedDiff.completed };
    const newBookmarks = { ...bookmarks, ...unsyncedDiff.bookmarks };
    const newNotes = { ...notes, ...unsyncedDiff.notes };
    const newStruggled = { ...struggled, ...unsyncedDiff.struggled };
    
    // Merge SRS data (local wins for problems not yet in Firestore)
    const diffSrs = unsyncedDiff.srsData || {};
    const newSrsData = { ...srsData };
    Object.keys(diffSrs).forEach(id => {
      if (!newSrsData[id]) newSrsData[id] = diffSrs[id];
    });
    
    setCompleted(newCompleted);
    setBookmarks(newBookmarks);
    setNotes(newNotes);
    setStruggled(newStruggled);
    setSrsData(newSrsData);
    
    setUnsyncedDiff(null); // Clear the diff
    
    // Push merged state to Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { 
      completed: newCompleted, 
      bookmarks: newBookmarks, 
      notes: newNotes, 
      struggled: newStruggled 
    }, { merge: true });

    // Push merged SRS cards to Firestore
    const problemsRef = collection(db, 'users', user.uid, 'problems');
    const srsUpdates = Object.entries(diffSrs)
      .filter(([id]) => !srsData[id]) // Only push ones that weren't already in Firestore
      .map(([id, data]) => setDoc(doc(problemsRef, String(id)), data, { merge: true }));
    if (srsUpdates.length > 0) await Promise.all(srsUpdates);
  };

  const clearUnsyncedData = () => {
    setUnsyncedDiff(null);
  };

  return {
    completed, toggleComplete,
    bookmarks, toggleBookmark,
    notes, saveNote,
    theme, mode, resolvedMode, setTheme, setMode, toggleTheme,
    struggled, toggleStruggled,
    compactMode, toggleCompactMode,
    focusMode, toggleFocusMode,
    srsData, recordAttempt, removeSrs, seedMockData,
    unsyncedDiff, mergeUnsyncedData, clearUnsyncedData,
    showAuthPrompt, setShowAuthPrompt
  };
}
