'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EditGroupForm } from './EditGroupForm';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { BudgetGroup } from '@/lib/types';

interface BudgetGroupMenuProps {
  group: BudgetGroup;
}

export function BudgetGroupMenu({ group }: BudgetGroupMenuProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Otwórz menu grupy</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edytuj
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteClick} 
            variant="destructive" 
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditGroupForm
        group={group}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        triggerButton={null}
      />

      {/* Delete Dialog */}
      <DeleteGroupDialog
        group={group}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        triggerButton={null}
      />
    </>
  );
}