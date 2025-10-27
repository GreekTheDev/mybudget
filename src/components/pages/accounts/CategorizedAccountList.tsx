'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Account, Transaction } from '@/lib/types';
import { AccountCard } from './AccountCard';
import { accountCategories, getCategoryForAccountType } from '@/lib/accountCategories';
import { formatCurrency } from '@/lib/utils';

interface CategorizedAccountListProps {
  accounts: Account[];
  transactions: Transaction[];
  selectedAccount: Account | null;
  expandedAccounts: Set<string>;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  onSelectAccount: (account: Account) => void;
  onToggleExpansion: (accountId: string) => void;
}

export function CategorizedAccountList({
  accounts,
  transactions,
  selectedAccount,
  expandedAccounts,
  layoutMode,
  onSelectAccount,
  onToggleExpansion
}: CategorizedAccountListProps) {
  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(accountCategories.map(cat => cat.id))
  );

  // Filter transactions for current month
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  }, [transactions]);

  // Group accounts by category
  const accountsByCategory = accountCategories.map(category => {
    const categoryAccounts = accounts.filter(
      account => getCategoryForAccountType(account.type) === category.id
    );
    const categoryBalance = categoryAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return {
      ...category,
      accounts: categoryAccounts,
      balance: categoryBalance
    };
  }).filter(category => category.accounts.length > 0); // Only show categories with accounts

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">Brak kont</p>
        <p className="text-sm">Dodaj pierwsze konto, aby zacząć śledzić swoje finanse</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {accountsByCategory.map((category) => {
        const isExpanded = expandedCategories.has(category.id);
        
        return (
          <div key={category.id} className="space-y-3">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isExpanded ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <h3 className="text-lg font-semibold text-foreground">
                  {category.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({category.accounts.length})
                </span>
              </div>
              <div className={`text-lg font-bold ${
                category.balance >= 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {formatCurrency(category.balance)}
              </div>
            </button>

            {/* Category Accounts */}
            {isExpanded && (
              <div className="space-y-4 pl-4 border-l-2 border-border">
                {category.accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    transactions={currentMonthTransactions.filter(t => t.accountId === account.id)}
                    isExpanded={expandedAccounts.has(account.id)}
                    layoutMode={layoutMode}
                    onClick={() => onSelectAccount(account)}
                    onToggleExpansion={() => onToggleExpansion(account.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
