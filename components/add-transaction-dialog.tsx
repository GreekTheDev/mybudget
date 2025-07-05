"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAccounts, Transaction } from "@/contexts/account-context"
import { AddAccountDialog } from "@/components/add-account-dialog"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId?: string // If provided, pre-select this account
  existingTransaction?: Transaction | null // If provided, we're editing an existing transaction
}

type TransactionType = "expense" | "income" | "transfer"
type RepeatFrequency = "day" | "week" | "month" | "year"

export function AddTransactionDialog({ 
  open, 
  onOpenChange, 
  accountId, 
  existingTransaction 
}: AddTransactionDialogProps) {
  const { accounts, addTransaction, updateTransaction, categoryGroups, getBudgetsByGroupId, addAccount } = useAccounts()
  const [step, setStep] = React.useState<"form" | "category-selection" | "add-account">("form")
  
  // Transaction type state
  const [transactionType, setTransactionType] = React.useState<TransactionType>("expense")
  
  // Recurring transaction state
  const [isRecurring, setIsRecurring] = React.useState(false)
  const [repeatFrequency, setRepeatFrequency] = React.useState<RepeatFrequency>("month")
  const [repeatInterval, setRepeatInterval] = React.useState(1)
  
  // For transfer transactions
  const [toAccountId, setToAccountId] = React.useState("")
  
  // Initialize form data based on whether we're editing or creating
  const [formData, setFormData] = React.useState({
    payee: "",
    amount: "",
    accountId: accountId || "",
    date: new Date(),
    category: "",
    memo: ""
  })
  
  // Update form data when existingTransaction changes
  React.useEffect(() => {
    if (existingTransaction) {
      const amount = existingTransaction.income > 0 
        ? existingTransaction.income.toString() 
        : existingTransaction.expense.toString();
      
      // Determine transaction type
      const type: TransactionType = existingTransaction.income > 0 
        ? "income" 
        : "expense";
        
      setTransactionType(type);
      setFormData({
        payee: existingTransaction.payee,
        amount: Math.abs(parseFloat(amount)).toString(), // Store absolute value
        accountId: existingTransaction.accountId,
        date: existingTransaction.date,
        category: existingTransaction.category,
        memo: existingTransaction.memo || ""
      });
    } else if (!open) {
      // Reset form when dialog closes and we're not editing
      setFormData({
        payee: "",
        amount: "",
        accountId: accountId || "",
        date: new Date(),
        category: "",
        memo: ""
      });
      setTransactionType("expense");
      setIsRecurring(false);
      setRepeatFrequency("month");
      setRepeatInterval(1);
    }
  }, [existingTransaction, open, accountId])

  // Handle amount input change with automatic sign adjustment
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // If user enters a negative sign, switch to expense type
    if (value.startsWith('-')) {
      setTransactionType("expense");
      value = value.substring(1);
    }
    // If user enters a plus sign, switch to income type
    else if (value.startsWith('+')) {
      setTransactionType("income");
      value = value.substring(1);
    }
    
    setFormData(prev => ({ ...prev, amount: value }));
  }

  // Handle transaction type change
  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form
    setStep("form")
    setFormData({
      payee: "",
      amount: "",
      accountId: accountId || "",
      date: new Date(),
      category: "",
      memo: ""
    })
    setTransactionType("expense")
    setIsRecurring(false)
    setRepeatFrequency("month")
    setRepeatInterval(1)
    setToAccountId("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation based on transaction type
    if (transactionType === "transfer") {
      if (!formData.amount || !formData.accountId || !toAccountId) return;
    } else {
      if (!formData.payee || !formData.amount || !formData.accountId || !formData.category) return;
    }

    const rawAmount = parseFloat(formData.amount)
    if (isNaN(rawAmount) || rawAmount <= 0) return

    // Handle "no category" selection
    const finalCategory = formData.category === "__no_category__" ? "" : formData.category

    if (transactionType === "transfer") {
      // For transfers, create two transactions (from and to)
      const fromTransaction = {
        accountId: formData.accountId,
        date: formData.date,
        payee: `Transfer to ${accounts.find(a => a.id === toAccountId)?.name || "another account"}`,
        category: "Transfer",
        memo: formData.memo,
        income: 0,
        expense: rawAmount,
      };
      
      const toTransaction = {
        accountId: toAccountId,
        date: formData.date,
        payee: `Transfer from ${accounts.find(a => a.id === formData.accountId)?.name || "another account"}`,
        category: "Transfer",
        memo: formData.memo,
        income: rawAmount,
        expense: 0,
      };
      
      // Add both transactions
      addTransaction(fromTransaction);
      addTransaction(toTransaction);
      
      // Handle recurring transfers
      if (isRecurring) {
        createRecurringTransactions(fromTransaction);
        createRecurringTransactions(toTransaction);
      }
    } else {
      // Regular income/expense transaction
      // Apply sign based on transaction type
      const amount = transactionType === "income" ? rawAmount : -rawAmount
      
      const transactionData = {
        accountId: formData.accountId,
        date: formData.date,
        payee: formData.payee,
        category: finalCategory,
        memo: formData.memo,
        income: amount > 0 ? amount : 0,
        expense: amount < 0 ? Math.abs(amount) : 0,
      }

      if (existingTransaction) {
        // Update existing transaction
        updateTransaction(existingTransaction.id, transactionData);
      } else {
        // Add new transaction
        addTransaction(transactionData);
        
        // If recurring, create future transactions
        if (isRecurring) {
          createRecurringTransactions(transactionData);
        }
      }
    }
    
    handleClose()
  }

  // Create recurring transactions
  const createRecurringTransactions = (baseTransaction: Omit<Transaction, "id">) => {
    // Create 12 future transactions (or another reasonable number)
    const futureDates = generateFutureDates(baseTransaction.date, repeatFrequency, repeatInterval, 12);
    
    futureDates.forEach(date => {
      const recurringTransaction = {
        ...baseTransaction,
        date: date,
        memo: baseTransaction.memo ? `${baseTransaction.memo} (Recurring)` : 'Recurring transaction'
      };
      
      addTransaction(recurringTransaction);
    });
  }

  // Generate future dates based on frequency and interval
  const generateFutureDates = (
    startDate: Date, 
    frequency: RepeatFrequency, 
    interval: number, 
    count: number
  ): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < count; i++) {
      const nextDate = new Date(currentDate);
      
      switch (frequency) {
        case "day":
          nextDate.setDate(nextDate.getDate() + interval);
          break;
        case "week":
          nextDate.setDate(nextDate.getDate() + (interval * 7));
          break;
        case "month":
          nextDate.setMonth(nextDate.getMonth() + interval);
          break;
        case "year":
          nextDate.setFullYear(nextDate.getFullYear() + interval);
          break;
      }
      
      dates.push(nextDate);
      currentDate = nextDate;
    }
    
    return dates;
  }

  const handleCategorySelect = (categoryName: string) => {
    setFormData(prev => ({ ...prev, category: categoryName }))
    setStep("form")
  }

  // Handle adding a new account
  const handleAddAccount = (account: Omit<{
    name: string;
    type: string;
    subtype: string;
    balance: number;
    category: string;
  }, "id">) => {
    addAccount(account);
    setStep("form");
  }

  // Check if we have enough accounts for transfers
  const hasMultipleAccounts = accounts.length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[500px] max-w-[500px] max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">
                {existingTransaction ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Transaction Type */}
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex rounded-md border overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-center text-sm ${
                      transactionType === "income" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => handleTransactionTypeChange("income")}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-center text-sm ${
                      transactionType === "transfer" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => handleTransactionTypeChange("transfer")}
                  >
                    Transfer
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-center text-sm ${
                      transactionType === "expense" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => handleTransactionTypeChange("expense")}
                  >
                    Expense
                  </button>
                </div>
              </div>
              
              {/* Transfer Warning - Show when not enough accounts */}
              {transactionType === "transfer" && !hasMultipleAccounts && (
                <div className="rounded-md bg-muted p-4 text-center">
                  <p className="text-sm mb-3">You need at least two accounts to make a transfer.</p>
                  <Button 
                    type="button" 
                    onClick={() => setStep("add-account")}
                    className="w-full"
                  >
                    Add Account
                  </Button>
                </div>
              )}
              
              {/* Regular Transaction Form - Hide for transfers when not enough accounts */}
              {(transactionType !== "transfer" || hasMultipleAccounts) && (
                <>
                  {/* Payee - Only for non-transfers */}
                  {transactionType !== "transfer" && (
                    <div className="space-y-2">
                      <Label htmlFor="payee">Payee</Label>
                      <Input
                        id="payee"
                        value={formData.payee}
                        onChange={(e) => setFormData(prev => ({ ...prev, payee: e.target.value }))}
                        placeholder="Enter payee name"
                        className="h-10"
                        required
                      />
                    </div>
                  )}

                  {transactionType !== "transfer" ? (
                    <>
                      {/* Amount */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={handleAmountChange}
                          placeholder="0.00"
                          className="h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2 w-full">
                        <Label>Category</Label>
                        {/* Desktop: Dropdown */}
                        <div className="hidden sm:block w-full">
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            required
                          >
                            <SelectTrigger className="h-10 w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__no_category__">No category</SelectItem>
                              {categoryGroups.map((group) => {
                                const groupBudgets = getBudgetsByGroupId(group.id)
                                if (groupBudgets.length === 0) return null
                                
                                return groupBudgets.map((budget) => (
                                  <SelectItem key={budget.id} value={budget.name}>
                                    {group.name} → {budget.name}
                                  </SelectItem>
                                ))
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Mobile: Button that opens category selection */}
                        <div className="block sm:hidden w-full">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start h-10"
                            onClick={() => setStep("category-selection")}
                          >
                            {formData.category || "Select category"}
                          </Button>
                        </div>
                      </div>

                      {/* Account */}
                      <div className="space-y-2 w-full">
                        <Label>Account</Label>
                        <Select 
                          value={formData.accountId} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                          required
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    /* Transfer Accounts */
                    <>
                      {/* Amount */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={handleAmountChange}
                          placeholder="0.00"
                          className="h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          required
                        />
                      </div>

                      {/* From Account */}
                      <div className="space-y-2 w-full">
                        <Label>From Account</Label>
                        <Select 
                          value={formData.accountId} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                          required
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} ({account.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* To Account */}
                      <div className="space-y-2 w-full">
                        <Label>To Account</Label>
                        <Select 
                          value={toAccountId} 
                          onValueChange={setToAccountId}
                          required
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select destination account" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts
                              .filter(account => account.id !== formData.accountId)
                              .map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.name} ({account.category})
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Date */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <DatePicker
                      date={formData.date}
                      onDateChange={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, date }))
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Memo */}
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo</Label>
                    <Input
                      id="memo"
                      value={formData.memo}
                      onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                      placeholder="Enter memo"
                      className="h-10"
                    />
                  </div>

                  {/* Recurring Transaction */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between h-6 w-full">
                      <Label htmlFor="recurring-switch" className="cursor-pointer">Recurring Transaction</Label>
                      <Switch
                        id="recurring-switch"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                      />
                    </div>
                    
                    {isRecurring && (
                      <div className="space-y-2 pt-2 pl-2 border-l-2 border-muted mt-2">
                        <div className="space-y-2">
                          <Label>Repeat Every</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={repeatInterval}
                              onChange={(e) => setRepeatInterval(parseInt(e.target.value) || 1)}
                              className="w-20 h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Select 
                              value={repeatFrequency} 
                              onValueChange={(value: RepeatFrequency) => setRepeatFrequency(value)}
                            >
                              <SelectTrigger className="flex-1 h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="day">Day(s)</SelectItem>
                                <SelectItem value="week">Week(s)</SelectItem>
                                <SelectItem value="month">Month(s)</SelectItem>
                                <SelectItem value="year">Year(s)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This will create recurring transactions in the future.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={
                        transactionType === "transfer" 
                          ? (!formData.amount || !formData.accountId || !toAccountId)
                          : (!formData.payee || !formData.amount || !formData.accountId || !formData.category)
                      }
                    >
                      {existingTransaction ? "Save Changes" : "Add Transaction"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </>
        ) : step === "category-selection" ? (
          <>
            <DialogHeader className="flex flex-row items-center space-x-2 pb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setStep("form")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>Select Category</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {categoryGroups.map((group) => {
                  const groupBudgets = getBudgetsByGroupId(group.id)
                  if (groupBudgets.length === 0) return null
                  
                  return (
                    <div key={group.id}>
                      <h4 className="font-medium text-sm mb-2">{group.name}</h4>
                      <div className="space-y-1">
                        {groupBudgets.map((budget) => (
                          <Button
                            key={budget.id}
                            variant="ghost"
                            className="w-full justify-start pl-6 h-8"
                            onClick={() => handleCategorySelect(budget.name)}
                          >
                            • {budget.name}
                          </Button>
                        ))}
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  )
                })}
                
                {/* Option to not select any category */}
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-8 text-muted-foreground"
                    onClick={() => handleCategorySelect("__no_category__")}
                  >
                    No category
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          // Add Account Form
          <AddAccountDialog 
            open={true} 
            onOpenChange={() => setStep("form")} 
            onAddAccount={handleAddAccount} 
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
