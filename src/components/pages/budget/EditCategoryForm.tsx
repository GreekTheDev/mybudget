'use client';

import React from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBudgetContext } from '@/contexts/BudgetContext';
import { BudgetGroup } from '@/lib/types';

interface EditCategoryFormData extends Record<string, unknown> {
  name: string;
  limit: number;
}

interface EditCategoryFormProps {
  groupId: string;
  category: BudgetGroup['categories'][0];
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditCategoryForm({ groupId, category, triggerButton, isOpen, onOpenChange }: EditCategoryFormProps) {
  const { editCategory } = useBudgetContext();

  const handleSubmit = (data: EditCategoryFormData) => {
    if (data.name.trim() && data.limit > 0) {
      editCategory(groupId, category.id, data.name.trim(), data.limit);
    }
  };

  const defaultTriggerButton = (
    <Button variant="outline" size="sm">
      Edytuj
    </Button>
  );

  // When controlled externally (isOpen/onOpenChange provided), don't render trigger button
  const shouldRenderTrigger = isOpen === undefined || onOpenChange === undefined;
  const finalTriggerButton = shouldRenderTrigger ? (triggerButton || defaultTriggerButton) : null;

  return (
    <DrawerForm<EditCategoryFormData>
      title="Edytuj kategorię"
      defaultValues={{ name: category.name, limit: category.limit }}
      onSubmit={handleSubmit}
      triggerButton={finalTriggerButton}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
