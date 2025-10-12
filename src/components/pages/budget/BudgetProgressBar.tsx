interface BudgetProgressBarProps {
  spent: number;
  planned: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showLabels?: boolean;
}

export function BudgetProgressBar({ 
  spent, 
  planned, 
  size = 'md', 
  showPercentage = true, 
  showLabels = true 
}: BudgetProgressBarProps) {
  const getProgressPercentage = (spent: number, planned: number) => {
    return Math.min((spent / planned) * 100, 100);
  };

  const getProgressColor = (spent: number, planned: number) => {
    const percentage = (spent / planned) * 100;
    if (percentage <= 80) return 'bg-green-500';
    if (percentage <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const heightClass = {
    sm: 'h-2',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const percentage = getProgressPercentage(spent, planned);

  return (
    <div className="mb-2">
      {showLabels && (
        <div className="flex justify-between text-sm text-secondary mb-1">
          <span>Postęp</span>
          {showPercentage && <span>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div 
          className={`${heightClass} rounded-full ${getProgressColor(spent, planned)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
