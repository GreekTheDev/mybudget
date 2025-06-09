import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Transaction, TransactionFormData } from '../../types/Transaction';
import { 
  getAllTransactions, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../../services/transactionService';
import { updateSpentAmounts } from '../../services/budgetService';
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
  
  // Filtry
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });





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
        t.category.toLowerCase().includes(filters.category.toLowerCase())
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

  // Pobieranie transakcji przy pierwszym renderowaniu
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="type">Typ:</label>
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
          <label className={styles.filterLabel} htmlFor="category">Kategoria:</label>
          <input
            type="text"
            id="category"
            name="category"
            className={styles.filterInput}
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Filtruj po kategorii"
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="dateFrom">Od:</label>
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
          <label className={styles.filterLabel} htmlFor="dateTo">Do:</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            className={styles.filterInput}
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="searchTerm">Szukaj:</label>
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
            Wyczyść filtry
          </button>
        )}
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