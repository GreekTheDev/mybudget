interface GoalProgressBarProps {
  current: number;
  target: number;
  isDebt?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showLabels?: boolean;
}

export function GoalProgressBar({ 
  current, 
  target, 
  isDebt = false, 
  size = 'md', 
  showPercentage = true, 
  showLabels = true 
}: GoalProgressBarProps) {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current: number, target: number, isDebt: boolean = false) => {
    const percentage = (current / target) * 100;
    if (isDebt) {
      // For debts, higher percentage is better (more paid off)
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // For savings, higher percentage is better (more saved)
      if (percentage >= 80) return 'bg-green-500';
      if (percentage >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const heightClass = {
    sm: 'h-2',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  const percentage = getProgressPercentage(current, target);

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
          className={`${heightClass} rounded-full ${getProgressColor(current, target, isDebt)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
