"use client"

import * as React from "react"
import { TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex-1 min-h-screen">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Reports</h1>
        <div className="flex-1" />
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 md:pt-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-xs sm:text-sm font-medium">Monthly Overview</div>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
            <div className="text-lg sm:text-2xl font-bold">Coming Soon</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Detailed monthly reports
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-xs sm:text-sm font-medium">Spending Analysis</div>
              <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
            <div className="text-lg sm:text-2xl font-bold">Coming Soon</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Category breakdown
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-xs sm:text-sm font-medium">Trends</div>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </div>
            <div className="text-lg sm:text-2xl font-bold">Coming Soon</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Income and expense trends
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg">
          <div className="text-center space-y-2">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Reports Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We're working on comprehensive reporting features including charts, 
              analytics, and insights to help you understand your finances better.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
