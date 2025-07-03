"use client"

import * as React from "react"
import { CategoryBudgetTable } from "@/components/CategoryBudgetTable"

export default function BudgetPage() {
  return (
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Budget</h1>
        <div className="flex-1" />
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 md:pt-6">
        <CategoryBudgetTable />
      </div>
    </div>
  )
}
