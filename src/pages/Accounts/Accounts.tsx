import { useState, useEffect, useCallback, useRef } from 'react';
import type { Account, NewAccount, AccountType, AccountColor } from '../../types/Account';
import { getAccounts, addAccount, deleteAccount, updateAccount } from '../../services/accountService';
import styles from './Accounts.module.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [newAccount, setNewAccount] = useState<NewAccount>({ 
    name: '', 
    balance: 0, 
    type: 'personal', 
    color: 'blue',
    includeInBudget: true 
  });

  const loadAccounts = useCallback(() => {
    const loadedAccounts = getAccounts();
    setAccounts(sortAccountsByType(loadedAccounts));
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openDialog = (account?: Account) => {
    if (account) {
      // Edit mode
      setIsEditMode(true);
      setActiveAccount(account);
      setNewAccount({
        name: account.name,
        balance: account.balance,
        type: account.type,
        color: account.color,
        includeInBudget: account.includeInBudget
      });
    } else {
      // Add mode
      setIsEditMode(false);
      setActiveAccount(null);
      setNewAccount({ 
        name: '', 
        balance: 0, 
        type: 'personal', 
        color: 'blue',
        includeInBudget: true 
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setMenuOpenId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAccount.name.trim()) {
      alert('Nazwa konta jest wymagana');
      return;
    }

    if (isEditMode && activeAccount) {
      // Update existing account
      const updatedAccount = updateAccount({
        ...activeAccount,
        name: newAccount.name,
        balance: newAccount.balance,
        type: newAccount.type,
        color: newAccount.color,
        includeInBudget: newAccount.includeInBudget
      });
      
      setAccounts(prevAccounts => {
        const newAccounts = prevAccounts.map(acc => 
          acc.id === updatedAccount.id ? updatedAccount : acc
        );
        return sortAccountsByType(newAccounts);
      });
    } else {
      // Create new account
      const createdAccount = addAccount(newAccount);
      setAccounts(sortAccountsByType([...accounts, createdAccount]));
    }
    
    closeDialog();
  };

  const toggleMenu = (accountId: string) => {
    setMenuOpenId(prevId => prevId === accountId ? null : accountId);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć to konto?')) {
      deleteAccount(accountId);
      setAccounts(accounts.filter(account => account.id !== accountId));
    }
    setMenuOpenId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const getAccountTypeName = (type: AccountType): string => {
    const typeNames = {
      personal: 'Konto osobiste',
      credit: 'Karta kredytowa',
      savings: 'Konto oszczędnościowe',
      foreign: 'Konto walutowe',
      virtual: 'Konto wirtualne',
      prepaid: 'Karta prepaid'
    };
    return typeNames[type];
  };
  
  const getColorName = (color: AccountColor): string => {
    const colorNames = {
      blue: 'Niebieski',
      green: 'Zielony',
      red: 'Czerwony',
      purple: 'Fioletowy',
      orange: 'Pomarańczowy',
      teal: 'Morski',
      pink: 'Różowy',
      yellow: 'Żółty'
    };
    return colorNames[color];
  };

  // Grupowanie kont według typu
  const groupAccountsByType = () => {
    const accountTypes: AccountType[] = ['personal', 'credit', 'savings', 'foreign', 'virtual', 'prepaid'];
    const groupedAccounts: Record<AccountType, Account[]> = {
      personal: [],
      credit: [],
      savings: [],
      foreign: [],
      virtual: [],
      prepaid: []
    };
    
    accounts.forEach(account => {
      groupedAccounts[account.type].push(account);
    });
    
    return accountTypes.map(type => ({
      type,
      accounts: groupedAccounts[type]
    })).filter(group => group.accounts.length > 0);
  };

  // Sortowanie kont według typu
  const sortAccountsByType = (accounts: Account[]) => {
    const typeOrder: Record<AccountType, number> = {
      personal: 1,
      credit: 2,
      savings: 3,
      foreign: 4,
      virtual: 5,
      prepaid: 6
    };
    
    return [...accounts].sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  };

  return (
    <div className={styles.accountsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Konta</h1>
        <button className={styles.addButton} onClick={() => openDialog()}>
          + Dodaj konto
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>Nie masz jeszcze żadnych kont</p>
          <button className={styles.addButton} onClick={() => openDialog()}>
            Dodaj pierwsze konto
          </button>
        </div>
      ) : (
        <div className={styles.accountsContainer}>
          {groupAccountsByType().map(group => (
            <div key={group.type} className={styles.accountsSection}>
              <h2 className={styles.sectionTitle}>{getAccountTypeName(group.type)}</h2>
              <div className={styles.accountsList}>
                {group.accounts.map(account => (
                  <div 
                    key={account.id} 
                    className={`${styles.accountCard} ${styles[`accountColor${account.color.charAt(0).toUpperCase() + account.color.slice(1)}`]} ${!account.includeInBudget ? styles.accountExcluded : ''}`}
                  >
                    <div className={styles.accountHeader}>
                      <h3 className={styles.accountName}>{account.name}</h3>
                      <div className={styles.kebabMenuContainer} ref={menuRef}>
                        <button 
                          className={styles.kebabMenuButton} 
                          onClick={() => toggleMenu(account.id)}
                          aria-label="Menu opcji konta"
                        >
                          <span className={styles.kebabDot}></span>
                          <span className={styles.kebabDot}></span>
                          <span className={styles.kebabDot}></span>
                        </button>
                        {menuOpenId === account.id && (
                          <div className={styles.kebabMenu}>
                            <button 
                              className={styles.menuItem}
                              onClick={() => {
                                openDialog(account);
                              }}
                            >
                              Edytuj
                            </button>
                            <button 
                              className={`${styles.menuItem} ${styles.deleteMenuItem}`}
                              onClick={() => handleDeleteAccount(account.id)}
                            >
                              Usuń
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </div>
                    <div className={styles.accountDetails}>
                      <p className={styles.accountType}>
                        {getAccountTypeName(account.type)}
                      </p>
                      {!account.includeInBudget && (
                        <div className={styles.accountBudgetStatus}>
                          Nie uwzględniane w budżecie
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className={styles.dialog}>
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>
              {isEditMode ? 'Edytuj konto' : 'Dodaj nowe konto'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="type" className={styles.label}>Rodzaj konta</label>
                <select
                  id="type"
                  name="type"
                  value={newAccount.type}
                  onChange={handleSelectChange}
                  className={styles.select}
                  required
                >
                  <option value="personal">Konto osobiste</option>
                  <option value="credit">Karta kredytowa</option>
                  <option value="savings">Konto oszczędnościowe</option>
                  <option value="foreign">Konto walutowe</option>
                  <option value="virtual">Konto wirtualne</option>
                  <option value="prepaid">Karta prepaid (podarunkowa)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="color" className={styles.label}>Kolor konta</label>
                <div className={styles.colorSelector}>
                  {['blue', 'green', 'red', 'purple', 'orange', 'teal', 'pink', 'yellow'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorOption} ${styles[`accountColor${color.charAt(0).toUpperCase() + color.slice(1)}`]} ${newAccount.color === color ? styles.colorOptionSelected : ''}`}
                      onClick={() => setNewAccount({...newAccount, color: color as AccountColor})}
                      aria-label={`Kolor ${getColorName(color as AccountColor)}`}
                      title={getColorName(color as AccountColor)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Nazwa konta</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAccount.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="np. Konto osobiste"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="balance" className={styles.label}>Saldo początkowe</label>
                <input
                  type="number"
                  id="balance"
                  name="balance"
                  value={newAccount.balance}
                  onChange={handleInputChange}
                  className={styles.input}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="includeInBudget"
                    name="includeInBudget"
                    checked={newAccount.includeInBudget}
                    onChange={handleCheckboxChange}
                    className={styles.checkbox}
                  />
                  <label htmlFor="includeInBudget" className={styles.checkboxLabel}>
                    Uwzględnij w budżecie
                  </label>
                </div>
              </div>
              <div className={styles.dialogActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={closeDialog}
                >
                  Anuluj
                </button>
                <button type="submit" className={styles.submitButton}>
                  {isEditMode ? 'Zapisz zmiany' : 'Utwórz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;