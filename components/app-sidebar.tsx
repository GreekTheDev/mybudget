"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calculator,
  CreditCard,
  DollarSign,
  Landmark,
  PiggyBank,
  Plus,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { useAccounts } from "@/contexts/account-context"

// Icon mapping for account types
const getAccountIcon = (type: string) => {
  switch (type) {
    case "checking":
      return Wallet
    case "savings":
      return PiggyBank
    case "cash":
      return DollarSign
    case "credit-card":
      return CreditCard
    case "mortgage":
    case "loan":
      return Landmark
    case "investment":
    case "retirement":
      return TrendingUp
    case "paypal":
    case "skrill":
    case "gift-card":
    case "binance":
      return Wallet
    default:
      return Wallet
  }
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const { accounts, addAccount, getTotalByCategory } = useAccounts()
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const isCollapsed = state === "collapsed"

  // Group accounts by category
  const accountsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof accounts> = {}
    accounts.forEach((account) => {
      if (!grouped[account.category]) {
        grouped[account.category] = []
      }
      grouped[account.category].push(account)
    })
    return grouped
  }, [accounts])

  const categories = Object.keys(accountsByCategory)

  return (
    <Sidebar collapsible="icon" className="hidden md:flex" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col text-left text-sm">
                <span className="font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">john@example.com</span>
              </div>
            )}
          </div>

        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={isCollapsed ? "Dashboard" : undefined}
                  asChild
                >
                  <Link href="/dashboard">
                    <Calculator />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={isCollapsed ? "Reports" : undefined}>
                  <TrendingUp />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* All Accounts Button - Show only when accounts exist */}
              {accounts.length > 0 && (
                <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                  <SidebarMenuButton asChild>
                    <Link href="/accounts">
                      <CreditCard />
                      <span>All Accounts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dynamic Account Categories */}
        {categories.length > 0 && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <div className="px-1">
                <Accordion type="multiple" className="w-full">
                  {categories.map((category) => {
                    const categoryAccounts = accountsByCategory[category]
                    const total = getTotalByCategory(category)
                    const value = category.toLowerCase().replace(/[\s&]/g, '-')
                    
                    return (
                      <AccordionItem key={category} value={value} className="border-none">
                        <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-accent rounded-md text-sm font-medium [&[data-state=open]>div>span:last-child]:text-accent-foreground [&[data-state=closed]>div>span:last-child]:text-muted-foreground">
                          <div className="flex items-center justify-between w-full">
                            <span>{category}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {formatCurrency(total)}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <SidebarMenu>
                            {categoryAccounts.map((account) => {
                              return (
                                <SidebarMenuItem key={account.id}>
                                  <SidebarMenuButton asChild>
                                    <Link href={`/accounts/${account.id}`} className="flex items-center justify-between w-full">
                                      <span className="text-sm">{account.name}</span>
                                      <span className="text-xs text-muted-foreground font-mono ml-auto">
                                        {formatCurrency(account.balance)}
                                      </span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              )
                            })}
                          </SidebarMenu>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {/* Collapsed state: Show account icons only */}
        <SidebarGroup className="group-data-[state=expanded]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              {accounts.map((account) => {
                const IconComponent = getAccountIcon(account.type)
                return (
                  <SidebarMenuItem key={account.id}>
                    <SidebarMenuButton 
                      tooltip={`${account.name}: ${formatCurrency(account.balance)}`}
                      asChild
                    >
                      <Link href={`/accounts/${account.id}`}>
                        <IconComponent className="h-4 w-4" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <div>
              <SidebarMenuButton 
                className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                tooltip={isCollapsed ? "Add Account" : undefined}
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4" />
                {!isCollapsed && <span>Add Account</span>}
              </SidebarMenuButton>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={`flex items-center gap-2 px-2 py-1 ${
              isCollapsed ? 'flex-col space-y-2' : 'justify-between'
            }`}>
              <SidebarMenuButton
                size="sm"
                className="h-9 w-9 p-0"
                tooltip={isCollapsed ? "Settings" : undefined}
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </SidebarMenuButton>
              <ModeToggle />
              <SidebarTrigger />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <AddAccountDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
        onAddAccount={addAccount}
      />
    </Sidebar>
  )
}
