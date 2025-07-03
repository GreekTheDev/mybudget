"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { ComboboxWithAdd } from "@/components/ui/combobox-with-add"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAccounts, Transaction } from "@/contexts/account-context"
import { MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AccountTransactionsProps {
  accountId?: string
}

export function AccountTransactions({ accountId }: AccountTransactionsProps) {
  const { 
    transactions, 
    updateTransaction, 
    deleteTransaction, 
    getUniquePayees, 
    getUniqueCategories 
  } = useAccounts()
  
  const [isClient, setIsClient] = React.useState(false)
  const [editingField, setEditingField] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const data: Transaction[] = accountId
    ? transactions.filter(t => t.accountId === accountId)
    : transactions

  const formatCurrency = (amount: number) => {
    if (amount === 0) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US')
  }

  const getTransactionAmount = (transaction: Transaction) => {
    if (transaction.income > 0) return transaction.income
    if (transaction.expense > 0) return -transaction.expense
    return 0
  }

  const updateTransactionAmount = (transactionId: string, value: string) => {
    const numValue = parseFloat(value) || 0
    if (numValue >= 0) {
      updateTransaction(transactionId, { income: numValue, expense: 0 })
    } else {
      updateTransaction(transactionId, { income: 0, expense: Math.abs(numValue) })
    }
  }

  const handleFieldClick = (transactionId: string, fieldName: string) => {
    setEditingField(`${transactionId}-${fieldName}`)
  }

  const handleFieldBlur = () => {
    setEditingField(null)
  }

  const isEditing = (transactionId: string, fieldName: string) => {
    return editingField === `${transactionId}-${fieldName}`
  }


  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No transactions found
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction) => {
              const amount = getTransactionAmount(transaction)
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date.toLocaleDateString('en-US')}</TableCell>
                  <TableCell>{transaction.payee}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.memo}</TableCell>
                  <TableCell className="text-right">
                    <span className={amount < 0 ? "text-red-600" : "text-green-600"}>
                      {amount !== 0 ? (amount < 0 ? `-${formatCurrency(amount)}` : formatCurrency(amount)) : ""}
                    </span>
                  </TableCell>
                  <TableCell className="w-16">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[200px]">Payee</TableHead>
            <TableHead className="w-[150px]">Category</TableHead>
            <TableHead className="w-auto">Memo</TableHead>
            <TableHead className="w-[120px] text-right">Amount</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => {
            const amount = getTransactionAmount(transaction)
            return (
              <TableRow key={transaction.id}>
                {/* Date Field */}
                <TableCell className="w-[150px]">
                  {isEditing(transaction.id, 'date') ? (
                    <div className="w-[140px]">
                      <DatePicker
                        date={transaction.date}
                        onDateChange={(date) => {
                          if (date) {
                            updateTransaction(transaction.id, { date })
                          }
                          handleFieldBlur()
                        }}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted/50 p-1 rounded w-[140px]"
                      onClick={() => handleFieldClick(transaction.id, 'date')}
                    >
                      {formatDate(transaction.date)}
                    </div>
                  )}
                </TableCell>
                
                {/* Payee Field */}
                <TableCell className="w-[200px]">
                  {isEditing(transaction.id, 'payee') ? (
                    <div className="w-[190px]">
                      <ComboboxWithAdd
                        value={transaction.payee}
                        onValueChange={(payee) => {
                          updateTransaction(transaction.id, { payee })
                          handleFieldBlur()
                        }}
                        options={getUniquePayees()}
                        placeholder="Select payee"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted/50 p-1 rounded w-[190px] truncate"
                      onClick={() => handleFieldClick(transaction.id, 'payee')}
                    >
                      {transaction.payee || "Click to add payee"}
                    </div>
                  )}
                </TableCell>
                
                {/* Category Field */}
                <TableCell className="w-[150px]">
                  {isEditing(transaction.id, 'category') ? (
                    <div className="w-[140px]">
                      <ComboboxWithAdd
                        value={transaction.category}
                        onValueChange={(category) => {
                          updateTransaction(transaction.id, { category })
                          handleFieldBlur()
                        }}
                        options={getUniqueCategories()}
                        placeholder="Select category"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted/50 p-1 rounded w-[140px] truncate"
                      onClick={() => handleFieldClick(transaction.id, 'category')}
                    >
                      {transaction.category || "Click to add category"}
                    </div>
                  )}
                </TableCell>
                
                {/* Memo Field */}
                <TableCell className="w-auto">
                  {isEditing(transaction.id, 'memo') ? (
                    <Input
                      value={transaction.memo}
                      onChange={(e) =>
                        updateTransaction(transaction.id, { memo: e.target.value })
                      }
                      onBlur={handleFieldBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFieldBlur()
                        }
                      }}
                      className="w-full min-w-[150px]"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted/50 p-1 rounded min-w-[150px]"
                      onClick={() => handleFieldClick(transaction.id, 'memo')}
                    >
                      {transaction.memo || "Click to add memo"}
                    </div>
                  )}
                </TableCell>
                
                {/* Amount Field */}
                <TableCell className="w-[120px] text-right">
                  {isEditing(transaction.id, 'amount') ? (
                    <div className="w-[110px] ml-auto">
                      <Input
                        type="number"
                        step="0.01"
                        value={amount !== 0 ? amount.toString() : ""}
                        onChange={(e) => updateTransactionAmount(transaction.id, e.target.value)}
                        onBlur={handleFieldBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleFieldBlur()
                          }
                        }}
                        className="w-full text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted/50 p-1 rounded text-right w-[110px] ml-auto"
                      onClick={() => handleFieldClick(transaction.id, 'amount')}
                    >
                      {amount !== 0 ? (
                        <span className={amount < 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {amount < 0 ? `-${formatCurrency(amount)}` : formatCurrency(amount)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Click to add</span>
                      )}
                    </div>
                  )}
                </TableCell>
                
                {/* Actions */}
                <TableCell className="w-16">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
