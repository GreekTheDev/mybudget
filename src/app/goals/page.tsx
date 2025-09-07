'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

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

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current: number, target: number, isDebt: boolean = false) => {
    const percentage = (current / target) * 100;
    if (isDebt) {
      // For debts, higher percentage is better (more paid off)
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // For savings, higher percentage is better (more saved)
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderGoalCard = (goal: Goal, isDebt: boolean = false) => (
    <div 
      key={goal.id}
      className="border border-border rounded-lg p-6 hover:bg-opacity-80 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground">{goal.name}</h3>
        <div className="text-right">
          <p className="text-sm text-secondary">
            {isDebt ? 'Spłacono / Do spłacenia' : 'Zgromadzono / Cel'}
          </p>
          <p className="font-semibold text-foreground">
            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-secondary mb-1">
          <span>Postęp</span>
          <span>{getProgressPercentage(goal.current, goal.target).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor(goal.current, goal.target, isDebt)}`}
            style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span className={`font-medium ${isDebt ? 'text-green-600' : 'text-green-600'}`}>
          {isDebt 
            ? `Pozostało do spłaty: ${formatCurrency(goal.target - goal.current)}`
            : `Pozostało do celu: ${formatCurrency(goal.target - goal.current)}`
          }
        </span>
        {goal.deadline && (
          <span className="text-xs text-secondary">
            Do: {formatDate(goal.deadline)}
          </span>
        )}
      </div>
    </div>
  );

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
          {/* Savings Summary */}
          <div className="border border-border rounded-lg p-6 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Oszczędności</h3>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold"></span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Łączny cel:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(savingsGoals.reduce((sum, goal) => sum + goal.target, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Zgromadzono:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(savingsGoals.reduce((sum, goal) => sum + goal.current, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Pozostało:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0))}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Średni postęp:</span>
                  <span className="font-medium text-foreground">
                    {Math.round(savingsGoals.reduce((sum, goal) => sum + getProgressPercentage(goal.current, goal.target), 0) / savingsGoals.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Debts Summary */}
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Długi</h3>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold"></span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Łączny dług:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(debtGoals.reduce((sum, goal) => sum + goal.target, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Spłacono:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(debtGoals.reduce((sum, goal) => sum + goal.current, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary">Pozostało:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(debtGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0))}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Średni postęp:</span>
                  <span className="font-medium text-foreground">
                    {Math.round(debtGoals.reduce((sum, goal) => sum + getProgressPercentage(goal.current, goal.target), 0) / debtGoals.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMobile ? (
          /* Mobile: Single column with sections */
          <div className="space-y-8">
            {/* Savings Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Zbieram na</h2>
              <div className="space-y-4">
                {savingsGoals.map((goal) => renderGoalCard(goal, false))}
              </div>
            </div>

            {/* Debts Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Spłacam</h2>
              <div className="space-y-4">
                {debtGoals.map((goal) => renderGoalCard(goal, true))}
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: Two columns */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Savings Column */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Zbieram na</h2>
              <div className="space-y-4">
                {savingsGoals.map((goal) => renderGoalCard(goal, false))}
              </div>
            </div>

            {/* Debts Column */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Spłacam</h2>
              <div className="space-y-4">
                {debtGoals.map((goal) => renderGoalCard(goal, true))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
