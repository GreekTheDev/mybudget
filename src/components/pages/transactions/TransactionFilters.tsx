import { Account } from '@/lib/types';

interface TransactionFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  filterType: 'all' | 'income' | 'expense';
  filterCategory: string;
  filterAccount: string;
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void;
  onFilterCategoryChange: (category: string) => void;
  onFilterAccountChange: (account: string) => void;
  categories: string[];
  accounts: Account[];
}

export function TransactionFilters({
  showFilters,
  onToggleFilters,
  filterType,
  filterCategory,
  filterAccount,
  onFilterTypeChange,
  onFilterCategoryChange,
  onFilterAccountChange,
  categories,
  accounts
}: TransactionFiltersProps) {
  const hasActiveFilters = filterType !== 'all' || filterCategory !== 'all' || filterAccount !== 'all';

  return (
    <div className="border border-border rounded-lg mb-6">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggleFilters}
      >
        <h2 className="text-lg font-semibold text-foreground">Filtry</h2>
        <div className="flex items-center gap-2">
          {/* Filter indicator dots */}
          {hasActiveFilters && (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
          {/* Chevron icon */}
          <svg 
            className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Typ transakcji</label>
              <select
                value={filterType}
                onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'income' | 'expense')}
                className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
              >
                <option value="all">Wszystkie</option>
                <option value="income">Przychody</option>
                <option value="expense">Wydatki</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Kategoria</label>
              <select
                value={filterCategory}
                onChange={(e) => onFilterCategoryChange(e.target.value)}
                className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
              >
                <option value="all">Wszystkie kategorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Konto</label>
              <select
                value={filterAccount}
                onChange={(e) => onFilterAccountChange(e.target.value)}
                className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
              >
                <option value="all">Wszystkie konta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
