import { useMemo } from 'react';
import type { BudgetData } from '../../../types/Budget';
import styles from './BudgetSummary.module.css';

interface BudgetSummaryProps {
  budgetData: BudgetData;
  formatAmount: (amount: number) => string;
}

const BudgetSummary = ({ budgetData, formatAmount }: BudgetSummaryProps) => {
  // Obliczanie całkowitego budżetu (suma wszystkich pozycji budżetowych)
  const totalBudget = useMemo(() => {
    return budgetData.sections.reduce((total, section) => {
      return total + section.items.reduce((sectionTotal, item) => {
        return sectionTotal + item.amount;
      }, 0);
    }, 0);
  }, [budgetData.sections]);

  // Obliczanie wydanych pieniędzy (suma wszystkich wydatków)
  const totalSpent = useMemo(() => {
    return budgetData.sections.reduce((total, section) => {
      return total + section.items.reduce((sectionTotal, item) => {
        return sectionTotal + item.spent;
      }, 0);
    }, 0);
  }, [budgetData.sections]);

  // Obliczanie dostępnych pieniędzy (budżet - wydatki)
  const availableAmount = useMemo(() => {
    return totalBudget - totalSpent;
  }, [totalBudget, totalSpent]);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Całkowity budżet</h3>
        <p className={styles.summaryAmount}>{formatAmount(totalBudget)}</p>
      </div>
      
      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Wydane</h3>
        <p className={`${styles.summaryAmount} ${styles.spentAmount}`}>{formatAmount(totalSpent)}</p>
      </div>
      
      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Dostępne</h3>
        <p className={`${styles.summaryAmount} ${availableAmount < 0 ? styles.negativeAmount : styles.availableAmount}`}>
          {formatAmount(availableAmount)}
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;