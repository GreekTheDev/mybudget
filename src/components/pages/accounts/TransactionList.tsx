import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/types';

interface TransactionListProps {
  transactions: Transaction[];
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export function TransactionList({ 
  transactions, 
  maxItems = 3, 
  showHeader = true,
  className = ""
}: TransactionListProps) {
  const sortedTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  return (
    <div className={className}>
      {showHeader && (
        <h4 className="font-medium text-foreground mb-3">Ostatnie transakcje</h4>
      )}
      <div className="space-y-2">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-2 rounded">
            <div>
              <p className="text-sm font-medium text-foreground">{transaction.description}</p>
              <p className="text-xs text-secondary">{transaction.category}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-secondary">
                {new Date(transaction.date).toLocaleDateString('pl-PL')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
