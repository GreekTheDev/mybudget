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
      <div className="flex-1 min-h-screen">
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Account Not Found</h1>
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
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">{account.name}</h1>
        <div className="flex-1" />
        <Button 
          className="text-sm px-3 py-2 md:px-4 md:py-2 md:hidden"
          onClick={() => {
            const event = new CustomEvent('openAddTransaction', { detail: { accountId } })
            document.dispatchEvent(event)
          }}
        >
          Add Transaction
        </Button>
      </header>
      <div className="flex flex-col space-y-4 p-4 md:p-8 md:pt-6">
        <div className="grid grid-cols-3 gap-4 md:flex md:items-start md:gap-8 text-base md:text-lg">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-green-600 font-semibold text-sm md:text-base">{formatCurrency(totalIncome)}</span>
            <span className="text-xs md:text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex flex-col text-center md:text-left">
            <span className="text-red-600 font-semibold text-sm md:text-base">{formatCurrency(totalExpenses)}</span>
            <span className="text-xs md:text-sm text-muted-foreground">Expenses</span>
          </div>
          <div className="flex flex-col text-center md:text-left">
            <span className="font-bold text-lg md:text-xl">{formatCurrency(calculatedBalance)}</span>
            <span className="text-xs md:text-sm text-muted-foreground">Balance</span>
          </div>
        </div>
        <AccountTransactions accountId={account.id} />
      </div>
    </div>
  )
}
