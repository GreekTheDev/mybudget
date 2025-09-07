'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

interface BudgetSubcategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
  subcategories: BudgetSubcategory[];
}

const mockCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Żywność',
    planned: 800,
    spent: 650,
    color: '#ef4444',
    subcategories: [
      { id: '1-1', name: 'Zakupy spożywcze', planned: 500, spent: 420, color: '#ef4444' },
      { id: '1-2', name: 'Restauracje', planned: 200, spent: 180, color: '#ef4444' },
      { id: '1-3', name: 'Fast food', planned: 100, spent: 50, color: '#ef4444' },
    ],
  },
  {
    id: '2',
    name: 'Transport',
    planned: 300,
    spent: 280,
    color: '#3b82f6',
    subcategories: [
      { id: '2-1', name: 'Paliwo', planned: 200, spent: 190, color: '#3b82f6' },
      { id: '2-2', name: 'Bilety komunikacji', planned: 100, spent: 90, color: '#3b82f6' },
    ],
  },
  {
    id: '3',
    name: 'Rozrywka',
    planned: 500,
    spent: 750,
    color: '#8b5cf6',
    subcategories: [
      { id: '3-1', name: 'Kino', planned: 150, spent: 200, color: '#8b5cf6' },
      { id: '3-2', name: 'Gry', planned: 200, spent: 300, color: '#8b5cf6' },
      { id: '3-3', name: 'Sport', planned: 150, spent: 250, color: '#8b5cf6' },
    ],
  },
  {
    id: '4',
    name: 'Ubrania',
    planned: 200,
    spent: 150,
    color: '#f59e0b',
    subcategories: [
      { id: '4-1', name: 'Odzież', planned: 150, spent: 120, color: '#f59e0b' },
      { id: '4-2', name: 'Obuwie', planned: 50, spent: 30, color: '#f59e0b' },
    ],
  },
  {
    id: '5',
    name: 'Zdrowie',
    planned: 100,
    spent: 80,
    color: '#10b981',
    subcategories: [
      { id: '5-1', name: 'Leki', planned: 60, spent: 50, color: '#10b981' },
      { id: '5-2', name: 'Wizyty lekarskie', planned: 40, spent: 30, color: '#10b981' },
    ],
  },
];

export default function Budget() {
  const [categories] = useState<BudgetCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getProgressPercentage = (spent: number, planned: number) => {
    return Math.min((spent / planned) * 100, 100);
  };

  const getProgressColor = (spent: number, planned: number) => {
    const percentage = (spent / planned) * 100;
    if (percentage <= 80) return 'bg-green-500';
    if (percentage <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      
      // If clicking on an already expanded category, close it
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        // Close all other categories and open the selected one
        newSet.clear();
        newSet.add(categoryId);
        
        // Smooth scroll to the selected category after a short delay
        setTimeout(() => {
          const element = document.getElementById(`category-${categoryId}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
      
      return newSet;
    });
  };

  useEffect(() => {
    const checkLayoutMode = () => {
      const width = window.innerWidth;
      
      // Simplified logic - only check overflow on specific breakpoints
      const isVeryNarrow = width < 1100;
      const isTooNarrow = width < 1200 && width > 1024;
      
      // Only check for element overflow if we're in the problematic range
      let isOverlapping = false;
      if (width >= 1024 && width <= 1200) {
        const categoriesList = document.querySelector('[data-categories-list]');
        const detailsPanel = document.querySelector('[data-details-panel]');
        
        if (categoriesList && detailsPanel) {
          const categoriesRect = categoriesList.getBoundingClientRect();
          const detailsRect = detailsPanel.getBoundingClientRect();
          isOverlapping = categoriesRect.right > detailsRect.left - 20;
        }
      }
      
      // Determine layout mode based on width and overflow detection
      if (width < 768 || isVeryNarrow) {
        setLayoutMode('mobile');
        setIsMobile(true);
      } else if (width < 1024 || isTooNarrow || isOverlapping) {
        setLayoutMode('tablet');
        setIsMobile(false);
      } else {
        setLayoutMode('desktop');
        setIsMobile(false);
      }
    };

    // Initial check
    checkLayoutMode();
    
    // More aggressive debouncing for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkLayoutMode, 200); // Increased debounce time
    };

    window.addEventListener('resize', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Budżet</h1>
          <button
            onClick={() => {/* TODO: Add budget category functionality */}}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Dodaj grupę
          </button>
        </div>

        <div className={`grid gap-8 ${
          layoutMode === 'mobile' 
            ? 'grid-cols-1' 
            : layoutMode === 'tablet' 
            ? 'grid-cols-1 xl:grid-cols-3' 
            : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {/* Categories List */}
          <div className={`${layoutMode === 'mobile' ? 'col-span-1' : layoutMode === 'tablet' ? 'col-span-1 xl:col-span-2' : 'lg:col-span-2'}`} data-categories-list>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Grupy budżetowe</h2>
            <div className="space-y-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  id={`category-${category.id}`}
                  className=" border border-border rounded-lg p-6 cursor-pointer hover:bg-opacity-80 transition-colors"
                  onClick={(e) => {
                    // On mobile/tablet, toggle expansion; on desktop, select category
                    if (layoutMode === 'mobile' || layoutMode === 'tablet') {
                      e.preventDefault();
                      toggleCategoryExpansion(category.id);
                    } else {
                      setSelectedCategory(category);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-foreground">{category.name}</h3>
                    <div className="text-right">
                      <p className="text-sm text-secondary">Wydano / Zaplanowano</p>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(category.spent)} / {formatCurrency(category.planned)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-secondary mb-1">
                      <span>Postęp</span>
                      <span>{getProgressPercentage(category.spent, category.planned).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200  rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(category.spent, category.planned)}`}
                        style={{ width: `${getProgressPercentage(category.spent, category.planned)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${category.spent > category.planned ? 'text-red-500' : 'text-green-600'}`}>
                      {category.spent > category.planned 
                        ? `Przekroczono o ${formatCurrency(category.spent - category.planned)}`
                        : `Pozostało ${formatCurrency(category.planned - category.spent)}`
                      }
                    </span>
                  </div>

                  {/* Mobile/Tablet: Show subcategories when expanded */}
                  <div className={`${layoutMode === 'desktop' ? 'hidden' : ''} transition-all duration-300 overflow-hidden ${
                    expandedCategories.has(category.id) ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-foreground">Kategorie</p>
                        <button className="text-sm text-secondary border border-border px-2 py-1 rounded transition-colors pointer-cursor ">
                          Dodaj kategorię
                        </button>
                      </div>
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center justify-between rounded pb-1">
                            <span className="text-sm text-foreground">{subcategory.name}</span>
                            <span className="text-sm text-secondary">
                              {formatCurrency(subcategory.spent)} / {formatCurrency(subcategory.planned)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Details - Responsive visibility */}
          <div className={`${layoutMode === 'mobile' ? 'hidden' : layoutMode === 'tablet' ? 'hidden xl:block xl:col-span-1' : 'hidden lg:block lg:col-span-1'}`} data-details-panel>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Szczegóły</h2>
            {selectedCategory ? (
              <div className=" border border-border rounded-lg p-6">
                {/* 1. Title */}
                <h3 className="text-lg font-semibold mb-4 text-foreground">{selectedCategory.name}</h3>
                
                {/* 2. Progress */}
                <div className="mb-4">
                  <p className="text-sm text-secondary mb-2">Postęp</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getProgressColor(selectedCategory.spent, selectedCategory.planned)}`}
                      style={{ width: `${getProgressPercentage(selectedCategory.spent, selectedCategory.planned)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-secondary mt-1">
                    {getProgressPercentage(selectedCategory.spent, selectedCategory.planned).toFixed(0)}% wykorzystano
                  </p>
                </div>
                
                {/* 3. Planned, Spent, Left in a row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-secondary mb-1">Zaplanowano</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCategory.planned)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary mb-1">Wydano</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(selectedCategory.spent)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary mb-1">Pozostało</p>
                    <p className={`text-lg font-bold ${selectedCategory.spent > selectedCategory.planned ? 'text-red-500' : 'text-green-600'}`}>
                      {formatCurrency(selectedCategory.planned - selectedCategory.spent)}
                    </p>
                  </div>
                </div>
                
                {/* 4. Subcategories */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Kategorie</p>
                    <button className="text-sm text-secondary border border-border hover:bg-gray-200 px-2 py-1 rounded transition-colors pointer-cursor">
                      Dodaj kategorię
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedCategory.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between rounded pb-1">
                        <span className="text-sm text-foreground">{subcategory.name}</span>
                        <span className="text-sm text-secondary">
                          {formatCurrency(subcategory.spent)} / {formatCurrency(subcategory.planned)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className=" border border-border rounded-lg p-6">
                <p className="text-secondary text-center">Wybierz kategorię, aby zobaczyć szczegóły</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
