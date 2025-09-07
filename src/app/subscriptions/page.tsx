'use client';

import { useState } from 'react';
import { Subscription, Account } from '@/lib/types';
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

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    amount: 45,
    type: 'expense',
    category: 'Rozrywka',
    description: 'Subskrypcja Netflix Premium',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-15'),
    accountId: '1',
    isActive: true,
    color: '#e50914',
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 20,
    type: 'expense',
    category: 'Rozrywka',
    description: 'Spotify Premium',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-10'),
    accountId: '1',
    isActive: true,
    color: '#1db954',
  },
  {
    id: '3',
    name: 'Czynsz',
    amount: 1200,
    type: 'expense',
    category: 'Mieszkanie',
    description: 'Opłata za mieszkanie',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-01'),
    accountId: '1',
    isActive: true,
    color: '#3b82f6',
  },
  {
    id: '4',
    name: 'Ubezpieczenie samochodu',
    amount: 800,
    type: 'expense',
    category: 'Ubezpieczenia',
    description: 'OC + AC',
    frequency: 'yearly',
    nextDueDate: new Date('2024-06-15'),
    accountId: '1',
    isActive: true,
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Wypłata',
    amount: 5000,
    type: 'income',
    category: 'Wynagrodzenie',
    description: 'Wypłata miesięczna',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-28'),
    accountId: '1',
    isActive: true,
    color: '#10b981',
  },
  {
    id: '6',
    name: 'Adobe Creative Cloud',
    amount: 89,
    type: 'expense',
    category: 'Oprogramowanie',
    description: 'Adobe CC All Apps',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-20'),
    accountId: '1',
    isActive: true,
    color: '#ff0000',
  },
  {
    id: '7',
    name: 'Gym membership',
    amount: 120,
    type: 'expense',
    category: 'Zdrowie',
    description: 'Członkostwo w siłowni',
    frequency: 'monthly',
    nextDueDate: new Date('2024-02-05'),
    accountId: '1',
    isActive: true,
    color: '#8b5cf6',
  },
  {
    id: '8',
    name: 'Podatek dochodowy',
    amount: 2000,
    type: 'expense',
    category: 'Podatki',
    description: 'Zaliczka na podatek',
    frequency: 'quarterly',
    nextDueDate: new Date('2024-03-31'),
    accountId: '1',
    isActive: true,
    color: '#ef4444',
  },
];

export default function Subscriptions() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Co tydzień';
      case 'biweekly': return 'Co 2 tygodnie';
      case 'monthly': return 'Co miesiąc';
      case 'quarterly': return 'Co 3 miesiące';
      case 'yearly': return 'Co rok';
      default: return frequency;
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return '📅';
      case 'biweekly': return '📆';
      case 'monthly': return '🗓️';
      case 'quarterly': return '📊';
      case 'yearly': return '🎯';
      default: return '📋';
    }
  };

  const getDaysUntilDue = (date: Date) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (date: Date) => {
    const days = getDaysUntilDue(date);
    if (days < 0) return { status: 'overdue', color: 'text-red-500', bgColor: 'bg-red-100' };
    if (days === 0) return { status: 'today', color: 'text-orange-500', bgColor: 'bg-orange-100' };
    if (days <= 3) return { status: 'soon', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    return { status: 'upcoming', color: 'text-green-500', bgColor: 'bg-green-100' };
  };

  const frequencies = Array.from(new Set(subscriptions.map(s => s.frequency)));

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const typeMatch = filterType === 'all' || subscription.type === filterType;
    const frequencyMatch = filterFrequency === 'all' || subscription.frequency === filterFrequency;
    const accountMatch = filterAccount === 'all' || subscription.accountId === filterAccount;
    return typeMatch && frequencyMatch && accountMatch;
  });

  const sortedSubscriptions = filteredSubscriptions.sort((a, b) => {
    // Sort by due date (overdue first, then by date)
    const aDays = getDaysUntilDue(a.nextDueDate);
    const bDays = getDaysUntilDue(b.nextDueDate);
    
    if (aDays < 0 && bDays >= 0) return -1;
    if (aDays >= 0 && bDays < 0) return 1;
    
    return aDays - bDays;
  });

  const totalMonthlyExpenses = subscriptions
    .filter(s => s.type === 'expense' && s.isActive)
    .reduce((sum, sub) => {
      let monthlyAmount = sub.amount;
      switch (sub.frequency) {
        case 'weekly': monthlyAmount = sub.amount * 4.33; break;
        case 'biweekly': monthlyAmount = sub.amount * 2.17; break;
        case 'quarterly': monthlyAmount = sub.amount / 3; break;
        case 'yearly': monthlyAmount = sub.amount / 12; break;
      }
      return sum + monthlyAmount;
    }, 0);

  const totalMonthlyIncome = subscriptions
    .filter(s => s.type === 'income' && s.isActive)
    .reduce((sum, sub) => {
      let monthlyAmount = sub.amount;
      switch (sub.frequency) {
        case 'weekly': monthlyAmount = sub.amount * 4.33; break;
        case 'biweekly': monthlyAmount = sub.amount * 2.17; break;
        case 'quarterly': monthlyAmount = sub.amount / 3; break;
        case 'yearly': monthlyAmount = sub.amount / 12; break;
      }
      return sum + monthlyAmount;
    }, 0);


  const renderSubscriptionCard = (subscription: Subscription) => {
    const account = accounts.find(acc => acc.id === subscription.accountId);
    const dueStatus = getDueDateStatus(subscription.nextDueDate);
    const daysUntil = getDaysUntilDue(subscription.nextDueDate);

    return (
      <div 
        key={subscription.id}
        className="border border-border rounded-lg p-6 hover:bg-opacity-80 transition-colors"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: subscription.color }}
            />
            <div>
              <h3 className="text-lg font-medium text-foreground">{subscription.name}</h3>
              <p className="text-sm text-secondary">{subscription.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${
              subscription.type === 'income' ? 'text-green-600' : 'text-red-500'
            }`}>
              {subscription.type === 'income' ? '+' : '-'}{formatCurrency(subscription.amount)}
            </p>
            <p className="text-sm text-secondary">{getFrequencyLabel(subscription.frequency)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-secondary mb-1">Konto</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: account?.color || '#6b7280' }}
              />
              <span className="text-sm text-foreground">
                {account?.name || 'Nieznane konto'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-secondary mb-1">Kategoria</p>
            <p className="text-sm text-foreground">{subscription.category}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFrequencyIcon(subscription.frequency)}</span>
            <span className="text-sm text-secondary">
              Następna płatność: {subscription.nextDueDate.toLocaleDateString('pl-PL')}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${dueStatus.bgColor} ${dueStatus.color}`}>
            {daysUntil < 0 ? `Opóźnione o ${Math.abs(daysUntil)} dni` :
             daysUntil === 0 ? 'Dziś' :
             daysUntil <= 3 ? `Za ${daysUntil} dni` :
             `Za ${daysUntil} dni`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Subskrypcje</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          >
            Dodaj subskrypcję
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Miesięczne przychody</h3>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalMonthlyIncome)}
            </p>
            <p className="text-sm text-secondary mt-1">
              {subscriptions.filter(s => s.type === 'income' && s.isActive).length} aktywnych subskrypcji
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Miesięczne wydatki</h3>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">-</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalMonthlyExpenses)}
            </p>
            <p className="text-sm text-secondary mt-1">
              {subscriptions.filter(s => s.type === 'expense' && s.isActive).length} aktywnych subskrypcji
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Bilans miesięczny</h3>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">=</span>
              </div>
            </div>
            <p className={`text-2xl font-bold ${
              totalMonthlyIncome - totalMonthlyExpenses >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {formatCurrency(totalMonthlyIncome - totalMonthlyExpenses)}
            </p>
            <p className="text-sm text-secondary mt-1">
              {totalMonthlyIncome - totalMonthlyExpenses >= 0 ? 'Dodatni bilans' : 'Ujemny bilans'}
            </p>
          </div>
        </div>

        {/* Filters Dropdown */}
        <div className="border border-border rounded-lg mb-6">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <h2 className="text-lg font-semibold text-foreground">Filtry</h2>
            <div className="flex items-center gap-2">
              {(filterType !== 'all' || filterFrequency !== 'all' || filterAccount !== 'all') && (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              )}
              <svg 
                className={`w-5 h-5 text-black transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {showFilters && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Typ</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="income">Przychody</option>
                    <option value="expense">Wydatki</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Częstotliwość</label>
                  <select
                    value={filterFrequency}
                    onChange={(e) => setFilterFrequency(e.target.value)}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
                  >
                    <option value="all">Wszystkie</option>
                    {frequencies.map(frequency => (
                      <option key={frequency} value={frequency}>{getFrequencyLabel(frequency)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Konto</label>
                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
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

        {/* Subscriptions List */}
        <div className="space-y-4">
          {sortedSubscriptions.length > 0 ? (
            sortedSubscriptions.map(renderSubscriptionCard)
          ) : (
            <div className="border border-border rounded-lg p-8 text-center">
              <p className="text-secondary">Brak subskrypcji spełniających kryteria filtrowania</p>
            </div>
          )}
        </div>

        {/* Add Subscription Modal Placeholder */}
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
              <h3 className="text-lg font-semibold mb-4 text-foreground">Dodaj subskrypcję</h3>
              <p className="text-secondary mb-4">Formularz dodawania subskrypcji będzie tutaj...</p>
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
