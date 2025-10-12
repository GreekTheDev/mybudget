'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { updateFABPosition, getFABPosition } from '@/components/layout/FloatingActionButton';

type FABPosition = 'left' | 'right' | 'disabled';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [fabPosition, setFabPosition] = useState<FABPosition>('right');

  useEffect(() => {
    setFabPosition(getFABPosition());
  }, []);

  const handleFABPositionChange = (newPosition: FABPosition) => {
    setFabPosition(newPosition);
    updateFABPosition(newPosition);
  };

  const getFABPositionLabel = (position: FABPosition) => {
    switch (position) {
      case 'left': return 'Lewy dolny róg';
      case 'right': return 'Prawy dolny róg';
      case 'disabled': return 'Ukryty';
      default: return position;
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Ustawienia</h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Wygląd</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Motyw</h3>
                <p className="text-sm text-secondary">
                  Wybierz między jasnym a ciemnym motywem
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-2 border border-border rounded-lg"
              >
                <span className="text-foreground">
                  {theme.mode === 'light' ? 'Ciemny motyw' : 'Jasny motyw'}
                </span>
                {theme.mode === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile FAB Settings */}
          <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Interfejs mobilny</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Przycisk szybkich akcji</h3>
                <p className="text-sm text-secondary">
                  Wybierz pozycję lub ukryj przycisk plus na urządzeniach mobilnych
                </p>
              </div>
              <select 
                className="px-4 py-2 border border-border rounded-lg text-foreground bg-background appearance-none"
                value={fabPosition}
                onChange={(e) => handleFABPositionChange(e.target.value as FABPosition)}
              >
                <option value="right">Prawy róg</option>
                <option value="left">Lewy róg</option>
                <option value="disabled">Ukryty</option>
              </select>
            </div>
          </div>

          {/* Language Settings */}
          {/* <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Język</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Język interfejsu</h3>
                <p className="text-sm text-secondary">
                  Wybierz język wyświetlania aplikacji
                </p>
              </div>
              <select 
                className="px-4 py-2 border border-border rounded-lg text-foreground"
                defaultValue="pl"
              >
                <option value="pl">Polski</option>
                <option value="en">English</option>
              </select>
            </div>
          </div> */}

          {/* Currency Settings */}
          {/* <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Waluta</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Domyślna waluta</h3>
                <p className="text-sm text-secondary">
                  Waluta używana do wyświetlania kwot
                </p>
              </div>
              <select 
                className="px-4 py-2 border border-border rounded-lg text-foreground"
                defaultValue="PLN"
              >
                <option value="PLN">PLN (Złoty polski)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dolar amerykański)</option>
              </select>
            </div>
          </div> */}



          {/* External Links */}
          <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Linki zewnętrzne</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Mój blog</h3>
                  <p className="text-sm text-secondary">
                    Przeczytaj więcej artykułów o finansach osobistych
                  </p>
                </div>
                <a
                  href="https://blog.placesobie.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-foreground">Odwiedź blog</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Moja strona internetowa</h3>
                  <p className="text-sm text-secondary">
                    Dowiedz się więcej o moich usługach i projektach
                  </p>
                </div>
                <a
                  href="https://greekthedev.click"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-foreground">Odwiedź stronę</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* About */}
          <div className=" border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">O aplikacji</h2>
            
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-medium">MyBudget</span> - Aplikacja do zarządzania finansami osobistymi
              </p>
              <p className="text-sm text-secondary">Wersja 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
