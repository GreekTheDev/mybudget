import { useState, useEffect } from 'react';
import type {
    BudgetData,
    BudgetFormData,
    BudgetSectionFormData
} from '../../types/Budget';
import type { Account } from '../../types/Account';
import { 
  getBudgetData, 
  setBudgetMonth, 
  addBudgetSection, 
  updateBudgetSection, 
  deleteBudgetSection, 
  addBudgetItem, 
  updateBudgetItem, 
  deleteBudgetItem, 
  reorderBudgetSections, 
  reorderBudgetItems,
  updateSpentAmounts,
  setAvailableBudget,
  hasSelectedBudgetTemplate,
  createBudgetFromTemplate
} from '../../services/budgetService';
import { getAccounts } from '../../services/accountService';
import { budgetTemplates } from '../../data/budgetTemplates';

import BudgetSection from '../../components/budget/BudgetSection/BudgetSection';
import BudgetTemplateSelector from '../../components/budget/BudgetTemplateSelector/BudgetTemplateSelector';
import BudgetSummary from '../../components/budget/BudgetSummary/BudgetSummary';
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import styles from './Budget.module.css';

const Budget = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    month: new Date(),
    sections: [],
    totalBudget: 0,
    availableBudget: 0
  });
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showAddSectionButton, setShowAddSectionButton] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // Stan do przechowywania informacji o aktualnie edytowanej kwocie budżetu
  const [editingBudgetItem, setEditingBudgetItem] = useState<{
    sectionId: string;
    itemId: string;
    originalAmount: number;
    newAmount: number;
  } | null>(null);

  // Obsługa wyboru szablonu budżetu
  const handleSelectTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tworzenie budżetu na podstawie szablonu
      await createBudgetFromTemplate(templateId);
      
      // Pobierz zaktualizowane dane
      await fetchBudgetData();
      
      // Ukryj selektor szablonów
      setShowTemplateSelector(false);
    } catch (err) {
      setError('Wystąpił błąd podczas tworzenia budżetu z szablonu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pobieranie danych budżetu
  const fetchBudgetData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Pobierz dane budżetu
      const data = await getBudgetData();
      
      // Pobierz dane kont
      const accountsData = getAccounts();
      setAccounts(accountsData);
      
      // Oblicz sumę sald kont, które mają być uwzględniane w budżecie
      const totalAccountBalance = accountsData
        .filter(account => account.includeInBudget)
        .reduce((sum, account) => sum + account.balance, 0);
      
      // Sprawdź, czy jest to nowy miesiąc
      const currentMonth = new Date();
      const dataMonth = new Date(data.month);
      
      if (
        dataMonth.getMonth() !== currentMonth.getMonth() || 
        dataMonth.getFullYear() !== currentMonth.getFullYear()
      ) {
        // Ustaw nowy miesiąc
        await setBudgetMonth(currentMonth);
      }
      
      // Zawsze aktualizuj dostępny budżet na podstawie sald kont
      // Uwzględniając już rozdysponowane środki
      const totalAllocated = data.sections.reduce((total, section) => {
        return total + section.items.reduce((sectionTotal, item) => {
          return sectionTotal + item.amount;
        }, 0);
      }, 0);
      
      // Dostępny budżet to suma sald kont minus już rozdysponowane środki
      const availableBudget = totalAccountBalance - totalAllocated;
      await setAvailableBudget(availableBudget); // Usunięto Math.max(0, ...) aby umożliwić ujemne wartości
      
      // Aktualizacja wydatków na podstawie transakcji
      await updateSpentAmounts();
      
      // Pobierz zaktualizowane dane
      const updatedData = await getBudgetData();
      setBudgetData(updatedData);
      
      // Sprawdź, czy użytkownik ma już sekcje budżetu lub czy wybrał już szablon
      if (updatedData.sections.length === 0 && !hasSelectedBudgetTemplate()) {
        setShowTemplateSelector(true);
      } else {
        setShowTemplateSelector(false);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania danych budżetu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Zmiana miesiąca
  const handleMonthChange = async (direction: 'prev' | 'next') => {
    const currentMonth = new Date(budgetData.month);
    const newMonth = new Date(currentMonth);
    
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    
    try {
      await setBudgetMonth(newMonth);
      
      // Pobierz aktualne dane budżetu
      const currentBudgetData = await getBudgetData();
      
      // Oblicz sumę sald kont, które mają być uwzględniane w budżecie
      const totalAccountBalance = accounts
        .filter(account => account.includeInBudget)
        .reduce((sum, account) => sum + account.balance, 0);
      
      // Oblicz już rozdysponowane środki
      const totalAllocated = currentBudgetData.sections.reduce((total, section) => {
        return total + section.items.reduce((sectionTotal, item) => {
          return sectionTotal + item.amount;
        }, 0);
      }, 0);
      
      // Dostępny budżet to suma sald kont minus już rozdysponowane środki
      const availableBudget = totalAccountBalance - totalAllocated;
      await setAvailableBudget(availableBudget); // Usunięto Math.max(0, ...) aby umożliwić ujemne wartości
      
      await updateSpentAmounts();
      
      // Pobierz wszystkie dane ponownie
      fetchBudgetData();
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany miesiąca');
      console.error(err);
    }
  };

  // Dodawanie sekcji
  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    
    try {
      await addBudgetSection({ name: newSectionName });
      fetchBudgetData();
      setIsAddingSection(false);
      setNewSectionName('');
    } catch (err) {
      setError('Wystąpił błąd podczas dodawania sekcji');
      console.error(err);
    }
  };

  // Obsługa klawisza Enter i Escape przy dodawaniu sekcji
  const handleSectionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSection();
    } else if (e.key === 'Escape') {
      setIsAddingSection(false);
      setNewSectionName('');
    }
  };

  // Aktualizacja sekcji
  const handleUpdateSection = async (id: string, data: BudgetSectionFormData) => {
    try {
      await updateBudgetSection(id, data);
      fetchBudgetData();
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji sekcji');
      console.error(err);
    }
  };

  // Usuwanie sekcji
  const handleDeleteSection = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę sekcję?')) {
      try {
        await deleteBudgetSection(id);
        fetchBudgetData();
      } catch (err) {
        setError('Wystąpił błąd podczas usuwania sekcji');
        console.error(err);
      }
    }
  };

  // Dodawanie pozycji budżetowej
  const handleAddItem = async (sectionId: string, data: BudgetFormData) => {
    try {
      // Upewniamy się, że kwota jest liczbą
      const numericAmount = Number(data.amount);
      if (isNaN(numericAmount)) {
        setError('Kwota musi być liczbą');
        return;
      }
      
      await addBudgetItem(sectionId, { ...data, amount: numericAmount });
      fetchBudgetData();
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Wystąpił błąd podczas dodawania pozycji budżetowej: ${errorMessage}`);
      console.error(err);
    }
  };

  // Rozpoczęcie edycji kwoty budżetu
  const handleStartEditingBudget = (sectionId: string, itemId: string, originalAmount: number) => {
    setEditingBudgetItem({
      sectionId,
      itemId,
      originalAmount,
      newAmount: originalAmount
    });
  };
  
  // Aktualizacja edytowanej kwoty budżetu
  const handleUpdateEditingBudget = (newAmount: number) => {
    if (editingBudgetItem) {
      setEditingBudgetItem({
        ...editingBudgetItem,
        newAmount
      });
    }
  };
  
  // Zakończenie edycji kwoty budżetu
  const handleFinishEditingBudget = () => {
    setEditingBudgetItem(null);
  };
  
  // Aktualizacja pozycji budżetowej
  const handleUpdateItem = async (sectionId: string, itemId: string, data: BudgetFormData) => {
    try {
      // Upewniamy się, że kwota jest liczbą
      const numericAmount = Number(data.amount);
      if (isNaN(numericAmount)) {
        setError('Kwota musi być liczbą');
        return;
      }
      
      await updateBudgetItem(sectionId, itemId, { ...data, amount: numericAmount });
      fetchBudgetData();
      // Resetujemy stan edycji po zapisaniu
      setEditingBudgetItem(null);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(`Wystąpił błąd podczas aktualizacji pozycji budżetowej: ${errorMessage}`);
      console.error(err);
    }
  };

  // Usuwanie pozycji budżetowej
  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę pozycję budżetową?')) {
      try {
        await deleteBudgetItem(sectionId, itemId);
        fetchBudgetData();
      } catch (err) {
        setError('Wystąpił błąd podczas usuwania pozycji budżetowej');
        console.error(err);
      }
    }
  };

  // Zmiana kolejności pozycji budżetowych
  const handleReorderItems = async (sectionId: string, sourceIndex: number, destinationIndex: number) => {
    try {
      await reorderBudgetItems(sectionId, sourceIndex, destinationIndex);
      fetchBudgetData();
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany kolejności pozycji');
      console.error(err);
    }
  };

  // Zmiana kolejności sekcji
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= budgetData.sections.length) {
      return;
    }
    
    try {
      await reorderBudgetSections(index, newIndex);
      fetchBudgetData();
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany kolejności sekcji');
      console.error(err);
    }
  };
  


  // Formatowanie miesiąca
  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('pl-PL', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Formatowanie kwoty
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Obliczanie dostępnej kwoty
  const calculateAvailableAmount = () => {
    // Jeśli aktualnie edytujemy kwotę budżetu, uwzględnij tę zmianę
    let availableBudget = budgetData.availableBudget;
    
    if (editingBudgetItem) {
      const amountDifference = editingBudgetItem.newAmount - editingBudgetItem.originalAmount;
      availableBudget -= amountDifference;
    }
    
    return availableBudget;
  };

  // Pobieranie danych przy pierwszym renderowaniu
  useEffect(() => {
    fetchBudgetData();
  }, []);

  return (
    <div 
      className={styles.container}
      onMouseEnter={() => setShowAddSectionButton(true)}
      onMouseLeave={() => setShowAddSectionButton(false)}
    >
      {showTemplateSelector ? (
        <BudgetTemplateSelector 
          templates={budgetTemplates}
          onSelectTemplate={handleSelectTemplate}
        />
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.monthSelector}>
              <button 
                className={styles.monthButton}
                onClick={() => handleMonthChange('prev')}
                aria-label="Poprzedni miesiąc"
              >
                <MdArrowBack size={20} />
              </button>
              <h2 className={styles.month}>{formatMonth(budgetData.month)}</h2>
              <button 
                className={styles.monthButton}
                onClick={() => handleMonthChange('next')}
                aria-label="Następny miesiąc"
              >
                <MdArrowForward size={20} />
              </button>
            </div>
            <div className={styles.availableAmount}>
              <span className={styles.availableLabel}>Do rozdysponowania:</span>
              <span className={`${styles.availableValue} ${calculateAvailableAmount() < 0 ? styles.availableValueNegative : ''}`}>
                {formatAmount(calculateAvailableAmount())}
              </span>
            </div>
            <button 
              className={styles.templateButton}
              onClick={() => setShowTemplateSelector(true)}
              title="Wybierz inny szablon budżetu"
            >
              Zmień szablon
            </button>
          </div>

          {/* Kafelki podsumowujące budżet */}
          <BudgetSummary 
            budgetData={budgetData} 
            formatAmount={formatAmount} 
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}>Ładowanie danych budżetu...</div>
          ) : (
            <div className={styles.sections}>
              {budgetData.sections.map((section, index) => (
                <BudgetSection
                  key={section.id}
                  section={section}
                  onEditSection={handleUpdateSection}
                  onDeleteSection={handleDeleteSection}
                  onAddItem={handleAddItem}
                  onEditItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onReorderItems={handleReorderItems}
                  onMoveSection={(direction) => handleMoveSection(index, direction)}
                  onStartEditingBudget={handleStartEditingBudget}
                  onUpdateEditingBudget={handleUpdateEditingBudget}
                  onFinishEditingBudget={handleFinishEditingBudget}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === budgetData.sections.length - 1}
                />
              ))}
            </div>
          )}

          {isAddingSection ? (
            <div className={styles.newSectionForm}>
              <input
                type="text"
                className={styles.newSectionInput}
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={handleSectionKeyDown}
                placeholder="Nazwa nowej sekcji"
                autoFocus
              />
              <div className={styles.newSectionActions}>
                <button 
                  className={styles.saveButton} 
                  onClick={handleAddSection}
                >
                  Dodaj
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={() => {
                    setIsAddingSection(false);
                    setNewSectionName('');
                  }}
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            showAddSectionButton && (
              <button
                className={styles.addSectionButton}
                onClick={() => setIsAddingSection(true)}
              >
                + Dodaj nową sekcję
              </button>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Budget;