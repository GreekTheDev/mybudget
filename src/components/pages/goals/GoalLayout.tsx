import { ReactNode } from 'react';

interface GoalLayoutProps {
  children: ReactNode;
  isMobile: boolean;
}

export function GoalLayout({ children, isMobile }: GoalLayoutProps) {
  if (isMobile) {
    return (
      <div className="space-y-8">
        {children}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {children}
    </div>
  );
}
