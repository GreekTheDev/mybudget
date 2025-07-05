"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddCategoryGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddGroup: (groupName: string) => void
}

export function AddCategoryGroupDialog({ 
  open, 
  onOpenChange, 
  onAddGroup 
}: AddCategoryGroupDialogProps) {
  const [groupName, setGroupName] = React.useState("")

  const handleClose = () => {
    onOpenChange(false)
    setGroupName("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return

    onAddGroup(groupName.trim())
    handleClose()
  }

  const handleCancel = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-[425px] sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-semibold">
            Add Category Group
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter group name
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="sr-only">
              Group Name
            </Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              autoFocus
              className="w-full"
            />
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!groupName.trim()}
              className="w-full sm:w-auto"
            >
              OK
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
