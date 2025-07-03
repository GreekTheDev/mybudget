"use client"

import * as React from "react"
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
import { useAccounts, Transaction } from "@/contexts/account-context"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId?: string // If provided, pre-select this account
}

export function AddTransactionDialog({ open, onOpenChange, accountId }: AddTransactionDialogProps) {
  const { accounts, addTransaction } = useAccounts()
  const [formData, setFormData] = React.useState({
    payee: "",
    amount: "",
    accountId: accountId || "",
    date: new Date(),
    category: "",
    memo: ""
  })

  const handleClose = () => {
    onOpenChange(false)
    // Reset form
    setFormData({
      payee: "",
      amount: "",
      accountId: accountId || "",
      date: new Date(),
      category: "",
      memo: ""
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.payee || !formData.amount || !formData.accountId) return

    const amount = parseFloat(formData.amount)
    if (isNaN(amount)) return

    const transaction: Omit<Transaction, "id"> = {
      accountId: formData.accountId,
      date: formData.date,
      payee: formData.payee,
      category: formData.category,
      memo: formData.memo,
      income: amount > 0 ? amount : 0,
      expense: amount < 0 ? Math.abs(amount) : 0,
    }

    addTransaction(transaction)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payee / Name */}
          <div className="space-y-2">
            <Label htmlFor="payee">Name / Payee</Label>
            <Input
              id="payee"
              value={formData.payee}
              onChange={(e) => setFormData(prev => ({ ...prev, payee: e.target.value }))}
              placeholder="Enter payee name"
              required
            />
          </div>
          
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount (+ for income, - for expense)"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use positive numbers for income, negative for expenses
            </p>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label>Account</Label>
            <Select 
              value={formData.accountId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
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

          {/* Category (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>

          {/* Memo (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Input
              id="memo"
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="Enter memo"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.payee || !formData.amount || !formData.accountId}
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
