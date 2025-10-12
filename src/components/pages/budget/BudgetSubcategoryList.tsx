import { formatCurrency } from '@/lib/utils';

interface BudgetSubcategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
}

interface BudgetSubcategoryListProps {
  subcategories: BudgetSubcategory[];
  onAddSubcategory?: () => void;
  showAddButton?: boolean;
}

export function BudgetSubcategoryList({ 
  subcategories, 
  onAddSubcategory, 
  showAddButton = true 
}: BudgetSubcategoryListProps) {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-foreground">Kategorie</p>
        {showAddButton && (
          <button 
            onClick={onAddSubcategory}
            className="text-sm text-secondary border border-border hover:bg-gray-200 px-2 py-1 rounded transition-colors pointer-cursor"
          >
            Dodaj kategorię
          </button>
        )}
      </div>
      <div className="space-y-2">
        {subcategories.map((subcategory) => (
          <div key={subcategory.id} className="flex items-center justify-between rounded pb-1">
            <span className="text-sm text-foreground">{subcategory.name}</span>
            <span className="text-sm text-secondary">
              {formatCurrency(subcategory.spent)} / {formatCurrency(subcategory.planned)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
