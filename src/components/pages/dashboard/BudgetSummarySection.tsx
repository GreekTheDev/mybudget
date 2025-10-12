'use client';

import Link from 'next/link';

interface BudgetSummarySectionProps {
  totalBudget?: number;
  totalSpent?: number;
  remaining?: number;
  progressPercentage?: number;
  categoriesInNorm?: number;
  categoriesExceeded?: number;
}

export default function BudgetSummarySection({
  totalBudget = 2500,
  totalSpent = 1910,
  remaining = 590,
  progressPercentage = 76,
  categoriesInNorm = 3,
  categoriesExceeded = 1,
}: BudgetSummarySectionProps) {
  return (
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
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
          </div>
          
          {/* Total Spent */}
          <div className="text-center">
            <p className="text-sm text-secondary mb-1">Wydano</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
          </div>
          
          {/* Remaining */}
          <div className="text-center">
            <p className="text-sm text-secondary mb-1">Pozostało</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(remaining)}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-secondary mb-2">
            <span>Postęp budżetu</span>
            <span>{progressPercentage}% wykorzystano</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-secondary">{categoriesInNorm} kategorie w normie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-secondary">{categoriesExceeded} kategoria przekroczona</span>
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
