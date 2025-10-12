import { formatCurrency } from '@/lib/utils';
import { Subscription } from '@/lib/types';

interface SubscriptionSummaryCardsProps {
  subscriptions: Subscription[];
  className?: string;
}

export function SubscriptionSummaryCards({ subscriptions, className = "" }: SubscriptionSummaryCardsProps) {
  const totalMonthlyExpenses = subscriptions
    .filter(s => s.type === 'expense' && s.isActive)
    .reduce((sum, sub) => {
      let monthlyAmount = sub.amount;
      switch (sub.frequency) {
        case 'weekly': monthlyAmount = sub.amount * 4.33; break;
        case 'biweekly': monthlyAmount = sub.amount * 2.17; break;
        case 'quarterly': monthlyAmount = sub.amount / 3; break;
        case 'yearly': monthlyAmount = sub.amount / 12; break;
      }
      return sum + monthlyAmount;
    }, 0);

  const totalMonthlyIncome = subscriptions
    .filter(s => s.type === 'income' && s.isActive)
    .reduce((sum, sub) => {
      let monthlyAmount = sub.amount;
      switch (sub.frequency) {
        case 'weekly': monthlyAmount = sub.amount * 4.33; break;
        case 'biweekly': monthlyAmount = sub.amount * 2.17; break;
        case 'quarterly': monthlyAmount = sub.amount / 3; break;
        case 'yearly': monthlyAmount = sub.amount / 12; break;
      }
      return sum + monthlyAmount;
    }, 0);

  const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${className}`}>
      {/* Monthly Income */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Miesięczne przychody</h3>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">+</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600">
          {formatCurrency(totalMonthlyIncome)}
        </p>
        <p className="text-sm text-secondary mt-1">
          {subscriptions.filter(s => s.type === 'income' && s.isActive).length} aktywnych subskrypcji
        </p>
      </div>

      {/* Monthly Expenses */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Miesięczne wydatki</h3>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">-</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-red-500">
          {formatCurrency(totalMonthlyExpenses)}
        </p>
        <p className="text-sm text-secondary mt-1">
          {subscriptions.filter(s => s.type === 'expense' && s.isActive).length} aktywnych subskrypcji
        </p>
      </div>

      {/* Monthly Balance */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Bilans miesięczny</h3>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">=</span>
          </div>
        </div>
        <p className={`text-2xl font-bold ${
          monthlyBalance >= 0 ? 'text-green-600' : 'text-red-500'
        }`}>
          {formatCurrency(monthlyBalance)}
        </p>
        <p className="text-sm text-secondary mt-1">
          {monthlyBalance >= 0 ? 'Dodatni bilans' : 'Ujemny bilans'}
        </p>
      </div>
    </div>
  );
}
