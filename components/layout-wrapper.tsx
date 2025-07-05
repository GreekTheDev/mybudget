"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { NoAccountsAlert } from "@/components/no-accounts-alert"
import { useAccounts } from "@/contexts/account-context"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [showAddAccountDialog, setShowAddAccountDialog] = React.useState(false)
  const [showAddTransactionDialog, setShowAddTransactionDialog] = React.useState(false)
  const [showNoAccountsAlert, setShowNoAccountsAlert] = React.useState(false)
  const { accounts, addAccount } = useAccounts()

  // Extract accountId from URL if we're on an account page
  const accountId = pathname.startsWith("/accounts/") 
    ? pathname.split("/")[2] 
    : undefined;

  // Handle adding a transaction - check if accounts exist first
  const handleAddTransaction = () => {
    if (accounts.length === 0) {
      setShowNoAccountsAlert(true);
    } else {
      setShowAddTransactionDialog(true);
    }
  };

  // Custom account handler that shows a toast notification
  const handleAddAccount = (account: Omit<typeof accounts[0], "id">) => {
    addAccount(account);
    toast.success(`Account "${account.name}" created successfully!`);
    
    // If we were trying to add a transaction, open the transaction dialog now
    if (showNoAccountsAlert) {
      setTimeout(() => {
        setShowAddTransactionDialog(true);
      }, 500);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNav 
        onAddAccount={() => setShowAddAccountDialog(true)} 
        onAddTransaction={handleAddTransaction}
      />
      <AddAccountDialog 
        open={showAddAccountDialog} 
        onOpenChange={setShowAddAccountDialog} 
        onAddAccount={handleAddAccount}
      />
      <AddTransactionDialog
        open={showAddTransactionDialog}
        onOpenChange={setShowAddTransactionDialog}
        accountId={accountId}
      />
      <NoAccountsAlert
        open={showNoAccountsAlert}
        onOpenChange={setShowNoAccountsAlert}
        onAddAccount={() => setShowAddAccountDialog(true)}
      />
    </>
  )
}
