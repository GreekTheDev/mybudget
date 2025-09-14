# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
This is a personal budget management application built with Next.js 15, React 19, and Tailwind CSS 4. The app is called "placesobie" and features a comprehensive financial tracking system with support for accounts, transactions, budgets, subscriptions, goals, and cash flow analysis. The application is currently developed in Polish language.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack (user typically has this running)
- `npm run build` - Build for production using Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checking

### Notes
- Uses Turbopack for faster builds and development
- Development server runs on http://localhost:3000
- User prefers not to run build or dev commands automatically - they handle this themselves

## Architecture Overview

### App Structure
- **Next.js 15 App Router**: Uses the new app directory structure with file-based routing
- **Page-based organization**: Each main feature has its own page directory under `src/app/`
- **Component-based architecture**: Highly modular with page-specific components organized under `src/components/pages/`

### Key Directories
```
src/
├── app/                     # Next.js App Router pages
│   ├── accounts/           # Account management
│   ├── budget/             # Budget tracking  
│   ├── transactions/       # Transaction management
│   ├── subscriptions/      # Recurring subscriptions
│   ├── goals/              # Financial goals
│   ├── cashflow/           # Cash flow analysis
│   ├── reports/            # Financial reports
│   └── settings/           # Application settings
├── components/
│   ├── layout/             # Navigation and layout components
│   └── pages/              # Page-specific component modules
│       ├── dashboard/      # Dashboard components
│       ├── accounts/       # Account-related components
│       ├── budget/         # Budget components
│       ├── transactions/   # Transaction components
│       ├── subscriptions/  # Subscription components
│       └── goals/          # Goal components
├── hooks/                  # Custom React hooks
│   └── useTheme.ts        # Theme management hook
└── lib/                    # Utility functions and configurations
    ├── types.ts           # TypeScript type definitions
    ├── theme.ts           # Theme configuration
    └── utils.ts           # Helper functions
```

### Component Organization Pattern
Each page module exports components via index.ts barrel files for clean imports. Components are organized by feature area and follow the pattern:
- Main layout components (e.g., `AccountLayout.tsx`)  
- Feature-specific cards and sections (e.g., `AccountCard.tsx`, `TotalBalanceCard.tsx`)
- Interactive elements (e.g., `AddTransactionModal.tsx`, `TransactionFilters.tsx`)

### Layout System
- **Root Layout** (`src/app/layout.tsx`): Contains Sidebar, ConditionalTopBar, and MobileNavbar
- **Responsive Design**: Desktop shows sidebar + top bar, mobile shows bottom navigation
- **Navigation**: Comprehensive sidebar with 10+ financial management sections

### Theme System
- **Dynamic theming**: Custom CSS variables with light/dark mode support
- **useTheme hook**: Manages theme state, localStorage persistence, and system preference detection
- **Color scheme**: Uses CSS custom properties for consistent theming across components

### TypeScript Types
Comprehensive type definitions in `src/lib/types.ts` covering:
- Core financial entities (Transaction, Account, Subscription)
- UI state management (Theme, navigation)
- Data analysis types (CashFlowData, SpendingReport, BudgetVsActual)
- Complex reporting structures (TrendReport, SavingsReport)

### Key Technical Patterns
- **Path aliases**: Uses `@/*` for `./src/*` imports
- **Client components**: Uses `'use client'` directive for interactive components
- **Tailwind CSS 4**: For styling with CSS custom properties integration
- **Component barrel exports**: Each feature module has an index.ts for clean imports
- **Polish localization**: Navigation and UI text in Polish language

## Important Implementation Details

### Multi-language Support
The project is primarily in Polish. When adding new features, ensure all user-facing text follows the existing Polish language patterns found in the navigation and components.

### Styling Approach  
- Uses Tailwind CSS 4 with CSS custom properties for theming
- Theme variables are set dynamically via JavaScript in useTheme hook
- Consistent use of `var(--property)` for theme-aware styling
- Responsive design with mobile-first approach

### Component Patterns
- Always create reusable components when possible
- Use barrel exports (index.ts) for component modules  
- Follow the established naming conventions (PascalCase for components)
- Use TypeScript interfaces from `types.ts` for data structures

### Development Practices
- ESLint configuration extends Next.js core web vitals and TypeScript rules
- Uses strict TypeScript configuration
- Turbopack enabled for faster development and builds