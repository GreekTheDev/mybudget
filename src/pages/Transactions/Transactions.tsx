import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Transaction, TransactionFormData } from '../../types/Transaction';
import { 
  getAllTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../../services/transactionService';
import { updateSpentAmounts, getAllBudgetCategories } from '../../services/budgetService';
import TransactionList from '../../components/transactions/TransactionList/TransactionList';
import TransactionModal from '../../components/transactions/TransactionModal/TransactionModal';
import styles from './Transactions.module.css';

const Transactions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(location.pathname === '/transactions/new');
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    categoryId: string;
    sectionName: string;
    sectionId: string;
  }>>([]);
  
  // Filtry
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });
  
  // Predefiniowane okresy czasowe
  const setDateRange = (days: number) => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);
    
    setFilters(prev => ({
      ...prev,
      dateFrom: fromDate.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    }));
  };
  
  // Ustawienie zakresu dla bieżącego tygodnia
  const setCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay() || 7; // Niedziela to 0, zmieniamy na 7
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay - 1));
    
    setFilters(prev => ({
      ...prev,
      dateFrom: monday.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0]
    }));
  };
  
  // Ustawienie zakresu dla poprzedniego tygodnia
  const setPreviousWeek = () => {
    const today = new Date();
    const currentDay = today.getDay() || 7; // Niedziela to 0, zmieniamy na 7
    
    const previousMonday = new Date(today);
    previousMonday.setDate(today.getDate() - (currentDay - 1) - 7);
    
    const previousSunday = new Date(previousMonday);
    previousSunday.setDate(previousMonday.getDate() + 6);
    
    setFilters(prev => ({
      ...prev,
      dateFrom: previousMonday.toISOString().split('T')[0],
      dateTo: previousSunday.toISOString().split('T')[0]
    }));
  };





  // Pobieranie transakcji
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAllTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania transakcji');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Pobieranie kategorii z budżetu
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getAllBudgetCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Błąd podczas pobierania kategorii:', err);
    }
  }, []);



  // Dodawanie transakcji
  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await addTransaction(data);
      
      // Aktualizacja wydatków w budżecie
      if (data.type === 'expense') {
        await updateSpentAmounts();
      }
      
      fetchTransactions();
      setIsModalOpen(false);
      // Jeśli jesteśmy na ścieżce /transactions/new, przekieruj z powrotem do /transactions
      if (location.pathname === '/transactions/new') {
        navigate('/transactions');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania transakcji');
      console.error(err);
    }
  };

  // Edycja transakcji
  const handleEditTransaction = async (id: string, data: TransactionFormData) => {
    try {
      await updateTransaction(id, data);
      
      // Aktualizacja wydatków w budżecie
      await updateSpentAmounts();
      
      fetchTransactions();
    } catch (err) {
      setError('Wystąpił błąd podczas edycji transakcji');
      console.error(err);
    }
  };

  // Usuwanie transakcji
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      try {
        await deleteTransaction(id);
        
        // Aktualizacja wydatków w budżecie
        await updateSpentAmounts();
        
        fetchTransactions();
      } catch (err) {
        setError('Wystąpił błąd podczas usuwania transakcji');
        console.error(err);
      }
    }
  };

  // Filtrowanie transakcji
  const applyFilters = useCallback(() => {
    let filtered = [...transactions];
    
    // Filtrowanie po typie
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    // Filtrowanie po kategorii
    if (filters.category) {
      filtered = filtered.filter(t => 
        t.category === filters.category
      );
    }
    
    // Filtrowanie po dacie od
    if (filters.dateFrom) {
      filtered = filtered.filter(t => 
        new Date(t.date) >= new Date(filters.dateFrom)
      );
    }
    
    // Filtrowanie po dacie do
    if (filters.dateTo) {
      filtered = filtered.filter(t => 
        new Date(t.date) <= new Date(filters.dateTo)
      );
    }
    
    // Filtrowanie po wyszukiwanym tekście
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  // Obsługa zmiany filtrów
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Czyszczenie filtrów
  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    });
  };

  // Pobieranie transakcji i kategorii przy pierwszym renderowaniu
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  // Aktualizacja filtrów
  useEffect(() => {
    applyFilters();
  }, [filters, transactions, applyFilters]);
  
  // Automatyczne otwieranie modalu na ścieżce /transactions/new
  useEffect(() => {
    if (location.pathname === '/transactions/new') {
      setIsModalOpen(true);
    }
  }, [location.pathname]);



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Transakcje</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Dodaj transakcję
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.filtersContainer}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="type">Typ</label>
              <select
                id="type"
                name="type"
                className={styles.filterSelect}
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">Wszystkie</option>
                <option value="income">Przychody</option>
                <option value="expense">Wydatki</option>
                <option value="transfer">Transfery</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="category">Kategoria</label>
              <select
                id="category"
                name="category"
                className={styles.filterSelect}
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup} style={{ flexGrow: 1 }}>
              <label className={styles.filterLabel} htmlFor="searchTerm">Opis</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                className={styles.filterInput}
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Szukaj w opisie lub kategorii"
              />
            </div>
            
            {(filters.type !== 'all' || filters.category || filters.dateFrom || filters.dateTo || filters.searchTerm) && (
              <button 
                className={styles.clearFilters}
                onClick={handleClearFilters}
              >
                Wyczyść
              </button>
            )}
          </div>
          
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="dateFrom">OD</label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                className={styles.filterInput}
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel} htmlFor="dateTo">DO</label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                className={styles.filterInput}
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className={styles.dateRangeButtons}>
              <button 
                className={styles.dateRangeButton} 
                onClick={setCurrentWeek}
              >
                Ten tydzień
              </button>
              <button 
                className={styles.dateRangeButton} 
                onClick={setPreviousWeek}
              >
                Poprzedni tydzień
              </button>
              <button 
                className={styles.dateRangeButton} 
                onClick={() => setDateRange(30)}
              >
                30 dni
              </button>
              <button 
                className={styles.dateRangeButton} 
                onClick={() => setDateRange(60)}
              >
                60 dni
              </button>
              <button 
                className={styles.dateRangeButton} 
                onClick={() => setDateRange(90)}
              >
                90 dni
              </button>
              <button 
                className={styles.dateRangeButton} 
                onClick={() => setDateRange(180)}
              >
                180 dni
              </button>
            </div>
          </div>
        </div>
      
      </div>

      {isLoading ? (
        <div className={styles.loading}>Ładowanie transakcji...</div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Jeśli jesteśmy na ścieżce /transactions/new, przekieruj z powrotem do /transactions
          if (location.pathname === '/transactions/new') {
            navigate('/transactions');
          }
        }}
        onSave={handleAddTransaction}
        mode="add"
      />
    </div>
  );
};

export default Transactions;