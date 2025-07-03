"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { AccountTransactions } from "@/components/account-transactions"

export default function AllAccountsPage() {
  return (
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">All Accounts</h1>
        <div className="flex-1" />
        <Button 
          className="text-sm px-3 py-2 md:px-4 md:py-2 md:hidden"
          onClick={() => {
            const event = new CustomEvent('openAddTransaction')
            document.dispatchEvent(event)
          }}
        >
          Add Transaction
        </Button>
      </header>
      <div className="flex flex-col space-y-4 p-4 md:p-8 md:pt-6">
        <AccountTransactions />
      </div>
    </div>
  )
}
