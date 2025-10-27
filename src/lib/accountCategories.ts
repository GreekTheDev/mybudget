import { AccountType, AccountCategory } from './types';

export interface AccountCategoryInfo {
  id: AccountCategory;
  name: string;
  types: AccountType[];
}

export const accountCategories: AccountCategoryInfo[] = [
  {
    id: 'current_accounts',
    name: 'Rachunki bieżące',
    types: ['cash', 'checking']
  },
  {
    id: 'savings_goals',
    name: 'Oszczędności i cele',
    types: ['savings', 'term_deposit']
  },
  {
    id: 'cards_credits',
    name: 'Karty i kredyty',
    types: ['credit', 'bnpl', 'loan', 'mortgage']
  },
  {
    id: 'investments_tech',
    name: 'Inwestycje i Technologia',
    types: ['investment', 'brokerage', 'pension', 'crypto', 'ewallet', 'prepaid']
  }
];

export const accountTypeLabels: Record<AccountType, string> = {
  cash: 'Gotówka',
  checking: 'Konto osobiste',
  savings: 'Oszczędności',
  term_deposit: 'Lokata terminowa',
  credit: 'Karta kredytowa',
  bnpl: '"Kup teraz, zapłać później"',
  loan: 'Pożyczka gotówkowa',
  mortgage: 'Kredyt hipoteczny',
  investment: 'Inwestycje',
  brokerage: 'Rachunek maklerski',
  pension: 'Emerytalne (IKE/IKZE/PPK)',
  crypto: 'Krypto',
  ewallet: 'Portfel elektroniczny',
  prepaid: 'Karta przedpłacona'
};

export const accountTypeColors: Record<AccountType, string> = {
  cash: '#16a34a',        // green-600
  checking: '#3b82f6',    // blue-500
  savings: '#10b981',     // emerald-500
  term_deposit: '#059669', // emerald-600
  credit: '#ef4444',      // red-500
  bnpl: '#f97316',        // orange-500
  loan: '#dc2626',        // red-600
  mortgage: '#b91c1c',    // red-700
  investment: '#8b5cf6',  // violet-500
  brokerage: '#7c3aed',   // violet-600
  pension: '#6366f1',     // indigo-500
  crypto: '#f59e0b',      // amber-500
  ewallet: '#06b6d4',     // cyan-500
  prepaid: '#14b8a6'      // teal-500
};

export function getCategoryForAccountType(type: AccountType): AccountCategory {
  for (const category of accountCategories) {
    if (category.types.includes(type)) {
      return category.id;
    }
  }
  return 'current_accounts'; // default fallback
}

export function getAccountTypeLabel(type: AccountType): string {
  return accountTypeLabels[type] || type;
}

export function getAccountTypeColor(type: AccountType): string {
  return accountTypeColors[type] || '#3b82f6';
}
