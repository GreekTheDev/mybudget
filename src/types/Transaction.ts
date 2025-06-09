export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  account?: string;
}

export type TransactionFormData = Omit<Transaction, 'id'>;

export interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}