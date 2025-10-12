'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { BudgetProgressBar } from './BudgetProgressBar';
import { AddCategoryForm } from './AddCategoryForm';
import { BudgetGroupMenu } from './BudgetGroupMenu';
import { BudgetGroup } from '@/lib/types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface BudgetGroupCardProps {
  group: BudgetGroup;
  isExpanded?: boolean;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  onClick: () => void;
  onToggleExpansion?: () => void;
  onAddCategory?: () => void;
}

export function BudgetGroupCard({
  group,
  isExpanded = false,
  layoutMode,
  onClick,
  onToggleExpansion,
  onAddCategory
}: BudgetGroupCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate totals from categories
  const totalPlanned = group.categories.reduce((sum, category) => sum + category.limit, 0);
  const totalSpent = group.categories.reduce((sum, category) => sum + category.spent, 0);

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
      id={`group-${group.id}`}
      className="border border-border rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-foreground">{group.name}</h3>
          <BudgetGroupMenu group={group} />
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
          <p className="font-semibold text-foreground">
            {formatCurrency(totalSpent)} / {formatCurrency(totalPlanned)}
          </p>
        </div>
      </div>
      
      {totalPlanned > 0 && (
        <BudgetProgressBar spent={totalSpent} planned={totalPlanned} />
      )}

      <div className="flex justify-between text-sm">
        <span className={`font-medium ${totalSpent > totalPlanned ? 'text-red-500' : 'text-green-600'}`}>
          {totalSpent > totalPlanned 
            ? `Przekroczono o ${formatCurrency(totalSpent - totalPlanned)}`
            : `Pozostało ${formatCurrency(totalPlanned - totalSpent)}`
          }
        </span>
        <span className="text-secondary">
          {group.categories.length} {group.categories.length === 1 ? 'kategoria' : 'kategorii'}
        </span>
      </div>

      {/* Tablet: Show categories when expanded (mobile uses drawer) */}
      <div className={`${layoutMode === 'tablet' ? '' : 'hidden'} transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <BudgetCategoryList 
          categories={group.categories}
          groupId={group.id}
        />
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
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg">{group.name}</DrawerTitle>
              <BudgetGroupMenu group={group} />
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-right">
                  <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(totalSpent)} / {formatCurrency(totalPlanned)}
                  </p>
                </div>
              </div>
              
              {totalPlanned > 0 && (
                <BudgetProgressBar spent={totalSpent} planned={totalPlanned} />
              )}

              <div className="flex justify-between text-sm mt-2">
                <span className={`font-medium ${totalSpent > totalPlanned ? 'text-red-500' : 'text-green-600'}`}>
                  {totalSpent > totalPlanned 
                    ? `Przekroczono o ${formatCurrency(totalSpent - totalPlanned)}`
                    : `Pozostało ${formatCurrency(totalPlanned - totalSpent)}`
                  }
                </span>
              </div>
            </div>

            <BudgetCategoryList 
              categories={group.categories}
              groupId={group.id}
            />
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

// Component to display categories within a group
function BudgetCategoryList({ categories, groupId }: { categories: BudgetGroup['categories']; groupId: string }) {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">Kategorie</p>
        <AddCategoryForm groupId={groupId} />
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Brak kategorii w tej grupie
        </p>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded pb-1">
              <span className="text-sm text-foreground">{category.name}</span>
              <span className="text-sm text-secondary">
                {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}