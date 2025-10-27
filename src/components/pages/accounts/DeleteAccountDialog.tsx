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
import { useAccountContext } from '@/contexts/AccountContext';
import { Account } from '@/lib/types';

interface DeleteAccountDialogProps {
  account: Account;
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteAccountDialog({ account, triggerButton, isOpen, onOpenChange }: DeleteAccountDialogProps) {
  const { deleteAccount } = useAccountContext();

  const handleDelete = () => {
    deleteAccount(account.id);
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
          <AlertDialogTitle>Usunąć konto?</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć konto &ldquo;{account.name}&rdquo;?
            Ta operacja jest nieodwracalna i usunie wszystkie powiązane transakcje.
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
