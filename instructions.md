# Budżet Domowy - Dokumentacja Projektu

## Informacje o projekcie

Aplikacja Budżet Domowy to narzędzie do zarządzania finansami osobistymi, które pozwala użytkownikom śledzić swoje wydatki, planować budżet i analizować swoje nawyki finansowe.

### Technologie

- **Frontend**: React + TypeScript + Vite
- **Stylowanie**: CSS Modules z custom properties
- **Routing**: React Router
- **Zarządzanie stanem**: (do ustalenia - Context API lub Redux)
- **Walidacja formularzy**: (do ustalenia)

## Wykonane prace

1. Utworzenie projektu React z Vite i TypeScript
2. Konfiguracja CSS Modules
3. Utworzenie podstawowej struktury projektu
4. Implementacja systemu zmiennych CSS (custom properties)
5. Stworzenie podstawowych komponentów layoutu (Header, Footer)
6. Konfiguracja React Router
7. Przygotowanie podstawowej struktury aplikacji

## Następne kroki

### Priorytet wysoki

1. Stworzenie podstawowych komponentów UI:
   - Button (różne warianty)
   - Input (różne typy)
   - Select
   - Checkbox
   - Radio
   - Card
   - Modal
   - Alert/Notification

2. Implementacja podstawowych stron:
   - Dashboard (przegląd finansów)
   - Transakcje (lista, dodawanie, edycja, usuwanie)
   - Budżet (planowanie, kategorie)
   - Raporty (wykresy, statystyki)
   - Ustawienia (preferencje użytkownika)

3. Implementacja systemu zarządzania stanem aplikacji

### Priorytet średni

1. Dodanie formularzy z walidacją
2. Implementacja lokalnego przechowywania danych (localStorage)
3. Dodanie wykresów i wizualizacji danych
4. Implementacja filtrowania i sortowania transakcji

### Priorytet niski

1. Dodanie motywów (jasny/ciemny)
2. Implementacja eksportu danych (CSV, PDF)
3. Dodanie powiadomień i przypomnień
4. Optymalizacja wydajności

## Struktura projektu

```
src/
├── assets/           # Statyczne zasoby (obrazy, ikony)
├── components/       # Komponenty wielokrotnego użytku
│   ├── common/       # Podstawowe komponenty UI
│   ├── forms/        # Komponenty formularzy
│   └── layout/       # Komponenty układu strony
├── hooks/            # Własne hooki React
├── pages/            # Komponenty stron
├── services/         # Usługi (API, localStorage)
├── styles/           # Globalne style i zmienne CSS
├── types/            # Definicje typów TypeScript
├── utils/            # Funkcje pomocnicze
├── App.tsx           # Główny komponent aplikacji
└── main.tsx          # Punkt wejścia aplikacji
```

## Napotkane problemy i wyzwania

- Konfiguracja CSS Modules z TypeScript wymaga dodatkowych deklaracji typów
- Zarządzanie stanem aplikacji będzie wymagało przemyślanej struktury danych
- Implementacja responsywnego interfejsu użytkownika wymaga dokładnego planowania
- Naprawiono błędy w plikach konfiguracyjnych JSON:
  - W pliku `amplify-config.json` usunięto zduplikowane obiekty JSON
  - W pliku `package.json` dodano brakujący przecinek po polu `"type": "module"`
  - Usunięto nieprawidłowy plik `package.json` z katalogu nadrzędnego, który zawierał zduplikowane obiekty JSON
- Dodano pakiet `@types/node` do zależności deweloperskich, aby umożliwić korzystanie z modułów Node.js (np. `path`) w konfiguracji TypeScript

## Konwencje kodowania

- Nazwy komponentów: PascalCase
- Nazwy plików komponentów: PascalCase
- Nazwy zmiennych i funkcji: camelCase
- Nazwy klas CSS: camelCase
- Importy: grupowane według typu (React, komponenty, style, etc.)
- Komentarze: tylko dla skomplikowanej logiki
- Formatowanie: 2 spacje jako wcięcie