'use client';

import { formatCurrency } from '@/lib/utils';
import { BudgetProgressBar } from './BudgetProgressBar';
import { AddCategoryForm } from './AddCategoryForm';
import { BudgetGroupMenu } from './BudgetGroupMenu';
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground">{group.name}</h3>
          <BudgetGroupMenu group={group} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary">Zaplanowano</p>
            <p className="font-semibold text-foreground">{formatCurrency(totalPlanned)}</p>
          </div>
          <div>
            <p className="text-secondary">Wydano</p>
            <p className="font-semibold text-foreground">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-secondary">Pozostało</p>
            <p className={`font-semibold ${totalSpent <= totalPlanned ? 'text-green-600' : 'text-red-500'}`}>
              {formatCurrency(totalPlanned - totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-secondary">Procent wykorzystania</p>
            <p className="font-semibold text-foreground">
              {totalPlanned > 0 ? `${Math.round((totalSpent / totalPlanned) * 100)}%` : '0%'}
            </p>
          </div>
        </div>
      </div>

      {totalPlanned > 0 && (
        <div className="mb-6">
          <BudgetProgressBar spent={totalSpent} planned={totalPlanned} />
        </div>
      )}

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
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-foreground">{category.name}</h5>
                  <div className="text-right">
                    <p className="text-sm text-secondary">Wydano / Limit</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(category.spent)} / {formatCurrency(category.limit)}
                    </p>
                  </div>
                </div>
                
                <BudgetProgressBar spent={category.spent} planned={category.limit} />
                
                <div className="flex justify-between text-sm mt-2">
                  <span className={`font-medium ${category.spent > category.limit ? 'text-red-500' : 'text-green-600'}`}>
                    {category.spent > category.limit 
                      ? `Przekroczono o ${formatCurrency(category.spent - category.limit)}`
                      : `Pozostało ${formatCurrency(category.limit - category.spent)}`
                    }
                  </span>
                  <span className="text-secondary">
                    {category.limit > 0 ? `${Math.round((category.spent / category.limit) * 100)}%` : '0%'}
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