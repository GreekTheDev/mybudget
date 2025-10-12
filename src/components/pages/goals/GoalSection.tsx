import { GoalCard } from './GoalCard';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  deadline?: string;
}

interface GoalSectionProps {
  goals: Goal[];
  title: string;
  isDebt?: boolean;
  className?: string;
}

export function GoalSection({ goals, title, isDebt = false, className = "" }: GoalSectionProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isDebt={isDebt}
          />
        ))}
      </div>
    </div>
  );
}
