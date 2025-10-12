'use client';

import React from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBudgetContext } from '@/contexts/BudgetContext';

interface AddCategoryFormData extends Record<string, unknown> {
  name: string;
  limit: number;
}

interface AddCategoryFormProps {
  groupId: string;
  triggerButton?: React.ReactNode;
}

export function AddCategoryForm({ groupId, triggerButton }: AddCategoryFormProps) {
  const { addCategory } = useBudgetContext();

  const handleSubmit = (data: AddCategoryFormData) => {
    if (data.name.trim() && data.limit > 0) {
      addCategory(groupId, data.name.trim(), data.limit);
    }
  };

  const defaultTriggerButton = (
    <Button variant="outline" size="sm">
      Dodaj kategorię
    </Button>
  );

  return (
    <DrawerForm<AddCategoryFormData>
      title="Dodaj nową kategorię"
      defaultValues={{ name: '', limit: 0 }}
      onSubmit={handleSubmit}
      triggerButton={triggerButton || defaultTriggerButton}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="name"
            rules={{ 
              required: 'Nazwa kategorii jest wymagana',
              minLength: { value: 1, message: 'Nazwa kategorii nie może być pusta' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa kategorii</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="np. Zakupy spożywcze, Paliwo, Kino..." 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            rules={{ 
              required: 'Limit budżetu jest wymagany',
              min: { value: 0.01, message: 'Limit musi być większy niż 0' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limit budżetu (PLN)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
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