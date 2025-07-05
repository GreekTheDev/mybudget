"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MonthNavigationProps {
  selectedMonth: Date
  onMonthChange: (date: Date) => void
  className?: string
}

export function MonthNavigation({ selectedMonth, onMonthChange, className = "" }: MonthNavigationProps) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  const formatMonthYear = (date: Date) => {
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      
      <div className="flex items-center">
        <h2 className="text-lg font-semibold min-w-[160px] text-center">
          {formatMonthYear(selectedMonth)}
        </h2>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  )
}
