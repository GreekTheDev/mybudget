import type { Theme } from './types';

export const lightTheme: Theme = {
  mode: 'light',
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#f8fafc',
  border: '#e2e8f0',
};

export const darkTheme: Theme = {
  mode: 'dark',
  primary: '#60a5fa',
  secondary: '#94a3b8',
  background: '#171717',
  foreground: '#f8fafc',
  card: '#1e293b',
  border: '#334155',
};

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};
