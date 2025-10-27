'use client';

import { useState, useEffect } from 'react';
import { FinancialSummary } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useAccountContext } from '@/contexts/AccountContext';

export default function TopBar() {
  const { state } = useAccountContext();
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    month: '',
    year: 0,
  });

  useEffect(() => {
    // Calculate total balance from all accounts
    const totalBalance = state.accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Get current month and year
    const now = new Date();
    const monthNames = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    
    setFinancialSummary({
      totalIncome: 0, // TODO: Calculate from transactions when implemented
      totalExpenses: 0, // TODO: Calculate from transactions when implemented
      balance: totalBalance,
      month: monthNames[now.getMonth()],
      year: now.getFullYear(),
    });
  }, [state.accounts]);

  return (
    <header 
      className={cn(
        "w-full transition-colors duration-200",
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-row lg:flex-row lg:items-center justify-between gap-4">
          

          {/* Financial Summary Section */}
          <div className="flex flex-row justify-start sm:justify-between gap-4 lg:gap-8">
            {/* Income - Hidden on mobile */}
            <div className="hidden md:flex flex-col items-center lg:items-start">
              <p className="text-xs lg:text-sm font-medium opacity-70 mb-1 text-secondary">
                Przychód
              </p>
              <p className="text-lg lg:text-xl font-semibold text-primary">
                {formatCurrency(financialSummary.totalIncome)}
              </p>
            </div>

            {/* Expenses - Hidden on mobile */}
            <div className="hidden md:flex flex-col items-center lg:items-start">
              <p className="text-xs lg:text-sm font-medium opacity-70 mb-1 text-secondary">
                Wydatki
              </p>
              <p className="text-lg lg:text-xl font-semibold text-red-500">
                {formatCurrency(financialSummary.totalExpenses)}
              </p>
            </div>

            {/* Balance - Always visible */}
            <div className="flex flex-col items-start md:items-center lg:items-start">
              <p className="text-xs lg:text-sm font-medium opacity-70 mb-1 text-secondary">
                Saldo
              </p>
              <p 
                className={cn(
                  "text-lg lg:text-xl font-semibold",
                  financialSummary.balance >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatCurrency(financialSummary.balance)}
              </p>
            </div>


          </div>

            {/* Date Section */}
            <div className="flex flex-col items-end md:items-center lg:items-end">
            <p className="text-sm lg:text-base opacity-70 text-secondary">
              {financialSummary.year}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {financialSummary.month}
            </h1>

          </div>

        </div>
      </div>
    </header>
  );
}
