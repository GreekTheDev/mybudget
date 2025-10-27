'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { CashFlowData, CashFlowPeriod, CashFlowProjection } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

// Mock data for demonstration
const mockCashFlowData: CashFlowData[] = [
  { date: '2024-01-01', income: 5000, expenses: 3200, netFlow: 1800, cumulativeBalance: 1800 },
  { date: '2024-01-02', income: 0, expenses: 150, netFlow: -150, cumulativeBalance: 1650 },
  { date: '2024-01-03', income: 0, expenses: 89, netFlow: -89, cumulativeBalance: 1561 },
  { date: '2024-01-04', income: 0, expenses: 45, netFlow: -45, cumulativeBalance: 1516 },
  { date: '2024-01-05', income: 0, expenses: 200, netFlow: -200, cumulativeBalance: 1316 },
  { date: '2024-01-06', income: 0, expenses: 120, netFlow: -120, cumulativeBalance: 1196 },
  { date: '2024-01-07', income: 0, expenses: 300, netFlow: -300, cumulativeBalance: 896 },
  { date: '2024-01-08', income: 0, expenses: 80, netFlow: -80, cumulativeBalance: 816 },
  { date: '2024-01-09', income: 0, expenses: 250, netFlow: -250, cumulativeBalance: 566 },
  { date: '2024-01-10', income: 0, expenses: 65, netFlow: -65, cumulativeBalance: 501 },
  { date: '2024-01-11', income: 0, expenses: 180, netFlow: -180, cumulativeBalance: 321 },
  { date: '2024-01-12', income: 0, expenses: 95, netFlow: -95, cumulativeBalance: 226 },
  { date: '2024-01-13', income: 0, expenses: 400, netFlow: -400, cumulativeBalance: -174 },
  { date: '2024-01-14', income: 0, expenses: 120, netFlow: -120, cumulativeBalance: -294 },
  { date: '2024-01-15', income: 0, expenses: 200, netFlow: -200, cumulativeBalance: -494 },
  { date: '2024-01-16', income: 0, expenses: 75, netFlow: -75, cumulativeBalance: -569 },
  { date: '2024-01-17', income: 0, expenses: 150, netFlow: -150, cumulativeBalance: -719 },
  { date: '2024-01-18', income: 0, expenses: 90, netFlow: -90, cumulativeBalance: -809 },
  { date: '2024-01-19', income: 0, expenses: 300, netFlow: -300, cumulativeBalance: -1109 },
  { date: '2024-01-20', income: 0, expenses: 110, netFlow: -110, cumulativeBalance: -1219 },
  { date: '2024-01-21', income: 0, expenses: 85, netFlow: -85, cumulativeBalance: -1304 },
  { date: '2024-01-22', income: 0, expenses: 200, netFlow: -200, cumulativeBalance: -1504 },
  { date: '2024-01-23', income: 0, expenses: 60, netFlow: -60, cumulativeBalance: -1564 },
  { date: '2024-01-24', income: 0, expenses: 180, netFlow: -180, cumulativeBalance: -1744 },
  { date: '2024-01-25', income: 0, expenses: 95, netFlow: -95, cumulativeBalance: -1839 },
  { date: '2024-01-26', income: 0, expenses: 250, netFlow: -250, cumulativeBalance: -2089 },
  { date: '2024-01-27', income: 0, expenses: 120, netFlow: -120, cumulativeBalance: -2209 },
  { date: '2024-01-28', income: 0, expenses: 70, netFlow: -70, cumulativeBalance: -2279 },
  { date: '2024-01-29', income: 0, expenses: 160, netFlow: -160, cumulativeBalance: -2439 },
  { date: '2024-01-30', income: 0, expenses: 45, netFlow: -45, cumulativeBalance: -2484 },
  { date: '2024-01-31', income: 0, expenses: 200, netFlow: -200, cumulativeBalance: -2684 },
];

const mockPeriodData: CashFlowPeriod[] = [
  { period: 'Styczeń 2024', income: 5000, expenses: 3200, netFlow: 1800, transactions: 31 },
  { period: 'Luty 2024', income: 5000, expenses: 3100, netFlow: 1900, transactions: 28 },
  { period: 'Marzec 2024', income: 5000, expenses: 3400, netFlow: 1600, transactions: 31 },
  { period: 'Kwiecień 2024', income: 5000, expenses: 2900, netFlow: 2100, transactions: 30 },
  { period: 'Maj 2024', income: 5000, expenses: 3300, netFlow: 1700, transactions: 31 },
  { period: 'Czerwiec 2024', income: 5000, expenses: 3150, netFlow: 1850, transactions: 30 },
];

const mockProjections: CashFlowProjection[] = [
  { month: 'Lipiec 2024', projectedIncome: 5000, projectedExpenses: 3200, projectedBalance: 1800, confidence: 'high' },
  { month: 'Sierpień 2024', projectedIncome: 5000, projectedExpenses: 3100, projectedBalance: 1900, confidence: 'high' },
  { month: 'Wrzesień 2024', projectedIncome: 5000, projectedExpenses: 3400, projectedBalance: 1600, confidence: 'medium' },
  { month: 'Październik 2024', projectedIncome: 5000, projectedExpenses: 2900, projectedBalance: 2100, confidence: 'medium' },
  { month: 'Listopad 2024', projectedIncome: 5000, projectedExpenses: 3300, projectedBalance: 1700, confidence: 'low' },
  { month: 'Grudzień 2024', projectedIncome: 5000, projectedExpenses: 3150, projectedBalance: 1850, confidence: 'low' },
];

export default function CashFlow() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'projection'>('daily');
  // Removed selectedMonth state - not used in the current implementation

  // Check for hash in URL to set initial tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#prognozy') {
        setSelectedPeriod('projection');
      }
    }
  }, []);

  const currentData = mockCashFlowData;
  const currentPeriodData = mockPeriodData;
  const currentProjections = mockProjections;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'Wysoka';
      case 'medium': return 'Średnia';
      case 'low': return 'Niska';
      default: return 'Nieznana';
    }
  };

  const renderDailyCashFlow = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Dzisiejszy przepływ</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(currentData[currentData.length - 1]?.netFlow || 0)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Bilans końcowy</h3>
          <p className={`text-2xl font-bold ${
            (currentData[currentData.length - 1]?.cumulativeBalance || 0) >= 0 
              ? 'text-green-600' : 'text-red-500'
          }`}>
            {formatCurrency(currentData[currentData.length - 1]?.cumulativeBalance || 0)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Średni dzienny przepływ</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(currentData.reduce((sum, day) => sum + day.netFlow, 0) / currentData.length)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Dni z ujemnym przepływem</h3>
          <p className="text-2xl font-bold text-red-500">
            {currentData.filter(day => day.netFlow < 0).length}
          </p>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Przepływ gotówki - ostatnie 31 dni</h3>
        <div className="h-64 flex items-end justify-between gap-1">
          {currentData.map((day, index) => {
            const maxValue = Math.max(...currentData.map(d => Math.abs(d.netFlow)));
            const height = (Math.abs(day.netFlow) / maxValue) * 200;
            const isPositive = day.netFlow >= 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${height}px` }}
                  title={`${day.date}: ${formatCurrency(day.netFlow)}`}
                />
                {index % 5 === 0 && (
                  <span className="text-xs text-secondary mt-2 transform -rotate-45 origin-left">
                    {new Date(day.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-secondary">Dodatni przepływ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-secondary">Ujemny przepływ</span>
          </div>
        </div>
      </div>

      {/* Daily Details */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Szczegóły dzienne</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {currentData.slice(-10).reverse().map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {new Date(day.date).toLocaleDateString('pl-PL')}
                </p>
                <p className="text-xs text-secondary">
                  Przychody: {formatCurrency(day.income)} | Wydatki: {formatCurrency(day.expenses)}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${day.netFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {day.netFlow >= 0 ? '+' : ''}{formatCurrency(day.netFlow)}
                </p>
                <p className="text-xs text-secondary">
                  Bilans: {formatCurrency(day.cumulativeBalance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthlyCashFlow = () => (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Średni miesięczny przepływ</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(currentPeriodData.reduce((sum, period) => sum + period.netFlow, 0) / currentPeriodData.length)}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Najlepszy miesiąc</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.max(...currentPeriodData.map(p => p.netFlow)))}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Najgorszy miesiąc</h3>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(Math.min(...currentPeriodData.map(p => p.netFlow)))}
          </p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Przepływ gotówki - ostatnie 6 miesięcy</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {currentPeriodData.map((period, index) => {
            const maxValue = Math.max(...currentPeriodData.map(p => Math.abs(p.netFlow)));
            const height = (Math.abs(period.netFlow) / maxValue) * 200;
            const isPositive = period.netFlow >= 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${height}px` }}
                  title={`${period.period}: ${formatCurrency(period.netFlow)}`}
                />
                <span className="text-xs text-secondary mt-2 text-center">
                  {period.period.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Details */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Szczegóły miesięczne</h3>
        <div className="space-y-4">
          {currentPeriodData.map((period, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-semibold text-foreground">{period.period}</h4>
                <p className="text-sm text-secondary">
                  {period.transactions} transakcji
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary">
                  Przychody: {formatCurrency(period.income)}
                </p>
                <p className="text-sm text-secondary">
                  Wydatki: {formatCurrency(period.expenses)}
                </p>
                <p className={`font-semibold ${period.netFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {period.netFlow >= 0 ? '+' : ''}{formatCurrency(period.netFlow)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      {/* Projection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Prognozowany przepływ (6 miesięcy)</h3>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(currentProjections.reduce((sum, proj) => sum + proj.projectedBalance, 0))}
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Średnia pewność prognozy</h3>
          <p className="text-2xl font-bold text-foreground">
            {Math.round(currentProjections.filter(p => p.confidence === 'high').length / currentProjections.length * 100)}%
          </p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary mb-2">Najlepszy prognozowany miesiąc</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.max(...currentProjections.map(p => p.projectedBalance)))}
          </p>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Prognoza przepływu gotówki</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {currentProjections.map((projection, index) => {
            const maxValue = Math.max(...currentProjections.map(p => Math.abs(p.projectedBalance)));
            const height = (Math.abs(projection.projectedBalance) / maxValue) * 200;
            const isPositive = projection.projectedBalance >= 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                    isPositive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ height: `${height}px`, opacity: projection.confidence === 'high' ? 1 : projection.confidence === 'medium' ? 0.7 : 0.4 }}
                  title={`${projection.month}: ${formatCurrency(projection.projectedBalance)} (${getConfidenceLabel(projection.confidence)} pewność)`}
                />
                <span className="text-xs text-secondary mt-2 text-center">
                  {projection.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-secondary">Dodatni przepływ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-secondary">Ujemny przepływ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-sm text-secondary">Niska pewność</span>
          </div>
        </div>
      </div>

      {/* Projection Details */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Szczegóły prognozy</h3>
        <div className="space-y-4">
          {currentProjections.map((projection, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-semibold text-foreground">{projection.month}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(projection.confidence)}`}>
                  {getConfidenceLabel(projection.confidence)} pewność
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary">
                  Prognozowane przychody: {formatCurrency(projection.projectedIncome)}
                </p>
                <p className="text-sm text-secondary">
                  Prognozowane wydatki: {formatCurrency(projection.projectedExpenses)}
                </p>
                <p className={`font-semibold ${projection.projectedBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {projection.projectedBalance >= 0 ? '+' : ''}{formatCurrency(projection.projectedBalance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Przepływ gotówki</h1>
            <p className="text-secondary mt-2">
              Analiza przychodów, wydatków i przepływu gotówki w czasie
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'daily'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            Dzienne
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            Miesięczne
          </button>
          <button
            onClick={() => setSelectedPeriod('projection')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'projection'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-opacity-80'
            }`}
          >
            Prognozy
          </button>
        </div>

        {/* Content based on selected period */}
        {selectedPeriod === 'daily' && renderDailyCashFlow()}
        {selectedPeriod === 'monthly' && renderMonthlyCashFlow()}
        {selectedPeriod === 'projection' && renderProjections()}
      </div>
    </div>
  );
}
