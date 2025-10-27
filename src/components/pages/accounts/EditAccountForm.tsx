'use client';

import React from 'react';
import { DrawerForm } from '@/components/ui/drawer-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAccountContext } from '@/contexts/AccountContext';
import { Account, AccountType } from '@/lib/types';
import { accountCategories, accountTypeLabels } from '@/lib/accountCategories';

interface EditAccountFormData extends Record<string, unknown> {
  name: string;
  type: AccountType;
  balance: number;
}

interface EditAccountFormProps {
  account: Account;
  triggerButton?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditAccountForm({ account, triggerButton, isOpen, onOpenChange }: EditAccountFormProps) {
  const { editAccount, updateBalance } = useAccountContext();

  const handleSubmit = (data: EditAccountFormData) => {
    if (data.name.trim()) {
      editAccount(account.id, data.name.trim(), data.type);
      // Update balance if it changed
      if (data.balance !== account.balance) {
        updateBalance(account.id, data.balance);
      }
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
    <DrawerForm<EditAccountFormData>
      title="Edytuj konto"
      defaultValues={{ name: account.name, type: account.type, balance: account.balance }}
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
              required: 'Nazwa konta jest wymagana',
              minLength: { value: 1, message: 'Nazwa konta nie może być pusta' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa konta</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="np. Konto główne, Oszczędności..." 
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
            rules={{ 
              required: 'Typ konta jest wymagany'
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ konta</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary [background-image:none]"
                  >
                    {accountCategories.map((category) => (
                      <optgroup key={category.id} label={category.name}>
                        {category.types.map((type) => (
                          <option key={type} value={type}>
                            {accountTypeLabels[type]}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="balance"
            rules={{ 
              required: 'Saldo jest wymagane'
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saldo (PLN)</FormLabel>
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
