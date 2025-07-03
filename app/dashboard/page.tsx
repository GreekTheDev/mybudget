import { Calculator, TrendingUp, CreditCard } from "lucide-react";
import { CategoryBudgetTable } from "@/components/CategoryBudgetTable";

export default function Dashboard() {
  return (
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex-1" />
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 md:pt-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-xs sm:text-sm font-medium">Total Balance</div>
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
          <div className="text-lg sm:text-2xl font-bold">$13,570.00</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            +2.1% from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-xs sm:text-sm font-medium">Monthly Budget</div>
            <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
          <div className="text-lg sm:text-2xl font-bold">$3,200.00</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            $800 remaining this month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-xs sm:text-sm font-medium">Monthly Expenses</div>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
          <div className="text-lg sm:text-2xl font-bold">$2,400.00</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            +12% from last month
          </p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-xs sm:text-sm font-medium">Savings Goal</div>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </div>
          <div className="text-lg sm:text-2xl font-bold">78%</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            $7,800 of $10,000 goal
          </p>
        </div>
        </div>
        
        {/* Category Budget Table */}
        <CategoryBudgetTable />
      </div>
    </div>
  );
}