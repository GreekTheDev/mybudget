'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  icon: string;
  gradient: string;
  bgColor: string;
  iconColor: string;
}

interface SubscriptionsSummarySectionProps {
  subscriptions?: Subscription[];
  totalAmount?: number;
}

const defaultSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    amount: 45,
    category: 'Streaming',
    icon: '📺',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 20,
    category: 'Muzyka',
    icon: '🎵',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '3',
    name: 'Adobe Creative',
    amount: 89,
    category: 'Design',
    icon: '💻',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: '4',
    name: 'Google Drive',
    amount: 15,
    category: 'Storage',
    icon: '☁️',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
];

export default function SubscriptionsSummarySection({ 
  subscriptions = defaultSubscriptions, 
  totalAmount = 169 
}: SubscriptionsSummarySectionProps) {
  const [isTileView, setIsTileView] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Subskrypcje</h2>
        <Link href="/subscriptions" className="text-sm text-primary hover:text-opacity-80 transition-colors">
          Zobacz wszystkie
        </Link>
      </div>
      
      <div className="border border-border rounded-lg p-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-secondary">Subskrypcje w tym miesiącu</span>
            <button
              onClick={() => setIsTileView(!isTileView)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-foreground"
            >
              {isTileView ? 'Lista' : 'Kafelki'}
            </button>
          </div>
          
          {isTileView ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {subscriptions.map((subscription) => (
                <div 
                  key={subscription.id} 
                  className={`bg-gradient-to-br ${subscription.gradient} rounded-lg p-4 text-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{subscription.icon}</span>
                    <span className="text-xs opacity-80">{subscription.category}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{subscription.name}</div>
                  <div className="text-lg font-bold">-{formatCurrency(subscription.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between py-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${subscription.bgColor} flex items-center justify-center`}>
                      <span className={`text-lg ${subscription.iconColor}`}>{subscription.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{subscription.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-500">-{formatCurrency(subscription.amount)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Total Sum */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between py-3 bg-opacity-10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg text-orange-600">💳</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Łączne subskrypcje</span>
              </div>
              <span className="text-sm font-bold text-red-500">-{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
