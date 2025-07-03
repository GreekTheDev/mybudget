"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { AccountTransactions } from "@/components/account-transactions"
import { useAccounts } from "@/contexts/account-context"

export default function AccountPage() {
  const params = useParams()
  const accountId = params.accountId as string
  const { getAccountById, getTransactionsByAccountId } = useAccounts()

  const account = getAccountById(accountId)
  const transactions = getTransactionsByAccountId(accountId)

  if (!account) {
    return (
      <div className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <h1 className="text-2xl font-bold tracking-tight">Account Not Found</h1>
        </header>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Account not found
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Calculate income and expenses from transactions
  const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0)
  const totalExpenses = transactions.reduce((sum, t) => sum + t.expense, 0)
  const calculatedBalance = totalIncome - totalExpenses

  return (
    <div className="flex-1">
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
        <h1 className="text-2xl font-bold tracking-tight">{account.name}</h1>
        <div className="flex-1" />
        <Button>Add Transaction</Button>
      </header>
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <div className="flex items-start gap-8 text-lg">
          <div className="flex flex-col">
            <span className="text-green-600 font-semibold">{formatCurrency(totalIncome)}</span>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex flex-col">
            <span className="text-red-600 font-semibold">{formatCurrency(totalExpenses)}</span>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">{formatCurrency(calculatedBalance)}</span>
            <span className="text-sm text-muted-foreground">Balance</span>
          </div>
        </div>
        <AccountTransactions accountId={account.id} />
      </div>
    </div>
  )
}
