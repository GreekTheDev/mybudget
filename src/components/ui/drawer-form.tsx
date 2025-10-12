'use client';

import React, { ReactNode } from 'react';
import { useForm, UseFormReturn, DefaultValues } from 'react-hook-form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

interface DrawerFormProps<T extends Record<string, unknown>> {
  title: string;
  triggerButton: ReactNode;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  children: (form: UseFormReturn<T>) => ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DrawerForm<T extends Record<string, unknown>>({
  title,
  triggerButton,
  defaultValues,
  onSubmit,
  children,
  isOpen,
  onOpenChange,
}: DrawerFormProps<T>) {
  const form = useForm<T>({
    defaultValues,
  });

  const handleSubmit = (data: T) => {
    onSubmit(data);
    form.reset();
    onOpenChange?.(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange?.(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1">
            <div className="px-4 pb-0 space-y-4 flex-1">
              {children(form)}
            </div>
            <DrawerFooter>
              <Button type="submit" className="w-full">
                Zapisz
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Anuluj
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}