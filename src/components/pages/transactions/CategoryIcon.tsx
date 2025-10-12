interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
      'Wynagrodzenie': { icon: '💰', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      'Czynsz': { icon: '🏠', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      'Żywność': { icon: '🍽️', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
      'Transport': { icon: '🚌', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      'Rozrywka': { icon: '🎬', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
      'Zdrowie': { icon: '🏥', bgColor: 'bg-red-100', iconColor: 'text-red-600' },
      'Ubrania': { icon: '👕', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
      'Oszczędności': { icon: '💎', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    };
    return iconMap[category] || { icon: '📝', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl'
  };

  const categoryIcon = getCategoryIcon(category);

  return (
    <div className={`${sizeClasses[size]} rounded-full ${categoryIcon.bgColor} flex items-center justify-center`}>
      <span className={categoryIcon.iconColor}>{categoryIcon.icon}</span>
    </div>
  );
}
