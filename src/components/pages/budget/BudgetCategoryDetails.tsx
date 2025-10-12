import { formatCurrency } from '@/lib/utils';
import { BudgetProgressBar } from './BudgetProgressBar';
import { BudgetSubcategoryList } from './BudgetSubcategoryList';

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

interface BudgetCategoryDetailsProps {
  category: BudgetCategory | null;
  onAddSubcategory?: () => void;
}

export function BudgetCategoryDetails({ category, onAddSubcategory }: BudgetCategoryDetailsProps) {
  if (!category) {
    return (
      <div className="border border-border rounded-lg p-6">
        <p className="text-secondary text-center">Wybierz kategorię, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-6">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 text-foreground">{category.name}</h3>
      
      {/* Progress */}
      <div className="mb-4">
        <p className="text-sm text-secondary mb-2">Postęp</p>
        <BudgetProgressBar spent={category.spent} planned={category.planned} size="lg" showLabels={false} />
        <p className="text-sm text-secondary mt-1">
          {Math.min((category.spent / category.planned) * 100, 100).toFixed(0)}% wykorzystano
        </p>
      </div>
      
      {/* Planned, Spent, Left in a row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-secondary mb-1">Zaplanowano</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(category.planned)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary mb-1">Wydano</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(category.spent)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary mb-1">Pozostało</p>
          <p className={`text-lg font-bold ${category.spent > category.planned ? 'text-red-500' : 'text-green-600'}`}>
            {formatCurrency(category.planned - category.spent)}
          </p>
        </div>
      </div>
      
      {/* Subcategories */}
      <BudgetSubcategoryList 
        subcategories={category.subcategories}
        onAddSubcategory={onAddSubcategory}
      />
    </div>
  );
}
