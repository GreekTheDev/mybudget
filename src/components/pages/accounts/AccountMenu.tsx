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
import { EditAccountForm } from './EditAccountForm';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { Account } from '@/lib/types';

interface AccountMenuProps {
  account: Account;
}

export function AccountMenu({ account }: AccountMenuProps) {
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
            <span className="sr-only">Otwórz menu konta</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 !bg-white dark:!bg-neutral-900">
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
      <EditAccountForm
        account={account}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        triggerButton={null}
      />

      {/* Delete Dialog */}
      <DeleteAccountDialog
        account={account}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        triggerButton={null}
      />
    </>
  );
}
