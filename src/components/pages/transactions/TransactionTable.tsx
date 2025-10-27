import { formatCurrency } from '@/lib/utils';
import { Transaction, Account, BudgetGroup } from '@/lib/types';
import { TransactionMenu } from './TransactionMenu';

interface EditTransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  budgetGroupId: string;
  budgetCategoryId: string;
  date: Date;
}

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: Account[];
  budgetGroups: BudgetGroup[];
  onEdit: (id: string, data: EditTransactionFormData) => void;
  className?: string;
}

export function TransactionTable({ transactions, accounts, budgetGroups, onEdit, className = "" }: TransactionTableProps) {
  return (
    <div className={`hidden lg:block border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">Opis</th>
              <th className="text-left p-4 font-medium text-foreground">Data</th>
              <th className="text-left p-4 font-medium text-foreground">Konto</th>
              <th className="text-left p-4 font-medium text-foreground">Kategoria</th>
              <th className="text-right p-4 font-medium text-foreground">Kwota</th>
              <th className="text-right p-4 font-medium text-foreground w-[50px]">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const account = accounts.find(acc => acc.id === transaction.accountId);
              return (
                <tr key={transaction.id} className="border-b border-border">
                  <td className="p-4 text-foreground font-medium">
                    {transaction.description}
                  </td>
                  <td className="p-4 text-foreground">
                    {new Date(transaction.date).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account?.color || '#6b7280' }}
                      />
                      <span className="text-secondary text-sm">
                        {account?.name || 'Nieznane konto'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-secondary">
                    {transaction.category}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <TransactionMenu
                      transaction={transaction}
                      accounts={accounts}
                      budgetGroups={budgetGroups}
                      onEdit={onEdit}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
