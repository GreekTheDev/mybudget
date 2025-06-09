import { updateSpentAmounts } from './budgetService';
import { updateAccountBalances } from './accountService';

// Funkcja inicjalizująca aplikację
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Inicjalizacja aplikacji...');
    
    // Aktualizuj salda kont na podstawie transakcji
    await updateAccountBalances();
    
    // Aktualizuj wydatki w budżecie na podstawie transakcji
    await updateSpentAmounts();
    
    console.log('Inicjalizacja zakończona pomyślnie');
  } catch (error) {
    console.error('Błąd podczas inicjalizacji aplikacji:', error);
  }
};