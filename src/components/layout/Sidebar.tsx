'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  {
    name: 'Pulpit',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
  },
  {
    name: 'Budżet',
    href: '/budget',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Konta',
    href: '/accounts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    name: 'Transakcje',
    href: '/transactions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Subskrypcje',
    href: '/subscriptions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    name: 'Przepływ gotówki',
    href: '/cashflow',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    name: 'Raporty',
    href: '/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Cele',
    href: '/goals',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    name: 'Przewodnik',
    href: '/guide',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: 'Ustawienia',
    href: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r transition-all duration-300 ease-in-out",
        " border-border overflow-hidden"
      )}
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        width: isCollapsed ? '5rem' : '16rem',
        transition: 'width 300ms ease-in-out, background-color 200ms ease-in-out, border-color 200ms ease-in-out',
      }}
    >
      {/* Header with logo */}
      <div className={cn(
        "flex items-center p-4 border-b border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "justify-center" : "justify-start"
      )} style={{ borderColor: 'var(--border)' }}>
        <div className={cn(
          "flex items-center",
          isCollapsed ? "gap-0" : "gap-3"
        )}>
          <Image
            src="/mybudget_logo.png"
            alt="MyBudget Logo"
            width={32}
            height={32}
            className="flex-shrink-0 transition-transform duration-300 ease-in-out"
          />
          <h2 
            className={cn(
              "text-lg font-semibold transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}
            style={{ color: 'var(--foreground)' }}
          >
            placesobie
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150",
                    "hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "active:scale-95",
                    isActive && "bg-opacity-20"
                  )}
                  style={{
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--foreground)',
                  }}
                  onClick={(e) => {
                    // Prevent double-click issues by ensuring immediate navigation
                    e.currentTarget.blur();
                  }}
                >
                  <span 
                    className="flex-shrink-0"
                    style={{ 
                      color: isActive ? '#ffffff' : 'var(--foreground)' 
                    }}
                  >
                    {item.icon}
                  </span>
                  <span 
                    className={cn(
                      "font-medium truncate transition-all duration-300 ease-in-out overflow-hidden",
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                    style={{ color: isActive ? '#ffffff' : 'var(--foreground)' }}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with action buttons */}
      <div className="p-4 border-t border-border transition-all duration-300 ease-in-out" style={{ borderColor: 'var(--border)' }}>
        <div className={cn(
          "flex gap-4 transition-all duration-300 ease-in-out",
          isCollapsed ? "flex-col items-center" : "flex-row justify-between"
        )}>
          {/* Add button */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
            }}
            aria-label="Dodaj nowy element"
            onClick={(e) => {
              e.currentTarget.blur();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

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

          {/* Expand/Collapse button */}
          <button
            onClick={(e) => {
              e.currentTarget.blur();
              toggleCollapse();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
            }}
            aria-label={isCollapsed ? 'Rozwiń' : 'Zwiń'}
          >
            <svg 
              className={cn("w-5 h-5 transition-transform duration-500 ease-in-out", isCollapsed && "rotate-180")} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
