interface FrequencyIconProps {
  frequency: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FrequencyIcon({ frequency, size = 'md' }: FrequencyIconProps) {
  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return '📅';
      case 'biweekly': return '📆';
      case 'monthly': return '🗓️';
      case 'quarterly': return '📊';
      case 'yearly': return '🎯';
      default: return '📋';
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <span className={sizeClasses[size]}>
      {getFrequencyIcon(frequency)}
    </span>
  );
}
