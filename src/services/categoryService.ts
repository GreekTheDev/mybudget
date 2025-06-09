import type { Category, CategoryGroup, CategoryType, NewCategory } from '../types/Category';

// Klucz do przechowywania kategorii w localStorage
const CATEGORIES_STORAGE_KEY = 'categories';

// Inicjalizacja danych kategorii z localStorage lub domyślnych wartości
const initializeCategories = (): CategoryGroup[] => {
  const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (!categoriesJson) {
    return getDefaultCategories();
  }
  
  try {
    return JSON.parse(categoriesJson);
  } catch (error) {
    console.error('Błąd podczas odczytu kategorii z localStorage:', error);
    return getDefaultCategories();
  }
};

// Domyślne kategorie
const getDefaultCategories = (): CategoryGroup[] => {
  return [
    {
      id: 'expense-essentials',
      name: 'Podstawowe wydatki',
      type: 'expense',
      categories: [
        {
          id: 'food',
          name: 'Jedzenie',
          type: 'expense'
        },
        {
          id: 'housing',
          name: 'Mieszkanie',
          type: 'expense'
        },
        {
          id: 'transport',
          name: 'Transport',
          type: 'expense'
        }
      ]
    },
    {
      id: 'expense-lifestyle',
      name: 'Styl życia',
      type: 'expense',
      categories: [
        {
          id: 'entertainment',
          name: 'Rozrywka',
          type: 'expense'
        },
        {
          id: 'shopping',
          name: 'Zakupy',
          type: 'expense'
        },
        {
          id: 'health',
          name: 'Zdrowie',
          type: 'expense'
        }
      ]
    },
    {
      id: 'income-main',
      name: 'Główne źródła dochodu',
      type: 'income',
      categories: [
        {
          id: 'salary',
          name: 'Wynagrodzenie',
          type: 'income'
        },
        {
          id: 'business',
          name: 'Działalność gospodarcza',
          type: 'income'
        }
      ]
    },
    {
      id: 'income-additional',
      name: 'Dodatkowe źródła dochodu',
      type: 'income',
      categories: [
        {
          id: 'investments',
          name: 'Inwestycje',
          type: 'income'
        },
        {
          id: 'gifts-received',
          name: 'Otrzymane prezenty',
          type: 'income'
        }
      ]
    },
    {
      id: 'transfer-group',
      name: 'Transfery',
      type: 'transfer',
      categories: [
        {
          id: 'account-transfer',
          name: 'Transfer między kontami',
          type: 'transfer'
        }
      ]
    }
  ];
};

// Symulacja lokalnej bazy danych
let categoryGroups: CategoryGroup[] = initializeCategories();

// Funkcja zapisująca kategorie do localStorage
const saveCategoriestoLocalStorage = () => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoryGroups));
  } catch (error) {
    console.error('Błąd podczas zapisywania kategorii do localStorage:', error);
  }
};

// Generowanie unikalnego ID
const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`;
};

// Pobieranie wszystkich grup kategorii
export const getAllCategoryGroups = (): Promise<CategoryGroup[]> => {
  return Promise.resolve([...categoryGroups]);
};

// Pobieranie grup kategorii według typu
export const getCategoryGroupsByType = (type: CategoryType): Promise<CategoryGroup[]> => {
  const filteredGroups = categoryGroups.filter(group => group.type === type);
  return Promise.resolve([...filteredGroups]);
};

// Pobieranie wszystkich kategorii
export const getAllCategories = (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCategories = categoryGroups.flatMap(group => group.categories);
      resolve([...allCategories]);
    }, 300);
  });
};

// Pobieranie kategorii według typu
export const getCategoriesByType = (type: CategoryType): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredCategories = categoryGroups
        .filter(group => group.type === type)
        .flatMap(group => group.categories);
      resolve([...filteredCategories]);
    }, 300);
  });
};



// Dodawanie nowej grupy kategorii
export const addCategoryGroup = (name: string, type: CategoryType): Promise<CategoryGroup> => {
  return new Promise((resolve) => {
    const newGroup: CategoryGroup = {
      id: generateId(`${type}-group-`),
      name,
      type,
      categories: []
    };
    
    categoryGroups = [...categoryGroups, newGroup];
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve({...newGroup});
    }, 300);
  });
};

// Dodawanie nowej kategorii
export const addCategory = (newCategory: NewCategory): Promise<Category> => {
  return new Promise((resolve, reject) => {
    const { name, type, groupId } = newCategory;
    
    // Znajdź grupę, do której dodać kategorię
    const groupIndex = groupId 
      ? categoryGroups.findIndex(group => group.id === groupId)
      : categoryGroups.findIndex(group => group.type === type);
    
    if (groupIndex === -1) {
      reject(new Error('Grupa kategorii nie została znaleziona'));
      return;
    }
    
    const category: Category = {
      id: generateId(`${type}-cat-`),
      name,
      type
    };
    
    const updatedGroup = {
      ...categoryGroups[groupIndex],
      categories: [...categoryGroups[groupIndex].categories, category]
    };
    
    categoryGroups = [
      ...categoryGroups.slice(0, groupIndex),
      updatedGroup,
      ...categoryGroups.slice(groupIndex + 1)
    ];
    
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve({...category});
    }, 300);
  });
};



// Usuwanie grupy kategorii
export const deleteCategoryGroup = (groupId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const groupIndex = categoryGroups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      reject(new Error('Grupa kategorii nie została znaleziona'));
      return;
    }
    
    categoryGroups = [
      ...categoryGroups.slice(0, groupIndex),
      ...categoryGroups.slice(groupIndex + 1)
    ];
    
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Usuwanie kategorii
export const deleteCategory = (categoryId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let foundGroup: CategoryGroup | undefined;
    let groupIndex = -1;
    let categoryIndex = -1;
    
    for (let i = 0; i < categoryGroups.length; i++) {
      const group = categoryGroups[i];
      const catIndex = group.categories.findIndex(cat => cat.id === categoryId);
      
      if (catIndex !== -1) {
        foundGroup = group;
        groupIndex = i;
        categoryIndex = catIndex;
        break;
      }
    }
    
    if (!foundGroup || groupIndex === -1 || categoryIndex === -1) {
      reject(new Error('Kategoria nie została znaleziona'));
      return;
    }
    
    const updatedGroup = {
      ...foundGroup,
      categories: [
        ...foundGroup.categories.slice(0, categoryIndex),
        ...foundGroup.categories.slice(categoryIndex + 1)
      ]
    };
    
    categoryGroups = [
      ...categoryGroups.slice(0, groupIndex),
      updatedGroup,
      ...categoryGroups.slice(groupIndex + 1)
    ];
    
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
};



// Aktualizacja grupy kategorii
export const updateCategoryGroup = (groupId: string, name: string): Promise<CategoryGroup> => {
  return new Promise((resolve, reject) => {
    const groupIndex = categoryGroups.findIndex(group => group.id === groupId);
    
    if (groupIndex === -1) {
      reject(new Error('Grupa kategorii nie została znaleziona'));
      return;
    }
    
    const updatedGroup = {
      ...categoryGroups[groupIndex],
      name
    };
    
    categoryGroups = [
      ...categoryGroups.slice(0, groupIndex),
      updatedGroup,
      ...categoryGroups.slice(groupIndex + 1)
    ];
    
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve({...updatedGroup});
    }, 300);
  });
};

// Aktualizacja kategorii
export const updateCategory = (categoryId: string, name: string): Promise<Category> => {
  return new Promise((resolve, reject) => {
    let foundGroup: CategoryGroup | undefined;
    let groupIndex = -1;
    let categoryIndex = -1;
    
    for (let i = 0; i < categoryGroups.length; i++) {
      const group = categoryGroups[i];
      const catIndex = group.categories.findIndex(cat => cat.id === categoryId);
      
      if (catIndex !== -1) {
        foundGroup = group;
        groupIndex = i;
        categoryIndex = catIndex;
        break;
      }
    }
    
    if (!foundGroup || groupIndex === -1 || categoryIndex === -1) {
      reject(new Error('Kategoria nie została znaleziona'));
      return;
    }
    
    const updatedCategory = {
      ...foundGroup.categories[categoryIndex],
      name
    };
    
    const updatedGroup = {
      ...foundGroup,
      categories: [
        ...foundGroup.categories.slice(0, categoryIndex),
        updatedCategory,
        ...foundGroup.categories.slice(categoryIndex + 1)
      ]
    };
    
    categoryGroups = [
      ...categoryGroups.slice(0, groupIndex),
      updatedGroup,
      ...categoryGroups.slice(groupIndex + 1)
    ];
    
    saveCategoriestoLocalStorage();
    
    setTimeout(() => {
      resolve({...updatedCategory});
    }, 300);
  });
};

