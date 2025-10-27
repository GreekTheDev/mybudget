'use client';

import React, { useState, useEffect } from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { Account, BudgetGroup } from '@/lib/types';

interface AddTransactionFormData extends Record<string, unknown> {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  accountId: string;
  budgetGroupId: string;
  budgetCategoryId: string;
  date: Date;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddTransactionFormData) => void;
  accounts: Account[];
  budgetGroups: BudgetGroup[];
  triggerButton?: React.ReactNode;
}

export function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onAdd,
  accounts,
  budgetGroups,
  triggerButton 
}: AddTransactionModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);

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

  const handleSubmit = (data: AddTransactionFormData) => {
    onAdd(data);
    setSelectedGroupId('');
    setAvailableCategories([]);
  };

  return (
    <DrawerForm<AddTransactionFormData>
      title="Dodaj transakcję"
      defaultValues={{ 
        description: '', 
        amount: 0,
        type: 'expense',
        accountId: accounts[0]?.id || '',
        budgetGroupId: '',
        budgetCategoryId: '',
        date: new Date()
      }}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onOpenChange={onClose}
      triggerButton={triggerButton}
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
  );
}
