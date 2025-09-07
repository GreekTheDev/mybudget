'use client';

import { useState, useEffect } from 'react';
import { Transaction, Account } from '@/lib/types';
import { formatCurrency, calculateFinancialSummary } from '@/lib/utils';
import Link from 'next/link';

// Mock data
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
];

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
];

export default function Dashboard() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [financialSummary, setFinancialSummary] = useState(calculateFinancialSummary(mockTransactions));
  const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(true);

  useEffect(() => {
    setFinancialSummary(calculateFinancialSummary(transactions));
  }, [transactions]);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);


  return (
    <div className="container mx-auto px-4 pb-4">
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Pulpit</h1>

        {/* Summary Cards */}
        <div className="mb-8">
          {/* Mobile layout: 2 rows */}
          <div className="md:hidden space-y-4">
            {/* First row: Przychód and Wydatki */}
            <div className="grid grid-cols-2 gap-6">
              <div className=" border rounded-lg p-2 text-end border-gray-400">
                <h3 className="text-sm font-medium text-secondary mb-2 text-start">Przychód</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.totalIncome)}</p>
              </div>
              
              <div className=" border rounded-lg p-2 text-end border-gray-400">
                <h3 className="text-sm font-medium text-secondary mb-2 text-start">Wydatki</h3>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(financialSummary.totalExpenses)}</p>
              </div>
            </div>
            
            {/* Second row: Saldo at 100% width */}
            <div className="w-full">
              <div className=" border rounded-lg p-2 text-end border-gray-400">
                <h3 className="text-sm font-medium text-secondary mb-2 text-start">Saldo</h3>
                <p className={`text-2xl font-bold ${financialSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(financialSummary.balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop layout: 1 row */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            <div className=" border rounded-lg p-2 text-end border-gray-400">
              <h3 className="text-sm font-medium text-secondary mb-2 text-start">Przychód</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.totalIncome)}</p>
            </div>
            
            <div className=" border rounded-lg p-2 text-end border-gray-400">
              <h3 className="text-sm font-medium text-secondary mb-2 text-start">Wydatki</h3>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(financialSummary.totalExpenses)}</p>
            </div>
            
            <div className=" border rounded-lg p-2 text-end border-gray-400">
              <h3 className="text-sm font-medium text-secondary mb-2 text-start">Saldo</h3>
              <p className={`text-2xl font-bold ${financialSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialSummary.balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Summary Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Budżet</h2>
            <Link href="/budget" className="text-sm text-primary hover:text-opacity-80 transition-colors">
              Zobacz wszystkie
            </Link>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Budget */}
              <div className="text-center">
                <p className="text-sm text-secondary mb-1">Całkowity budżet</p>
                <p className="text-2xl font-bold text-foreground">2,500 zł</p>
              </div>
              
              {/* Total Spent */}
              <div className="text-center">
                <p className="text-sm text-secondary mb-1">Wydano</p>
                <p className="text-2xl font-bold text-foreground">1,910 zł</p>
              </div>
              
              {/* Remaining */}
              <div className="text-center">
                <p className="text-sm text-secondary mb-1">Pozostało</p>
                <p className="text-2xl font-bold text-green-600">590 zł</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-secondary mb-2">
                <span>Postęp budżetu</span>
                <span>76% wykorzystano</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full"
                  style={{ width: '76%' }}
                ></div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-secondary">3 kategorie w normie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-secondary">1 kategoria przekroczona</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Summary Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Konta</h2>
            <Link href="/accounts" className="text-sm text-primary hover:text-opacity-80 transition-colors">
              Zobacz wszystkie
            </Link>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            {/* Account List Preview */}
            <div>
              <div className="flex justify-between text-sm text-secondary mb-3">
                <span>Przegląd kont</span>
                <span>4 aktywne konta</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg text-blue-600">💳</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Konto główne</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">3,350 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg text-green-600">💰</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Oszczędności</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">15,000 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-lg text-red-600">💸</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Karta kredytowa</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-1,200 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg text-purple-600">📈</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Inwestycje</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">1,200 zł</span>
                </div>
              </div>
              
              {/* Total Sum */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between py-3 bg-opacity-10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-lg text-indigo-600">💎</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Całkowite saldo</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">18,350 zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Summary Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Subskrypcje</h2>
            <Link href="/subscriptions" className="text-sm text-primary hover:text-opacity-80 transition-colors">
              Zobacz wszystkie
            </Link>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div>
              <div className="flex justify-between text-sm text-secondary mb-3">
                <span>Subskrypcje w tym miesiącu</span>
                <span>4 aktywne</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-lg text-red-600">📺</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Netflix</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-45 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg text-blue-600">🎵</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Spotify</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-20 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg text-purple-600">💻</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Adobe Creative</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-89 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg text-green-600">☁️</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Google Drive</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-15 zł</span>
                </div>
              </div>
              
              {/* Total Sum */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between py-3 bg-opacity-10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-lg text-orange-600">💳</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Łączne subskrypcje</span>
                  </div>
                  <span className="text-sm font-bold text-red-500">-169 zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cashflow Forecast Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Przepływ gotówki</h2>
            <Link href="/cashflow#prognozy" className="text-sm text-primary hover:text-opacity-80 transition-colors">
              Zobacz szczegóły
            </Link>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div>
              <div className="flex justify-between text-sm text-secondary mb-3">
                <span>Prognoza wydatków na ten miesiąc</span>
                <span>Na podstawie 6 miesięcy</span>
              </div>
              
              {/* Forecast Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-secondary mb-1">Przewidywane wydatki</p>
                  <p className="text-xl font-bold text-blue-600">2,450 zł</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-secondary mb-1">Przewidywane przychody</p>
                  <p className="text-xl font-bold text-green-600">5,000 zł</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-secondary mb-1">Przewidywane saldo</p>
                  <p className="text-xl font-bold text-purple-600">+2,550 zł</p>
                </div>
              </div>

              {/* Expense Categories Forecast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-lg text-red-600">🍽️</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Żywność</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">~650 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg text-blue-600">🚌</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Transport</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">~280 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg text-purple-600">🎬</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Rozrywka</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">~420 zł</span>
                </div>
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-lg text-orange-600">🏠</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">Czynsz</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">~1,100 zł</span>
                </div>
              </div>
              
              {/* Confidence Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-secondary">Wysoka pewność prognozy</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Summary Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Cele</h2>
            <Link href="/goals" className="text-sm text-primary hover:text-opacity-80 transition-colors">
              Zobacz wszystkie
            </Link>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <div>
              <div className="flex justify-between text-sm text-secondary mb-3">
                <span>Aktywne cele finansowe</span>
                <span>3 w trakcie</span>
              </div>
              
              {/* Goals List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg text-green-600">🏠</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">Wkład własny na mieszkanie</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                        <span className="text-xs text-secondary">65%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">65,000 / 100,000 zł</span>
                    <p className="text-xs text-secondary">Pozostało: 35,000 zł</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg text-blue-600">🚗</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">Nowy samochód</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: '30%' }}
                          ></div>
                        </div>
                        <span className="text-xs text-secondary">30%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">15,000 / 50,000 zł</span>
                    <p className="text-xs text-secondary">Pozostało: 35,000 zł</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg text-purple-600">✈️</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">Wakacje w Japonii</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: '80%' }}
                          ></div>
                        </div>
                        <span className="text-xs text-secondary">80%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">8,000 / 10,000 zł</span>
                    <p className="text-xs text-secondary">Pozostało: 2,000 zł</p>
                  </div>
                </div>
              </div>
              
              {/* Goals Summary */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-secondary mb-1">Łącznie zaoszczędzone</p>
                    <p className="text-lg font-bold text-green-600">88,000 zł</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-secondary mb-1">Pozostało do celu</p>
                    <p className="text-lg font-bold text-blue-600">72,000 zł</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Recent Transactions */}
          <div>
            <button
              onClick={() => setIsTransactionsExpanded(!isTransactionsExpanded)}
              className="flex items-center justify-between w-full text-left mb-4 border-b border-gray-400 pb-2 rounded-t-lg p-2 -m-2 transition-colors cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-foreground">Ostatnie transakcje</h2>
              <svg
                className={`w-5 h-5 text-foreground transition-transform duration-200 ${
                  isTransactionsExpanded ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isTransactionsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => {
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
        </div>
      </div>
    </div>
  );
}
