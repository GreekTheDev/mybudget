# MyBudget Information

## Summary
MyBudget is a personal budget management application built with Next.js. It allows users to track accounts, transactions, and manage their personal finances with a modern UI.

## Structure
- **app/**: Next.js app router pages and layouts
- **components/**: React components including UI components and app-specific components
- **contexts/**: React context providers for state management
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and helpers
- **public/**: Static assets

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.x
**Framework**: Next.js 15.3.4
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 19.0.0
- Next.js 15.3.4
- Radix UI components (various UI primitives)
- TanStack React Table 8.21.3
- date-fns 4.1.0
- next-themes 0.4.6
- Tailwind CSS utilities (tailwind-merge, class-variance-authority)

**Development Dependencies**:
- TypeScript 5.x
- ESLint 9.x
- Tailwind CSS 4.x
- Various type definitions (@types/react, @types/node)

## Build & Installation
```bash
# Install dependencies
npm install

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Main Files & Resources
**Entry Points**:
- `app/layout.tsx`: Root layout with providers
- `app/page.tsx`: Main landing page
- `app/dashboard/page.tsx`: Dashboard page
- `app/accounts/page.tsx`: Accounts listing page
- `app/accounts/[accountId]/page.tsx`: Individual account page

**State Management**:
- `contexts/account-context.tsx`: Manages accounts and transactions data

**Key Components**:
- `components/app-sidebar.tsx`: Main application sidebar
- `components/account-transactions.tsx`: Displays account transactions
- `components/add-account-dialog.tsx`: Dialog for adding new accounts
- `components/ui/`: Reusable UI components library

## Project Configuration
**TypeScript**: Configured with strict mode, ES2017 target
**Next.js**: App Router, Turbopack for development
**Path Aliases**: `@/*` maps to the root directory
**Styling**: Tailwind CSS with PostCSS