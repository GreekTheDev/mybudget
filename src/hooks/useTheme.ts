'use client';

import { useState, useEffect } from 'react';
import type { Theme } from '@/lib/types';
import { getTheme } from '@/lib/theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return getTheme(savedTheme);
      }
      // Only use system theme if no saved theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return getTheme(systemTheme);
    }
    return getTheme('light');
  });

  // Update CSS variables whenever theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--background', theme.background);
      document.documentElement.style.setProperty('--foreground', theme.foreground);
      document.documentElement.style.setProperty('--card', theme.card);
      document.documentElement.style.setProperty('--border', theme.border);
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
    }
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(getTheme(savedTheme));
      }
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      // Only update if no explicit theme is saved
      if (!savedTheme || (savedTheme !== 'dark' && savedTheme !== 'light')) {
        setTheme(getTheme(e.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    const newTheme = getTheme(newMode);
    setTheme(newTheme);
    localStorage.setItem('theme', newMode);
  };

  return { theme, toggleTheme };
};
