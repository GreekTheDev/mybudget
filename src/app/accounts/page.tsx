'use client';

import { useState, useEffect } from 'react';
import { Account, Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

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
  const [isMobile, setIsMobile] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Konto rozliczeniowe';
      case 'savings': return 'Oszczędności';
      case 'credit': return 'Karta kredytowa';
      case 'investment': return 'Inwestycje';
      default: return type;
    }
  };

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
        setIsMobile(true);
      } else if (width < 1024 || isTooNarrow || isOverlapping) {
        setLayoutMode('tablet');
        setIsMobile(false);
      } else {
        setLayoutMode('desktop');
        setIsMobile(false);
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

        {/* Total Balance */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Całkowite saldo</h2>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
        </div>

        <div className={`grid gap-8 ${
          layoutMode === 'mobile' 
            ? 'grid-cols-1' 
            : layoutMode === 'tablet' 
            ? 'grid-cols-1 xl:grid-cols-3' 
            : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {/* Accounts List */}
          <div className={`${layoutMode === 'mobile' ? 'col-span-1' : layoutMode === 'tablet' ? 'col-span-1 xl:col-span-2' : 'lg:col-span-2'}`} data-accounts-list>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Lista kont</h2>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  id={`account-${account.id}`}
                  className=" border border-border rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
                  onClick={(e) => {
                    // On mobile/tablet, toggle expansion; on desktop, select account
                    if (layoutMode === 'mobile' || layoutMode === 'tablet') {
                      e.preventDefault();
                      toggleAccountExpansion(account.id);
                    } else {
                      setSelectedAccount(account);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{account.name}</h3>
                        <p className="text-sm text-secondary">{getAccountTypeLabel(account.type)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatCurrency(account.balance)}
                      </p>
                      <p className="text-sm text-secondary">
                        {getAccountTransactions(account.id).length} transakcji
                      </p>
                    </div>
                  </div>

                  {/* Mobile/Tablet: Show transactions when expanded */}
                  <div className={`${layoutMode === 'desktop' ? 'hidden' : ''} transition-all duration-300 overflow-hidden ${
                    expandedAccounts.has(account.id) ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-foreground mb-3">Ostatnie transakcje</h4>
                      <div className="space-y-2">
                        {getAccountTransactions(account.id)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 3)
                          .map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-2 rounded">
                              <div>
                                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                                <p className="text-xs text-secondary">{transaction.category}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-secondary">
                                  {new Date(transaction.date).toLocaleDateString('pl-PL')}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details - Responsive visibility */}
          <div className={`${layoutMode === 'mobile' ? 'hidden' : layoutMode === 'tablet' ? 'hidden xl:block xl:col-span-1' : 'hidden lg:block lg:col-span-1'}`} data-details-panel>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Szczegóły konta</h2>
            {selectedAccount ? (
              <div className=" border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedAccount.color }}
                  />
                  <h3 className="text-lg font-semibold text-foreground">{selectedAccount.name}</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-secondary mb-1">Typ konta</p>
                    <p className="font-medium text-foreground">{getAccountTypeLabel(selectedAccount.type)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary mb-1">Saldo</p>
                    <p className={`text-2xl font-bold ${selectedAccount.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary mb-1">Liczba transakcji</p>
                    <p className="font-medium text-foreground">
                      {getAccountTransactions(selectedAccount.id).length}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3">Ostatnie transakcje</h4>
                  <div className="space-y-2">
                    {getAccountTransactions(selectedAccount.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 3)
                      .map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                            <p className="text-xs text-secondary">{transaction.category}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-secondary">
                              {new Date(transaction.date).toLocaleDateString('pl-PL')}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className=" border border-border rounded-lg p-6">
                <p className="text-secondary text-center">Wybierz konto, aby zobaczyć szczegóły</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
