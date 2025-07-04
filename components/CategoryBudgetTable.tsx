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
import { Plus, ChevronRight, Trash2, GripVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {
  CSS,
} from '@dnd-kit/utilities'

import { useAccounts, CategoryGroup, CategoryBudget } from "@/contexts/account-context"
import { AddCategoryGroupDialog } from "@/components/add-category-group-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sortable Group Row Component
function SortableGroupRow({ group, children }: { group: CategoryGroup, children: React.ReactNode }) {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} className="bg-muted/50">
      {children}
    </TableRow>
  )
}

// Sortable Group Handle Component
function SortableGroupHandle({ groupId }: { groupId: string }) {
  const { listeners } = useSortable({ id: groupId })
  
  return (
    <div className="flex items-center justify-start" style={{ width: "30px" }}>
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// Sortable Budget Handle Component
function SortableBudgetHandle({ budgetId }: { budgetId: string }) {
  const { listeners } = useSortable({ id: budgetId })
  
  return (
    <div className="flex items-center justify-start" style={{ width: "30px" }}>
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

// Sortable Budget Row Component
function SortableBudgetRow({ budget, children }: { budget: CategoryBudget, children: React.ReactNode }) {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: budget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      {children}
    </TableRow>
  )
}

export function CategoryBudgetTable() {
  const {
    categoryGroups,
    updateCategoryBudget,
    updateCategoryGroup,
    addCategoryGroup,
    addCategoryBudget,
    deleteCategoryGroup,
    deleteCategoryBudget,
    reorderCategoryGroups,
    reorderCategoryBudgets,
    getCategoryActivity,
    getBudgetsByGroupId,
    toggleCategoryGroup,
  } = useAccounts()

  const [editingName, setEditingName] = React.useState<string | null>(null)
  const [editingAmount, setEditingAmount] = React.useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = React.useState<string | null>(null)
  const [removeMode, setRemoveMode] = React.useState(false)
  // This state tracks which group is currently having a category added to it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addingCategoryToGroup, setAddingCategoryToGroup] = React.useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [addGroupDialogOpen, setAddGroupDialogOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<{type: 'group' | 'category', id: string, name: string} | null>(null)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end for groups and categories
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    // Check if dragging a group
    const activeGroup = categoryGroups.find(group => group.id === active.id)
    if (activeGroup) {
      const overGroup = categoryGroups.find(group => group.id === over.id)
      if (overGroup) {
        const oldIndex = categoryGroups.findIndex(group => group.id === active.id)
        const newIndex = categoryGroups.findIndex(group => group.id === over.id)
        reorderCategoryGroups(oldIndex, newIndex)
      }
      return
    }

    // Check if dragging a category budget
    const activeBudget = categoryGroups
      .flatMap(group => getBudgetsByGroupId(group.id))
      .find(budget => budget.id === active.id)
    
    if (activeBudget) {
      const groupBudgets = getBudgetsByGroupId(activeBudget.groupId)
      const oldIndex = groupBudgets.findIndex(budget => budget.id === active.id)
      const newIndex = groupBudgets.findIndex(budget => budget.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCategoryBudgets(activeBudget.groupId, oldIndex, newIndex)
      }
    }
  }

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

  const handleAddCategoryGroup = () => {
    setAddGroupDialogOpen(true)
  }

  const handleAddGroup = (groupName: string) => {
    addCategoryGroup({
      name: groupName,
      isExpanded: false
    })
  }

  const handleDeleteClick = (type: 'group' | 'category', id: string, name: string) => {
    setItemToDelete({ type, id, name })
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return
    
    if (itemToDelete.type === 'group') {
      deleteCategoryGroup(itemToDelete.id)
    } else {
      deleteCategoryBudget(itemToDelete.id)
    }
    
    setDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  const handleAddCategory = (groupId: string) => {
    const categoryName = newCategoryName.trim()
    
    if (!categoryName) {
      return
    }
    
    try {
      // Add the category
      addCategoryBudget({
        name: categoryName,
        assignedAmount: 0,
        groupId: groupId
      })
      
      // Auto-close the dropdown and reset form state
      setNewCategoryName("")
      setAddingCategoryToGroup(null)
    } catch (error) {
      console.error("Error adding category:", error)
      alert("Failed to add category. Please try again.")
    }
  }

  const handleCancelAddCategory = () => {
    // Close the dropdown and reset form state
    setNewCategoryName("")
    setAddingCategoryToGroup(null)
  }

  return (
    <>
      <AddCategoryGroupDialog
        open={addGroupDialogOpen}
        onOpenChange={setAddGroupDialogOpen}
        onAddGroup={handleAddGroup}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="w-[95vw] max-w-[425px] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Budget</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs sm:text-sm"
              onClick={handleAddCategoryGroup}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Category Group</span>
              <span className="sm:hidden">Add Group</span>
            </Button>
            <Button 
              variant={removeMode ? "destructive" : "outline"} 
              size="sm" 
              className="text-xs sm:text-sm"
              onClick={() => setRemoveMode(!removeMode)}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Remove
            </Button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-2">
          {categoryGroups.length === 0 ? (
            <div className="rounded-lg border bg-card p-6 text-center">
              <p className="text-muted-foreground">No groups! Click the &quot;+ Add Category Group Button&quot; to create a new budget group!</p>
            </div>
          ) : (
            categoryGroups.map((group) => (
              <div key={group.id} className="rounded-lg border bg-card">
                {/* Group Header */}
                <div className="p-3 bg-muted/50 rounded-t-lg">
                  <div className="flex items-center justify-between">
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
                      <div className="flex items-center group/mobile-header">
                        <span className="font-medium text-xs">{group.name}</span>
                        {getBudgetsByGroupId(group.id).length === 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">Add a new category here →!</span>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="ml-2 opacity-0 group-hover/mobile-header:opacity-100 transition-opacity p-1 rounded hover:bg-muted/50"
                              onClick={() => setAddingCategoryToGroup(group.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 p-3">
                            <div className="space-y-3">
                              <Input
                                placeholder="New Category"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddCategory(group.id)
                                    // Close the dropdown by clicking outside
                                    document.body.click()
                                  } else if (e.key === 'Escape') {
                                    handleCancelAddCategory()
                                    // Close the dropdown by clicking outside
                                    document.body.click()
                                  }
                                }}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleAddCategory(group.id)
                                    // Close the dropdown by clicking outside
                                    document.body.click()
                                  }}
                                  disabled={!newCategoryName.trim()}
                                >
                                  OK
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    handleCancelAddCategory()
                                    // Close the dropdown by clicking outside
                                    document.body.click()
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {removeMode && (
                          <button
                            onClick={() => handleDeleteClick('group', group.id, group.name)}
                            className="ml-2 text-red-500 hover:text-red-700 p-1 rounded"
                            title="Delete group"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-muted-foreground">Assigned</div>
                          <div className="font-medium">{formatCurrency(calculateGroupTotals(group.id).assigned)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Available</div>
                          <div className={`font-medium ${
                            calculateGroupTotals(group.id).available >= 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {formatCurrency(calculateGroupTotals(group.id).available)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Items */}
                {group.isExpanded && (
                  <div className="divide-y">
                    {getBudgetsByGroupId(group.id).map((budget) => {
                      const activity = getCategoryActivity(budget.name)
                      const available = budget.assignedAmount - activity
                      
                      return (
                        <div key={budget.id} className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-xs flex-1">{budget.name}</div>
                            <div className="grid grid-cols-2 gap-4 text-xs mr-2">
                              <div className="text-center">
                                <div className="font-medium">{formatCurrency(budget.assignedAmount)}</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-medium ${
                                  available >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                  {formatCurrency(available)}
                                </div>
                              </div>
                            </div>
                            {removeMode && (
                              <button
                                onClick={() => handleDeleteClick('category', budget.id, budget.name)}
                                className="text-red-500 hover:text-red-700 p-1 rounded flex-shrink-0"
                                title="Delete category"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block rounded-md border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead className={removeMode === true ? "w-[60%]" : "w-[70%]"}>Category</TableHead>
                  <TableHead className="w-[10%] text-right">Assigned</TableHead>
                  <TableHead className="w-[10%] text-right">Activity</TableHead>
                  <TableHead className="w-[10%] text-right">Available</TableHead>
                  {removeMode && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={removeMode ? 6 : 5} className="h-24 text-center">
                      <p className="text-muted-foreground">No groups! Click the &quot;+ Add Category Group Button&quot; to create a new budget group!</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext items={categoryGroups.map(g => g.id)} strategy={verticalListSortingStrategy}>
                    {categoryGroups.map((group) => (
                      <React.Fragment key={group.id}>
                        {/* Group Header Row with Totals */}
                        <SortableGroupRow group={group}>
                          <TableCell className="w-[30px]">
                            <SortableGroupHandle groupId={group.id} />
                          </TableCell>
                          <TableCell className={removeMode === true ? "w-[60%]" : "w-[70%]"}>
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
                                <div className="flex items-center group/header">
                                  <div
                                    className="cursor-pointer hover:bg-muted/50 p-1 rounded font-semibold"
                                    onClick={() => setEditingGroupName(group.id)}
                                  >
                                    {group.name}
                                  </div>
                                  {getBudgetsByGroupId(group.id).length === 0 && (
                                    <span className="ml-2 text-sm text-muted-foreground">Add a new category here →</span>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        className="ml-2 opacity-0 group-hover/header:opacity-100 transition-opacity p-1 rounded hover:bg-muted/50"
                                        onClick={() => setAddingCategoryToGroup(group.id)}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 p-3">
                                      <div className="space-y-3">
                                        <Input
                                          placeholder="New Category"
                                          value={newCategoryName}
                                          onChange={(e) => setNewCategoryName(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleAddCategory(group.id)
                                              // Close the dropdown by clicking outside
                                              document.body.click()
                                            } else if (e.key === 'Escape') {
                                              handleCancelAddCategory()
                                              // Close the dropdown by clicking outside
                                              document.body.click()
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              handleAddCategory(group.id)
                                              // Close the dropdown by clicking outside
                                              document.body.click()
                                            }}
                                            disabled={!newCategoryName.trim()}
                                          >
                                            OK
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              handleCancelAddCategory()
                                              // Close the dropdown by clicking outside
                                              document.body.click()
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                          {removeMode && (
                            <TableCell className="w-[50px]">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => handleDeleteClick('group', group.id, group.name)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded"
                                  title="Delete group"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          )}
                        </SortableGroupRow>
                        
                        {/* Category Budget Rows (only show if expanded) */}
                        {group.isExpanded && (
                          <SortableContext items={getBudgetsByGroupId(group.id).map(b => b.id)} strategy={verticalListSortingStrategy}>
                            {getBudgetsByGroupId(group.id).map((budget) => {
                              const activity = getCategoryActivity(budget.name)
                              const available = budget.assignedAmount - activity
                              
                              return (
                                <SortableBudgetRow key={budget.id} budget={budget}>
                                  <TableCell className="w-[30px]">
                                    <SortableBudgetHandle budgetId={budget.id} />
                                  </TableCell>
                                  <TableCell className={`${removeMode === true ? "w-[60%]" : "w-[70%]"} pl-8`}>
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
                                        {Number(budget.assignedAmount) > 0 ? formatCurrency(budget.assignedAmount) : (
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
                                  {removeMode && (
                                    <TableCell className="w-[50px]">
                                      <div className="flex items-center justify-center">
                                        <button
                                          onClick={() => handleDeleteClick('category', budget.id, budget.name)}
                                          className="text-red-500 hover:text-red-700 p-1 rounded"
                                          title="Delete category"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </TableCell>
                                  )}
                                </SortableBudgetRow>
                              );
                            })}
                          </SortableContext>
                        )}
                      </React.Fragment>
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>
    </>
  )
}