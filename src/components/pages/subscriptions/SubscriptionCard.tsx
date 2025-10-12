import { formatCurrency } from '@/lib/utils';
import { Subscription } from '@/lib/types';
import { FrequencyIcon } from './FrequencyIcon';
import { DueDateStatus } from './DueDateStatus';

interface SubscriptionCardProps {
  subscription: Subscription;
  className?: string;
}

export function SubscriptionCard({ subscription, className = "" }: SubscriptionCardProps) {
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'tygodniowo';
      case 'biweekly': return 'co 2 tygodnie';
      case 'monthly': return 'miesięcznie';
      case 'quarterly': return 'kwartalnie';
      case 'yearly': return 'rocznie';
      default: return frequency;
    }
  };

  return (
    <div className={`border border-border rounded-lg p-4 hover:bg-card/50 transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: subscription.color }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">{subscription.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <FrequencyIcon frequency={subscription.frequency} size="sm" />
              <span className="text-xs text-secondary">{getFrequencyLabel(subscription.frequency)}</span>
              <span className="text-xs text-secondary">•</span>
              <span className="text-xs text-secondary">{subscription.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className={`font-semibold ${
              subscription.type === 'income' ? 'text-green-600' : 'text-red-500'
            }`}>
              {subscription.type === 'income' ? '+' : '-'}{formatCurrency(subscription.amount)}
            </p>
            <p className="text-xs text-secondary">
              {subscription.nextDueDate.toLocaleDateString('pl-PL')}
            </p>
          </div>
          <DueDateStatus dueDate={subscription.nextDueDate} />
        </div>
      </div>
    </div>
  );
}
