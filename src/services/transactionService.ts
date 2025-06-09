import type { Transaction, TransactionFormData } from '../types/Transaction';
import { updateSpentAmounts } from './budgetService';
import { updateAccountBalances } from './accountService';

// Klucz do przechowywania transakcji w localStorage
const TRANSACTIONS_STORAGE_KEY = 'transactions';

// Inicjalizacja danych transakcji z localStorage lub domyślnych wartości
const initializeTransactions = (): Transaction[] => {
  const transactionsJson = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
  if (!transactionsJson) {
    return [];
  }
  
  try {
    return JSON.parse(transactionsJson);
  } catch (error) {
    console.error('Błąd podczas odczytu transakcji z localStorage:', error);
    return [];
  }
};

// Symulacja lokalnej bazy danych
let transactions: Transaction[] = initializeTransactions();

// Funkcja zapisująca transakcje do localStorage
const saveTransactionsToLocalStorage = () => {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Błąd podczas zapisywania transakcji do localStorage:', error);
  }
};

// Funkcja aktualizująca wszystkie powiązane dane po zmianie transakcji
const updateRelatedData = async () => {
  try {
    // Aktualizuj wydatki w budżecie
    await updateSpentAmounts();
    
    // Aktualizuj salda kont
    await updateAccountBalances();
    
    // Odśwież dane dashboardu (nie musimy nic robić z wynikiem)
    // Dane dashboardu są pobierane na żądanie, więc wystarczy, że aktualizujemy
    // budżet i salda kont, a dashboard pobierze już zaktualizowane dane
  } catch (error) {
    console.error('Błąd podczas aktualizacji powiązanych danych:', error);
  }
};

// Generowanie unikalnego ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Pobieranie wszystkich transakcji
export const getAllTransactions = (): Promise<Transaction[]> => {
  return Promise.resolve([...transactions]);
};

// Dodawanie nowej transakcji
export const addTransaction = (transactionData: TransactionFormData): Promise<Transaction> => {
  return new Promise((resolve) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
    };
    
    transactions = [...transactions, newTransaction];
    
    // Zapisz zaktualizowane transakcje do localStorage
    saveTransactionsToLocalStorage();
    
    // Aktualizuj powiązane dane (budżet i salda kont)
    updateRelatedData();
    
    resolve(newTransaction);
  });
};

// Aktualizacja istniejącej transakcji
export const updateTransaction = (id: string, transactionData: TransactionFormData): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      reject(new Error('Transakcja nie została znaleziona'));
      return;
    }
    
    const updatedTransaction: Transaction = {
      ...transactionData,
      id,
    };
    
    transactions = [
      ...transactions.slice(0, index),
      updatedTransaction,
      ...transactions.slice(index + 1)
    ];
    
    // Zapisz zaktualizowane transakcje do localStorage
    saveTransactionsToLocalStorage();
    
    // Aktualizuj powiązane dane (budżet i salda kont)
    updateRelatedData();
    
    resolve(updatedTransaction);
  });
};

// Usuwanie transakcji
export const deleteTransaction = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      reject(new Error('Transakcja nie została znaleziona'));
      return;
    }
    
    transactions = [
      ...transactions.slice(0, index),
      ...transactions.slice(index + 1)
    ];
    
    // Zapisz zaktualizowane transakcje do localStorage
    saveTransactionsToLocalStorage();
    
    // Aktualizuj powiązane dane (budżet i salda kont)
    updateRelatedData();
    
    resolve();
  });
};

// Pobieranie pojedynczej transakcji
export const getTransactionById = (id: string): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      reject(new Error('Transakcja nie została znaleziona'));
      return;
    }
    
    resolve({...transaction});
  });
};