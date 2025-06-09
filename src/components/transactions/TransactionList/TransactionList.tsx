import { useState } from 'react';
import type { Transaction } from '../../../types/Transaction';
import styles from './TransactionList.module.css';
import TransactionModal from '../TransactionModal/TransactionModal';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string, data: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  const handleSaveEdit = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      onEdit(editingTransaction.id, data);
      setEditingTransaction(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Brak transakcji do wyświetlenia</p>
      </div>
    );
  }

  return (
    <>
      <table className={styles.transactionList}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Opis</th>
            <th>Kategoria</th>
            <th>Kwota</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td className={
                transaction.type === 'income' 
                  ? styles.income 
                  : transaction.type === 'transfer' 
                    ? styles.transfer 
                    : styles.expense
              }>
                {transaction.type === 'income' 
                  ? '+' 
                  : transaction.type === 'transfer' 
                    ? '↔' 
                    : '-'} {formatAmount(Math.abs(transaction.amount))}
              </td>
              <td className={styles.actions}>
                <button 
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => handleEditClick(transaction)}
                  aria-label="Edytuj transakcję"
                >
                  ✏️
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(transaction.id)}
                  aria-label="Usuń transakcję"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTransaction && (
        <TransactionModal
          isOpen={!!editingTransaction}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
          transaction={editingTransaction}
          mode="edit"
        />
      )}
    </>
  );
};

export default TransactionList;