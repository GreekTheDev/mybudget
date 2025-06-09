import { BudgetTemplate } from '../components/budget/BudgetTemplateSelector/BudgetTemplateSelector';

export const budgetTemplates: BudgetTemplate[] = [
  {
    id: 'budget-50-30-20',
    name: 'Budżet 50/30/20',
    description: 'Klasyczny model budżetu, w którym 50% przeznaczasz na potrzeby, 30% na zachcianki, a 20% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 50,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 30,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 20,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  },
  {
    id: 'budget-40-30-30',
    name: 'Budżet 40/30/30',
    description: 'Zrównoważony model budżetu, w którym 40% przeznaczasz na potrzeby, 30% na zachcianki, a 30% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 40,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 30,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 30,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  },
  {
    id: 'budget-60-20-20',
    name: 'Budżet 60/20/20',
    description: 'Model budżetu dla osób z wyższymi kosztami życia, w którym 60% przeznaczasz na potrzeby, 20% na zachcianki, a 20% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 60,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania',
          'Dodatkowe wydatki na potrzeby'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 20,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 20,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  },
  {
    id: 'budget-70-15-15',
    name: 'Budżet 70/15/15',
    description: 'Model budżetu dla osób z bardzo wysokimi kosztami życia, w którym 70% przeznaczasz na potrzeby, 15% na zachcianki, a 15% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 70,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania',
          'Dodatkowe wydatki na potrzeby'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 15,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 15,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  },
  {
    id: 'budget-40-40-20',
    name: 'Budżet 40/40/20',
    description: 'Model budżetu dla osób, które chcą przeznaczyć więcej na przyjemności, w którym 40% przeznaczasz na potrzeby, 40% na zachcianki, a 20% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 40,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 40,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty',
          'Dodatkowe wydatki na przyjemności'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 20,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  },
  {
    id: 'budget-45-35-20',
    name: 'Budżet 45/35/20',
    description: 'Zrównoważony model budżetu, w którym 45% przeznaczasz na potrzeby, 35% na zachcianki, a 20% na oszczędności i spłatę długów.',
    sections: [
      {
        name: 'Potrzeby',
        percentage: 45,
        items: [
          'Mieszkanie',
          'Media',
          'Jedzenie',
          'Transport',
          'Opieka zdrowotna',
          'Ubezpieczenia',
          'Spłata minimalnych rat długów',
          'Podstawowe ubrania'
        ]
      },
      {
        name: 'Chcenia',
        percentage: 35,
        items: [
          'Rozrywka',
          'Hobby',
          'Restauracje i kawiarnie',
          'Ubrania',
          'Subskrypcje',
          'Wakacje i wyjazdy',
          'Książki i czasopisma',
          'Prezenty'
        ]
      },
      {
        name: 'Oszczędności i Spłata Długów',
        percentage: 20,
        items: [
          'Oszczędności na emeryturę',
          'Fundusz awaryjny',
          'Inwestycje',
          'Spłata długów'
        ]
      }
    ]
  }
];