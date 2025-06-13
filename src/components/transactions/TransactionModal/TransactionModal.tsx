import { useState, useEffect } from 'react';
import type { Transaction, TransactionFormData } from '../../../types/Transaction';
import { getAccounts } from '../../../services/accountService';
import type { Account } from '../../../types/Account';
import type { Category, CategoryGroup, CategoryType } from '../../../types/Category';
import { getCategoryGroupsByType } from '../../../services/categoryService';
import { getAllBudgetCategories } from '../../../services/budgetService';
import styles from './TransactionModal.module.css';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  transaction?: Transaction;
  mode: 'add' | 'edit';
}

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  transaction, 
  mode 
}: TransactionModalProps) => {
  const [formData, setFormData] = useState<TransactionFormData & { account?: string }>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    category: '',
    type: 'expense',
    account: ''
  });
  
  // Dodatkowe pole dla transferu - konto docelowe
  const [targetAccount, setTargetAccount] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amountFocused, setAmountFocused] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  // Pobieranie kont i kategorii przy montowaniu komponentu
  useEffect(() => {
    const fetchData = async () => {
      // Pobieranie kont
      const accountsList = getAccounts();
      setAccounts(accountsList);
      
      // Jeśli mamy konta i nie wybrano jeszcze żadnego, ustaw pierwsze jako domyślne
      if (accountsList.length > 0 && !formData.account) {
        setFormData(prev => ({
          ...prev,
          account: accountsList[0].id
        }));
      }
      
      // Pobieranie kategorii według typu transakcji
      try {
        // Pobieramy kategorie z budżetu zamiast z serwisu kategorii
        const budgetCategories = await getAllBudgetCategories();
        
        // Tworzymy grupy kategorii na podstawie danych z budżetu
        const groups: CategoryGroup[] = [];
        
        // Grupujemy kategorie według sekcji budżetu
        const sectionGroups: Record<string, Category[]> = {};
        
        budgetCategories.forEach(item => {
          if (!sectionGroups[item.sectionId]) {
            sectionGroups[item.sectionId] = [];
          }
          
          // Tworzymy kategorię na podstawie elementu budżetu
          const category: Category = {
            id: item.id,
            name: item.name,
            type: formData.type as CategoryType
          };
          
          sectionGroups[item.sectionId].push(category);
        });
        
        // Tworzymy grupy kategorii na podstawie sekcji budżetu
        Object.entries(sectionGroups).forEach(([sectionId, categories]) => {
          const sectionName = categories.length > 0 ? 
            budgetCategories.find(item => item.sectionId === sectionId)?.sectionName || 'Sekcja budżetu' : 
            'Sekcja budżetu';
            
          groups.push({
            id: sectionId,
            name: sectionName,
            type: formData.type as CategoryType,
            categories
          });
        });
        
        setCategoryGroups(groups);
        
        // Jeśli nie ma kategorii z budżetu, pobieramy z serwisu kategorii
        if (groups.length === 0) {
          const defaultGroups = await getCategoryGroupsByType(formData.type);
          setCategoryGroups(defaultGroups);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
        
        // W przypadku błędu, pobieramy kategorie z serwisu kategorii
        try {
          const groups = await getCategoryGroupsByType(formData.type);
          setCategoryGroups(groups);
        } catch (fallbackError) {
          console.error('Błąd podczas pobierania kategorii z serwisu kategorii:', fallbackError);
        }
      }
    };
    
    fetchData();
  }, [formData.type, formData.account]);

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        date: transaction.date.split('T')[0],
        amount: Math.abs(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        account: transaction.account
      });
    }
  }, [transaction, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Data jest wymagana';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Kwota musi być większa od zera';
    }

    // Opis nie jest już wymagany

    // Dla transferów sprawdzamy konto docelowe zamiast kategorii
    if (formData.type === 'transfer') {
      if (!targetAccount) {
        newErrors.category = 'Konto docelowe jest wymagane';
      }
      
      if (targetAccount === formData.account) {
        newErrors.targetAccount = 'Konto docelowe musi być inne niż konto źródłowe';
      }
    } else {
      // Dla innych typów transakcji sprawdzamy kategorię
      if (!formData.category?.trim()) {
        newErrors.category = 'Kategoria jest wymagana';
      }
    }

    if (!formData.account?.trim()) {
      newErrors.account = 'Konto jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aktualizuj dane formularza
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTypeChange = async (type: 'income' | 'expense' | 'transfer') => {
    // Aktualizuj typ transakcji
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Resetuj kategorię, bo zmieniamy typ
    }));
    
    // Resetuj konto docelowe przy zmianie typu
    setTargetAccount('');
    
    // Dla transferów nie potrzebujemy pobierać kategorii
    if (type === 'transfer') {
      setCategoryGroups([]);
      return;
    }
    
    // Pobierz kategorie dla nowego typu
    try {
      // Pobieramy kategorie z budżetu
      const budgetCategories = await getAllBudgetCategories();
      
      // Tworzymy grupy kategorii na podstawie danych z budżetu
      const groups: CategoryGroup[] = [];
      
      // Grupujemy kategorie według sekcji budżetu
      const sectionGroups: Record<string, Category[]> = {};
      
      budgetCategories.forEach(item => {
        if (!sectionGroups[item.sectionId]) {
          sectionGroups[item.sectionId] = [];
        }
        
        // Tworzymy kategorię na podstawie elementu budżetu
        const category: Category = {
          id: item.id,
          name: item.name,
          type: type as CategoryType
        };
        
        sectionGroups[item.sectionId].push(category);
      });
      
      // Tworzymy grupy kategorii na podstawie sekcji budżetu
      Object.entries(sectionGroups).forEach(([sectionId, categories]) => {
        const sectionName = categories.length > 0 ? 
          budgetCategories.find(item => item.sectionId === sectionId)?.sectionName || 'Sekcja budżetu' : 
          'Sekcja budżetu';
          
        groups.push({
          id: sectionId,
          name: sectionName,
          type: type as CategoryType,
          categories
        });
      });
      
      setCategoryGroups(groups);
      
      // Jeśli nie ma kategorii z budżetu, pobieramy z serwisu kategorii
      if (groups.length === 0) {
        const defaultGroups = await getCategoryGroupsByType(type);
        setCategoryGroups(defaultGroups);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania kategorii z budżetu:', error);
      
      // W przypadku błędu, pobieramy kategorie z serwisu kategorii
      try {
        const groups = await getCategoryGroupsByType(type);
        setCategoryGroups(groups);
      } catch (fallbackError) {
        console.error('Błąd podczas pobierania kategorii z serwisu kategorii:', fallbackError);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Dla transferów, używamy targetAccount jako kategorii
      if (formData.type === 'transfer') {
        const transferData = {
          ...formData,
          category: targetAccount, // Używamy targetAccount jako kategorii dla transferu
          description: formData.description || `Transfer z ${accounts.find(a => a.id === formData.account)?.name || ''} do ${accounts.find(a => a.id === targetAccount)?.name || ''}`
        };
        onSave(transferData);
      } else {
        // Dla wydatków i przychodów, jeśli nie ma opisu, dodajemy domyślny
        const finalData = {
          ...formData,
          description: formData.description || (formData.type === 'income' ? 'Przychód' : 'Wydatek')
        };
        onSave(finalData);
      }
    }
  };

  // Funkcja addItem została usunięta, ponieważ nie jest już potrzebna

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('pl-PL', options);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'add' ? 'Dodaj transakcję' : 'Edytuj transakcję'}
          </h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.typeButtonsContainer}>
            <button 
              type="button"
              className={`${styles.typeButton} ${styles.incomeButton} ${formData.type === 'income' ? styles.active : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              Przychód
            </button>
            <button 
              type="button"
              className={`${styles.typeButton} ${styles.transferButton} ${formData.type === 'transfer' ? styles.active : ''}`}
              onClick={() => handleTypeChange('transfer')}
            >
              Transfer
            </button>
            <button 
              type="button"
              className={`${styles.typeButton} ${styles.expenseButton} ${formData.type === 'expense' ? styles.active : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              Wydatek
            </button>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formColumn} style={{ width: '45%' }}>
              <label className={styles.label} htmlFor="account">Konto</label>
              <select
                id="account"
                name="account"
                className={`${styles.select} ${styles.accountSelect}`}
                value={formData.account}
                onChange={handleChange}
              >
                <option value="">Wybierz konto</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {errors.account && <p className={styles.error}>{errors.account}</p>}
            </div>
            <div className={styles.formColumn} style={{ width: '55%' }}>
              <label className={styles.label} htmlFor="amount">Kwota</label>
              <div className={styles.amountInputContainer}>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className={styles.input}
                  value={formData.amount || ''}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                />
                {!amountFocused && formData.amount > 0 && <span className={styles.currency}>PLN</span>}
              </div>
              {errors.amount && <p className={styles.error}>{errors.amount}</p>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formColumn} style={{ width: '100%' }}>
              {formData.type === 'transfer' ? (
                <>
                  <label className={styles.label} htmlFor="targetAccount">Konto docelowe</label>
                  <select
                    id="targetAccount"
                    name="targetAccount"
                    className={styles.select}
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                  >
                    <option value="">Wybierz konto docelowe</option>
                    {accounts
                      .filter(account => account.id !== formData.account) // Filtrujemy, aby nie pokazywać aktualnego konta
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))
                    }
                  </select>
                  {errors.targetAccount && <p className={styles.error}>{errors.targetAccount}</p>}
                  {errors.category && <p className={styles.error}>{errors.category}</p>}
                </>
              ) : (
                <>
                  <label className={styles.label} htmlFor="category">Kategoria</label>
                  <select
                    id="category"
                    name="category"
                    className={styles.select}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Wybierz kategorię</option>
                    {categoryGroups.length > 0 ? (
                      // Grupowanie kategorii według grup
                      categoryGroups.map(group => (
                        <optgroup key={group.id} label={group.name}>
                          {group.categories.map(category => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    ) : (
                      // Komunikat, jeśli nie ma kategorii
                      <option value="" disabled>Brak dostępnych kategorii</option>
                    )}
                  </select>
                  {errors.category && <p className={styles.error}>{errors.category}</p>}
                </>
              )}
            </div>
          </div>

          {/* Przycisk "Dodaj pozycję" został usunięty */}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">Opis</label>
            <input
              type="text"
              id="description"
              name="description"
              className={styles.input}
              value={formData.description}
              onChange={handleChange}
              maxLength={100}
              placeholder="Dodaj opis transakcji"
            />
            {errors.description && <p className={styles.error}>{errors.description}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Data</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  date: e.target.value
                }));
              }}
              className={styles.input}
            />
            {errors.date && <p className={styles.error}>{errors.date}</p>}
          </div>

          <button 
            type="submit" 
            className={styles.saveButton}
          >
            Zapisz
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;