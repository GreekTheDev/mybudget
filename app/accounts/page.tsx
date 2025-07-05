"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, GripVertical } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AccountTransactions } from "@/components/account-transactions"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { MonthNavigation } from "@/components/month-navigation"
import { useAccounts, Account } from "@/contexts/account-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { formatCurrency } from "@/lib/utils"

// Sortable account card component
function SortableAccountCard({ account }: { account: Account }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: account.id })
  
  const router = useRouter()
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  
  const handleCardClick = () => {
    router.push(`/accounts/${account.id}`)
  }
  
  return (
    <div ref={setNodeRef} style={style} className="touch-manipulation">
      <Card className="mb-3">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div 
              className="px-2 py-4 cursor-grab touch-manipulation" 
              {...attributes} 
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div 
              className="flex-1 py-4 pr-4 flex justify-between items-center cursor-pointer"
              onClick={handleCardClick}
            >
              <div className="font-medium">{account.name}</div>
              <div className={account.balance >= 0 ? "text-success" : "text-danger"}>
                {formatCurrency(account.balance)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Summary card component
function AccountsSummaryCard({ accounts }: { accounts: Account[] }) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  return (
    <Card className="mb-5">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Accounts Summary</h3>
        <div className="space-y-2">
          {accounts.map(account => (
            <div key={account.id} className="flex justify-between items-center">
              <div className="text-sm">{account.name}</div>
              <div className="text-sm">{formatCurrency(account.balance)}</div>
            </div>
          ))}
          {accounts.length > 0 && (
            <>
              <div className="border-t my-2"></div>
              <div className="flex justify-between items-center font-medium">
                <div>Total</div>
                <div className={totalBalance >= 0 ? "text-success" : "text-danger"}>
                  {formatCurrency(totalBalance)}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AllAccountsPage() {
  const { accounts, addAccount, reorderAccounts } = useAccounts()
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const isMobile = useIsMobile()
  
  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )
  
  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      // Find the indices of the dragged item and the drop target
      const activeIndex = accounts.findIndex(account => account.id === active.id)
      const overIndex = accounts.findIndex(account => account.id === over.id)
      
      if (activeIndex !== -1 && overIndex !== -1) {
        reorderAccounts(activeIndex, overIndex)
      }
    }
  }
  
  return (
    <div className="flex-1 min-h-screen pb-16 md:pb-0">
      <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">All Accounts</h1>
        <div className="flex-1" />
        <Button 
          className="text-sm px-3 py-2 md:px-4 md:py-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </header>
      
      <div className="flex flex-col p-4 md:p-8 md:pt-6">
        {/* Mobile view with cards */}
        {isMobile ? (
          <>
            <AccountsSummaryCard accounts={accounts} />
            
            {accounts.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={accounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
                  {accounts.map((account) => (
                    <SortableAccountCard key={account.id} account={account} />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No accounts yet. Add your first account to get started.
              </div>
            )}
          </>
        ) : (
          /* Desktop view with transactions table */
          <>
            <MonthNavigation 
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              className="mb-6"
            />
            <AccountTransactions selectedMonth={selectedMonth} />
          </>
        )}
      </div>
      
      {/* Add Account Dialog */}
      <AddAccountDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddAccount={addAccount}
      />
    </div>
  )
}
