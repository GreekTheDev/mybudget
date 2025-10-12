'use client';

import { useState } from 'react';
import { Transaction, Account } from '@/lib/types';

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
  accounts: Account[];
}

export default function RecentTransactionsSection({ transactions, accounts }: RecentTransactionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
      'Wynagrodzenie': { icon: '💰', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      'Czynsz': { icon: '🏠', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      'Żywność': { icon: '🍽️', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      'Transport': { icon: '🚌', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      'Rozrywka': { icon: '🎬', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      'Zdrowie': { icon: '🏥', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      'Ubrania': { icon: '👕', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
      'Oszczędności': { icon: '💎', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    };
    return iconMap[category] || { icon: '📝', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-4 border-b border-gray-400 pb-2 rounded-t-lg p-2 -m-2 transition-colors cursor-pointer"
      >
        <h2 className="text-xl font-semibold text-foreground">Ostatnie transakcje</h2>
        <svg
          className={`w-5 h-5 text-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => {
            const account = accounts.find(acc => acc.id === transaction.accountId);
            const categoryIcon = getCategoryIcon(transaction.category);

            return (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  {/* Category Icon */}
                  <div className={`w-10 h-10 rounded-full ${categoryIcon.bgColor} flex items-center justify-center`}>
                    <span className={`text-lg ${categoryIcon.iconColor}`}>{categoryIcon.icon}</span>
                  </div>
                  
                  {/* Transaction Details */}
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-secondary">{transaction.category}</p>
                  </div>
                </div>

                {/* Amount and Account */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary">
                    {account?.name || 'Nieznane konto'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
