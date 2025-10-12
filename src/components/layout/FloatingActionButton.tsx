'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type FABPosition = 'left' | 'right' | 'disabled';

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [position, setPosition] = useState<FABPosition>('right');

  useEffect(() => {
    // Load position from localStorage
    const savedPosition = localStorage.getItem('fab-position') as FABPosition;
    if (savedPosition && ['left', 'right', 'disabled'].includes(savedPosition)) {
      setPosition(savedPosition);
    }

    // Listen for changes from settings (custom event for same-window updates)
    const handlePositionChange = (e: CustomEvent) => {
      const newPosition = e.detail.position as FABPosition;
      if (['left', 'right', 'disabled'].includes(newPosition)) {
        setPosition(newPosition);
      }
    };

    window.addEventListener('fab-position-change', handlePositionChange as EventListener);
    return () => window.removeEventListener('fab-position-change', handlePositionChange as EventListener);
  }, []);

  const handleClick = () => {
    // TODO: Implement plus button functionality
    console.log('Floating Action Button clicked');
    onClick?.();
  };

  // Don't render if disabled
  if (position === 'disabled') {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "md:hidden fixed z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-opacity-30",
        "bottom-24", // Above the navbar (navbar is h-20, so 24 = 20 + 4 for spacing)
        position === 'left' ? 'left-4' : 'right-4'
      )}
      style={{
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <svg
        className="w-6 h-6 mx-auto my-auto block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
}

// Export helper function for settings
export const updateFABPosition = (newPosition: FABPosition) => {
  localStorage.setItem('fab-position', newPosition);
  // Trigger a custom event to update all instances (storage event doesn't work within same window)
  window.dispatchEvent(new CustomEvent('fab-position-change', {
    detail: { position: newPosition }
  }));
};

export const getFABPosition = (): FABPosition => {
  if (typeof window === 'undefined') return 'right';
  const saved = localStorage.getItem('fab-position') as FABPosition;
  return saved && ['left', 'right', 'disabled'].includes(saved) ? saved : 'right';
};