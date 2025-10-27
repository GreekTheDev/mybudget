import { formatCurrency } from '@/lib/utils';
import { Transaction, Account } from '@/lib/types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionCardProps {
  transaction: Transaction;
  account?: Account;
  className?: string;
  onClick?: () => void;
}

export function TransactionCard({ transaction, account, className = "", onClick }: TransactionCardProps) {
  return (
    <div 
      className={`flex items-center justify-between p-3 border border-border rounded-lg ${onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        <CategoryIcon category={transaction.category} size="md" />
        
        {/* Transaction Details */}
        <div>
          <p className="font-medium text-foreground">{transaction.description}</p>
          <p className="text-sm text-secondary">{transaction.category}</p>
        </div>
      </div>

      {/* Amount and Account */}
      <div className="text-right">
        <div className="flex items-center gap-1">
          <span className={`font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        <p className="text-sm text-secondary">
          {account?.name || 'Nieznane konto'}
        </p>
      </div>
    </div>
  );
}
