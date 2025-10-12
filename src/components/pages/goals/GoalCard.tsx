import { formatCurrency } from '@/lib/utils';
import { GoalProgressBar } from './GoalProgressBar';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  deadline?: string;
}

interface GoalCardProps {
  goal: Goal;
  isDebt?: boolean;
  className?: string;
}

export function GoalCard({ goal, isDebt = false, className = "" }: GoalCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  return (
    <div className={`border border-border rounded-lg p-6 hover:bg-opacity-80 transition-colors ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground">{goal.name}</h3>
        <div className="text-right">
          <p className="text-sm text-secondary">
            {isDebt ? 'Spłacono / Do spłacenia' : 'Zgromadzono / Cel'}
          </p>
          <p className="font-semibold text-foreground">
            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
          </p>
        </div>
      </div>
      
      <GoalProgressBar current={goal.current} target={goal.target} isDebt={isDebt} />

      <div className="flex justify-between text-sm">
        <span className={`font-medium ${isDebt ? 'text-green-600' : 'text-green-600'}`}>
          {isDebt 
            ? `Pozostało do spłaty: ${formatCurrency(goal.target - goal.current)}`
            : `Pozostało do celu: ${formatCurrency(goal.target - goal.current)}`
          }
        </span>
        {goal.deadline && (
          <span className="text-xs text-secondary">
            Do: {formatDate(goal.deadline)}
          </span>
        )}
      </div>
    </div>
  );
}
