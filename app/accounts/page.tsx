"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { AccountTransactions } from "@/components/account-transactions"
import { useAccounts } from "@/contexts/account-context"

export default function AllAccountsPage() {
  const { accounts } = useAccounts()

  return (
    <div className="flex-1">
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
        <h1 className="text-2xl font-bold tracking-tight">All Accounts</h1>
        <div className="flex-1" />
        <Button>Add Transaction</Button>
      </header>
      <div className="flex flex-col space-y-4 p-8 pt-6">
        <AccountTransactions />
      </div>
    </div>
  )
}
