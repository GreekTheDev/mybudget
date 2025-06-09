import { useState } from 'react';
import styles from './DataManager.module.css';

const DataManager = () => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Klucze używane w aplikacji
  const appKeys = ['transactions', 'budget', 'accounts', 'categories'];

  const handleResetData = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      return;
    }

    try {
      // Usuwanie tylko kluczy używanych przez aplikację
      appKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      setResetStatus('success');
      setIsConfirmingReset(false);
      
      // Po 3 sekundach ukryj komunikat o sukcesie
      setTimeout(() => {
        setResetStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Błąd podczas resetowania danych:', error);
      setResetStatus('error');
      setIsConfirmingReset(false);
    }
  };

  const handleCancelReset = () => {
    setIsConfirmingReset(false);
  };

  return (
    <div className={styles.dataManager}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Resetowanie danych</h2>
        <p className={styles.description}>
          Resetowanie danych spowoduje usunięcie wszystkich wprowadzonych informacji, w tym:
        </p>
        <ul className={styles.dataList}>
          <li>Wszystkich transakcji</li>
          <li>Wszystkich budżetów i kategorii</li>
          <li>Wszystkich kont</li>
        </ul>
        <p className={styles.warning}>
          <strong>Uwaga:</strong> Ta operacja jest nieodwracalna. Po zresetowaniu danych, aplikacja
          powróci do stanu początkowego.
        </p>

        <div className={styles.actions}>
          {!isConfirmingReset ? (
            <button 
              className={styles.resetButton} 
              onClick={handleResetData}
            >
              Resetuj dane aplikacji
            </button>
          ) : (
            <div className={styles.confirmationBox}>
              <p className={styles.confirmationText}>
                Czy na pewno chcesz zresetować wszystkie dane? Ta operacja jest nieodwracalna.
              </p>
              <div className={styles.confirmationButtons}>
                <button 
                  className={styles.confirmButton} 
                  onClick={handleResetData}
                >
                  Tak, resetuj dane
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancelReset}
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>

        {resetStatus === 'success' && (
          <div className={styles.statusMessage + ' ' + styles.successMessage}>
            Dane zostały pomyślnie zresetowane. Odśwież stronę, aby zobaczyć zmiany.
          </div>
        )}

        {resetStatus === 'error' && (
          <div className={styles.statusMessage + ' ' + styles.errorMessage}>
            Wystąpił błąd podczas resetowania danych. Spróbuj ponownie.
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eksport i import danych</h2>
        <p className={styles.comingSoon}>
          Funkcja eksportu i importu danych będzie dostępna wkrótce.
        </p>
      </section>
    </div>
  );
};

export default DataManager;