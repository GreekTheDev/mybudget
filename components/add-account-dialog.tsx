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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Account {
  id: string
  name: string
  type: string
  subtype: string
  balance: number
  category: string
}

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: (account: Omit<Account, "id">) => void
}

const accountTypes = [
  {
    category: "Cash",
    types: [
      { name: "Checking account", value: "checking" },
      { name: "Cash", value: "cash" },
    ],
  },
  {
    category: "E-Wallets",
    types: [
      { name: "PayPal", value: "paypal" },
      { name: "Skrill", value: "skrill" },
      { name: "Gift Card", value: "gift-card" },
      { name: "Binance", value: "binance" },
    ],
  },
  {
    category: "Credit Cards",
    types: [
      { name: "Credit card", value: "credit-card" },
    ],
  },
  {
    category: "Loans",
    types: [
      { name: "Mortgage", value: "mortgage" },
      { name: "Loan", value: "loan" },
    ],
  },
  {
    category: "Assets & Liabilities",
    types: [
      { name: "Investment Account", value: "investment" },
      { name: "Retirement Account", value: "retirement" },
    ],
  },
  {
    category: "Savings",
    types: [
      { name: "Savings account", value: "savings" },
    ],
  },
]

export function AddAccountDialog({ open, onOpenChange, onAddAccount }: AddAccountDialogProps) {
  const [step, setStep] = React.useState<"form" | "type-selection">("form")
  const [accountName, setAccountName] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<{ name: string; value: string; category: string } | null>(null)
  const [balance, setBalance] = React.useState("")

  const handleClose = () => {
    onOpenChange(false)
    setStep("form")
    setAccountName("")
    setSelectedType(null)
    setBalance("")
  }

  const handleTypeSelect = (type: { name: string; value: string }, category: string) => {
    setSelectedType({ ...type, category })
    setStep("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountName || !selectedType) return

    onAddAccount({
      name: accountName,
      type: selectedType.value,
      subtype: selectedType.name,
      category: selectedType.category,
      balance: balance ? parseFloat(balance) : 0,
    })

    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Add Account</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Enter account name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setStep("type-selection")}
                >
                  {selectedType ? selectedType.name : "Select account type"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!accountName || !selectedType}>
                  Add Account
                </Button>
              </div>
            </form>
          </>
        ) : (
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
              <DialogTitle>Select Account Type</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {accountTypes.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                    <div className="space-y-1">
                      {category.types.map((type) => (
                        <Button
                          key={type.value}
                          variant="ghost"
                          className="w-full justify-start pl-6 h-8"
                          onClick={() => handleTypeSelect(type, category.category)}
                        >
                          • {type.name}
                        </Button>
                      ))}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
