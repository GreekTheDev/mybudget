'use client';

import { useState } from 'react';

interface GuideSection {
  id: string;
  title: string;
  content: string;
  tips?: string[];
}

const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Jak zacząć z budżetowaniem',
    content: 'Budżetowanie to podstawa zdrowego zarządzania finansami. Oto jak możesz zacząć swoją przygodę z kontrolowaniem wydatków.',
    tips: [
      'Zacznij od śledzenia wszystkich swoich wydatków przez miesiąc',
      'Określ swoje miesięczne dochody i stałe wydatki',
      'Ustaw cele finansowe - krótko i długoterminowe',
      'Używaj zasady 50/30/20: 50% na potrzeby, 30% na zachcianki, 20% na oszczędności'
    ]
  },
  {
    id: 'budget-basics',
    title: 'Podstawy budżetowania',
    content: 'Poznaj fundamentalne zasady tworzenia i utrzymywania budżetu osobistego.',
    tips: [
      'Zawsze wydawaj mniej niż zarabiasz',
      'Automatyzuj oszczędności - ustaw stałe przelewy',
      'Regularnie przeglądaj i aktualizuj swój budżet',
      'Miej fundusz awaryjny na nieprzewidziane wydatki'
    ]
  },
  {
    id: 'saving-strategies',
    title: 'Strategie oszczędzania',
    content: 'Różne metody oszczędzania, które pomogą Ci osiągnąć cele finansowe.',
    tips: [
      'Zasada "płać sobie najpierw" - odkładaj na początku miesiąca',
      'Używaj kont oszczędnościowych z wyższym oprocentowaniem',
      'Inwestuj w fundusze indeksowe dla długoterminowych celów',
      'Unikaj impulsywnych zakupów - stosuj regułę 24h'
    ]
  },
  {
    id: 'debt-management',
    title: 'Zarządzanie długami',
    content: 'Jak skutecznie radzić sobie z długami i unikać pułapek finansowych.',
    tips: [
      'Spłacaj najpierw długi z najwyższym oprocentowaniem',
      'Rozważ konsolidację długów jeśli masz ich wiele',
      'Unikaj nowych długów podczas spłacania starych',
      'Skontaktuj się z wierzycielami w przypadku problemów finansowych'
    ]
  },
  {
    id: 'investment-basics',
    title: 'Podstawy inwestowania',
    content: 'Wprowadzenie do świata inwestycji dla początkujących.',
    tips: [
      'Zacznij od edukacji - czytaj książki o finansach',
      'Używaj konta maklerskiego z niskimi opłatami',
      'Dywersyfikuj swoje inwestycje',
      'Inwestuj długoterminowo - nie spekuluj'
    ]
  }
];

export default function Guide() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const currentSection = guideSections.find(section => section.id === activeSection);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Przewodnik po budżetowaniu</h1>
          <p className="text-lg text-secondary">
            Kompleksowy przewodnik, który pomoże Ci opanować sztukę zarządzania finansami osobistymi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with sections */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Spis treści</h2>
              <nav className="space-y-2">
                {guideSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="border border-border rounded-lg p-6">
              {currentSection && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    {currentSection.title}
                  </h2>
                  <p className="text-lg text-secondary mb-6">
                    {currentSection.content}
                  </p>
                  
                  {currentSection.tips && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground">
                        Kluczowe wskazówki:
                      </h3>
                      <ul className="space-y-3">
                        {currentSection.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <p className="text-foreground">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Additional resources */}
            <div className="mt-6 border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Dodatkowe zasoby
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">📚 Polecane książki</h4>
                  <ul className="text-sm text-secondary space-y-1">
                    <li>• Bogaty ojciec, biedny ojciec - Robert Kiyosaki</li>
                    <li>• Finansowy ninja - Michał Szafrański</li>
                    <li>• Psychologia pieniędzy - Morgan Housel</li>
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">🌐 Przydatne strony</h4>
                  <ul className="text-sm text-secondary space-y-1">
                    <li>• Narodowy Bank Polski - kursy walut</li>
                    <li>• Komisja Nadzoru Finansowego</li>
                    <li>• Kalkulatory finansowe online</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
