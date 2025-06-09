export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId: string;
}

export interface BudgetSection {
  id: string;
  name: string;
  items: BudgetItem[];
}

export interface BudgetData {
  month: Date;
  sections: BudgetSection[];
  totalBudget: number;
  availableBudget: number; // Kwota dostępna do rozdysponowania
}

export interface BudgetFormData {
  name: string;
  amount: number;
}

export interface BudgetSectionFormData {
  name: string;
}