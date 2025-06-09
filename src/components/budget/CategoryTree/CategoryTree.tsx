import { useState, useEffect } from 'react';
import { getAllCategories } from '../../../services/categoryService';
import type { Category } from '../../../types/Category';
import styles from './CategoryTree.module.css';

interface CategoryTreeProps {
  onAddSubcategory?: (categoryId: string, name: string) => void;
}

const CategoryTree = ({ onAddSubcategory }: CategoryTreeProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const allCategories = await getAllCategories();
        
        // Filtrujemy tylko kategorie typu 'expense'
        const expenseCategories = allCategories.filter(cat => cat.type === 'expense');
        
        // Domyślnie rozwijamy wszystkie kategorie
        const expanded: Record<string, boolean> = {};
        expenseCategories.forEach(cat => {
          expanded[cat.id] = true;
        });
        
        setCategories(expenseCategories);
        setExpandedCategories(expanded);
        setError(null);
      } catch (err) {
        setError('Błąd podczas pobierania kategorii');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (newSubcategoryName.trim() && onAddSubcategory) {
      await onAddSubcategory(categoryId, newSubcategoryName);
      setNewSubcategoryName('');
      setAddingSubcategoryFor(null);
      
      // Odświeżamy kategorie po dodaniu subkategorii
      try {
        const allCategories = await getAllCategories();
        const expenseCategories = allCategories.filter(cat => cat.type === 'expense');
        setCategories(expenseCategories);
      } catch (err) {
        console.error('Błąd podczas odświeżania kategorii:', err);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Ładowanie kategorii...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.categoryTree}>
      <h3 className={styles.title}>Kategorie i podkategorie</h3>
      
      {categories.length === 0 ? (
        <p className={styles.emptyMessage}>Brak kategorii wydatków.</p>
      ) : (
        <ul className={styles.categoryList}>
          {categories.map(category => (
            <li key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <button 
                  className={styles.toggleButton}
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={expandedCategories[category.id]}
                >
                  {expandedCategories[category.id] ? '▼' : '►'}
                </button>
                <span className={styles.categoryName}>{category.name}</span>
                <button 
                  className={styles.addButton}
                  onClick={() => setAddingSubcategoryFor(category.id)}
                  title="Dodaj podkategorię"
                >
                  +
                </button>
              </div>
              
              {addingSubcategoryFor === category.id && (
                <div className={styles.addSubcategoryForm}>
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Nazwa podkategorii"
                    className={styles.input}
                    autoFocus
                  />
                  <div className={styles.formActions}>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleAddSubcategory(category.id)}
                    >
                      Dodaj
                    </button>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => {
                        setAddingSubcategoryFor(null);
                        setNewSubcategoryName('');
                      }}
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              )}
              

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryTree;