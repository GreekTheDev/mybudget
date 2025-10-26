'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

interface MoreItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const moreItems: MoreItem[] = [
  {
    name: 'Subskrypcje',
    href: '/subscriptions',
    description: 'Zarządzaj swoimi subskrypcjami',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    name: 'Cashflow',
    href: '/cashflow',
    description: 'Analiza przepływów pieniężnych',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    name: 'Raporty',
    href: '/reports',
    description: 'Szczegółowe raporty finansowe',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Cele',
    href: '/goals',
    description: 'Ustawiaj i śledź swoje cele finansowe',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    name: 'Przewodnik',
    href: '/guide',
    description: 'Przewodnik po aplikacji',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: 'Ustawienia',
    href: '/settings',
    description: 'Ustawienia aplikacji',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function MorePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className="min-h-screen p-4 pb-24"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 
              className="text-2xl font-bold"
              style={{ color: 'var(--foreground)' }}
            >
              Więcej funkcji
            </h1>
            {/* Theme toggle button */}
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                toggleTheme();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
              aria-label="Zmień motyw"
            >
              {theme.mode === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
          <p 
            className="text-sm opacity-70"
            style={{ color: 'var(--foreground)' }}
          >
            Dostęp do wszystkich funkcji aplikacji
          </p>
        </div>

        <div className="grid gap-3">
          {moreItems
            .filter((item) => !['/cashflow', '/reports', '/guide'].includes(item.href))
            .map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex-shrink-0 p-2 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff'
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-semibold text-base mb-1"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.name}
                  </h3>
                  <p 
                    className="text-sm opacity-70 truncate"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg 
                    className="w-5 h-5 opacity-50" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
