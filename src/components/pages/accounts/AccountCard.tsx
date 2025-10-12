import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Account, Transaction } from '@/lib/types';
import { TransactionList } from './TransactionList';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface AccountCardProps {
  account: Account;
  transactions: Transaction[];
  isExpanded?: boolean;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  onClick: () => void;
  onToggleExpansion?: () => void;
}

export function AccountCard({
  account,
  transactions,
  isExpanded = false,
  layoutMode,
  onClick,
  onToggleExpansion
}: AccountCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking': return 'Konto rozliczeniowe';
      case 'savings': return 'Oszczędności';
      case 'credit': return 'Karta kredytowa';
      case 'investment': return 'Inwestycje';
      default: return type;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (layoutMode === 'mobile') {
      e.preventDefault();
      setDrawerOpen(true);
    } else if (layoutMode === 'tablet') {
      e.preventDefault();
      onToggleExpansion?.();
    } else {
      onClick();
    }
  };

  const cardContent = (
    <div 
      id={`account-${account.id}`}
      className="border border-border rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: account.color }}
          />
          <div>
            <h3 className="text-lg font-medium text-foreground">{account.name}</h3>
            <p className="text-sm text-secondary">{getAccountTypeLabel(account.type)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {formatCurrency(account.balance)}
          </p>
          <p className="text-sm text-secondary">
            {transactions.length} transakcji
          </p>
        </div>
      </div>

      {/* Tablet: Show transactions when expanded (mobile uses drawer) */}
      <div className={`${layoutMode === 'tablet' ? '' : 'hidden'} transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <div className="pt-4 border-t border-border">
          <TransactionList 
            transactions={transactions}
            maxItems={3}
            showHeader={true}
          />
        </div>
      </div>
    </div>
  );

  // For mobile, wrap the card in a drawer trigger
  if (layoutMode === 'mobile') {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <div onClick={handleClick}>
            {cardContent}
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              {account.name}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-secondary">{getAccountTypeLabel(account.type)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-secondary">
                    {transactions.length} transakcji
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <TransactionList 
                transactions={transactions}
                maxItems={10}
                showHeader={true}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // For desktop and tablet, return the card with click handler
  return (
    <div onClick={handleClick}>
      {cardContent}
    </div>
  );
}
