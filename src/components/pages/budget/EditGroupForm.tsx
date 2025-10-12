'use client';

import React from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { BudgetGroup } from '@/lib/types';

interface EditGroupFormData extends Record<string, unknown> {
  name: string;
}

interface EditGroupFormProps {
  group: BudgetGroup;
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditGroupForm({ group, triggerButton, isOpen, onOpenChange }: EditGroupFormProps) {
  const { editGroup } = useBudgetContext();

  const handleSubmit = (data: EditGroupFormData) => {
    if (data.name.trim() && data.name.trim() !== group.name) {
      editGroup(group.id, data.name.trim());
    }
  };

  const defaultTriggerButton = (
    <Button variant="outline" size="sm">
      Edytuj
    </Button>
  );

  return (
    <DrawerForm<EditGroupFormData>
      title="Edytuj grupę budżetową"
      defaultValues={{ name: group.name }}
      onSubmit={handleSubmit}
      triggerButton={triggerButton || defaultTriggerButton}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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