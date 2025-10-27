'use client';

import { ReactNode } from 'react';
import { AccountProvider } from '@/contexts/AccountContext';
import { TransactionProvider } from '@/contexts/TransactionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AccountProvider>
      <BudgetProvider>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </BudgetProvider>
    </AccountProvider>
  );
}
