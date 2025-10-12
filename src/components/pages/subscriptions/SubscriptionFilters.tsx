import { Account, Subscription } from '@/lib/types';

interface SubscriptionFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  filterType: 'all' | 'income' | 'expense';
  filterFrequency: string;
  filterAccount: string;
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void;
  onFilterFrequencyChange: (frequency: string) => void;
  onFilterAccountChange: (account: string) => void;
  frequencies: string[];
  accounts: Account[];
}

export function SubscriptionFilters({
  showFilters,
  onToggleFilters,
  filterType,
  filterFrequency,
  filterAccount,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterAccountChange,
  frequencies,
  accounts
}: SubscriptionFiltersProps) {
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Co tydzień';
      case 'biweekly': return 'Co 2 tygodnie';
      case 'monthly': return 'Co miesiąc';
      case 'quarterly': return 'Co 3 miesiące';
      case 'yearly': return 'Co rok';
      default: return frequency;
    }
  };

  const hasActiveFilters = filterType !== 'all' || filterFrequency !== 'all' || filterAccount !== 'all';

  return (
    <div className="border border-border rounded-lg mb-6">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggleFilters}
      >
        <h2 className="text-lg font-semibold text-foreground">Filtry</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
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

      {showFilters && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Typ</label>
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
              <label className="block text-sm font-medium text-secondary mb-2">Częstotliwość</label>
              <select
                value={filterFrequency}
                onChange={(e) => onFilterFrequencyChange(e.target.value)}
                className="w-full p-2 pr-8 border border-border rounded-lg text-foreground bg-background appearance-none cursor-pointer"
              >
                <option value="all">Wszystkie</option>
                {frequencies.map(frequency => (
                  <option key={frequency} value={frequency}>{getFrequencyLabel(frequency)}</option>
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
