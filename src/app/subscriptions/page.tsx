'use client';

import { useState } from 'react';
import { Subscription, Account } from '@/lib/types';
import { 
  AddSubscriptionModal,
  SubscriptionCard,
  SubscriptionFilters,
  SubscriptionSummaryCards
} from '@/components/pages/subscriptions';

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
  const getDaysUntilDue = (date: Date) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

        <SubscriptionSummaryCards subscriptions={subscriptions} />

        <SubscriptionFilters
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterType={filterType}
          filterFrequency={filterFrequency}
          filterAccount={filterAccount}
          onFilterTypeChange={setFilterType}
          onFilterFrequencyChange={setFilterFrequency}
          onFilterAccountChange={setFilterAccount}
          frequencies={frequencies}
          accounts={accounts}
        />

        {/* Subscriptions List */}
        <div className="space-y-3">
          {sortedSubscriptions.length > 0 ? (
            sortedSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))
          ) : (
            <div className="border border-border rounded-lg p-8 text-center">
              <p className="text-secondary">Brak subskrypcji spełniających kryteria filtrowania</p>
            </div>
          )}
        </div>

        <AddSubscriptionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            // TODO: Implement add subscription functionality
            setShowAddModal(false);
          }}
        />
      </div>
    </div>
  );
}
