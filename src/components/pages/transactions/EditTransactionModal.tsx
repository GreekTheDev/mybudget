'use client';

import React, { useState, useEffect } from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { Account, BudgetGroup, Transaction } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';

interface EditTransactionFormData extends Record<string, unknown> {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  budgetGroupId: string;
  budgetCategoryId: string;
  date: Date;
}

interface EditTransactionModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: EditTransactionFormData) => void;
  accounts: Account[];
  budgetGroups: BudgetGroup[];
}

export function EditTransactionModal({ 
  transaction,
  isOpen, 
  onClose, 
  onSave,
  accounts,
  budgetGroups
}: EditTransactionModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(transaction.budgetGroupId || '');
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (selectedGroupId) {
      const selectedGroup = budgetGroups.find(g => g.id === selectedGroupId);
      if (selectedGroup) {
        setAvailableCategories(selectedGroup.categories.map(c => ({ id: c.id, name: c.name })));
      }
    } else {
      setAvailableCategories([]);
    }
  }, [selectedGroupId, budgetGroups]);

  // Initialize selected group on mount
  useEffect(() => {
    if (transaction.budgetGroupId) {
      setSelectedGroupId(transaction.budgetGroupId);
    }
  }, [transaction.budgetGroupId]);

  const handleSubmit = (data: EditTransactionFormData) => {
    onSave(transaction.id, data);
  };

  return (
    <>
      <DrawerForm<EditTransactionFormData>
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <span>Edytuj transakcję</span>
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="p-2 rounded-md hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </button>
          </div>
        }
        defaultValues={{ 
          description: transaction.description, 
          amount: transaction.amount,
          type: transaction.type,
          accountId: transaction.accountId,
          budgetGroupId: transaction.budgetGroupId || '',
          budgetCategoryId: transaction.budgetCategoryId || '',
          date: transaction.date
        }}
        onSubmit={handleSubmit}
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        triggerButton={undefined}
      >
        {(form) => (
          <>
            <FormField
              control={form.control}
              name="description"
              rules={{ 
                required: 'Opis jest wymagany',
                minLength: { value: 1, message: 'Opis nie może być pusty' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="np. Zakupy spożywcze, Wynagrodzenie..." 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              rules={{ required: 'Typ transakcji jest wymagany' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ transakcji</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary [background-image:none]"
                    >
                      <option value="expense">Wydatek</option>
                      <option value="income">Przychód</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetGroupId"
              rules={{ required: 'Grupa budżetowa jest wymagana' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupa budżetowa</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedGroupId(e.target.value);
                        form.setValue('budgetCategoryId', '');
                      }}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary [background-image:none]"
                    >
                      <option value="">Wybierz grupę budżetową</option>
                      {budgetGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetCategoryId"
              rules={{ required: 'Kategoria budżetowa jest wymagana' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria budżetowa</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      disabled={!selectedGroupId || availableCategories.length === 0}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 [background-image:none]"
                    >
                      <option value="">Wybierz kategorię</option>
                      {availableCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountId"
              rules={{ required: 'Konto jest wymagane' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konto</FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary [background-image:none]"
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              rules={{ required: 'Data jest wymagana' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data transakcji</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      placeholder="Wybierz datę transakcji"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              rules={{ 
                required: 'Kwota jest wymagana',
                min: { value: 0.01, message: 'Kwota musi być większa niż 0' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kwota (PLN)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </DrawerForm>

      <DeleteTransactionDialog
        transaction={transaction}
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDeleted={onClose}
      />
    </>
  );
}
