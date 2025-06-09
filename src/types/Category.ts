export type CategoryType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface CategoryGroup {
  id: string;
  name: string;
  type: CategoryType;
  categories: Category[];
}

export interface NewCategory {
  name: string;
  type: CategoryType;
  groupId?: string;
}