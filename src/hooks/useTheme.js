import { useState, useEffect, useCallback } from 'react';

export const THEMES = [
  {
    id: 'usuzumi',
    label: 'Usuzumi',
    kanji: '薄墨',
    swatchLight: '#E0262E', // accent red
    swatchDark: '#FF5252',
  },
  {
    id: 'washi',
    label: 'Washi',
    kanji: '和紙',
    swatchLight: '#1B1A17', // ink
    swatchDark: '#EDEBE4',
  }
];

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('edsa-theme') || 'usuzumi';
    } catch (e) {
      return 'usuzumi';
    }
  });

  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem('edsa-mode') || 'system';
    } catch (e) {
      return 'system';
    }
  });

  const [resolvedMode, setResolvedMode] = useState(() => {
    if (mode === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  });

  const updateClasses = useCallback((currentTheme, currentMode) => {
    const isDark = currentMode === 'dark' || (currentMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setResolvedMode(isDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      const paperColor = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor && paperColor) {
        metaThemeColor.setAttribute('content', paperColor);
      }

      // Update favicon
      const faviconSvg = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
      if (faviconSvg) {
        faviconSvg.setAttribute('href', `/favicon-${currentTheme}.svg`);
      }
    }, 0);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('edsa-theme', newTheme);
    } catch (e) { }
    updateClasses(newTheme, mode);
  };

  const setMode = (newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('edsa-mode', newMode);
    } catch (e) { }
    updateClasses(theme, newMode);
  };

  useEffect(() => {
    updateClasses(theme, mode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        updateClasses(theme, 'system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mode, updateClasses]);

  return { theme, mode, resolvedMode, setTheme, setMode };
}
