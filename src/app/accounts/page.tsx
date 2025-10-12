'use client';

import { useState, useEffect } from 'react';
import { Account, Transaction } from '@/lib/types';
import { 
  AccountCard, 
  AccountDetails, 
  AccountLayout,
  TotalBalanceCard
} from '@/components/pages/accounts';

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Konto główne',
    type: 'checking',
    balance: 3350,
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Oszczędności',
    type: 'savings',
    balance: 15000,
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Karta kredytowa',
    type: 'credit',
    balance: -1200,
    color: '#ef4444',
  },
  {
    id: '4',
    name: 'Inwestycje',
    type: 'investment',
    balance: 25000,
    color: '#8b5cf6',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    type: 'income',
    category: 'Wynagrodzenie',
    description: 'Wypłata',
    date: new Date('2024-01-15'),
    accountId: '1',
  },
  {
    id: '2',
    amount: 1200,
    type: 'expense',
    category: 'Czynsz',
    description: 'Opłata za mieszkanie',
    date: new Date('2024-01-10'),
    accountId: '1',
  },
  {
    id: '3',
    amount: 300,
    type: 'expense',
    category: 'Żywność',
    description: 'Zakupy spożywcze',
    date: new Date('2024-01-12'),
    accountId: '1',
  },
  {
    id: '4',
    amount: 1000,
    type: 'income',
    category: 'Oszczędności',
    description: 'Przelew do oszczędności',
    date: new Date('2024-01-14'),
    accountId: '2',
  },
];

export default function Accounts() {
  const [accounts] = useState<Account[]>(mockAccounts);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

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
          <button
            onClick={() => {/* TODO: Add account functionality */}}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          >
            Dodaj konto
          </button>
        </div>

        <TotalBalanceCard totalBalance={totalBalance} />

        <AccountLayout layoutMode={layoutMode}>
          {/* Accounts List */}
          <div className={`${layoutMode === 'mobile' ? 'col-span-1' : layoutMode === 'tablet' ? 'col-span-1 xl:col-span-2' : 'lg:col-span-2'}`} data-accounts-list>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Lista kont</h2>
            <div className="space-y-4">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  transactions={getAccountTransactions(account.id)}
                  isExpanded={expandedAccounts.has(account.id)}
                  layoutMode={layoutMode}
                  onClick={() => setSelectedAccount(account)}
                  onToggleExpansion={() => toggleAccountExpansion(account.id)}
                />
              ))}
            </div>
          </div>

          {/* Account Details - Responsive visibility */}
          <div className={`${layoutMode === 'mobile' ? 'hidden' : layoutMode === 'tablet' ? 'hidden xl:block xl:col-span-1' : 'hidden lg:block lg:col-span-1'}`} data-details-panel>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Szczegóły konta</h2>
            <AccountDetails 
              account={selectedAccount}
              transactions={selectedAccount ? getAccountTransactions(selectedAccount.id) : []}
            />
          </div>
        </AccountLayout>
      </div>
    </div>
  );
}
