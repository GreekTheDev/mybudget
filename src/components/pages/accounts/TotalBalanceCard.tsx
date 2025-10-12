import { formatCurrency } from '@/lib/utils';

interface TotalBalanceCardProps {
  totalBalance: number;
  className?: string;
}

export function TotalBalanceCard({ totalBalance, className = "" }: TotalBalanceCardProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-xl font-semibold mb-2 text-foreground">Całkowite saldo</h2>
      <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBalance)}</p>
    </div>
  );
}
