import { useState, useEffect } from 'react';

export function useStore() {
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

  useEffect(() => {
    localStorage.setItem('dsa_completed', JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem('dsa_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('dsa_notes', JSON.stringify(notes));
  }, [notes]);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dsa_theme');
    // Default to system preference if no saved theme
    if (!saved) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('dsa_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [struggled, setStruggled] = useState(() => {
    const saved = localStorage.getItem('dsa_struggled');
    return saved ? JSON.parse(saved) : {};
  });

  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('dsa_compact');
    return saved ? JSON.parse(saved) : false;
  });

  const [focusMode, setFocusMode] = useState(false); // Session only

  useEffect(() => {
    localStorage.setItem('dsa_struggled', JSON.stringify(struggled));
  }, [struggled]);

  useEffect(() => {
    localStorage.setItem('dsa_compact', JSON.stringify(compactMode));
  }, [compactMode]);

  const toggleStruggled = (id) => {
    setStruggled((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleCompactMode = () => setCompactMode(prev => !prev);
  const toggleFocusMode = () => setFocusMode(prev => !prev);

  const toggleComplete = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveNote = (id, note) => {
    setNotes((prev) => ({
      ...prev,
      [id]: note
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    completed, toggleComplete,
    bookmarks, toggleBookmark,
    notes, saveNote,
    theme, toggleTheme,
    struggled, toggleStruggled,
    compactMode, toggleCompactMode,
    focusMode, toggleFocusMode
  };
}
