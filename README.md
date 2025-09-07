# Personal Budget App

A modern, responsive personal budget management application built with Next.js 15, React 19, and Tailwind CSS.

## Features

- 📊 **Dashboard Overview** - Comprehensive financial summary with income, expenses, and balance
- 💰 **Account Management** - Track multiple accounts (checking, savings, credit cards, investments)
- 📈 **Budget Tracking** - Monitor spending against budget categories with visual progress indicators
- 🎯 **Financial Goals** - Set and track progress toward financial objectives
- 💳 **Subscription Management** - Monitor recurring subscriptions and their costs
- 📊 **Cash Flow Forecasting** - Predict future expenses based on historical data
- 📱 **Responsive Design** - Optimized for both mobile and desktop experiences
- 🌙 **Theme Support** - Light/dark mode toggle with system preference detection

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Build Tool**: Turbopack (for faster development)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GreekTheDev/mybudget.git
cd mybudget
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── accounts/          # Account management
│   ├── budget/            # Budget tracking
│   ├── cashflow/          # Cash flow analysis
│   ├── goals/             # Financial goals
│   ├── guide/             # User guide
│   ├── more/              # Additional features
│   ├── reports/           # Financial reports
│   ├── settings/          # App settings
│   ├── subscriptions/     # Subscription management
│   ├── transactions/      # Transaction history
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard home
├── components/            # Reusable components
│   ├── charts/            # Chart components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
│       ├── ConditionalTopBar.tsx
│       ├── MobileNavbar.tsx
│       ├── Sidebar.tsx
│       └── TopBar.tsx
├── hooks/                 # Custom React hooks
│   └── useTheme.ts        # Theme management
└── lib/                   # Utility functions
    ├── theme.ts           # Theme configuration
    ├── types.ts           # TypeScript type definitions
    └── utils.ts           # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Features Overview

### Dashboard
- Financial summary cards (Income, Expenses, Balance)
- Budget progress tracking
- Account overview with balances
- Recent transactions list
- Subscription monitoring
- Cash flow forecasting
- Financial goals progress

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Optimized navigation for mobile devices

### Theme System
- Light and dark mode support
- System preference detection
- Smooth theme transitions
- Consistent color scheme across components

## Deployment

This application is configured for deployment on AWS Amplify. The build process uses Turbopack for faster builds and optimized performance.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support or questions, please contact the development team.