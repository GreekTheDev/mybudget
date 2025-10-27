'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Transaction } from '@/lib/types';
import { useTransactionContext } from '@/contexts/TransactionContext';

interface DeleteTransactionDialogProps {
  transaction: Transaction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteTransactionDialog({ 
  transaction, 
  isOpen, 
  onOpenChange,
  onDeleted
}: DeleteTransactionDialogProps) {
  const { deleteTransaction } = useTransactionContext();

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć transakcję?</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć transakcję &ldquo;{transaction.description}&rdquo; 
            o wartości {transaction.amount} PLN?
            Ta operacja jest nieodwracalna.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-500/90 text-white"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
