'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon: string;
}

interface AccountsSummarySectionProps {
  accounts?: Account[];
  totalBalance?: number;
}

const defaultAccounts: Account[] = [
  {
    id: '1',
    name: 'Konto główne',
    type: 'checking',
    balance: 3350,
    color: '#3b82f6',
    icon: '💳',
  },
  {
    id: '2',
    name: 'Oszczędności',
    type: 'savings',
    balance: 15000,
    color: '#10b981',
    icon: '💰',
  },
  {
    id: '3',
    name: 'Karta kredytowa',
    type: 'credit',
    balance: -1200,
    color: '#ef4444',
    icon: '💸',
  },
  {
    id: '4',
    name: 'Inwestycje',
    type: 'investment',
    balance: 1200,
    color: '#8b5cf6',
    icon: '📈',
  },
];

export default function AccountsSummarySection({ 
  accounts = defaultAccounts, 
  totalBalance = 18350 
}: AccountsSummarySectionProps) {
  const [isTileView, setIsTileView] = useState(true);

  const getAccountTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'checking': 'Główne',
      'savings': 'Oszczędności',
      'credit': 'Kredytowa',
      'investment': 'Inwestycje',
    };
    return typeMap[type] || 'Inne';
  };

  const getAccountGradient = (type: string) => {
    const gradientMap: Record<string, string> = {
      'checking': 'from-blue-500 to-blue-600',
      'savings': 'from-green-500 to-green-600',
      'credit': 'from-red-500 to-red-600',
      'investment': 'from-purple-500 to-purple-600',
    };
    return gradientMap[type] || 'from-gray-500 to-gray-600';
  };

  const getAccountBgColor = (type: string) => {
    const bgColorMap: Record<string, string> = {
      'checking': 'bg-blue-100',
      'savings': 'bg-green-100',
      'credit': 'bg-red-100',
      'investment': 'bg-purple-100',
    };
    return bgColorMap[type] || 'bg-gray-100';
  };

  const getAccountIconColor = (type: string) => {
    const iconColorMap: Record<string, string> = {
      'checking': 'text-blue-600',
      'savings': 'text-green-600',
      'credit': 'text-red-600',
      'investment': 'text-purple-600',
    };
    return iconColorMap[type] || 'text-gray-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Konta</h2>
        <Link href="/accounts" className="text-sm text-primary hover:text-opacity-80 transition-colors">
          Zobacz wszystkie
        </Link>
      </div>
      
      <div className="border border-border rounded-lg p-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-secondary">Przegląd kont</span>
            <button
              onClick={() => setIsTileView(!isTileView)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-foreground"
            >
              {isTileView ? 'Lista' : 'Kafelki'}
            </button>
          </div>
          
          {isTileView ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {accounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`bg-gradient-to-br ${getAccountGradient(account.type)} rounded-lg p-4 text-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{account.icon}</span>
                    <span className="text-xs opacity-80">{getAccountTypeLabel(account.type)}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{account.name}</div>
                  <div className="text-lg font-bold">{formatCurrency(account.balance)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getAccountBgColor(account.type)} flex items-center justify-center`}>
                      <span className={`text-lg ${getAccountIconColor(account.type)}`}>{account.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{account.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    account.balance < 0 ? 'text-red-500' : 'text-foreground'
                  }`}>
                    {formatCurrency(account.balance)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Total Sum */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between py-3 bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-lg text-indigo-600">💎</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Całkowite saldo</span>
              </div>
              <span className="text-sm font-bold text-foreground">{formatCurrency(totalBalance)}</span>
            </div>
          </div>
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
