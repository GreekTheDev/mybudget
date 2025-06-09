import type { Account, NewAccount } from '../types/Account';

import { getAllTransactions } from './transactionService';

// Klucz do przechowywania kont w localStorage
const ACCOUNTS_STORAGE_KEY = 'accounts';

// Pobieranie wszystkich kont
export const getAccounts = (): Account[] => {
  const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!accountsJson) return [];
  
  try {
    const accounts = JSON.parse(accountsJson);
    return accounts.map((account: Account) => ({
      ...account,
      // Dodajemy domyślny kolor dla istniejących kont, które go nie mają
      color: account.color || 'blue',
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt)
    }));
  } catch (error) {
    console.error('Błąd podczas pobierania kont:', error);
    return [];
  }
};

// Usunięto mapowanie typów kont na nazwy sekcji budżetu, ponieważ sekcje budżetu
// powinny być tworzone tylko przez użytkownika

// Dodawanie nowego konta
export const addAccount = (newAccount: NewAccount): Account => {
  const accounts = getAccounts();
  
  const account: Account = {
    id: crypto.randomUUID(),
    name: newAccount.name,
    balance: newAccount.balance,
    type: newAccount.type,
    color: newAccount.color || 'blue', // Domyślny kolor jeśli nie podano
    includeInBudget: newAccount.includeInBudget,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const updatedAccounts = [...accounts, account];
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
  
  // Usunięto automatyczne tworzenie sekcji budżetu
  
  return account;
};

// Usunięto funkcję ensureBudgetSectionExists, ponieważ sekcje budżetu
// powinny być tworzone tylko przez użytkownika

// Aktualizacja konta
export const updateAccount = (updatedAccount: Account): Account => {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(account => account.id === updatedAccount.id);
  
  if (accountIndex === -1) {
    throw new Error('Konto nie zostało znalezione');
  }
  
  const accountToUpdate = {
    ...updatedAccount,
    updatedAt: new Date()
  };
  
  accounts[accountIndex] = accountToUpdate;
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  
  return accountToUpdate;
};

// Usuwanie konta
export const deleteAccount = (accountId: string): void => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.filter(account => account.id !== accountId);
  
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
};

// Pobieranie konta po ID
export const getAccountById = (accountId: string): Account | undefined => {
  const accounts = getAccounts();
  return accounts.find(account => account.id === accountId);
};

// Aktualizacja sald kont na podstawie transakcji
export const updateAccountBalances = async (): Promise<void> => {
  try {
    // Pobierz wszystkie konta i transakcje
    const accounts = getAccounts();
    const transactions = await getAllTransactions();
    
    // Mapa do przechowywania sald początkowych kont
    const initialBalances: Record<string, number> = {};
    
    // Zapisz początkowe salda kont
    accounts.forEach(account => {
      initialBalances[account.id] = account.balance;
    });
    
    // Zresetuj salda kont do wartości początkowych
    const updatedAccounts = accounts.map(account => ({
      ...account,
      balance: initialBalances[account.id] || 0
    }));
    
    // Przetwórz wszystkie transakcje i zaktualizuj salda
    transactions.forEach(transaction => {
      if (transaction.account) {
        const accountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.account);
        
        if (accountIndex !== -1) {
          // Aktualizuj saldo w zależności od typu transakcji
          if (transaction.type === 'income') {
            updatedAccounts[accountIndex].balance += transaction.amount;
          } else if (transaction.type === 'expense') {
            updatedAccounts[accountIndex].balance -= transaction.amount;
          } else if (transaction.type === 'transfer') {
            // Dla transferów potrzebujemy znać konto docelowe
            // Zakładamy, że w przypadku transferu, pole category zawiera ID konta docelowego
            const targetAccountIndex = updatedAccounts.findIndex(acc => acc.id === transaction.category);
            
            if (targetAccountIndex !== -1) {
              updatedAccounts[accountIndex].balance -= transaction.amount;
              updatedAccounts[targetAccountIndex].balance += transaction.amount;
            }
          }
          
          // Aktualizuj datę ostatniej modyfikacji
          updatedAccounts[accountIndex].updatedAt = new Date();
        }
      }
    });
    
    // Zapisz zaktualizowane konta do localStorage
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    
  } catch (error) {
    console.error('Błąd podczas aktualizacji sald kont:', error);
  }
};