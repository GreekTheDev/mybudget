'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Transaction } from '@/lib/types';

interface EditTransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  budgetGroupId: string;
  budgetCategoryId: string;
  date: Date;
}
import { 
  AddTransactionModal,
  EditTransactionModal,
  TransactionFilters,
  TransactionList,
  TransactionTable
} from '@/components/pages/transactions';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { useTransactionContext } from '@/contexts/TransactionContext';
import { useAccountContext } from '@/contexts/AccountContext';


export default function Transactions() {
  const { state: budgetState } = useBudgetContext();
  const { state: transactionState, addTransaction, editTransaction } = useTransactionContext();
  const { state: accountState } = useAccountContext();
  const accounts = accountState.accounts;
  
  const transactions = transactionState.transactions;
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
    const accountMatch = filterAccount === 'all' || transaction.accountId === filterAccount;
    return typeMatch && categoryMatch && accountMatch;
  });

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddTransaction = (data: EditTransactionFormData) => {
    // Find category name from budgetCategoryId
    const budgetGroup = budgetState.groups.find(g => g.id === data.budgetGroupId);
    const budgetCategory = budgetGroup?.categories.find(c => c.id === data.budgetCategoryId);
    const categoryName = budgetCategory?.name || '';

    addTransaction({
      ...data,
      category: categoryName,
      date: data.date instanceof Date ? data.date : new Date(data.date),
    });
    setShowAddModal(false);
  };

  const handleEditTransaction = (id: string, data: EditTransactionFormData) => {
    // Find category name from budgetCategoryId
    const budgetGroup = budgetState.groups.find(g => g.id === data.budgetGroupId);
    const budgetCategory = budgetGroup?.categories.find(c => c.id === data.budgetCategoryId);
    const categoryName = budgetCategory?.name || '';

    editTransaction(id, {
      ...data,
      category: categoryName,
      date: data.date instanceof Date ? data.date : new Date(data.date),
    });
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Transakcje</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
          >
            Dodaj transakcję
          </button>
        </div>

        <TransactionFilters
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterType={filterType}
          filterCategory={filterCategory}
          filterAccount={filterAccount}
          onFilterTypeChange={setFilterType}
          onFilterCategoryChange={setFilterCategory}
          onFilterAccountChange={setFilterAccount}
          categories={categories}
          accounts={accounts}
        />

        <TransactionTable 
          transactions={sortedTransactions}
          accounts={accounts}
          budgetGroups={budgetState.groups}
          onEdit={handleEditTransaction}
        />

        <TransactionList 
          transactions={sortedTransactions}
          accounts={accounts}
          onTransactionClick={handleTransactionClick}
        />

        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTransaction}
          accounts={accounts}
          budgetGroups={budgetState.groups}
        />

        {selectedTransaction && (
          <EditTransactionModal
            transaction={selectedTransaction}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedTransaction(null);
            }}
            onSave={handleEditTransaction}
            accounts={accounts}
            budgetGroups={budgetState.groups}
          />
        )}

        <FloatingActionButton onClick={() => setShowAddModal(true)} />
      </div>
    </div>
  );
}
