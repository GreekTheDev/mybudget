'use client';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface FinancialSummaryCardsProps {
  financialSummary: FinancialSummary;
}

export default function FinancialSummaryCards({ financialSummary }: FinancialSummaryCardsProps) {
  return (
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
