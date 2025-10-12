'use client';

import { useState } from 'react';
import { Transaction, Account } from '@/lib/types';
import { 
  AddTransactionModal,
  TransactionFilters,
  TransactionList,
  TransactionTable
} from '@/components/pages/transactions';

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

        <TransactionFilters
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterType={filterType}
          filterCategory={filterCategory}
          filterAccount={filterAccount}
          onFilterTypeChange={setFilterType}
          onFilterCategoryChange={setFilterCategory}
          onFilterAccountChange={setFilterAccount}
          categories={categories}
          accounts={accounts}
        />

        <TransactionTable 
          transactions={sortedTransactions}
          accounts={accounts}
        />

        <TransactionList 
          transactions={sortedTransactions}
          accounts={accounts}
        />

        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            // TODO: Implement add transaction functionality
            setShowAddModal(false);
          }}
        />
      </div>
    </div>
  );
}
