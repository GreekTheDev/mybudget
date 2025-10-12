'use client';

import Link from 'next/link';

interface ExpenseCategory {
  name: string;
  amount: number;
  icon: string;
  bgColor: string;
  iconColor: string;
}

interface CashflowSectionProps {
  predictedExpenses?: number;
  predictedIncome?: number;
  predictedBalance?: number;
  confidence?: number;
  expenseCategories?: ExpenseCategory[];
  isMobile?: boolean;
}

const defaultExpenseCategories: ExpenseCategory[] = [
  {
    name: 'Żywność',
    amount: 650,
    icon: '🍽️',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    name: 'Transport',
    amount: 280,
    icon: '🚌',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Rozrywka',
    amount: 420,
    icon: '🎬',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Czynsz',
    amount: 1100,
    icon: '🏠',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

export default function CashflowSection({
  predictedExpenses = 2450,
  predictedIncome = 5000,
  predictedBalance = 2550,
  confidence = 85,
  expenseCategories = defaultExpenseCategories,
  isMobile = false,
}: CashflowSectionProps) {
  return (
    <div>
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
          <div className={`grid grid-cols-1 ${isMobile ? 'md:grid-cols-3' : 'gap-4'} mb-6`}>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-secondary mb-1">Przewidywane wydatki</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(predictedExpenses)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-secondary mb-1">Przewidywane przychody</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(predictedIncome)}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-secondary mb-1">Przewidywane saldo</p>
              <p className="text-xl font-bold text-purple-600">+{formatCurrency(predictedBalance)}</p>
            </div>
          </div>

          {/* Expense Categories Forecast */}
          <div className="space-y-2">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between py-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${category.bgColor} flex items-center justify-center`}>
                    <span className={`text-lg ${category.iconColor}`}>{category.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                </div>
                <span className="text-sm font-semibold text-red-500">~{formatCurrency(category.amount)}</span>
              </div>
            ))}
          </div>
          
          {/* Confidence Indicator */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-secondary">Wysoka pewność prognozy</span>
              </div>
              <span className="text-sm font-medium text-green-600">{confidence}%</span>
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
