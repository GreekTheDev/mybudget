# MyBudget - Personal Finance Management Application

## 1. Project Overview

MyBudget is a modern personal finance management application built with Next.js that helps users track their finances with clarity and ease. The application provides:

- Clear, transparent view of personal budget and financial status
- Device synchronization through Supabase Realtime
- Simplified user experience with "Inbox zero" for transactions, drag-and-drop categorization, and quick filters

## 2. Project Structure

### 2.1 Core Directories

- **app/**: Next.js app router pages and layouts
  - `/accounts`: Account management pages
  - `/budget`: Budget planning and tracking
  - `/dashboard`: Main dashboard with financial overview
  - `/reports`: Financial reports and analytics
  
- **components/**: React components
  - `/ui`: Reusable UI components from shadcn/ui
  - App-specific components for accounts, transactions, etc.
  
- **contexts/**: React context providers for state management
  - `account-context.tsx`: Manages accounts and transactions data
  
- **hooks/**: Custom React hooks
  - `use-mobile.ts`: Responsive design hook
  
- **lib/**: Utility functions and helpers
  - `utils.ts`: General utility functions

### 2.2 Key Data Models

- **Account**: Financial accounts (checking, savings, credit cards, etc.)
  ```typescript
  interface Account {
    id: string
    name: string
    type: string
    subtype: string
    balance: number
    category: string
  }
  ```

- **Transaction**: Financial transactions
  ```typescript
  interface Transaction {
    id: string
    accountId: string
    date: Date
    payee: string
    category: string
    memo: string
    expense: number
    income: number
  }
  ```

- **CategoryBudget**: Budget allocations for categories
  ```typescript
  interface CategoryBudget {
    id: string
    name: string
    assignedAmount: number
    groupId: string
  }
  ```

## 3. Application Features

### 3.1 Navigation Structure

#### Mobile Navigation (Bottom Navbar)
1. **Budget**
   - Income • Expenses • Cash Flow • Balance
2. **Accounts**
   - List • Add • Edit • Delete • Configure
3. **Transactions**
   - List • CRUD • Quick Categorization
4. **Reports**
   - Net Worth • Income/Expenses: day→year • Categories • Accounts
5. **Settings**
   - Change Password • Delete Account

#### Desktop Navigation (Left Sidebar)
- Identical hierarchy to mobile, with layout optimized for larger screens

## 4. Components and Pages

### 4.1 Pages
- `app/page.tsx`: Landing page
- `app/dashboard/page.tsx`: Main dashboard with financial overview
- `app/accounts/page.tsx`: Accounts listing and management
- `app/accounts/[accountId]/page.tsx`: Individual account details
- `app/budget/page.tsx`: Budget planning and tracking
- `app/reports/page.tsx`: Financial reports and analytics

### 4.2 Key Components
- `app-sidebar.tsx`: Main application sidebar for desktop
- `bottom-nav.tsx`: Bottom navigation for mobile
- `account-transactions.tsx`: Displays account transactions
- `add-account-dialog.tsx`: Dialog for adding new accounts
- `add-transaction-dialog.tsx`: Dialog for adding new transactions
- `add-category-group-dialog.tsx`: Dialog for adding category groups
- `CategoryBudgetTable.tsx`: Table for budget categories and allocations
- `month-navigation.tsx`: Navigation for selecting month/period
- `money-status-indicator.tsx`: Visual indicator for financial status
- `mode-toggle.tsx`: Toggle for light/dark mode
- `theme-provider.tsx`: Provider for theme management

### 4.3 UI Components (shadcn/ui)
- `accordion`: For categories in the budget view
- `alert`: For notifications
- `alert-dialog`: For editing/deleting transactions
- `avatar`: For user profiles
- `badge`: For filters in the transactions table
- `button`: Standard buttons
- `calendar`: For date selection in transactions
- `card`: For login and information cards
- `chart`: For statistics in the reports view
- `checkbox`: For checkboxes
- `table`: For displaying transactions and budget data (uses @tanstack/react-table)
- `dialog`: For creating transactions
- `drawer`: For fast adding transaction on mobile
- `input`: For text input fields
- `progress`: For progress in expenses or goals
- `resizable`: For flexible layouts
- `scroll-area`: For improved scrolling experience
- `select`: For dropdown selections
- `separator`: For visual separation
- `sheet`: For additional UI panels
- `sidebar`: For desktop navigation
- `skeleton`: For loading states
- `sonner`: For notifications
- `tabs`: For tabbed interfaces
- `switch`: For toggle controls
- `toggle-group`: For dashboard period selection (Day/Week/Month)

## 5. Technical Stack

### 5.1 Core Technologies
- **Framework**: Next.js 15.3.4
- **Language**: TypeScript 5.x
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Context API
- **Data Tables**: TanStack React Table 8.21.3
- **Date Handling**: date-fns 4.1.0
- **Theming**: next-themes 0.4.6
- **Drag and Drop**: @dnd-kit libraries

### 5.2 Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9.x
- **Build Tool**: Turbopack (for development)

## 6. Design System

### 6.1 Color Palette

The application uses a financial-themed color palette that balances professionalism with modern design:

| Token | Light Mode ("Mint Day") | Dark Mode ("Midnight Mint") | Usage |
|-------|-------------------------|----------------------------|-------|
| --background | #F9FAFB | #0F172A | App body |
| --surface | #FFFFFF | #1E293B | Cards, sheets |
| --surface-muted | #F1F5F9 | #334155 | Table rows, zebra stripes |
| --primary | #0E9F6E | #34D399 | Main brand color, CTA buttons |
| --primary-foreground | #FFFFFF | #0F172A | Text/Icon on primary |
| --secondary | #2563EB | #60A5FA | Links, secondary buttons |
| --secondary-foreground | #FFFFFF | #0F172A | — |
| --success (Income) | #22C55E | #4ADE80 | Positive amounts, alerts |
| --danger (Expense) | #DC2626 | #F87171 | Negative amounts, errors |
| --warning | #D97706 | #FBBF24 | Budget overspent, caution banners |
| --neutral-text | #334155 | #E2E8F0 | Default body text |
| --neutral-muted | #64748B | #94A3B8 | Helper text, labels |
| --border | #E2E8F0 | #475569 | Card & table borders |

### 6.2 Icons
- Using React Icons library: https://react-icons.github.io/react-icons/icons/fa6/
- Import syntax: `import { IconName } from "react-icons/fa6";`
- Optional: FontAwesome integration with `fontawesome-svg-core` and `@fortawesome/free-solid-svg-icons`

## 7. Development Guidelines

### 7.1 Component Installation
- Use shadcn/ui for consistent components: `npx shadcn@latest add [component-name]`
- Always install components individually to keep bundle size optimized

### 7.2 Theme Support
- The application supports light and dark modes using next-themes
- Installation: `npm install next-themes`
- Implementation:
  1. Create theme provider in `components/theme-provider.tsx`
  2. Wrap root layout with ThemeProvider
  3. Add mode toggle component for user preference
- System preference detection is enabled by default

### 7.3 Responsive Design
- Mobile-first approach with optimizations for desktop
- Bottom navigation on mobile, sidebar on desktop
- Responsive components that adapt to screen size