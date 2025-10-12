'use client';

import Link from 'next/link';

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  icon: string;
  bgColor: string;
  iconColor: string;
  progressColor: string;
}

interface GoalsSummarySectionProps {
  goals?: Goal[];
  totalSaved?: number;
  totalRemaining?: number;
  activeGoalsCount?: number;
}

const defaultGoals: Goal[] = [
  {
    id: '1',
    name: 'Wkład własny na mieszkanie',
    currentAmount: 65000,
    targetAmount: 100000,
    progress: 65,
    icon: '🏠',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    progressColor: 'bg-green-500',
  },
  {
    id: '2',
    name: 'Nowy samochód',
    currentAmount: 15000,
    targetAmount: 50000,
    progress: 30,
    icon: '🚗',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    progressColor: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Wakacje w Japonii',
    currentAmount: 8000,
    targetAmount: 10000,
    progress: 80,
    icon: '✈️',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    progressColor: 'bg-purple-500',
  },
];

export default function GoalsSummarySection({ 
  goals = defaultGoals, 
  totalSaved = 88000, 
  totalRemaining = 72000,
  activeGoalsCount = 3
}: GoalsSummarySectionProps) {
  return (
    <div>
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
            <span>{activeGoalsCount} w trakcie</span>
          </div>
          
          {/* Goals List */}
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${goal.bgColor} flex items-center justify-center`}>
                    <span className={`text-lg ${goal.iconColor}`}>{goal.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{goal.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${goal.progressColor} h-2 rounded-full`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-secondary">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                  <p className="text-xs text-secondary">
                    Pozostało: {formatCurrency(goal.targetAmount - goal.currentAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Goals Summary */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-secondary mb-1">Łącznie zaoszczędzone</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalSaved)}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-secondary mb-1">Pozostało do celu</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(totalRemaining)}</p>
              </div>
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
