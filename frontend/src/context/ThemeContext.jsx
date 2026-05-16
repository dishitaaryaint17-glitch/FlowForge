import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'flowforge-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const ThemeContext = createContext(null);

const applyThemeToDocument = (nextTheme) => {
  document.documentElement.dataset.theme = nextTheme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply immediately (helps prevent flash on first load)
  useEffect(() => {
    applyThemeToDocument(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);


  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isLight: theme === 'light',
      setTheme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};