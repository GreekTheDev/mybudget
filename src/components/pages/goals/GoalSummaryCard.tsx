import { formatCurrency } from '@/lib/utils';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  deadline?: string;
}

interface GoalSummaryCardProps {
  goals: Goal[];
  type: 'savings' | 'debts';
  className?: string;
}

export function GoalSummaryCard({ goals, type, className = "" }: GoalSummaryCardProps) {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalRemaining = totalTarget - totalCurrent;
  const averageProgress = Math.round(goals.reduce((sum, goal) => sum + getProgressPercentage(goal.current, goal.target), 0) / goals.length);

  const isSavings = type === 'savings';

  return (
    <div className={`border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {isSavings ? 'Oszczędności' : 'Długi'}
        </h3>
        <div className={`w-8 h-8 ${isSavings ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
          <span className="text-white text-sm font-bold"></span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-secondary">
            {isSavings ? 'Łączny cel:' : 'Łączny dług:'}
          </span>
          <span className="font-semibold text-foreground">
            {formatCurrency(totalTarget)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-secondary">
            {isSavings ? 'Zgromadzono:' : 'Spłacono:'}
          </span>
          <span className="font-semibold text-green-600">
            {formatCurrency(totalCurrent)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-secondary">Pozostało:</span>
          <span className={`font-semibold ${isSavings ? 'text-foreground' : 'text-red-600'}`}>
            {formatCurrency(totalRemaining)}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Średni postęp:</span>
            <span className="font-medium text-foreground">
              {averageProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
