import { ReactNode } from 'react';

interface AccountLayoutProps {
  children: ReactNode;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
}

export function AccountLayout({ children, layoutMode }: AccountLayoutProps) {
  return (
    <div className={`grid gap-8 ${
      layoutMode === 'mobile' 
        ? 'grid-cols-1' 
        : layoutMode === 'tablet' 
        ? 'grid-cols-1 xl:grid-cols-3' 
        : 'grid-cols-1 lg:grid-cols-3'
    }`}>
      {children}
    </div>
  );
}
