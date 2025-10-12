import { ReactNode } from 'react';

interface BudgetLayoutProps {
  children: ReactNode;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
}

export function BudgetLayout({ children, layoutMode }: BudgetLayoutProps) {
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
