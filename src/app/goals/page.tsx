'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { 
  GoalLayout,
  GoalSection,
  GoalSummaryCard
} from '@/components/pages/goals';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  deadline?: string;
}

const mockSavingsGoals: Goal[] = [
  {
    id: '1',
    name: 'Wakacje w Hiszpanii',
    target: 5000,
    current: 3200,
    color: '#10b981',
    deadline: '2024-08-15'
  },
  {
    id: '2',
    name: 'Nowy laptop',
    target: 3000,
    current: 1800,
    color: '#3b82f6',
    deadline: '2024-06-30'
  },
  {
    id: '3',
    name: 'Fundusz awaryjny',
    target: 10000,
    current: 7500,
    color: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Remont kuchni',
    target: 15000,
    current: 4200,
    color: '#f59e0b',
    deadline: '2024-12-31'
  }
];

const mockDebtGoals: Goal[] = [
  {
    id: '5',
    name: 'Kredyt hipoteczny',
    target: 250000,
    current: 180000,
    color: '#ef4444',
    deadline: '2030-12-31'
  },
  {
    id: '6',
    name: 'Karta kredytowa',
    target: 5000,
    current: 3200,
    color: '#dc2626',
    deadline: '2024-05-15'
  },
  {
    id: '7',
    name: 'Pożyczka samochodowa',
    target: 20000,
    current: 12000,
    color: '#b91c1c',
    deadline: '2025-03-20'
  }
];

export default function Goals() {
  const [savingsGoals] = useState<Goal[]>(mockSavingsGoals);
  const [debtGoals] = useState<Goal[]>(mockDebtGoals);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Cele finansowe</h1>
          <button
            onClick={() => {/* TODO: Add goal functionality */}}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer "
          >
            Dodaj cel
          </button>
        </div>

        {/* Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <GoalSummaryCard goals={savingsGoals} type="savings" />
          <GoalSummaryCard goals={debtGoals} type="debts" />
        </div>

        <GoalLayout isMobile={isMobile}>
          <GoalSection 
            goals={savingsGoals} 
            title="Zbieram na" 
            isDebt={false} 
          />
          <GoalSection 
            goals={debtGoals} 
            title="Spłacam" 
            isDebt={true} 
          />
        </GoalLayout>
      </div>
    </div>
  );
}
