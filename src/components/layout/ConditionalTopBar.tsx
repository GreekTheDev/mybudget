'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';

export default function ConditionalTopBar() {
  const pathname = usePathname();
  
  // Hide TopBar on settings page but maintain spacing
  if (pathname === '/settings') {
    return <div className="h-24" />; // Same height as TopBar (py-4 + content)
  }
  
  return <TopBar />;
}
