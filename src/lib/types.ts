export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
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
