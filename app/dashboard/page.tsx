"use client"

import { Calculator, TrendingUp, CreditCard } from "lucide-react";
import { CategoryBudgetTable } from "@/components/CategoryBudgetTable";
import { MoneyStatusIndicator } from "@/components/money-status-indicator";
import { useAccounts } from "@/contexts/account-context";

export default function Dashboard() {
  const { getTotalBalance, getTotalIncome, getTotalExpenses, getTotalBudgetAssigned } = useAccounts()
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  const totalBalance = getTotalBalance()
  const totalBudgetAssigned = getTotalBudgetAssigned()
  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const budgetRemaining = totalBudgetAssigned - totalExpenses
  
  return (
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex-1" />
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 md:pt-6">
        {/* Mobile 2x2 Grid, Desktop 4 columns */}
        <div className="grid gap-2 grid-cols-2 md:gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <div className="text-[10px] md:text-sm font-medium">Total Balance</div>
            <CreditCard className="h-2 w-2 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div className="text-sm md:text-2xl font-bold">{formatCurrency(totalBalance)}</div>
          <p className="text-[8px] md:text-xs text-muted-foreground">
            Across all accounts
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <div className="text-[10px] md:text-sm font-medium">Budget Assigned</div>
            <Calculator className="h-2 w-2 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div className="text-sm md:text-2xl font-bold">{formatCurrency(totalBudgetAssigned)}</div>
          <p className="text-[8px] md:text-xs text-muted-foreground">
            {formatCurrency(budgetRemaining)} remaining
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <div className="text-[10px] md:text-sm font-medium">Total Expenses</div>
            <TrendingUp className="h-2 w-2 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div className="text-sm md:text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-[8px] md:text-xs text-muted-foreground">
            From all transactions
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <div className="text-[10px] md:text-sm font-medium">Total Income</div>
            <TrendingUp className="h-2 w-2 md:h-4 md:w-4 text-muted-foreground" />
          </div>
          <div className="text-sm md:text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-[8px] md:text-xs text-muted-foreground">
            From all transactions
          </p>
        </div>
        </div>
        
        {/* Money Status Indicator */}
        <MoneyStatusIndicator />
        
        {/* Category Budget Table */}
        <CategoryBudgetTable />
      </div>
    </div>
  );
}