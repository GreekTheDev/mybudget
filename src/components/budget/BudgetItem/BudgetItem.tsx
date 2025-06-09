import { useState } from 'react';
import type { BudgetItem as BudgetItemType, BudgetFormData } from '../../../types/Budget';
import styles from './BudgetItem.module.css';

interface BudgetItemProps {
  item: BudgetItemType;
  onEdit: (id: string, data: BudgetFormData) => void;
  onDelete: (id: string) => void;
  onStartEditingBudget: (itemId: string, amount: number) => void;
  onUpdateEditingBudget: (newAmount: number) => void;
  onFinishEditingBudget: () => void;
  isDragging?: boolean;
}

const BudgetItem = ({ 
  item, 
  onEdit, 
  onDelete, 
  onStartEditingBudget,
  onUpdateEditingBudget,
  onFinishEditingBudget,
  isDragging 
}: BudgetItemProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount);

  // Obliczanie dostępnej kwoty
  const available = item.amount - item.spent;
  
  // Formatowanie kwoty
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveName = () => {
    if (name.trim()) {
      onEdit(item.id, { name, amount: item.amount });
      setIsEditingName(false);
    }
  };

  const handleSaveAmount = () => {
    // Akceptujemy dowolną liczbę, w tym ujemne wartości
    // Upewniamy się, że amount jest liczbą
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount)) {
      onEdit(item.id, { name: item.name, amount: numericAmount });
      setIsEditingAmount(false);
      onFinishEditingBudget();
    } else {
      // Jeśli wartość nie jest liczbą, przywracamy poprzednią wartość
      setAmount(item.amount);
      setIsEditingAmount(false);
      onFinishEditingBudget();
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setName(item.name);
    }
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveAmount();
    } else if (e.key === 'Escape') {
      setIsEditingAmount(false);
      setAmount(item.amount);
      onFinishEditingBudget();
    }
  };
  
  // Obsługa rozpoczęcia edycji kwoty
  const handleStartEditingAmount = () => {
    if (!isEditingAmount) {
      setIsEditingAmount(true);
      onStartEditingBudget(item.id, item.amount);
    }
  };
  
  // Obsługa zmiany kwoty podczas edycji
  const handleAmountChange = (newAmount: number) => {
    // Upewniamy się, że newAmount jest liczbą
    const numericAmount = Number(newAmount);
    if (!isNaN(numericAmount)) {
      setAmount(numericAmount);
      onUpdateEditingBudget(numericAmount);
    }
  };

  return (
    <div className={`${styles.itemContainer} ${isDragging ? styles.dragging : ''}`}>
      <div className={`${styles.item}`}>
        <div 
          className={styles.name}
          onClick={() => !isEditingName && setIsEditingName(true)}
        >
          {isEditingName ? (
            <input
              type="text"
              className={styles.editInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleNameKeyDown}
              onBlur={handleSaveName}
              autoFocus
            />
          ) : (
            <div className={styles.nameContainer}>
              <span className={styles.editable}>{item.name}</span>
            </div>
          )}
        </div>
        
        <div 
          className={styles.budget}
          onClick={handleStartEditingAmount}
        >
          {isEditingAmount ? (
            <input
              type="number"
              className={styles.editInput}
              value={amount || ''}
              onChange={(e) => {
                // Jeśli pole jest puste, przekazujemy 0
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                handleAmountChange(value);
              }}
              onKeyDown={handleAmountKeyDown}
              onBlur={handleSaveAmount}
              step="0.01"
              autoFocus
            />
          ) : (
            <span className={styles.editable}>{formatAmount(item.amount)}</span>
          )}
        </div>
        
        <div className={styles.spent}>
          <span>{formatAmount(item.spent)}</span>
        </div>
        
        <div className={`${styles.available} ${available < 0 ? styles.negative : ''}`}>
          <span>{formatAmount(available)}</span>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.deleteButton} 
            onClick={() => onDelete(item.id)}
            title="Usuń"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetItem;