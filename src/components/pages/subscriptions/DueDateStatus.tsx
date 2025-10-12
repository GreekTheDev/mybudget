interface DueDateStatusProps {
  dueDate: Date;
  className?: string;
}

export function DueDateStatus({ dueDate, className = "" }: DueDateStatusProps) {
  const getDaysUntilDue = (date: Date) => {
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (date: Date) => {
    const days = getDaysUntilDue(date);
    if (days < 0) return { status: 'overdue', color: 'text-white', bgColor: 'bg-red-500' };
    if (days === 0) return { status: 'today', color: 'text-white', bgColor: 'bg-orange-500' };
    if (days <= 3) return { status: 'soon', color: 'text-white', bgColor: 'bg-yellow-500' };
    return { status: 'upcoming', color: 'text-white', bgColor: 'bg-green-500' };
  };

  const daysUntil = getDaysUntilDue(dueDate);
  const dueStatus = getDueDateStatus(dueDate);

  const getStatusText = () => {
    if (daysUntil < 0) return `${Math.abs(daysUntil)}d`;
    if (daysUntil === 0) return 'Dziś';
    if (daysUntil <= 7) return `${daysUntil}d`;
    return `${daysUntil}d`;
  };

  return (
    <div className={`px-2 py-1 rounded text-xs font-medium ${dueStatus.bgColor} ${dueStatus.color} ${className}`}>
      {getStatusText()}
    </div>
  );
}
