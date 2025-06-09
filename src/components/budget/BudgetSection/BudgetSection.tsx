import { useState, useEffect } from 'react';
import type { BudgetSection as BudgetSectionType, BudgetFormData, BudgetSectionFormData } from '../../../types/Budget';
import BudgetItem from '../BudgetItem/BudgetItem';
import styles from './BudgetSection.module.css';

interface BudgetSectionProps {
  section: BudgetSectionType;
  onEditSection: (id: string, data: BudgetSectionFormData) => void;
  onDeleteSection: (id: string) => void;
  onAddItem: (sectionId: string, data: BudgetFormData) => void;
  onEditItem: (sectionId: string, itemId: string, data: BudgetFormData) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onReorderItems: (sectionId: string, sourceIndex: number, destinationIndex: number) => void;
  onMoveSection: (direction: 'up' | 'down') => void;
  onStartEditingBudget: (sectionId: string, itemId: string, originalAmount: number) => void;
  onUpdateEditingBudget: (newAmount: number) => void;
  onFinishEditingBudget: () => void;

  index: number;
  isFirst: boolean;
  isLast: boolean;
}

const BudgetSection = ({ 
  section, 
  onEditSection, 
  onDeleteSection, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  onReorderItems,
  onMoveSection,
  onStartEditingBudget,
  onUpdateEditingBudget,
  onFinishEditingBudget,

  isFirst,
  isLast
}: BudgetSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [showAddItemButton, setShowAddItemButton] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Obliczanie sum dla sekcji
  const totalBudget = section.items.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = section.items.reduce((sum, item) => sum + item.spent, 0);
  const totalAvailable = totalBudget - totalSpent;

  // Formatowanie kwoty
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveSection = () => {
    if (sectionName.trim()) {
      onEditSection(section.id, { name: sectionName });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveSection();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setSectionName(section.name);
    }
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      // Dodajemy pozycję z początkową kwotą 0, którą użytkownik może później zmienić na ujemną
      onAddItem(section.id, { name: newItemName, amount: 0 });
      setNewItemName('');
      setIsAddingItem(false);
    }
  };

  const handleNewItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setIsAddingItem(false);
      setNewItemName('');
    }
  };

  // Obsługa przeciągania elementów
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    
    // Jeśli przeciągamy nad innym elementem, zamieniamy miejscami
    if (draggedItemIndex !== index) {
      onReorderItems(section.id, draggedItemIndex, index);
      setDraggedItemIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };
  
  // Obsługa zamykania menu po kliknięciu poza nim
  const handleClickOutside = (e: MouseEvent) => {
    if (showActionsMenu) {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.menuContainer}`)) {
        setShowActionsMenu(false);
      }
    }
  };
  
  // Dodanie i usunięcie event listenera dla kliknięć poza menu
  useEffect(() => {
    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu]);

  return (
    <div
      className={`${styles.section} ${draggedItemIndex !== null ? styles.dragging : ''}`}
      onMouseEnter={() => setShowAddItemButton(true)}
      onMouseLeave={() => setShowAddItemButton(false)}
    >
      <div className={styles.header}>
        <div 
          className={styles.title}
          onClick={() => !isEditing && setIsEditing(true)}
        >
          {isEditing ? (
            <input
              type="text"
              className={styles.editInput}
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveSection}
              autoFocus
            />
          ) : (
            <h3 className={styles.sectionTitle}>{section.name}</h3>
          )}
        </div>
        
        <div className={styles.summary}>
          <div className={styles.budget}>
            <span>{formatAmount(totalBudget)}</span>
          </div>
          <div className={styles.spent}>
            <span>{formatAmount(totalSpent)}</span>
          </div>
          <div className={`${styles.available} ${totalAvailable < 0 ? styles.negative : ''}`}>
            <span>{formatAmount(totalAvailable)}</span>
          </div>
          <div className={styles.actions}>
            <div className={styles.menuContainer}>
              <button 
                className={styles.menuButton} 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionsMenu(!showActionsMenu);
                }}
                title="Opcje"
              >
                ⋮
              </button>
              
              {showActionsMenu && (
                <div className={styles.actionsMenu}>
                  {!isFirst && (
                    <button 
                      className={styles.menuItem} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSection('up');
                        setShowActionsMenu(false);
                      }}
                    >
                      <span className={styles.menuItemIcon}>↑</span>
                      <span>Przesuń w górę</span>
                    </button>
                  )}
                  
                  {!isLast && (
                    <button 
                      className={styles.menuItem} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSection('down');
                        setShowActionsMenu(false);
                      }}
                    >
                      <span className={styles.menuItemIcon}>↓</span>
                      <span>Przesuń w dół</span>
                    </button>
                  )}
                  
                  <button 
                    className={styles.menuItem} 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(section.id);
                      setShowActionsMenu(false);
                    }}
                  >
                    <span className={styles.menuItemIcon}>🗑</span>
                    <span>Usuń sekcję</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.tableHeader}>
        <div className={styles.nameHeader}>Nazwa</div>
        <div className={styles.budgetHeader}>Budżet</div>
        <div className={styles.spentHeader}>Wydane</div>
        <div className={styles.availableHeader}>Dostępne</div>
        <div className={styles.actionsHeader} style={{ width: '28px' }}></div>
      </div>
      
      <div className={styles.items}>
        {section.items.map((item, itemIndex) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(itemIndex)}
            onDragOver={(e) => handleDragOver(e, itemIndex)}
            onDragEnd={handleDragEnd}
            className={draggedItemIndex === itemIndex ? styles.draggingItem : ''}
          >
            <BudgetItem
              item={item}
              onEdit={(itemId, data) => onEditItem(section.id, itemId, data)}
              onDelete={(itemId) => onDeleteItem(section.id, itemId)}
              onStartEditingBudget={(itemId, amount) => onStartEditingBudget(section.id, itemId, amount)}
              onUpdateEditingBudget={onUpdateEditingBudget}
              onFinishEditingBudget={onFinishEditingBudget}
              isDragging={draggedItemIndex === itemIndex}
            />
          </div>
        ))}
        
        {isAddingItem && (
          <div className={styles.newItemRow}>
            <div className={styles.name}>
              <input
                type="text"
                className={styles.newItemInput}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={handleNewItemKeyDown}
                placeholder="Nazwa kategorii"
                autoFocus
              />
            </div>
            <div className={styles.budget}>
              <span>{formatAmount(0)}</span>
            </div>
            <div className={styles.spent}>
              <span>{formatAmount(0)}</span>
            </div>
            <div className={styles.available}>
              <span>{formatAmount(0)}</span>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.saveButton} 
                onClick={handleAddItem}
                title="Zapisz"
              >
                ✓
              </button>
              <button 
                className={styles.cancelButton} 
                onClick={() => {
                  setIsAddingItem(false);
                  setNewItemName('');
                }}
                title="Anuluj"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isAddingItem && showAddItemButton && (
        <button
          className={styles.addItemButton}
          onClick={() => setIsAddingItem(true)}
        >
          + Dodaj nową kategorię
        </button>
      )}
    </div>
  );
};

export default BudgetSection;