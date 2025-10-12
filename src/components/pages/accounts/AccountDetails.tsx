import { formatCurrency } from '@/lib/utils';
import { Account, Transaction } from '@/lib/types';
import { TransactionList } from './TransactionList';

interface AccountDetailsProps {
  account: Account | null;
  transactions: Transaction[];
}

export function AccountDetails({ account, transactions }: AccountDetailsProps) {
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Konto rozliczeniowe';
      case 'savings': return 'Oszczędności';
      case 'credit': return 'Karta kredytowa';
      case 'investment': return 'Inwestycje';
      default: return type;
    }
  };

  if (!account) {
    return (
      <div className="border border-border rounded-lg p-6">
        <p className="text-secondary text-center">Wybierz konto, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: account.color }}
        />
        <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-secondary mb-1">Typ konta</p>
          <p className="font-medium text-foreground">{getAccountTypeLabel(account.type)}</p>
        </div>
        
        <div>
          <p className="text-sm text-secondary mb-1">Saldo</p>
          <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {formatCurrency(account.balance)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-secondary mb-1">Liczba transakcji</p>
          <p className="font-medium text-foreground">
            {transactions.length}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <TransactionList 
          transactions={transactions}
          maxItems={3}
          showHeader={true}
        />
      </div>
    </div>
  );
}
