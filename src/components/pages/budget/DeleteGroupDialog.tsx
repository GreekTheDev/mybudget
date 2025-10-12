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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { BudgetGroup } from '@/lib/types';

interface DeleteGroupDialogProps {
  group: BudgetGroup;
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteGroupDialog({ group, triggerButton, isOpen, onOpenChange }: DeleteGroupDialogProps) {
  const { deleteGroup } = useBudgetContext();

  const handleDelete = () => {
    deleteGroup(group.id);
    onOpenChange?.(false);
  };

  const defaultTriggerButton = (
    <Button variant="destructive" size="sm">
      Usuń
    </Button>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {triggerButton || defaultTriggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć grupę budżetową?</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć grupę &ldquo;{group.name}&rdquo;?
            {group.categories.length > 0 && (
              <>
                {' '}Ta grupa zawiera {group.categories.length} {group.categories.length === 1 ? 'kategorię' : 'kategorii'}.
              </>
            )}
            {' '}Ta operacja jest nieodwracalna.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}