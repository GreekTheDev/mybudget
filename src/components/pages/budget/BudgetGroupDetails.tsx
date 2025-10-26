'use client';

import { formatCurrency } from '@/lib/utils';
import { BudgetProgressBar } from './BudgetProgressBar';
import { AddCategoryForm } from './AddCategoryForm';
import { BudgetGroupMenu } from './BudgetGroupMenu';
import { CategoryMenu } from './CategoryMenu';
import { BudgetGroup } from '@/lib/types';

interface BudgetGroupDetailsProps {
  group: BudgetGroup | null;
  onAddCategory?: () => void;
}

export function BudgetGroupDetails({ group, onAddCategory }: BudgetGroupDetailsProps) {
  if (!group) {
    return (
      <div className="border border-border rounded-lg p-6">
        <p className="text-center text-secondary">Wybierz grupę budżetową, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  // Calculate totals from categories
  const totalPlanned = group.categories.reduce((sum, category) => sum + category.limit, 0);
  const totalSpent = group.categories.reduce((sum, category) => sum + category.spent, 0);

  return (
    <div className="border border-border rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">{group.name}</h3>
          <BudgetGroupMenu group={group} />
        </div>
        
        <div className="text-right mb-3">
          <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
          <p className="font-semibold text-foreground">
            {formatCurrency(totalSpent)} / {formatCurrency(totalPlanned)}
          </p>
        </div>

        {totalPlanned > 0 && (
          <BudgetProgressBar spent={totalSpent} planned={totalPlanned} />
        )}
        
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-secondary">Pozostało</span>
          <span className={`font-semibold ${totalSpent <= totalPlanned ? 'text-green-600' : 'text-red-500'}`}>
            {formatCurrency(totalPlanned - totalSpent)}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-foreground">Kategorie</h4>
          <AddCategoryForm groupId={group.id} />
        </div>

        {group.categories.length === 0 ? (
          <div className="text-center py-8 text-secondary">
            <p className="mb-2">Brak kategorii w tej grupie</p>
            <p className="text-sm">Dodaj pierwszą kategorię, aby rozpocząć planowanie</p>
          </div>
        ) : (
          <div className="space-y-3">
            {group.categories.map((category) => (
              <div key={category.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-foreground">{category.name}</h5>
                  <CategoryMenu groupId={group.id} category={category} />
                </div>
                
                <div className="text-right mb-3">
                  <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                  </p>
                </div>
                
                <BudgetProgressBar spent={category.spent} planned={category.limit} />
                
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-secondary">Pozostało</span>
                  <span className={`font-semibold ${category.spent > category.limit ? 'text-red-500' : 'text-green-600'}`}>
                    {formatCurrency(category.limit - category.spent)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}