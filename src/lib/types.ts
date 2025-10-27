export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  accountId: string;
  budgetGroupId?: string;
  budgetCategoryId?: string;
}

export type AccountType = 
  | 'cash' | 'checking'
  | 'savings' | 'term_deposit'
  | 'credit' | 'bnpl' | 'loan' | 'mortgage'
  | 'investment' | 'brokerage' | 'pension' | 'crypto' | 'ewallet' | 'prepaid';

export type AccountCategory = 
  | 'current_accounts'
  | 'savings_goals'
  | 'cards_credits'
  | 'investments_tech';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  month: string;
  year: number;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'weekly' | 'biweekly';
  nextDueDate: Date;
  accountId: string;
  isActive: boolean;
  color: string;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
}

export interface CashFlowData {
  date: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulativeBalance: number;
}

export interface CashFlowPeriod {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  transactions: number;
}

export interface CashFlowProjection {
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface SpendingReport {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface IncomeReport {
  source: string;
  amount: number;
  percentage: number;
  color: string;
  frequency: string;
  trend: 'up' | 'down' | 'stable';
}

export interface TrendReport {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export interface BudgetVsActual {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  status: 'over' | 'under' | 'on-track';
}

export interface SavingsReport {
  goal: string;
  target: number;
  current: number;
  progress: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'ahead';
}

export interface ReportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Budget Domain Models
export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
}

export interface BudgetGroup {
  id: string;
  name: string;
  categories: BudgetCategory[];
}

export interface BudgetState {
  groups: BudgetGroup[];
}

export type BudgetAction =
  | { type: 'LOAD_GROUPS'; payload: { groups: BudgetGroup[] } }
  | { type: 'ADD_GROUP'; payload: { name: string } }
  | { type: 'ADD_GROUP_SUCCESS'; payload: { group: BudgetGroup } }
  | { type: 'EDIT_GROUP'; payload: { id: string; name: string } }
  | { type: 'DELETE_GROUP'; payload: { id: string } }
  | { type: 'ADD_CATEGORY'; payload: { groupId: string; name: string; limit: number } }
  | { type: 'ADD_CATEGORY_SUCCESS'; payload: { groupId: string; category: BudgetCategory } }
  | { type: 'EDIT_CATEGORY'; payload: { groupId: string; categoryId: string; name: string; limit: number } }
  | { type: 'DELETE_CATEGORY'; payload: { groupId: string; categoryId: string } };

