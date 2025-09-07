'use client';

import { useState } from 'react';
import { 
  SpendingReport, 
  IncomeReport, 
  TrendReport, 
  BudgetVsActual, 
  SavingsReport, 
  ReportCategory 
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

// Mock data for different report types
const mockSpendingData: SpendingReport[] = [
  { category: 'Mieszkanie', amount: 3200, percentage: 35, color: '#3b82f6', trend: 'stable', change: 2 },
  { category: 'Jedzenie', amount: 1200, percentage: 13, color: '#10b981', trend: 'up', change: 8 },
  { category: 'Transport', amount: 800, percentage: 9, color: '#f59e0b', trend: 'down', change: -5 },
  { category: 'Rozrywka', amount: 600, percentage: 7, color: '#8b5cf6', trend: 'up', change: 12 },
  { category: 'Zdrowie', amount: 500, percentage: 5, color: '#ef4444', trend: 'stable', change: 0 },
  { category: 'Odzież', amount: 400, percentage: 4, color: '#06b6d4', trend: 'down', change: -15 },
  { category: 'Inne', amount: 1500, percentage: 16, color: '#6b7280', trend: 'up', change: 3 },
];

const mockIncomeData: IncomeReport[] = [
  { source: 'Wynagrodzenie', amount: 5000, percentage: 80, color: '#10b981', frequency: 'Miesięcznie', trend: 'stable' },
  { source: 'Freelance', amount: 800, percentage: 13, color: '#3b82f6', frequency: 'Nieregularnie', trend: 'up' },
  { source: 'Inwestycje', amount: 400, percentage: 6, color: '#8b5cf6', frequency: 'Miesięcznie', trend: 'up' },
  { source: 'Inne', amount: 50, percentage: 1, color: '#6b7280', frequency: 'Nieregularnie', trend: 'stable' },
];

const mockTrendData: TrendReport[] = [
  { period: 'Styczeń 2024', income: 5000, expenses: 3200, savings: 1800, savingsRate: 36 },
  { period: 'Luty 2024', income: 5000, expenses: 3100, savings: 1900, savingsRate: 38 },
  { period: 'Marzec 2024', income: 5000, expenses: 3400, savings: 1600, savingsRate: 32 },
  { period: 'Kwiecień 2024', income: 5000, expenses: 2900, savings: 2100, savingsRate: 42 },
  { period: 'Maj 2024', income: 5000, expenses: 3300, savings: 1700, savingsRate: 34 },
  { period: 'Czerwiec 2024', income: 5000, expenses: 3150, savings: 1850, savingsRate: 37 },
];

const mockBudgetVsActual: BudgetVsActual[] = [
  { category: 'Mieszkanie', budgeted: 3000, actual: 3200, variance: -200, variancePercentage: -6.7, status: 'over' },
  { category: 'Jedzenie', budgeted: 1000, actual: 1200, variance: -200, variancePercentage: -20, status: 'over' },
  { category: 'Transport', budgeted: 900, actual: 800, variance: 100, variancePercentage: 11.1, status: 'under' },
  { category: 'Rozrywka', budgeted: 500, actual: 600, variance: -100, variancePercentage: -20, status: 'over' },
  { category: 'Zdrowie', budgeted: 500, actual: 500, variance: 0, variancePercentage: 0, status: 'on-track' },
  { category: 'Oszczędności', budgeted: 2000, actual: 1850, variance: 150, variancePercentage: 7.5, status: 'under' },
];

const mockSavingsData: SavingsReport[] = [
  { goal: 'Wakacje', target: 10000, current: 7500, progress: 75, deadline: '2024-08-01', status: 'on-track' },
  { goal: 'Nowy samochód', target: 50000, current: 15000, progress: 30, deadline: '2025-06-01', status: 'behind' },
  { goal: 'Fundusz awaryjny', target: 25000, current: 20000, progress: 80, deadline: '2024-12-01', status: 'ahead' },
  { goal: 'Remont mieszkania', target: 30000, current: 5000, progress: 17, deadline: '2025-03-01', status: 'behind' },
];

const reportCategories: ReportCategory[] = [
  {
    id: 'spending',
    name: 'Analiza wydatków',
    description: 'Szczegółowa analiza wydatków według kategorii',
    icon: '💰',
    color: '#ef4444'
  },
  {
    id: 'income',
    name: 'Analiza przychodów',
    description: 'Przegląd źródeł przychodów i ich trendów',
    icon: '📈',
    color: '#10b981'
  },
  {
    id: 'trends',
    name: 'Trendy finansowe',
    description: 'Długoterminowe trendy przychodów i oszczędności',
    icon: '📊',
    color: '#3b82f6'
  },
  {
    id: 'budget',
    name: 'Budżet vs rzeczywistość',
    description: 'Porównanie planowanego budżetu z rzeczywistymi wydatkami',
    icon: '🎯',
    color: '#f59e0b'
  },
  {
    id: 'savings',
    name: 'Cele oszczędnościowe',
    description: 'Postęp w realizacji celów oszczędnościowych',
    icon: '🏆',
    color: '#8b5cf6'
  }
];

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState<string>('spending');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('6months');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'text-red-600 bg-red-100';
      case 'under': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'ahead': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'over': return 'Przekroczono';
      case 'under': return 'Poniżej budżetu';
      case 'on-track': return 'Na torze';
      case 'behind': return 'Opóźnienie';
      case 'ahead': return 'Przed terminem';
      default: return 'Nieznany';
    }
  };

  const renderSpendingReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Całkowite wydatki</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(mockSpendingData.reduce((sum, item) => sum + item.amount, 0))}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Największa kategoria</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockSpendingData[0]?.category}
          </p>
          <p className="text-sm text-secondary">
            {mockSpendingData[0]?.percentage}% wydatków
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Kategorie z trendem wzrostowym</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockSpendingData.filter(item => item.trend === 'up').length}
          </p>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Wydatki według kategorii</h3>
        <div className="space-y-4">
          {mockSpendingData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary">{item.percentage}%</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-sm">{getTrendIcon(item.trend)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Spending Table */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Szczegóły wydatków</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-foreground">Kategoria</th>
                <th className="text-right py-2 text-foreground">Kwota</th>
                <th className="text-right py-2 text-foreground">Procent</th>
                <th className="text-center py-2 text-foreground">Trend</th>
                <th className="text-right py-2 text-foreground">Zmiana</th>
              </tr>
            </thead>
            <tbody>
              {mockSpendingData.map((item, index) => (
                <tr key={index} className="border-b border-border last:border-b-0">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground">{item.category}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 text-foreground font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="text-right py-2 text-secondary">
                    {item.percentage}%
                  </td>
                  <td className="text-center py-2">
                    <span className="text-lg">{getTrendIcon(item.trend)}</span>
                  </td>
                  <td className={`text-right py-2 font-medium ${
                    item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIncomeReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Całkowite przychody</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(mockIncomeData.reduce((sum, item) => sum + item.amount, 0))}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Główne źródło</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockIncomeData[0]?.source}
          </p>
          <p className="text-sm text-secondary">
            {mockIncomeData[0]?.percentage}% przychodów
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Źródła przychodów</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockIncomeData.length}
          </p>
        </div>
      </div>

      {/* Income Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Przychody według źródła</h3>
        <div className="space-y-4">
          {mockIncomeData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{item.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary">{item.percentage}%</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-sm">{getTrendIcon(item.trend)}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <p className="text-xs text-secondary mt-1">{item.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrendsReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Średnia stopa oszczędności</h3>
          <p className="text-2xl font-bold text-foreground">
            {Math.round(mockTrendData.reduce((sum, item) => sum + item.savingsRate, 0) / mockTrendData.length)}%
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Najlepszy miesiąc</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.max(...mockTrendData.map(item => item.savings)))}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Średnie oszczędności</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(mockTrendData.reduce((sum, item) => sum + item.savings, 0) / mockTrendData.length)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Trend oszczędności</h3>
          <p className="text-2xl font-bold text-foreground">
            {getTrendIcon('up')}
          </p>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Trendy finansowe - ostatnie 6 miesięcy</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {mockTrendData.map((item, index) => {
            const maxValue = Math.max(...mockTrendData.map(d => d.savings));
            const height = (item.savings / maxValue) * 200;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-green-500 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${height}px` }}
                  title={`${item.period}: ${formatCurrency(item.savings)} (${item.savingsRate}%)`}
                />
                <span className="text-xs text-secondary mt-2 text-center">
                  {item.period.split(' ')[0]}
                </span>
                <span className="text-xs text-secondary">
                  {item.savingsRate}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-secondary">Oszczędności</span>
          </div>
        </div>
      </div>

      {/* Trends Table */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Szczegóły trendów</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-foreground">Okres</th>
                <th className="text-right py-2 text-foreground">Przychody</th>
                <th className="text-right py-2 text-foreground">Wydatki</th>
                <th className="text-right py-2 text-foreground">Oszczędności</th>
                <th className="text-right py-2 text-foreground">Stopa oszczędności</th>
              </tr>
            </thead>
            <tbody>
              {mockTrendData.map((item, index) => (
                <tr key={index} className="border-b border-border last:border-b-0">
                  <td className="py-2 text-foreground">{item.period}</td>
                  <td className="text-right py-2 text-green-600 font-medium">
                    {formatCurrency(item.income)}
                  </td>
                  <td className="text-right py-2 text-red-500 font-medium">
                    {formatCurrency(item.expenses)}
                  </td>
                  <td className="text-right py-2 text-blue-600 font-medium">
                    {formatCurrency(item.savings)}
                  </td>
                  <td className="text-right py-2 text-foreground font-medium">
                    {item.savingsRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBudgetVsActual = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Kategorie na torze</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockBudgetVsActual.filter(item => item.status === 'on-track').length}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Przekroczone budżety</h3>
          <p className="text-2xl font-bold text-red-500">
            {mockBudgetVsActual.filter(item => item.status === 'over').length}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Poniżej budżetu</h3>
          <p className="text-2xl font-bold text-green-600">
            {mockBudgetVsActual.filter(item => item.status === 'under').length}
          </p>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Budżet vs rzeczywistość</h3>
        <div className="space-y-4">
          {mockBudgetVsActual.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{item.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Budżet</span>
                    <span className="text-foreground">{formatCurrency(item.budgeted)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary">Rzeczywiste</span>
                    <span className="text-foreground">{formatCurrency(item.actual)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'over' ? 'bg-red-500' : 
                        item.status === 'under' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((item.actual / item.budgeted) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="text-sm text-secondary">
                Różnica: {formatCurrency(item.variance)} ({item.variancePercentage > 0 ? '+' : ''}{item.variancePercentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavingsReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Aktywne cele</h3>
          <p className="text-2xl font-bold text-foreground">
            {mockSavingsData.length}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Cele na torze</h3>
          <p className="text-2xl font-bold text-green-600">
            {mockSavingsData.filter(item => item.status === 'on-track').length}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Całkowita wartość celów</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(mockSavingsData.reduce((sum, item) => sum + item.target, 0))}
          </p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Cele oszczędnościowe</h3>
        <div className="space-y-6">
          {mockSavingsData.map((goal, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{goal.goal}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {getStatusLabel(goal.status)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Postęp</span>
                  <span className="text-foreground">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      goal.status === 'ahead' ? 'bg-green-500' :
                      goal.status === 'behind' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary">Aktualne: </span>
                    <span className="text-foreground font-medium">{formatCurrency(goal.current)}</span>
                  </div>
                  <div>
                    <span className="text-secondary">Cel: </span>
                    <span className="text-foreground font-medium">{formatCurrency(goal.target)}</span>
                  </div>
                </div>
                <div className="text-sm text-secondary">
                  Termin: {new Date(goal.deadline).toLocaleDateString('pl-PL')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedCategory) {
      case 'spending': return renderSpendingReport();
      case 'income': return renderIncomeReport();
      case 'trends': return renderTrendsReport();
      case 'budget': return renderBudgetVsActual();
      case 'savings': return renderSavingsReport();
      default: return renderSpendingReport();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Raporty</h1>
            <p className="text-secondary mt-2">
              Szczegółowe analizy i raporty finansowe
            </p>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {reportCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                selectedCategory === category.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
              <p className="text-xs text-secondary">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('3months')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === '3months'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            3 miesiące
          </button>
          <button
            onClick={() => setSelectedPeriod('6months')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === '6months'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            6 miesięcy
          </button>
          <button
            onClick={() => setSelectedPeriod('1year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === '1year'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            1 rok
          </button>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </div>
  );
}
