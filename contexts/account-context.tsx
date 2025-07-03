"use client"

import * as React from "react"

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
  const [accounts, setAccounts] = React.useState<Account[]>([
    {
      id: "1",
      name: "Main Checking",
      type: "checking",
      subtype: "Checking account",
      balance: 2450.00,
      category: "Cash",
    },
    {
      id: "2",
      name: "Savings",
      type: "savings",
      subtype: "Savings account",
      balance: 12350.00,
      category: "Savings",
    },
    {
      id: "3",
      name: "Credit Card",
      type: "credit-card",
      subtype: "Credit card",
      balance: -1230.00,
      category: "Credit Cards",
    },
  ])
  const [transactions, setTransactions] = React.useState<Transaction[]>([
    {
      id: "t1",
      accountId: "1",
      date: new Date("2024-07-01"),
      payee: "Grocery Store",
      category: "Groceries",
      memo: "Weekly shopping",
      expense: 120.50,
      income: 0,
    },
    {
      id: "t2",
      accountId: "1",
      date: new Date("2024-07-02"),
      payee: "Salary",
      category: "Income",
      memo: "Monthly salary",
      expense: 0,
      income: 5000.00,
    },
    {
      id: "t3",
      accountId: "2",
      date: new Date("2024-07-01"),
      payee: "Transfer from Checking",
      category: "Transfer",
      memo: "Monthly savings",
      expense: 0,
      income: 500.00,
    },
  ])

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
      id: crypto.randomUUID(),
    }
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const addTransaction = React.useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
    }
    setCategoryGroups((prev) => [...prev, newGroup])
  }, [])

  const addCategoryBudget = React.useCallback((budget: Omit<CategoryBudget, "id">) => {
    const newBudget: CategoryBudget = {
      ...budget,
      id: crypto.randomUUID(),
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
  ])

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}
