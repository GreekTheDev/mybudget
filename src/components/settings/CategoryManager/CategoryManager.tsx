import { useState, useEffect } from 'react';
import type { CategoryGroup, CategoryType } from '../../../types/Category';
import { 
  getAllCategoryGroups, 
  addCategoryGroup, 
  addCategory,

  deleteCategoryGroup,
  deleteCategory
} from '../../../services/categoryService';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stany dla formularzy
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Dane formularzy
  const [newGroupName, setNewGroupName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Pobieranie grup kategorii
  useEffect(() => {
    const fetchCategoryGroups = async () => {
      try {
        setLoading(true);
        const groups = await getAllCategoryGroups();
        setCategoryGroups(groups);
        setError(null);
      } catch (err) {
        setError('Błąd podczas pobierania kategorii');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryGroups();
  }, []);
  
  // Filtrowanie grup kategorii według aktywnej zakładki
  const filteredGroups = categoryGroups.filter(group => group.type === activeTab);
  
  // Obsługa dodawania nowej grupy
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError('Nazwa grupy nie może być pusta');
      return;
    }
    
    try {
      const newGroup = await addCategoryGroup(newGroupName, activeTab);
      setCategoryGroups([...categoryGroups, newGroup]);
      setNewGroupName('');
      setShowGroupForm(false);
      setError(null);
    } catch (err) {
      setError('Błąd podczas dodawania grupy');
      console.error(err);
    }
  };
  
  // Obsługa dodawania nowej kategorii
  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !selectedGroupId) {
      setError('Nazwa kategorii nie może być pusta i musisz wybrać grupę');
      return;
    }
    
    try {
      const newCategory = await addCategory({
        name: newCategoryName,
        type: activeTab,
        groupId: selectedGroupId
      });
      
      // Aktualizuj stan
      const updatedGroups = categoryGroups.map(group => {
        if (group.id === selectedGroupId) {
          return {
            ...group,
            categories: [...group.categories, newCategory]
          };
        }
        return group;
      });
      
      setCategoryGroups(updatedGroups);
      setNewCategoryName('');
      setShowCategoryForm(false);
      setError(null);
    } catch (err) {
      setError('Błąd podczas dodawania kategorii');
      console.error(err);
    }
  };
  

  
  // Obsługa usuwania grupy
  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę grupę? Wszystkie kategorie i subkategorie w tej grupie również zostaną usunięte.')) {
      return;
    }
    
    try {
      await deleteCategoryGroup(groupId);
      
      // Aktualizuj stan
      setCategoryGroups(categoryGroups.filter(group => group.id !== groupId));
      setError(null);
    } catch (err) {
      setError('Błąd podczas usuwania grupy');
      console.error(err);
    }
  };
  
  // Obsługa usuwania kategorii
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę kategorię? Wszystkie subkategorie w tej kategorii również zostaną usunięte.')) {
      return;
    }
    
    try {
      await deleteCategory(categoryId);
      
      // Aktualizuj stan
      const updatedGroups = categoryGroups.map(group => ({
        ...group,
        categories: group.categories.filter(category => category.id !== categoryId)
      }));
      
      setCategoryGroups(updatedGroups);
      setError(null);
    } catch (err) {
      setError('Błąd podczas usuwania kategorii');
      console.error(err);
    }
  };
  

  
  if (loading) {
    return <div className={styles.loading}>Ładowanie kategorii...</div>;
  }
  
  return (
    <div className={styles.categoryManager}>
      <h2 className={styles.title}>Zarządzanie kategoriami</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'expense' ? styles.active : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          Wydatki
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'income' ? styles.active : ''}`}
          onClick={() => setActiveTab('income')}
        >
          Przychody
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'transfer' ? styles.active : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfery
        </button>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.addButton}
          onClick={() => {
            setShowGroupForm(true);
            setShowCategoryForm(false);
          }}
        >
          + Dodaj grupę
        </button>
        <button 
          className={styles.addButton}
          onClick={() => {
            setShowGroupForm(false);
            setShowCategoryForm(true);
          }}
        >
          + Dodaj kategorię
        </button>
      </div>
      
      {/* Formularz dodawania grupy */}
      {showGroupForm && (
        <div className={styles.form}>
          <h3>Dodaj nową grupę</h3>
          <div className={styles.formGroup}>
            <label htmlFor="groupName">Nazwa grupy:</label>
            <input
              type="text"
              id="groupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nazwa grupy"
            />
          </div>
          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setShowGroupForm(false);
                setNewGroupName('');
              }}
            >
              Anuluj
            </button>
            <button 
              className={styles.saveButton}
              onClick={handleAddGroup}
            >
              Dodaj
            </button>
          </div>
        </div>
      )}
      
      {/* Formularz dodawania kategorii */}
      {showCategoryForm && (
        <div className={styles.form}>
          <h3>Dodaj nową kategorię</h3>
          <div className={styles.formGroup}>
            <label htmlFor="groupSelect">Grupa:</label>
            <select
              id="groupSelect"
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">Wybierz grupę</option>
              {filteredGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryName">Nazwa kategorii:</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nazwa kategorii"
            />
          </div>
          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => {
                setShowCategoryForm(false);
                setNewCategoryName('');
                setSelectedGroupId(null);
              }}
            >
              Anuluj
            </button>
            <button 
              className={styles.saveButton}
              onClick={handleAddCategory}
            >
              Dodaj
            </button>
          </div>
        </div>
      )}
      

      
      {/* Lista kategorii */}
      <div className={styles.categoryList}>
        {filteredGroups.length === 0 ? (
          <p className={styles.emptyMessage}>
            Brak grup kategorii dla {activeTab === 'expense' ? 'wydatków' : activeTab === 'income' ? 'przychodów' : 'transferów'}.
          </p>
        ) : (
          filteredGroups.map(group => (
            <div key={group.id} className={styles.categoryGroup}>
              <div className={styles.groupHeader}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteGroup(group.id)}
                  title="Usuń grupę"
                >
                  ✕
                </button>
              </div>
              
              {group.categories.length === 0 ? (
                <p className={styles.emptyMessage}>Brak kategorii w tej grupie.</p>
              ) : (
                <ul className={styles.categories}>
                  {group.categories.map(category => (
                    <li key={category.id} className={styles.category}>
                      <div className={styles.categoryHeader}>
                        <h4 className={styles.categoryName}>{category.name}</h4>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteCategory(category.id)}
                          title="Usuń kategorię"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;