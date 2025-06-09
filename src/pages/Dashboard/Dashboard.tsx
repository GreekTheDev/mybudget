import { useState, useEffect, useCallback } from 'react';
import type { Account } from '../../types/Account';
import type { BudgetData } from '../../types/Budget';
import type { Transaction } from '../../types/Transaction';
import { getAccounts } from '../../services/accountService';
import { getBudgetData } from '../../services/budgetService';
import { getAllTransactions } from '../../services/transactionService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Stan dla danych
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    month: new Date(),
    sections: [],
    totalBudget: 0,
    availableBudget: 0
  });
  // Usunięto nieużywaną zmienną stanu dla transakcji
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Podsumowanie
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  // Obliczanie podsumowania
  const calculateSummary = useCallback((transactionsData: Transaction[], accountsData: Account[]) => {
    const income = transactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = transactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Obliczanie sumy sald kont, które mają być uwzględniane w budżecie
    const totalAccountBalance = accountsData
      .filter(account => account.includeInBudget)
      .reduce((sum, account) => sum + account.balance, 0);
      
    setSummary({
      income,
      expense,
      balance: totalAccountBalance // Używamy salda kont jako bilansu
    });
  }, []);

  // Pobieranie danych
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Pobieranie kont
      const accountsData = getAccounts();
      setAccounts(accountsData);
      
      // Pobieranie danych budżetu
      const budget = await getBudgetData();
      setBudgetData(budget);
      
      // Pobieranie transakcji
      const transactionsData = await getAllTransactions();
      
      // Obliczanie podsumowania z uwzględnieniem sald kont
      calculateSummary(transactionsData, accountsData);
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania danych');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummary]);

  // Formatowanie kwoty
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  // Pobieranie danych przy pierwszym renderowaniu
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funkcja do określania koloru paska postępu
  const getProgressBarColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    
    if (percentage >= 100) {
      return styles.progressDanger;
    } else if (percentage >= 80) {
      return styles.progressWarning;
    } else {
      return styles.progressNormal;
    }
  };

  // Funkcja do pobierania nazwy typu konta
  const getAccountTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
      personal: 'Konto osobiste',
      credit: 'Karta kredytowa',
      savings: 'Konto oszczędnościowe',
      foreign: 'Konto walutowe',
      virtual: 'Konto wirtualne',
      prepaid: 'Karta prepaid'
    };
    return typeNames[type] || type;
  };
  


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Ładowanie danych...</div>
      ) : (
        <>
          {/* Sekcja podsumowania */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Przychody</h3>
              <p className={`${styles.summaryValue} ${styles.income}`}>
                {formatAmount(summary.income)}
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Wydatki</h3>
              <p className={`${styles.summaryValue} ${styles.expense}`}>
                {formatAmount(summary.expense)}
              </p>
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Bilans</h3>
              <p className={`${styles.summaryValue} ${styles.balance}`}>
                {formatAmount(summary.balance)}
              </p>
            </div>
          </div>

          {/* Sekcja kont */}
          <div className={styles.accountsSection}>
            <h2 className={styles.sectionTitle}>Konta</h2>
            {accounts.length === 0 ? (
              <p>Nie masz jeszcze żadnych kont. Dodaj swoje konta aby rozpocząć zarządzanie finansami.</p>
            ) : (
              <div className={styles.accountsGrid}>
                {accounts.map(account => (
                  <div 
                    key={account.id} 
                    className={`${styles.accountCard} ${styles[`accountColor${account.color.charAt(0).toUpperCase() + account.color.slice(1)}`]} ${!account.includeInBudget ? styles.accountExcluded : ''}`}
                  >
                    <h3 className={styles.accountName}>{account.name}</h3>
                    <p className={styles.accountBalance}>
                      {formatAmount(account.balance)}
                    </p>
                    <div className={styles.accountDetails}>
                      <p className={styles.accountType}>
                        {getAccountTypeName(account.type)}
                      </p>
                      {!account.includeInBudget && (
                        <p className={styles.accountExcludedNote}>
                          Nie uwzględniane w budżecie
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sekcja kategorii budżetu */}
          <div className={styles.budgetSection}>
            <h2 className={styles.sectionTitle}>Kategorie budżetu</h2>
            {budgetData.sections.length === 0 ? (
              <p>Nie masz jeszcze żadnych kategorii budżetu. Przejdź do zakładki budżet i wybierz szablon!</p>
            ) : (
              <div className={styles.budgetGrid}>
                {budgetData.sections.flatMap(section => 
                  section.items.map(item => (
                    <div key={item.id} className={`${styles.categoryCard} ${item.spent > item.amount ? styles.categoryCardOverBudget : ''}`}>
                      <h3 className={styles.categoryName}>
                        {item.name}
                        {item.spent > item.amount && (
                          <span className={styles.budgetAlert}>
                            <span className={styles.alertIcon}>!</span>
                          </span>
                        )}
                      </h3>
                      <p className={styles.categoryBudget}>
                        {formatAmount(item.amount)}
                      </p>
                      <p className={styles.categorySpent}>
                        Wydano: {formatAmount(item.spent)}
                      </p>
                      <div className={styles.progressWrapper}>
                        <div className={styles.progressContainer}>
                          <div 
                            className={`${styles.progressBar} ${getProgressBarColor(item.spent, item.amount)}`}
                            style={{ width: `${Math.min((item.spent / item.amount) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`${styles.progressPercentage} ${item.spent > item.amount ? styles.percentageOverBudget : ''}`}>
                          {Math.round((item.spent / item.amount) * 100)}%
                        </span>
                      </div>
                      {item.spent > item.amount && (
                        <p className={styles.overBudgetAlert}>Przekroczono budżet!</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;