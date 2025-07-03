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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

interface AccountTransactionsProps {
  accountId?: string
}

export function AccountTransactions({ accountId }: AccountTransactionsProps) {
  const { 
    transactions, 
    accounts,
    addTransaction,
    updateTransaction, 
    deleteTransaction, 
    getUniquePayees, 
    getUniqueCategories 
  } = useAccounts()
  
  const [isClient, setIsClient] = React.useState(false)
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showNewRow, setShowNewRow] = React.useState(false)
  const [newTransaction, setNewTransaction] = React.useState({
    payee: "",
    amount: "",
    accountId: accountId || "",
    date: new Date(),
    category: "",
    memo: ""
  })

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

  const handleAddNewTransaction = () => {
    // For mobile, show dialog
    if (window.innerWidth < 768) {
      setShowAddDialog(true)
    } else {
      // For desktop, show new row
      setShowNewRow(true)
    }
  }

  const handleSaveNewTransaction = () => {
    if (!newTransaction.payee || !newTransaction.amount) return

    const amount = parseFloat(newTransaction.amount)
    if (isNaN(amount)) return

    const transaction = {
      accountId: newTransaction.accountId,
      date: newTransaction.date,
      payee: newTransaction.payee,
      category: newTransaction.category,
      memo: newTransaction.memo,
      income: amount > 0 ? amount : 0,
      expense: amount < 0 ? Math.abs(amount) : 0,
    }

    addTransaction(transaction)
    setShowNewRow(false)
    setNewTransaction({
      payee: "",
      amount: "",
      accountId: accountId || "",
      date: new Date(),
      category: "",
      memo: ""
    })
  }

  const handleCancelNewTransaction = () => {
    setShowNewRow(false)
    setNewTransaction({
      payee: "",
      amount: "",
      accountId: accountId || "",
      date: new Date(),
      category: "",
      memo: ""
    })
  }

  const isEditing = (transactionId: string, fieldName: string) => {
    return editingField === `${transactionId}-${fieldName}`
  }


  if (data.length === 0) {
    return (
      <React.Fragment>
        <div className="flex items-center justify-center h-32 text-muted-foreground mb-4">
          No transactions found
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={handleAddNewTransaction}
          >
            Add Transaction
          </Button>
        </div>
        
        {/* Mobile Add Transaction Dialog */}
        <AddTransactionDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          accountId={accountId}
        />
      </React.Fragment>
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
    <React.Fragment>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {data.map((transaction) => {
          const amount = getTransactionAmount(transaction)
          return (
            <div key={transaction.id} className="rounded-lg border bg-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">
                    {transaction.payee || "Unknown Payee"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    {amount !== 0 ? (
                      <span className={`text-sm font-medium ${
                        amount < 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        {amount < 0 ? `-${formatCurrency(amount)}` : formatCurrency(amount)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No amount</span>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="space-y-2">
                {transaction.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">Category:</span>
                    <span className="text-xs px-2 py-1 bg-muted rounded-md">
                      {transaction.category}
                    </span>
                  </div>
                )}
                {transaction.memo && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground w-16 mt-0.5">Memo:</span>
                    <span className="text-xs text-muted-foreground flex-1">
                      {transaction.memo}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
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
          
          {/* New Transaction Row for Desktop */}
          {showNewRow && (
            <TableRow className="bg-muted/20">
              {/* Date */}
              <TableCell className="w-[150px]">
                <DatePicker
                  date={newTransaction.date}
                  onDateChange={(date) => {
                    if (date) {
                      setNewTransaction(prev => ({ ...prev, date }))
                    }
                  }}
                  className="w-[140px]"
                />
              </TableCell>
              
              {/* Payee */}
              <TableCell className="w-[200px]">
                <Input
                  value={newTransaction.payee}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, payee: e.target.value }))}
                  placeholder="Enter payee name"
                  className="w-[190px]"
                />
              </TableCell>
              
              {/* Category */}
              <TableCell className="w-[150px]">
                <Input
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                  className="w-[140px]"
                />
              </TableCell>
              
              {/* Memo */}
              <TableCell className="w-auto">
                <Input
                  value={newTransaction.memo}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, memo: e.target.value }))}
                  placeholder="Enter memo"
                  className="min-w-[150px]"
                />
              </TableCell>
              
              {/* Amount */}
              <TableCell className="w-[120px] text-right">
                <Input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-[110px] ml-auto text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </TableCell>
              
              {/* Actions */}
              <TableCell className="w-16">
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSaveNewTransaction}
                    disabled={!newTransaction.payee || !newTransaction.amount}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleCancelNewTransaction}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Add Transaction Button */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={handleAddNewTransaction}
          disabled={showNewRow}
        >
          Add Transaction
        </Button>
      </div>
    </div>
    
    {/* Mobile Add Transaction Dialog */}
    <AddTransactionDialog 
      open={showAddDialog}
      onOpenChange={setShowAddDialog}
      accountId={accountId}
    />
    </React.Fragment>
  )
}
