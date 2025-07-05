"use client"

import * as React from "react"
import { generateUUID } from "@/lib/utils"

export interface Account {
  id: string
  name: string
  type: string
  subtype: string
  balance: number
  category: string
}

export interface Transaction {
  id: string
  accountId: string
  date: Date
  payee: string
  category: string
  memo: string
  expense: number
  income: number
}

export interface CategoryBudget {
  id: string
  name: string
  assignedAmount: number
  groupId: string
}

export interface CategoryGroup {
  id: string
  name: string
  isExpanded: boolean
}

interface AccountContextType {
  accounts: Account[]
  transactions: Transaction[]
  categoryGroups: CategoryGroup[]
  categoryBudgets: CategoryBudget[]
  addAccount: (account: Omit<Account, "id">) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategoryGroup: (group: Omit<CategoryGroup, "id">) => void
  addCategoryBudget: (budget: Omit<CategoryBudget, "id">) => void
  updateCategoryBudget: (id: string, budget: Partial<CategoryBudget>) => void
  updateCategoryGroup: (id: string, group: Partial<CategoryGroup>) => void
  deleteCategoryGroup: (id: string) => void
  deleteCategoryBudget: (id: string) => void
  reorderCategoryGroups: (startIndex: number, endIndex: number) => void
  reorderCategoryBudgets: (groupId: string, startIndex: number, endIndex: number) => void
  reorderAccounts: (startIndex: number, endIndex: number) => void
  toggleCategoryGroup: (groupId: string) => void
  getAccountById: (id: string) => Account | undefined
  getTransactionsByAccountId: (accountId: string) => Transaction[]
  getTotalByCategory: (category: string) => number
  getCategoryActivity: (categoryName: string) => number
  getBudgetsByGroupId: (groupId: string) => CategoryBudget[]
  getUniquePayees: () => string[]
  getUniqueCategories: () => string[]
  getAllAvailableCategories: () => string[]
  getTotalBalance: () => number
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getTotalBudgetAssigned: () => number
  getAvailableToAssign: () => number
}

const AccountContext = React.createContext<AccountContextType | null>(null)

export function useAccounts() {
  const context = React.useContext(AccountContext)
  if (!context) {
    throw new Error("useAccounts must be used within an AccountProvider")
  }
  return context
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [transactions, setTransactions] = React.useState<Transaction[]>([])

  const [categoryGroups, setCategoryGroups] = React.useState<CategoryGroup[]>([])

  const [categoryBudgets, setCategoryBudgets] = React.useState<CategoryBudget[]>([])

  const addAccount = React.useCallback((account: Omit<Account, "id">) => {
    const newAccount: Account = {
      ...account,
      id: generateUUID(),
    }
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const updateAccount = React.useCallback((id: string, updatedFields: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? { ...account, ...updatedFields }
          : account
      )
    )
  }, [])

  const deleteAccount = React.useCallback((id: string) => {
    // First delete all transactions for this account
    setTransactions((prev) => prev.filter((transaction) => transaction.accountId !== id))
    // Then delete the account
    setAccounts((prev) => prev.filter((account) => account.id !== id))
  }, [])

  const addTransaction = React.useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
    }
    setTransactions((prev) => [...prev, newTransaction])
    
    // Update account balance when a transaction is added
    setAccounts((prevAccounts) => 
      prevAccounts.map((account) => {
        if (account.id === transaction.accountId) {
          // For income, add to balance; for expense, subtract from balance
          const balanceChange = transaction.income - transaction.expense;
          return {
            ...account,
            balance: account.balance + balanceChange
          }
        }
        return account
      })
    )
  }, [])

  const updateTransaction = React.useCallback((id: string, updatedFields: Partial<Transaction>) => {
    // First, find the original transaction to calculate balance changes
    setTransactions((prev) => {
      const originalTransaction = prev.find(t => t.id === id);
      if (!originalTransaction) return prev;
      
      const updatedTransaction = { ...originalTransaction, ...updatedFields };
      
      // Update account balance if income or expense changed
      if (originalTransaction.income !== updatedTransaction.income || 
          originalTransaction.expense !== updatedTransaction.expense ||
          originalTransaction.accountId !== updatedTransaction.accountId) {
        
        setAccounts(prevAccounts => {
          return prevAccounts.map(account => {
            // If this is the original account, remove the original transaction amount
            if (account.id === originalTransaction.accountId) {
              const originalBalanceChange = originalTransaction.income - originalTransaction.expense;
              return {
                ...account,
                balance: account.balance - originalBalanceChange
              };
            }
            // If this is the new account (in case account changed), add the new transaction amount
            else if (updatedFields.accountId && account.id === updatedFields.accountId) {
              const newIncome = updatedFields.income !== undefined ? updatedFields.income : originalTransaction.income;
              const newExpense = updatedFields.expense !== undefined ? updatedFields.expense : originalTransaction.expense;
              const newBalanceChange = newIncome - newExpense;
              return {
                ...account,
                balance: account.balance + newBalanceChange
              };
            }
            // If the account ID didn't change but amounts did
            else if (!updatedFields.accountId && account.id === originalTransaction.accountId) {
              const oldBalanceChange = originalTransaction.income - originalTransaction.expense;
              const newIncome = updatedFields.income !== undefined ? updatedFields.income : originalTransaction.income;
              const newExpense = updatedFields.expense !== undefined ? updatedFields.expense : originalTransaction.expense;
              const newBalanceChange = newIncome - newExpense;
              const netBalanceChange = newBalanceChange - oldBalanceChange;
              
              return {
                ...account,
                balance: account.balance + netBalanceChange
              };
            }
            return account;
          });
        });
      }
      
      // Return the updated transactions array
      return prev.map(transaction => 
        transaction.id === id 
          ? updatedTransaction
          : transaction
      );
    });
  }, [])

  const deleteTransaction = React.useCallback((id: string) => {
    // First, find the transaction to be deleted
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (transactionToDelete) {
      // Update account balance by removing the transaction amount
      setAccounts(prevAccounts => 
        prevAccounts.map(account => {
          if (account.id === transactionToDelete.accountId) {
            const balanceChange = transactionToDelete.income - transactionToDelete.expense;
            return {
              ...account,
              balance: account.balance - balanceChange
            };
          }
          return account;
        })
      );
      
      // Then remove the transaction from the list
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    }
  }, [transactions])

  const getUniquePayees = React.useCallback(() => {
    const payees = transactions.map((t) => t.payee).filter(Boolean)
    return [...new Set(payees)].sort()
  }, [transactions])

  const getUniqueCategories = React.useCallback(() => {
    const categories = transactions.map((t) => t.category).filter(Boolean)
    return [...new Set(categories)].sort()
  }, [transactions])
  
  // Define getBudgetsByGroupId before it's used in getAllAvailableCategories
  const getBudgetsByGroupId = React.useCallback((groupId: string) => {
    return categoryBudgets.filter((budget) => budget.groupId === groupId)
  }, [categoryBudgets])

  const getAllAvailableCategories = React.useCallback(() => {
    // Get all unique categories from transactions
    const transactionCategories = transactions.map((t) => t.category).filter(Boolean)
    
    // Get all budget categories from all groups
    const budgetCategories = categoryGroups.flatMap(group => 
      getBudgetsByGroupId(group.id).map(budget => budget.name)
    ).filter(Boolean)
    
    // Combine and deduplicate
    const allCategories = [...transactionCategories, ...budgetCategories]
    return [...new Set(allCategories)].sort()
  }, [transactions, categoryGroups, getBudgetsByGroupId])

  const getAccountById = React.useCallback((id: string) => {
    return accounts.find((account) => account.id === id)
  }, [accounts])

  const getTransactionsByAccountId = React.useCallback((accountId: string) => {
    return transactions.filter((transaction) => transaction.accountId === accountId)
  }, [transactions])

  const getTotalByCategory = React.useCallback((category: string) => {
    return accounts
      .filter((account) => account.category === category)
      .reduce((total, account) => total + account.balance, 0)
  }, [accounts])

  const addCategoryGroup = React.useCallback((group: Omit<CategoryGroup, "id">) => {
    const newGroup: CategoryGroup = {
      ...group,
      id: generateUUID(),
    }
    setCategoryGroups((prev) => [...prev, newGroup])
  }, [])

  const addCategoryBudget = React.useCallback((budget: Omit<CategoryBudget, "id">) => {
    // Create the new budget object with a simple ID generation
    const newBudget: CategoryBudget = {
      ...budget,
      id: generateUUID(),
      assignedAmount: budget.assignedAmount || 0, // Ensure assignedAmount is a number
    }
    
    // Update state with the new budget
    setCategoryBudgets((prev) => [...prev, newBudget])
    
    return newBudget
  }, [])

  const updateCategoryBudget = React.useCallback((id: string, updatedFields: Partial<CategoryBudget>) => {
    setCategoryBudgets((prev) =>
      prev.map((budget) =>
        budget.id === id
          ? { ...budget, ...updatedFields }
          : budget
      )
    )
  }, [])

  const updateCategoryGroup = React.useCallback((id: string, updatedFields: Partial<CategoryGroup>) => {
    setCategoryGroups((prev) =>
      prev.map((group) =>
        group.id === id
          ? { ...group, ...updatedFields }
          : group
      )
    )
  }, [])

  const deleteCategoryGroup = React.useCallback((id: string) => {
    // Delete all budgets in this group first
    setCategoryBudgets((prev) => prev.filter((budget) => budget.groupId !== id))
    // Then delete the group
    setCategoryGroups((prev) => prev.filter((group) => group.id !== id))
  }, [])

  const deleteCategoryBudget = React.useCallback((id: string) => {
    setCategoryBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }, [])

  const reorderCategoryGroups = React.useCallback((startIndex: number, endIndex: number) => {
    setCategoryGroups((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const reorderCategoryBudgets = React.useCallback((groupId: string, startIndex: number, endIndex: number) => {
    setCategoryBudgets((prev) => {
      const groupBudgets = prev.filter(budget => budget.groupId === groupId)
      const otherBudgets = prev.filter(budget => budget.groupId !== groupId)
      
      const result = Array.from(groupBudgets)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      return [...otherBudgets, ...result]
    })
  }, [])
  
  const reorderAccounts = React.useCallback((startIndex: number, endIndex: number) => {
    setAccounts((prev) => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  const toggleCategoryGroup = React.useCallback((groupId: string) => {
    setCategoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    )
  }, [])

  const getCategoryActivity = React.useCallback((categoryName: string) => {
    return transactions
      .filter((transaction) => transaction.category === categoryName)
      .reduce((total, transaction) => total + transaction.expense, 0)
  }, [transactions])

  // Calculate total balance across all accounts
  const getTotalBalance = React.useCallback(() => {
    return accounts.reduce((total, account) => total + account.balance, 0)
  }, [accounts])

  // Calculate total income from all transactions
  const getTotalIncome = React.useCallback(() => {
    return transactions.reduce((total, transaction) => total + transaction.income, 0)
  }, [transactions])

  // Calculate total expenses from all transactions
  const getTotalExpenses = React.useCallback(() => {
    return transactions.reduce((total, transaction) => total + transaction.expense, 0)
  }, [transactions])

  // Calculate total budget assigned across all categories
  const getTotalBudgetAssigned = React.useCallback(() => {
    return categoryBudgets.reduce((total, budget) => total + budget.assignedAmount, 0)
  }, [categoryBudgets])

  // Calculate available money to assign (total balance - total assigned)
  const getAvailableToAssign = React.useCallback(() => {
    const totalBalance = getTotalBalance()
    const totalAssigned = getTotalBudgetAssigned()
    return totalBalance - totalAssigned
  }, [getTotalBalance, getTotalBudgetAssigned])

  const value = React.useMemo(() => ({
    accounts,
    transactions,
    categoryGroups,
    categoryBudgets,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategoryGroup,
    addCategoryBudget,
    updateCategoryBudget,
    updateCategoryGroup,
    deleteCategoryGroup,
    deleteCategoryBudget,
    reorderCategoryGroups,
    reorderCategoryBudgets,
    reorderAccounts,
    toggleCategoryGroup,
    getAccountById,
    getTransactionsByAccountId,
    getTotalByCategory,
    getCategoryActivity,
    getBudgetsByGroupId,
    getUniquePayees,
    getUniqueCategories,
    getAllAvailableCategories,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getTotalBudgetAssigned,
    getAvailableToAssign,
  }), [
    accounts,
    transactions,
    categoryGroups,
    categoryBudgets,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategoryGroup,
    addCategoryBudget,
    updateCategoryBudget,
    updateCategoryGroup,
    deleteCategoryGroup,
    deleteCategoryBudget,
    reorderCategoryGroups,
    reorderCategoryBudgets,
    reorderAccounts,
    toggleCategoryGroup,
    getAccountById,
    getTransactionsByAccountId,
    getTotalByCategory,
    getCategoryActivity,
    getBudgetsByGroupId,
    getUniquePayees,
    getUniqueCategories,
    getAllAvailableCategories,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getTotalBudgetAssigned,
    getAvailableToAssign,
  ])

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}
