'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';
import { useAccountContext } from '@/contexts/AccountContext';
import { useBudgetContext } from '@/contexts/BudgetContext';

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction =
  | { type: 'LOAD_TRANSACTIONS'; payload: { transactions: Transaction[] } }
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> }
  | { type: 'ADD_TRANSACTION_SUCCESS'; payload: { transaction: Transaction } }
  | { type: 'EDIT_TRANSACTION'; payload: { id: string; data: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } };

interface TransactionContextType {
  state: TransactionState;
  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'LOAD_TRANSACTIONS': {
      return {
        ...state,
        transactions: action.payload.transactions || [],
      };
    }

    case 'ADD_TRANSACTION_SUCCESS': {
      return {
        ...state,
        transactions: [...state.transactions, action.payload.transaction],
      };
    }

    case 'ADD_TRANSACTION': {
      // Temporary local update (will be replaced by ADD_TRANSACTION_SUCCESS)
      return state;
    }

    case 'EDIT_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.data }
            : transaction
        ),
      };
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload.id
        ),
      };
    }

    default:
      return state;
  }
}

const initialState: TransactionState = {
  transactions: [],
};

interface TransactionProviderProps {
  children: ReactNode;
  initialTransactions?: Transaction[];
}

export function TransactionProvider({ children, initialTransactions = [] }: TransactionProviderProps) {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: initialTransactions,
  });
  const supabase = createClient();
  const { refreshAccounts } = useAccountContext();
  const { refreshBudgets } = useBudgetContext();

  // Load transactions from Supabase on mount
  useEffect(() => {
    const loadTransactions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user logged in');
        return;
      }

      // Load transactions with related data
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          description,
          amount,
          type,
          date,
          account_id,
          budget_group_id,
          budget_category_id,
          budget_categories (
            name
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      if (transactions) {
        const transformedTransactions: Transaction[] = transactions.map(t => ({
          id: t.id,
          description: t.description,
          amount: Number(t.amount),
          type: t.type as 'income' | 'expense',
          category: (t.budget_categories as any)?.name || '',
          date: new Date(t.date),
          accountId: t.account_id,
          budgetGroupId: t.budget_group_id || undefined,
          budgetCategoryId: t.budget_category_id || undefined,
        }));

        dispatch({ type: 'LOAD_TRANSACTIONS', payload: { transactions: transformedTransactions } });
      }
    };

    loadTransactions();
  }, []);

  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Insert transaction into database
    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: data.date.toISOString(),
        account_id: data.accountId,
        budget_group_id: data.budgetGroupId || null,
        budget_category_id: data.budgetCategoryId || null,
      })
      .select(`
        id,
        description,
        amount,
        type,
        date,
        account_id,
        budget_group_id,
        budget_category_id
      `)
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    if (newTransaction) {
      const transaction: Transaction = {
        id: newTransaction.id,
        description: newTransaction.description,
        amount: Number(newTransaction.amount),
        type: newTransaction.type as 'income' | 'expense',
        category: data.category,
        date: new Date(newTransaction.date),
        accountId: newTransaction.account_id,
        budgetGroupId: newTransaction.budget_group_id || undefined,
        budgetCategoryId: newTransaction.budget_category_id || undefined,
      };
      dispatch({ type: 'ADD_TRANSACTION_SUCCESS', payload: { transaction } });
      
      // Refresh accounts and budgets to show updated balances
      await Promise.all([
        refreshAccounts(),
        refreshBudgets()
      ]);
    }
  };

  const editTransaction = async (id: string, data: Partial<Transaction>) => {
    // Build update object
    const updateData: any = {};
    if (data.description !== undefined) updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.date !== undefined) updateData.date = data.date.toISOString();
    if (data.accountId !== undefined) updateData.account_id = data.accountId;
    if (data.budgetGroupId !== undefined) updateData.budget_group_id = data.budgetGroupId;
    if (data.budgetCategoryId !== undefined) updateData.budget_category_id = data.budgetCategoryId;

    // Update in database
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'EDIT_TRANSACTION', payload: { id, data } });
    
    // Refresh accounts and budgets to show updated balances
    await Promise.all([
      refreshAccounts(),
      refreshBudgets()
    ]);
  };

  const deleteTransaction = async (id: string) => {
    // Delete from database
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } });
    
    // Refresh accounts and budgets to show updated balances
    await Promise.all([
      refreshAccounts(),
      refreshBudgets()
    ]);
  };

  const contextValue: TransactionContextType = {
    state,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
}
