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
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategoryGroup: (group: Omit<CategoryGroup, "id">) => void
  addCategoryBudget: (budget: Omit<CategoryBudget, "id">) => void
  updateCategoryBudget: (id: string, budget: Partial<CategoryBudget>) => void
  updateCategoryGroup: (id: string, group: Partial<CategoryGroup>) => void
  deleteCategoryBudget: (id: string) => void
  toggleCategoryGroup: (groupId: string) => void
  getAccountById: (id: string) => Account | undefined
  getTransactionsByAccountId: (accountId: string) => Transaction[]
  getTotalByCategory: (category: string) => number
  getCategoryActivity: (categoryName: string) => number
  getBudgetsByGroupId: (groupId: string) => CategoryBudget[]
  getUniquePayees: () => string[]
  getUniqueCategories: () => string[]
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

  const [categoryGroups, setCategoryGroups] = React.useState<CategoryGroup[]>([
    { id: "bills", name: "Bills", isExpanded: false },
    { id: "needs", name: "Needs", isExpanded: false },
    { id: "wants", name: "Wants", isExpanded: false },
    { id: "savings", name: "Savings", isExpanded: false },
  ])

  const [categoryBudgets, setCategoryBudgets] = React.useState<CategoryBudget[]>([
    { id: "cb1", name: "Mortgage", assignedAmount: 0, groupId: "bills" },
    { id: "cb2", name: "TV, phone and internet", assignedAmount: 0, groupId: "bills" },
    { id: "cb3", name: "Insurance", assignedAmount: 0, groupId: "bills" },
    { id: "cb4", name: "Personal loans", assignedAmount: 0, groupId: "bills" },
    { id: "cb5", name: "Music", assignedAmount: 0, groupId: "bills" },
    { id: "cb6", name: "TV streaming", assignedAmount: 0, groupId: "bills" },
    { id: "cb7", name: "Fitness", assignedAmount: 0, groupId: "bills" },
    { id: "cb8", name: "Other subscriptions", assignedAmount: 0, groupId: "bills" },
  ])

  const addAccount = React.useCallback((account: Omit<Account, "id">) => {
    const newAccount: Account = {
      ...account,
      id: generateUUID(),
    }
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const addTransaction = React.useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }, [])

  const updateTransaction = React.useCallback((id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) => 
      prev.map((transaction) => 
        transaction.id === id 
          ? { ...transaction, ...updatedFields }
          : transaction
      )
    )
  }, [])

  const deleteTransaction = React.useCallback((id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }, [])

  const getUniquePayees = React.useCallback(() => {
    const payees = transactions.map((t) => t.payee).filter(Boolean)
    return [...new Set(payees)].sort()
  }, [transactions])

  const getUniqueCategories = React.useCallback(() => {
    const categories = transactions.map((t) => t.category).filter(Boolean)
    return [...new Set(categories)].sort()
  }, [transactions])

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
    const newBudget: CategoryBudget = {
      ...budget,
      id: generateUUID(),
    }
    setCategoryBudgets((prev) => [...prev, newBudget])
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

  const deleteCategoryBudget = React.useCallback((id: string) => {
    setCategoryBudgets((prev) => prev.filter((budget) => budget.id !== id))
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

  const getBudgetsByGroupId = React.useCallback((groupId: string) => {
    return categoryBudgets.filter((budget) => budget.groupId === groupId)
  }, [categoryBudgets])

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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategoryGroup,
    addCategoryBudget,
    updateCategoryBudget,
    updateCategoryGroup,
    deleteCategoryBudget,
    toggleCategoryGroup,
    getAccountById,
    getTransactionsByAccountId,
    getTotalByCategory,
    getCategoryActivity,
    getBudgetsByGroupId,
    getUniquePayees,
    getUniqueCategories,
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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategoryGroup,
    addCategoryBudget,
    updateCategoryBudget,
    updateCategoryGroup,
    deleteCategoryBudget,
    toggleCategoryGroup,
    getAccountById,
    getTransactionsByAccountId,
    getTotalByCategory,
    getCategoryActivity,
    getBudgetsByGroupId,
    getUniquePayees,
    getUniqueCategories,
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
