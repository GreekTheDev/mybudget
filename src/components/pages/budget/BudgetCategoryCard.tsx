import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { BudgetProgressBar } from './BudgetProgressBar';
import { BudgetSubcategoryList } from './BudgetSubcategoryList';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface BudgetSubcategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
  subcategories: BudgetSubcategory[];
}

interface BudgetCategoryCardProps {
  category: BudgetCategory;
  isExpanded?: boolean;
  layoutMode: 'desktop' | 'tablet' | 'mobile';
  onClick: () => void;
  onToggleExpansion?: () => void;
  onAddSubcategory?: () => void;
}

export function BudgetCategoryCard({
  category,
  isExpanded = false,
  layoutMode,
  onClick,
  onToggleExpansion,
  onAddSubcategory
}: BudgetCategoryCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      id={`category-${category.id}`}
      className="border border-border rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground">{category.name}</h3>
        <div className="text-right">
          <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
          <p className="font-semibold text-foreground">
            {formatCurrency(category.spent)} / {formatCurrency(category.planned)}
          </p>
        </div>
      </div>
      
      <BudgetProgressBar spent={category.spent} planned={category.planned} />

      <div className="flex justify-between text-sm">
        <span className={`font-medium ${category.spent > category.planned ? 'text-red-500' : 'text-green-600'}`}>
          {category.spent > category.planned 
            ? `Przekroczono o ${formatCurrency(category.spent - category.planned)}`
            : `Pozostało ${formatCurrency(category.planned - category.spent)}`
          }
        </span>
      </div>

      {/* Tablet: Show subcategories when expanded (mobile uses drawer) */}
      <div className={`${layoutMode === 'tablet' ? '' : 'hidden'} transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}>
        <BudgetSubcategoryList 
          subcategories={category.subcategories}
          onAddSubcategory={onAddSubcategory}
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
            <DrawerTitle className="text-lg">{category.name}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-right">
                  <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(category.spent)} / {formatCurrency(category.planned)}
                  </p>
                </div>
              </div>
              
              <BudgetProgressBar spent={category.spent} planned={category.planned} />

              <div className="flex justify-between text-sm mt-2">
                <span className={`font-medium ${category.spent > category.planned ? 'text-red-500' : 'text-green-600'}`}>
                  {category.spent > category.planned 
                    ? `Przekroczono o ${formatCurrency(category.spent - category.planned)}`
                    : `Pozostało ${formatCurrency(category.planned - category.spent)}`
                  }
                </span>
              </div>
            </div>

            <BudgetSubcategoryList 
              subcategories={category.subcategories}
              onAddSubcategory={onAddSubcategory}
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
