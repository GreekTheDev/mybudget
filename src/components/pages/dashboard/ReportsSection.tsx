'use client';

import Link from 'next/link';

interface ReportsSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onConfigureClick?: () => void;
}

export default function ReportsSection({
  title = "Widget raportów",
  description = "Tutaj będą wyświetlane najważniejsze raporty i analizy",
  buttonText = "Skonfiguruj raporty",
  onConfigureClick,
}: ReportsSectionProps) {
  const handleConfigureClick = () => {
    if (onConfigureClick) {
      onConfigureClick();
    } else {
      // Default behavior - could be expanded later
      console.log('Configure reports clicked');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Raporty</h2>
        <Link href="/reports" className="text-sm text-primary hover:text-opacity-80 transition-colors">
          Zobacz wszystkie
        </Link>
      </div>
      
      <div className="border border-border rounded-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
          <p className="text-sm text-secondary mb-4">{description}</p>
          <button 
            onClick={handleConfigureClick}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
