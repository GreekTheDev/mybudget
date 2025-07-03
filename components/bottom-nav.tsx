"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, CreditCard, TrendingUp, Plus, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  onAddAccount: () => void
}

export function BottomNav({ onAddAccount }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      isActive: pathname === "/dashboard" || pathname === "/"
    },
    {
      href: "/accounts",
      icon: CreditCard,
      label: "Accounts",
      isActive: pathname.startsWith("/accounts")
    },
    {
      href: "#",
      icon: Plus,
      label: "Add",
      isActive: false,
      isAction: true,
      onClick: onAddAccount
    },
    {
      href: "/reports",
      icon: TrendingUp,
      label: "Reports",
      isActive: pathname === "/reports"
    },
    {
      href: "/budget",
      icon: Calculator,
      label: "Budget",
      isActive: pathname === "/budget"
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          
          if (item.isAction) {
            return (
              <Button
                key={item.label}
                onClick={item.onClick}
                size="sm"
                className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 text-xs transition-colors",
                item.isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", item.isActive && "text-primary")} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
