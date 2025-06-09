import type { BudgetData, BudgetSection, BudgetItem, BudgetFormData, BudgetSectionFormData } from '../types/Budget';
import { getAllTransactions } from './transactionService';
import { budgetTemplates } from '../data/budgetTemplates';

// Klucz do przechowywania budżetu w localStorage
const BUDGET_STORAGE_KEY = 'budget';
// Klucz do przechowywania informacji o tym, czy użytkownik już wybrał szablon
const BUDGET_TEMPLATE_SELECTED_KEY = 'budget_template_selected';

// Sprawdzenie, czy użytkownik już wybrał szablon budżetu
export const hasSelectedBudgetTemplate = (): boolean => {
  return localStorage.getItem(BUDGET_TEMPLATE_SELECTED_KEY) === 'true';
};

// Ustawienie flagi, że użytkownik wybrał szablon budżetu
export const markBudgetTemplateAsSelected = (): void => {
  localStorage.setItem(BUDGET_TEMPLATE_SELECTED_KEY, 'true');
};

// Tworzenie budżetu na podstawie szablonu
export const createBudgetFromTemplate = async (templateId: string): Promise<BudgetData> => {
  const template = budgetTemplates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error('Nie znaleziono szablonu budżetu');
  }
  
  // Usuwamy istniejące sekcje
  budgetData = {
    ...budgetData,
    sections: []
  };
  
  // Tworzymy nowe sekcje na podstawie szablonu
  for (const section of template.sections) {
    const newSection: BudgetSection = {
      id: generateId(),
      name: section.name,
      items: []
    };
    
    // Dodajemy pozycje do sekcji
    for (const itemName of section.items) {
      const newItem: BudgetItem = {
        id: generateId(),
        name: itemName,
        amount: 0, // Początkowa kwota 0
        spent: 0,
        categoryId: itemName.toLowerCase().replace(/\s+/g, '-')
      };
      
      newSection.items.push(newItem);
    }
    
    budgetData.sections.push(newSection);
  }
  
  // Zapisujemy zaktualizowany budżet
  saveBudgetToLocalStorage();
  
  // Oznaczamy, że użytkownik wybrał szablon
  markBudgetTemplateAsSelected();
  
  return {...budgetData};
};

// Inicjalizacja danych budżetu z localStorage lub domyślnych wartości
const initializeBudgetData = (): BudgetData => {
  const budgetJson = localStorage.getItem(BUDGET_STORAGE_KEY);
  if (!budgetJson) {
    return {
      month: new Date(),
      sections: [],
      totalBudget: 0,
      availableBudget: 0
    };
  }
  
  try {
    const parsedData = JSON.parse(budgetJson);
    return {
      ...parsedData,
      month: new Date(parsedData.month),
      // Jeśli availableBudget nie istnieje w zapisanych danych, ustawiamy na 0
      availableBudget: parsedData.availableBudget || 0
    };
  } catch (error) {
    console.error('Błąd podczas odczytu budżetu z localStorage:', error);
    return {
      month: new Date(),
      sections: [],
      totalBudget: 0,
      availableBudget: 0
    };
  }
};

// Symulacja lokalnej bazy danych
let budgetData: BudgetData = initializeBudgetData();

// Generowanie unikalnego ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Pobieranie danych budżetu
export const getBudgetData = async (): Promise<BudgetData> => {
  return Promise.resolve({...budgetData});
};

// Pobieranie wszystkich kategorii z budżetu
export const getAllBudgetCategories = async (): Promise<Array<{
  id: string;
  name: string;
  categoryId: string;
  sectionName: string;
  sectionId: string;
}>> => {
  const budget = await getBudgetData();
  
  const categories = budget.sections.flatMap(section => 
    section.items.map(item => ({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      sectionName: section.name,
      sectionId: section.id
    }))
  );
  
  return categories;
};

// Ustawienie miesiąca budżetu
export const setBudgetMonth = (month: Date): Promise<BudgetData> => {
  return new Promise((resolve) => {
    budgetData = {
      ...budgetData,
      month
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    resolve({...budgetData});
  });
};

// Ustawienie dostępnego budżetu na początku miesiąca
export const setAvailableBudget = (amount: number): Promise<BudgetData> => {
  return new Promise((resolve) => {
    budgetData = {
      ...budgetData,
      availableBudget: amount
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    resolve({...budgetData});
  });
};

// Dodawanie nowej sekcji
export const addBudgetSection = (sectionData: BudgetSectionFormData): Promise<BudgetSection> => {
  return new Promise((resolve) => {
    const newSection: BudgetSection = {
      id: generateId(),
      name: sectionData.name,
      items: []
    };
    
    budgetData = {
      ...budgetData,
      sections: [...budgetData.sections, newSection]
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    resolve({...newSection});
  });
};

// Aktualizacja sekcji
export const updateBudgetSection = (id: string, sectionData: BudgetSectionFormData): Promise<BudgetSection> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === id);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    const updatedSection: BudgetSection = {
      ...budgetData.sections[sectionIndex],
      name: sectionData.name
    };
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        updatedSection,
        ...budgetData.sections.slice(sectionIndex + 1)
      ]
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    resolve({...updatedSection});
  });
};

// Usuwanie sekcji
export const deleteBudgetSection = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === id);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        ...budgetData.sections.slice(sectionIndex + 1)
      ]
    };
    
    // Przeliczenie całkowitego budżetu
    calculateTotalBudget();
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Dodawanie nowej pozycji budżetowej
export const addBudgetItem = (sectionId: string, itemData: BudgetFormData): Promise<BudgetItem> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    // Upewniamy się, że kwota jest liczbą
    const amount = Number(itemData.amount);
    
    // Usunięto sprawdzanie wystarczającej kwoty do rozdysponowania
    // Pozwalamy na ujemne i przekroczone kwoty
    
    const newItem: BudgetItem = {
      id: generateId(),
      name: itemData.name,
      amount: amount,
      spent: 0,
      categoryId: itemData.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    const updatedSection: BudgetSection = {
      ...budgetData.sections[sectionIndex],
      items: [...budgetData.sections[sectionIndex].items, newItem]
    };
    
    // Aktualizuj dostępny budżet
    const newAvailableBudget = budgetData.availableBudget - amount;
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        updatedSection,
        ...budgetData.sections.slice(sectionIndex + 1)
      ],
      availableBudget: newAvailableBudget
    };
    
    // Przeliczenie całkowitego budżetu
    calculateTotalBudget();
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    // Aktualizacja wydatków - czekamy na zakończenie
    updateSpentAmounts().then(() => {
      setTimeout(() => {
        resolve({...newItem});
      }, 300);
    }).catch(error => {
      console.error('Błąd podczas aktualizacji wydatków:', error);
      // Mimo błędu, kontynuujemy i zwracamy nowy element
      setTimeout(() => {
        resolve({...newItem});
      }, 300);
    });
  });
};

// Aktualizacja pozycji budżetowej
export const updateBudgetItem = (sectionId: string, itemId: string, itemData: BudgetFormData): Promise<BudgetItem> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    const itemIndex = budgetData.sections[sectionIndex].items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
      reject(new Error('Pozycja budżetowa nie została znaleziona'));
      return;
    }
    
    const currentItem = budgetData.sections[sectionIndex].items[itemIndex];
    // Upewniamy się, że kwota jest liczbą
    const newAmount = Number(itemData.amount);
    const amountDifference = newAmount - currentItem.amount;
    
    // Usunięto sprawdzanie wystarczającej kwoty do rozdysponowania
    // Pozwalamy na ujemne i przekroczone kwoty
    
    const updatedItem: BudgetItem = {
      ...currentItem,
      name: itemData.name,
      amount: newAmount,
      categoryId: itemData.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    const updatedSection: BudgetSection = {
      ...budgetData.sections[sectionIndex],
      items: [
        ...budgetData.sections[sectionIndex].items.slice(0, itemIndex),
        updatedItem,
        ...budgetData.sections[sectionIndex].items.slice(itemIndex + 1)
      ]
    };
    
    // Aktualizuj dostępny budżet
    const newAvailableBudget = budgetData.availableBudget - amountDifference;
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        updatedSection,
        ...budgetData.sections.slice(sectionIndex + 1)
      ],
      availableBudget: newAvailableBudget
    };
    
    // Przeliczenie całkowitego budżetu
    calculateTotalBudget();
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    // Aktualizacja wydatków - czekamy na zakończenie
    updateSpentAmounts().then(() => {
      setTimeout(() => {
        resolve({...updatedItem});
      }, 300);
    }).catch(error => {
      console.error('Błąd podczas aktualizacji wydatków:', error);
      // Mimo błędu, kontynuujemy i zwracamy zaktualizowany element
      setTimeout(() => {
        resolve({...updatedItem});
      }, 300);
    });
  });
};

// Usuwanie pozycji budżetowej
export const deleteBudgetItem = (sectionId: string, itemId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    const itemIndex = budgetData.sections[sectionIndex].items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
      reject(new Error('Pozycja budżetowa nie została znaleziona'));
      return;
    }
    
    // Pobierz kwotę usuwanej pozycji, aby dodać ją z powrotem do dostępnego budżetu
    const itemAmount = budgetData.sections[sectionIndex].items[itemIndex].amount;
    
    const updatedSection: BudgetSection = {
      ...budgetData.sections[sectionIndex],
      items: [
        ...budgetData.sections[sectionIndex].items.slice(0, itemIndex),
        ...budgetData.sections[sectionIndex].items.slice(itemIndex + 1)
      ]
    };
    
    // Aktualizuj dostępny budżet
    const newAvailableBudget = budgetData.availableBudget + itemAmount;
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        updatedSection,
        ...budgetData.sections.slice(sectionIndex + 1)
      ],
      availableBudget: newAvailableBudget
    };
    
    // Przeliczenie całkowitego budżetu
    calculateTotalBudget();
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Zmiana kolejności sekcji
export const reorderBudgetSections = (sourceIndex: number, destinationIndex: number): Promise<BudgetSection[]> => {
  return new Promise((resolve, reject) => {
    if (
      sourceIndex < 0 || 
      sourceIndex >= budgetData.sections.length || 
      destinationIndex < 0 || 
      destinationIndex >= budgetData.sections.length
    ) {
      reject(new Error('Nieprawidłowy indeks sekcji'));
      return;
    }
    
    const sections = [...budgetData.sections];
    const [removed] = sections.splice(sourceIndex, 1);
    sections.splice(destinationIndex, 0, removed);
    
    budgetData = {
      ...budgetData,
      sections
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    setTimeout(() => {
      resolve([...sections]);
    }, 300);
  });
};

// Zmiana kolejności pozycji budżetowych
export const reorderBudgetItems = (
  sectionId: string, 
  sourceIndex: number, 
  destinationIndex: number
): Promise<BudgetItem[]> => {
  return new Promise((resolve, reject) => {
    const sectionIndex = budgetData.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    const items = [...budgetData.sections[sectionIndex].items];
    
    if (
      sourceIndex < 0 || 
      sourceIndex >= items.length || 
      destinationIndex < 0 || 
      destinationIndex >= items.length
    ) {
      reject(new Error('Nieprawidłowy indeks pozycji'));
      return;
    }
    
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    
    const updatedSection: BudgetSection = {
      ...budgetData.sections[sectionIndex],
      items
    };
    
    budgetData = {
      ...budgetData,
      sections: [
        ...budgetData.sections.slice(0, sectionIndex),
        updatedSection,
        ...budgetData.sections.slice(sectionIndex + 1)
      ]
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    setTimeout(() => {
      resolve([...items]);
    }, 300);
  });
};

// Przeniesienie pozycji budżetowej między sekcjami
export const moveBudgetItem = (
  sourceSectionId: string,
  destinationSectionId: string,
  sourceIndex: number,
  destinationIndex: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sourceSectionIndex = budgetData.sections.findIndex(s => s.id === sourceSectionId);
    const destinationSectionIndex = budgetData.sections.findIndex(s => s.id === destinationSectionId);
    
    if (sourceSectionIndex === -1 || destinationSectionIndex === -1) {
      reject(new Error('Sekcja nie została znaleziona'));
      return;
    }
    
    const sourceItems = [...budgetData.sections[sourceSectionIndex].items];
    const destinationItems = [...budgetData.sections[destinationSectionIndex].items];
    
    if (
      sourceIndex < 0 || 
      sourceIndex >= sourceItems.length || 
      destinationIndex < 0 || 
      destinationIndex > destinationItems.length
    ) {
      reject(new Error('Nieprawidłowy indeks pozycji'));
      return;
    }
    
    const [removed] = sourceItems.splice(sourceIndex, 1);
    destinationItems.splice(destinationIndex, 0, removed);
    
    const updatedSourceSection: BudgetSection = {
      ...budgetData.sections[sourceSectionIndex],
      items: sourceItems
    };
    
    const updatedDestinationSection: BudgetSection = {
      ...budgetData.sections[destinationSectionIndex],
      items: destinationItems
    };
    
    const updatedSections = [...budgetData.sections];
    updatedSections[sourceSectionIndex] = updatedSourceSection;
    updatedSections[destinationSectionIndex] = updatedDestinationSection;
    
    budgetData = {
      ...budgetData,
      sections: updatedSections
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Przeliczenie całkowitego budżetu
const calculateTotalBudget = () => {
  const total = budgetData.sections.reduce((sectionTotal, section) => {
    return sectionTotal + section.items.reduce((itemTotal, item) => {
      return itemTotal + item.amount;
    }, 0);
  }, 0);
  
  budgetData = {
    ...budgetData,
    totalBudget: total
  };
  
  // Zapisz zaktualizowany budżet do localStorage
  saveBudgetToLocalStorage();
};

// Funkcja zapisująca budżet do localStorage
const saveBudgetToLocalStorage = () => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgetData));
  } catch (error) {
    console.error('Błąd podczas zapisywania budżetu do localStorage:', error);
  }
};

// Aktualizacja wydatków na podstawie transakcji
export const updateSpentAmounts = async (): Promise<void> => {
  try {
    // Pobierz wszystkie transakcje
    const transactions = await getAllTransactions();
    
    // Filtruj transakcje tylko dla bieżącego miesiąca
    const currentMonth = budgetData.month;
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === 'expense' &&
        transactionDate >= startOfMonth &&
        transactionDate <= endOfMonth
      );
    });
    
    // Mapa wydatków według kategorii
    const spentByCategory: Record<string, number> = {};
    const spentByCategoryId: Record<string, number> = {};
    const spentByCategoryLowerCase: Record<string, number> = {};
    
    monthTransactions.forEach(transaction => {
      // Używamy nazwy kategorii bezpośrednio, aby dopasować do nazw w budżecie
      const categoryName = transaction.category;
      spentByCategory[categoryName] = (spentByCategory[categoryName] || 0) + transaction.amount;
      
      // Dodajemy również wersję z małymi literami dla lepszego dopasowania
      const categoryNameLower = categoryName.toLowerCase();
      spentByCategoryLowerCase[categoryNameLower] = (spentByCategoryLowerCase[categoryNameLower] || 0) + transaction.amount;
      
      // Tworzymy również categoryId z nazwy kategorii, aby dopasować do categoryId w budżecie
      const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
      spentByCategoryId[categoryId] = (spentByCategoryId[categoryId] || 0) + transaction.amount;
    });
    
    // Aktualizacja wydatków dla każdej pozycji budżetowej
    const updatedSections = budgetData.sections.map(section => {
      const updatedItems = section.items.map(item => {
        // Próbujemy dopasować po nazwie kategorii, nazwie z małymi literami lub po categoryId
        const spentAmount = 
          spentByCategory[item.name] || 
          spentByCategoryLowerCase[item.name.toLowerCase()] ||
          spentByCategoryId[item.categoryId] || 
          0;
          
        return {
          ...item,
          spent: spentAmount
        };
      });
      
      return {
        ...section,
        items: updatedItems
      };
    });
    
    budgetData = {
      ...budgetData,
      sections: updatedSections
    };
    
    // Zapisz zaktualizowany budżet do localStorage
    saveBudgetToLocalStorage();
    
    // Dodajemy log dla debugowania
    console.log('Aktualizacja wydatków zakończona:', {
      transakcje: monthTransactions.length,
      kategorie: Object.keys(spentByCategory),
      kategorieId: Object.keys(spentByCategoryId),
      sekcje: budgetData.sections.map(s => ({
        nazwa: s.name,
        pozycje: s.items.map(i => ({
          nazwa: i.name,
          categoryId: i.categoryId,
          kwota: i.amount,
          wydano: i.spent
        }))
      }))
    });
    
  } catch (error) {
    console.error('Błąd podczas aktualizacji wydatków:', error);
  }
};