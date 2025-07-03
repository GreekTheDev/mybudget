"use client"

import * as React from "react"
import { BottomNav } from "@/components/bottom-nav"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { useAccounts } from "@/contexts/account-context"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const { addAccount } = useAccounts()

  return (
    <>
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNav onAddAccount={() => setShowAddDialog(true)} />
      <AddAccountDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAddAccount={addAccount}
      />
    </>
  )
}
