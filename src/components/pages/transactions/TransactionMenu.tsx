'use client';

import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';
import { Transaction, Account, BudgetGroup } from '@/lib/types';
import { EditTransactionModal } from './EditTransactionModal';
import { toast } from 'sonner';

interface EditTransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  budgetGroupId: string;
  budgetCategoryId: string;
  date: Date;
}

interface TransactionMenuProps {
  transaction: Transaction;
  accounts: Account[];
  budgetGroups: BudgetGroup[];
  onEdit: (id: string, data: EditTransactionFormData) => void;
}

export function TransactionMenu({ transaction, accounts, budgetGroups, onEdit }: TransactionMenuProps) {
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

  const handleEditSave = (id: string, data: EditTransactionFormData) => {
    onEdit(id, data);
    setEditDialogOpen(false);
    toast.success('Transakcja została zaktualizowana');
  };

  const handleDeleteSuccess = () => {
    toast.success('Transakcja została usunięta');
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
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Otwórz menu transakcji</span>
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

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={transaction}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
        accounts={accounts}
        budgetGroups={budgetGroups}
      />

      {/* Delete Dialog */}
      <DeleteTransactionDialog
        transaction={transaction}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={handleDeleteSuccess}
      />
    </>
  );
}
