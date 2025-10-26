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

interface DeleteCategoryDialogProps {
  groupId: string;
  category: BudgetGroup['categories'][0];
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteCategoryDialog({ groupId, category, triggerButton, isOpen, onOpenChange }: DeleteCategoryDialogProps) {
  const { deleteCategory } = useBudgetContext();

  const handleDelete = () => {
    deleteCategory(groupId, category.id);
    onOpenChange?.(false);
  };

  const defaultTriggerButton = (
    <Button variant="destructive" size="sm">
      Usuń
    </Button>
  );

  // When controlled externally (isOpen/onOpenChange provided), don't render trigger button
  const shouldRenderTrigger = isOpen === undefined || onOpenChange === undefined;
  const finalTriggerButton = shouldRenderTrigger ? (triggerButton || defaultTriggerButton) : null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      {finalTriggerButton && (
        <AlertDialogTrigger asChild>
          {finalTriggerButton}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć kategorię?</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć kategorię &ldquo;{category.name}&rdquo;?
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
