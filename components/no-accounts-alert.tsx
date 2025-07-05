"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NoAccountsAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: () => void
}

export function NoAccountsAlert({ open, onOpenChange, onAddAccount }: NoAccountsAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No Accounts Available</AlertDialogTitle>
          <AlertDialogDescription>
            You need to create an account before adding transactions. Transactions must be associated with an account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction 
            onClick={() => {
              onAddAccount();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto"
          >
            Add Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}