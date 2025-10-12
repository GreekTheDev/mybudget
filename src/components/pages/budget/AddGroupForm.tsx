'use client';

import React from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBudgetContext } from '@/contexts/BudgetContext';

interface AddGroupFormData extends Record<string, unknown> {
  name: string;
}

export function AddGroupForm() {
  const { addGroup } = useBudgetContext();

  const handleSubmit = (data: AddGroupFormData) => {
    if (data.name.trim()) {
      addGroup(data.name.trim());
    }
  };

  return (
    <DrawerForm<AddGroupFormData>
      title="Dodaj nową grupę budżetową"
      defaultValues={{ name: '' }}
      onSubmit={handleSubmit}
      triggerButton={
        <Button>
          Dodaj grupę
        </Button>
      }
    >
      {(form) => (
        <FormField
          control={form.control}
          name="name"
          rules={{ 
            required: 'Nazwa grupy jest wymagana',
            minLength: { value: 1, message: 'Nazwa grupy nie może być pusta' }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa grupy</FormLabel>
              <FormControl>
                <Input 
                  placeholder="np. Żywność, Transport, Rozrywka..." 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </DrawerForm>
  );
}