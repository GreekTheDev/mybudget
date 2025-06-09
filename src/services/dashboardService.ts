import type { Transaction } from '../types/Transaction';
import { getAllTransactions } from './transactionService';
import { getAccounts } from './accountService';
import { getBudgetData } from './budgetService';

// Interfejs dla danych dashboardu
export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  accountSummary: {
    id: string;
    name: string;
    balance: number;
    type: string;
  }[];
  budgetSummary: {
    totalBudget: number;
    totalSpent: number;
    percentageUsed: number;
    topCategories: {
      name: string;
      amount: number;
      spent: number;
      percentage: number;
    }[];
  };
  monthlyStats: {
    month: string;
    income: number;
    expense: number;
  }[];
}

// Pobieranie danych dla dashboardu
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Pobierz dane z różnych źródeł
    const transactions = await getAllTransactions();
    const accounts = getAccounts();
    const budget = await getBudgetData();
    
    // Oblicz całkowite saldo, przychody i wydatki
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Filtruj transakcje z ostatniego miesiąca
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const recentTransactions = transactions
      .filter(transaction => new Date(transaction.date) >= lastMonth)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Pobierz 5 najnowszych transakcji
    
    // Oblicz przychody i wydatki z ostatniego miesiąca
    const monthlyTransactions = transactions.filter(
      transaction => new Date(transaction.date) >= lastMonth
    );
    
    const totalIncome = monthlyTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const totalExpense = monthlyTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Przygotuj podsumowanie kont
    const accountSummary = accounts.map(account => ({
      id: account.id,
      name: account.name,
      balance: account.balance,
      type: account.type
    }));
    
    // Przygotuj podsumowanie budżetu
    const totalBudget = budget.totalBudget;
    const totalSpent = budget.sections.reduce(
      (sum, section) => sum + section.items.reduce(
        (itemSum, item) => itemSum + item.spent, 0
      ), 0
    );
    
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Znajdź top 5 kategorii budżetowych pod względem wydatków
    const allBudgetItems = budget.sections.flatMap(section => section.items);
    const sortedItems = [...allBudgetItems]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);
    
    const topCategories = sortedItems.map(item => ({
      name: item.name,
      amount: item.amount,
      spent: item.spent,
      percentage: item.amount > 0 ? (item.spent / item.amount) * 100 : 0
    }));
    
    // Przygotuj statystyki miesięczne (ostatnie 6 miesięcy)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthName = month.toLocaleString('pl-PL', { month: 'short' });
      
      const monthTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date >= month && date <= monthEnd;
      });
      
      const monthIncome = monthTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const monthExpense = monthTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      monthlyStats.push({
        month: monthName,
        income: monthIncome,
        expense: monthExpense
      });
    }
    
    return {
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransactions,
      accountSummary,
      budgetSummary: {
        totalBudget,
        totalSpent,
        percentageUsed,
        topCategories
      },
      monthlyStats
    };
  } catch (error) {
    console.error('Błąd podczas pobierania danych dla dashboardu:', error);
    throw error;
  }
};

// Funkcja do odświeżania danych dashboardu
export const refreshDashboardData = async (): Promise<DashboardData> => {
  return getDashboardData();
};