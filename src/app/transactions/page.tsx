'use client';

import { useState } from 'react';
import { Transaction, Account } from '@/lib/types';
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
    amount: 150,
    type: 'expense',
    category: 'Transport',
    description: 'Bilety komunikacji miejskiej',
    date: new Date('2024-01-14'),
    accountId: '1',
  },
  {
    id: '5',
    amount: 200,
    type: 'expense',
    category: 'Rozrywka',
    description: 'Kino',
    date: new Date('2024-01-13'),
    accountId: '1',
  },
  {
    id: '6',
    amount: 1000,
    type: 'income',
    category: 'Oszczędności',
    description: 'Przelew do oszczędności',
    date: new Date('2024-01-14'),
    accountId: '2',
  },
  {
    id: '7',
    amount: 80,
    type: 'expense',
    category: 'Zdrowie',
    description: 'Lekarz',
    date: new Date('2024-01-11'),
    accountId: '1',
  },
  {
    id: '8',
    amount: 250,
    type: 'expense',
    category: 'Ubrania',
    description: 'Zakupy odzieżowe',
    date: new Date('2024-01-09'),
    accountId: '1',
  },
];

export default function Transactions() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
    const accountMatch = filterAccount === 'all' || transaction.accountId === filterAccount;
    return typeMatch && categoryMatch && accountMatch;
  });

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Transakcje</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          >
            Dodaj transakcję
          </button>
        </div>

        {/* Filters Dropdown */}
        <div className="border border-border rounded-lg mb-6">
          {/* Filter Header */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer "
            onClick={() => setShowFilters(!showFilters)}
          >
            <h2 className="text-lg font-semibold text-foreground">Filtry</h2>
            <div className="flex items-center gap-2">
              {/* Filter indicator dots */}
              {(filterType !== 'all' || filterCategory !== 'all' || filterAccount !== 'all') && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              )}
              {/* Chevron icon */}
              <svg 
                className={`w-5 h-5  transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Content */}
          {showFilters && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Typ transakcji</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer "
                  >
                    <option value="all">Wszystkie</option>
                    <option value="income">Przychody</option>
                    <option value="expense">Wydatki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Kategoria</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer "
                  >
                    <option value="all">Wszystkie kategorie</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Konto</label>
                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer "
                  >
                    <option value="all">Wszystkie konta</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Data</th>
                  <th className="text-left p-4 font-medium text-foreground">Opis</th>
                  <th className="text-left p-4 font-medium text-foreground">Kategoria</th>
                  <th className="text-left p-4 font-medium text-foreground">Konto</th>
                  <th className="text-right p-4 font-medium text-foreground">Kwota</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => {
                  const account = accounts.find(acc => acc.id === transaction.accountId);
                  return (
                    <tr key={transaction.id} className="border-b border-border hover:bg-gray-50  dark:hover:bg-gray-100 transition-colors">
                      <td className="p-4 text-foreground">
                        {new Date(transaction.date).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="p-4 text-foreground font-medium">
                        {transaction.description}
                      </td>
                      <td className="p-4 text-secondary">
                        {transaction.category}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: account?.color || '#6b7280' }}
                          />
                          <span className="text-secondary text-sm">
                            {account?.name || 'Nieznane konto'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet List View */}
        <div className="lg:hidden">
          {(() => {
            // Group transactions by date
            const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
              const date = new Date(transaction.date).toLocaleDateString('pl-PL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              });
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(transaction);
              return groups;
            }, {} as Record<string, Transaction[]>);

            return Object.entries(groupedTransactions).map(([date, dayTransactions]) => {
              const dailyTotal = dayTransactions.reduce((sum, t) => {
                return sum + (t.type === 'income' ? t.amount : -t.amount);
              }, 0);

              return (
                <div key={date} className="mb-6">
                  {/* Date Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-foreground capitalize">{date}</h3>
                    <span className="text-sm text-secondary">
                      {formatCurrency(Math.abs(dailyTotal))}
                    </span>
                  </div>

                  {/* Transactions for this date */}
                  <div className="space-y-3">
                    {dayTransactions.map((transaction) => {
                      const account = accounts.find(acc => acc.id === transaction.accountId);
                      
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

                      const categoryIcon = getCategoryIcon(transaction.category);

                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg ">
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
              );
            });
          })()}
        </div>

        {/* Add Transaction Modal Placeholder */}
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
              }
            }}
          >
            <div className="border border-border rounded-lg p-6 max-w-md w-full mx-4 bg-white">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Dodaj transakcję</h3>
              <p className="text-secondary mb-4">Formularz dodawania transakcji będzie tutaj...</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
