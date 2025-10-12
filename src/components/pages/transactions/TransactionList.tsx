import { formatCurrency } from '@/lib/utils';
import { Transaction, Account } from '@/lib/types';
import { TransactionCard } from './TransactionCard';

interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  className?: string;
}

export function TransactionList({ transactions, accounts, className = "" }: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className={`lg:hidden ${className}`}>
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => {
        const dailyTotal = dayTransactions.reduce((sum, t) => {
          return sum + (t.type === 'income' ? t.amount : -t.amount);
        }, 0);

        return (
          <div key={date} className="mb-6">
            {/* Date Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-foreground capitalize">{date}</h3>
              <span className="text-sm text-secondary">
                {formatCurrency(Math.abs(dailyTotal))}
              </span>
            </div>

            {/* Transactions for this date */}
            <div className="space-y-3">
              {dayTransactions.map((transaction) => {
                const account = accounts.find(acc => acc.id === transaction.accountId);
                return (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    account={account}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
