"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, ChevronRight } from "lucide-react"

import { useAccounts } from "@/contexts/account-context"

export function CategoryBudgetTable() {
  const {
    categoryGroups,
    updateCategoryBudget,
    updateCategoryGroup,
    getCategoryActivity,
    getBudgetsByGroupId,
    toggleCategoryGroup,
  } = useAccounts()

  const [editingName, setEditingName] = React.useState<string | null>(null)
  const [editingAmount, setEditingAmount] = React.useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = React.useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateGroupTotals = (groupId: string) => {
    const budgets = getBudgetsByGroupId(groupId)
    const totalAssigned = budgets.reduce((sum, budget) => sum + budget.assignedAmount, 0)
    const totalActivity = budgets.reduce((sum, budget) => sum + getCategoryActivity(budget.name), 0)
    const totalAvailable = totalAssigned - totalActivity
    
    return {
      assigned: totalAssigned,
      activity: totalActivity,
      available: totalAvailable
    }
  }

  const handleNameClick = (budgetId: string) => {
    setEditingName(budgetId)
  }

  const handleAmountClick = (budgetId: string) => {
    setEditingAmount(budgetId)
  }

  const handleNameBlur = () => {
    setEditingName(null)
  }

  const handleAmountBlur = () => {
    setEditingAmount(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Budget</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category Group
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%]">Category</TableHead>
              <TableHead className="w-[10%] text-right">Assigned</TableHead>
              <TableHead className="w-[10%] text-right">Activity</TableHead>
              <TableHead className="w-[10%] text-right">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryGroups.map((group) => (
              <React.Fragment key={group.id}>
                {/* Group Header Row with Totals */}
                <TableRow className="bg-muted/50">
                  <TableCell className="w-[70%]">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategoryGroup(group.id)}
                        className="mr-2 transition-transform"
                        style={{
                          transform: group.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      {editingGroupName === group.id ? (
                        <Input
                          value={group.name}
                          onChange={(e) =>
                            updateCategoryGroup(group.id, {
                              name: e.target.value,
                            })
                          }
                          onBlur={() => setEditingGroupName(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingGroupName(null)
                            }
                          }}
                          className="w-auto min-w-[100px] focus-visible:ring-0 focus-visible:ring-offset-0"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-muted/50 p-1 rounded font-semibold"
                          onClick={() => setEditingGroupName(group.id)}
                        >
                          {group.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%] text-right font-semibold">
                    {formatCurrency(calculateGroupTotals(group.id).assigned)}
                  </TableCell>
                  <TableCell className="w-[10%] text-right font-semibold">
                    {formatCurrency(calculateGroupTotals(group.id).activity)}
                  </TableCell>
                  <TableCell className="w-[10%] text-right font-semibold">
                    <span
                      className={calculateGroupTotals(group.id).available >= 0 ? "text-green-600" : "text-red-600"}
                    >
                      {formatCurrency(calculateGroupTotals(group.id).available)}
                    </span>
                  </TableCell>
                </TableRow>
                
                {/* Category Budget Rows (only show if expanded) */}
                {group.isExpanded && getBudgetsByGroupId(group.id).map((budget) => {
                  const activity = getCategoryActivity(budget.name)
                  const available = budget.assignedAmount - activity
                  
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="w-[70%] pl-8">
                        {editingName === budget.id ? (
                          <div className="w-full max-w-[400px]">
                            <Input
                              value={budget.name}
                              onChange={(e) =>
                                updateCategoryBudget(budget.id, {
                                  name: e.target.value,
                                })
                              }
                              onBlur={handleNameBlur}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleNameBlur()
                                }
                              }}
                              className="w-full"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div 
                            className="cursor-pointer hover:bg-muted/50 p-1 rounded w-full max-w-[400px] min-h-[32px] flex items-center"
                            onClick={() => handleNameClick(budget.id)}
                          >
                            {budget.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[10%] text-right">
                        {editingAmount === budget.id ? (
                          <div className="w-[80px] ml-auto">
                            <Input
                              type="number"
                              step="0.01"
                              value={budget.assignedAmount || ""}
                              onChange={(e) =>
                                updateCategoryBudget(budget.id, {
                                  assignedAmount: parseFloat(e.target.value) || 0,
                                })
                              }
                              onBlur={handleAmountBlur}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAmountBlur()
                                }
                              }}
                              className="w-full text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0.00"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div 
                            className="cursor-pointer hover:bg-muted/50 p-1 rounded text-right w-[80px] ml-auto min-h-[32px] flex items-center justify-end"
                            onClick={() => handleAmountClick(budget.id)}
                          >
                            {budget.assignedAmount > 0 ? formatCurrency(budget.assignedAmount) : (
                              <span className="text-muted-foreground">0.00</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[10%] text-right">
                        <div className="w-[80px] ml-auto text-right min-h-[32px] flex items-center justify-end">
                          {formatCurrency(activity)}
                        </div>
                      </TableCell>
                      <TableCell className="w-[10%] text-right">
                        <div className="w-[80px] ml-auto text-right min-h-[32px] flex items-center justify-end">
                          <span
                            className={`${
                              available >= 0 ? "text-green-600" : "text-red-600"
                            } font-medium`}
                          >
                            {formatCurrency(available)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
