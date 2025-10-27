'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { Account } from '@/lib/types';
import { 
  AccountDetails, 
  AccountLayout,
  TotalBalanceCard
} from '@/components/pages/accounts';
import { CategorizedAccountList } from '@/components/pages/accounts/CategorizedAccountList';
import { AddAccountForm } from '@/components/pages/accounts/AddAccountForm';
import { useAccountContext } from '@/contexts/AccountContext';
import { useTransactionContext } from '@/contexts/TransactionContext';

export default function Accounts() {
  const { state } = useAccountContext();
  const { state: transactionState } = useTransactionContext();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const totalBalance = state.accounts.reduce((sum, account) => sum + account.balance, 0);

  // Get current month's transactions for selected account
  const currentMonthAccountTransactions = useMemo(() => {
    if (!selectedAccount) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactionState.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        t.accountId === selectedAccount.id &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  }, [selectedAccount, transactionState.transactions]);

  const toggleAccountExpansion = (accountId: string) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      
      // If clicking on an already expanded account, close it
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        // Close all other accounts and open the selected one
        newSet.clear();
        newSet.add(accountId);
        
        // Smooth scroll to the selected account after a short delay
        setTimeout(() => {
          const element = document.getElementById(`account-${accountId}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
      
      return newSet;
    });
  };

  useEffect(() => {
    const checkLayoutMode = () => {
      const width = window.innerWidth;
      
      // Simplified logic - only check overflow on specific breakpoints
      const isVeryNarrow = width < 1100;
      const isTooNarrow = width < 1200 && width > 1024;
      
      // Only check for element overflow if we're in the problematic range
      let isOverlapping = false;
      if (width >= 1024 && width <= 1200) {
        const accountsList = document.querySelector('[data-accounts-list]');
        const detailsPanel = document.querySelector('[data-details-panel]');
        
        if (accountsList && detailsPanel) {
          const accountsRect = accountsList.getBoundingClientRect();
          const detailsRect = detailsPanel.getBoundingClientRect();
          isOverlapping = accountsRect.right > detailsRect.left - 20;
        }
      }
      
      // Determine layout mode based on width and overflow detection
      if (width < 768 || isVeryNarrow) {
        setLayoutMode('mobile');
      } else if (width < 1024 || isTooNarrow || isOverlapping) {
        setLayoutMode('tablet');
      } else {
        setLayoutMode('desktop');
      }
    };

    // Initial check
    checkLayoutMode();
    
    // More aggressive debouncing for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkLayoutMode, 200); // Increased debounce time
    };

    window.addEventListener('resize', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Konta</h1>
          <AddAccountForm />
        </div>

        <TotalBalanceCard totalBalance={totalBalance} />

        <AccountLayout layoutMode={layoutMode}>
          {/* Accounts List */}
          <div className={`${layoutMode === 'mobile' ? 'col-span-1' : layoutMode === 'tablet' ? 'col-span-1 xl:col-span-2' : 'lg:col-span-2'}`} data-accounts-list>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Lista kont</h2>
            <CategorizedAccountList
              accounts={state.accounts}
              transactions={transactionState.transactions}
              selectedAccount={selectedAccount}
              expandedAccounts={expandedAccounts}
              layoutMode={layoutMode}
              onSelectAccount={setSelectedAccount}
              onToggleExpansion={toggleAccountExpansion}
            />
          </div>

          {/* Account Details - Responsive visibility */}
          <div className={`${layoutMode === 'mobile' ? 'hidden' : layoutMode === 'tablet' ? 'hidden xl:block xl:col-span-1' : 'hidden lg:block lg:col-span-1'}`} data-details-panel>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Szczegóły konta</h2>
            <AccountDetails 
              account={selectedAccount}
              transactions={currentMonthAccountTransactions}
            />
          </div>
        </AccountLayout>
      </div>
    </div>
  );
}
