"use client"

import * as React from "react"
import { useAccounts } from "@/contexts/account-context"

export function MoneyStatusIndicator() {
  const { getAvailableToAssign } = useAccounts()
  
  // Get the real available money to assign
  const availableMoney = getAvailableToAssign()
  
  const getStatusConfig = (amount: number) => {
    if (amount > 0) {
      return {
        bgColor: "bg-green-100 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-800 dark:text-green-200",
        message: "You have money to assign!"
      }
    } else if (amount === 0) {
      return {
        bgColor: "bg-gray-100 dark:bg-gray-900/20",
        borderColor: "border-gray-200 dark:border-gray-800",
        textColor: "text-gray-800 dark:text-gray-200",
        message: "Everything is good!"
      }
    } else {
      return {
        bgColor: "bg-red-100 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-800 dark:text-red-200",
        message: "Oh oh, There's too much month left at the end of your money."
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount))
  }

  const status = getStatusConfig(availableMoney)

  return (
    <div className={`w-full rounded-lg border p-4 md:p-6 ${status.bgColor} ${status.borderColor}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className={`text-sm md:text-base font-medium ${status.textColor} mb-1`}>
            {availableMoney === 0 ? (
              formatCurrency(0)
            ) : (
              `${availableMoney > 0 ? '+' : '-'}${formatCurrency(availableMoney)}`
            )}
          </div>
          <div className={`text-xs md:text-sm ${status.textColor}`}>
            {status.message}
          </div>
        </div>
        {availableMoney !== 0 && (
          <div className="mt-2 md:mt-0">
            <div className={`text-xs ${status.textColor} opacity-75`}>
              Available to assign
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
