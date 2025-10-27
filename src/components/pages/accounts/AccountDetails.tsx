import { formatCurrency } from '@/lib/utils';
import { Account, Transaction } from '@/lib/types';
import { TransactionList } from './TransactionList';
import { AccountMenu } from './AccountMenu';
import { getAccountTypeLabel } from '@/lib/accountCategories';

interface AccountDetailsProps {
  account: Account | null;
  transactions: Transaction[];
}

export function AccountDetails({ account, transactions }: AccountDetailsProps) {
  // Get current month name
  const currentMonthName = new Date().toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });

  if (!account) {
    return (
      <div className="border border-border rounded-lg p-6">
        <p className="text-secondary text-center">Wybierz konto, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: account.color }}
          />
          <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
        </div>
        <AccountMenu account={account} />
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
          <p className="text-sm text-secondary mb-1">Transakcje w tym miesiącu</p>
          <p className="font-medium text-foreground">
            {transactions.length}
          </p>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-foreground">Ostatnie transakcje</h4>
              {transactions.length > 5 && (
                <span className="text-xs text-secondary">
                  Pokazano 5 z {transactions.length}
                </span>
              )}
            </div>
            <p className="text-xs text-secondary capitalize">{currentMonthName}</p>
          </div>
          <TransactionList 
            transactions={transactions}
            maxItems={5}
            showHeader={false}
          />
        </div>
      )}
      
      {transactions.length === 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-sm text-secondary text-center py-4">
            Brak transakcji w tym miesiącu
          </p>
        </div>
      )}
    </div>
  );
}
