# Personal Budget App – Instructions  

> use this for shadcn always: npx shadcn@latest 

  
## 1. Cel projektu  
  
- Zapewnienie jasnego, przejrzystego widoku **budżetu osobistego**.    
- Synchronizacja pomiędzy urządzeniami dzięki Supabase Realtime.    
- Maksymalnie prosta obsługa: „Inbox zero” dla transakcji, drag-and-drop kategorii, szybkie filtry.  

## 4. Makiety ekranów  
  
### 4.1 Mobile-first nawigacja (bottom navbar)  
  
1. **Budżet**    
   - Przychody • Wydatki • Przepływy pieniężne • Saldo  
2. **Konta**    
   - Lista • Dodawanie • Edycja • Usuwanie • Konfiguracja  
3. **Transakcje**    
   - Lista • CRUD • Szybkie kategoryzowanie  
4. **Raporty**    
   - Net Worth • Wydatki/Przychody: dzień-►rok • Kategorie • Konta  
5. **Ustawienia**    
   - Zmiana hasła • Usunięcie konta 
### 4.2 Desktop (sidebar left)  
  
Identyczna hierarchia jak powyżej – jedyna różnica to layout.  
  

  
## 7. TODO: UI & Brand  

SHADCN DOCS: https://ui.shadcn.com/docs/installation

### USE DARK MODE FROM SHADCN

Install next-themes

Start by installing next-themes:

npm install next-themes

Create a theme provider
components/theme-provider.tsx

"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

Wrap your root layout

Add the ThemeProvider to your root layout and add the suppressHydrationWarning prop to the html tag.
app/layout.tsx

import { ThemeProvider } from "@/components/theme-provider"
 
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}

Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode.
  
### 7.1 Komponenty Shadcn  
npx shadcn@latest add 
    - accordion - for categories in the budget view
    - alert - for notifications
    - alert-dialog - for editing / deleting transactions
    - avatar - for the users
    - badge - for filters in the transactions table
    - button - just buttons
    - calendar - for date selection in transactions
    - card - for login
    - chart - for statictis in the reports view
    - checkbox - for checkboxes
    - table - npm install @tanstack/react-table - for tables in the budget, transactions etc
    - dialog - for creating a transaction
    - drawer - for fast adding transaction on mobile
    - input - for inputs 
    - progress - for progress in expenses or goals
    - resizable - for fun layout
    - scroll-area - i guess better scrolling?
    - select - for selecting 
    - separator - nice separator
    - sheet - maybe we will use it somewhere
    - sidebar - sidebar of course for the web desktop version 
    - skeleton - for slow loading on slow internet devices
    - sonner - for notifications 
    - tabs - will use it somewhere - maybe account or something
    - switch - also cool, will use it somewhere
    - toggle-group - dashboard (change Day D Week W Month M)
  
### 7.2 Paleta kolorów  

Below is a pragmatic, fully-accessible palette that feels “financial” (greens for growth, neutrals for clarity) while still looking modern.
All swatches have at least AA contrast against their paired foregrounds.
Token	                Light (🏦 “Mint Day”)	        Dark (🌒 “Midnight Mint”)	        Notes / Usage
--background	        #F9FAFB	                         #0F172A         	                 App body
--surface	            #FFFFFF	                         #1E293B         	                 Cards, sheets
--surface-muted	        #F1F5F9	                         #334155         	                 Table rows, zebra stripes
--primary	            #0E9F6E	                         #34D399         	                 Main brand color, CTA buttons
--primary-foreground	#FFFFFF	                         #0F172A         	                 Text/Icon on primary
--secondary	            #2563EB	                         #60A5FA         	                 Links, secondary buttons
--secondary-foreground	#FFFFFF	                         #0F172A         	                 —
--success (Income)	    #22C55E	                         #4ADE80         	                 Positive amounts, alerts
--danger (Expense)	    #DC2626	                         #F87171         	                 Negative amounts, errors
--warning	            #D97706	                         #FBBF24         	                 Budget overspent, caution banners
--neutral-text	        #334155	                         #E2E8F0         	                 Default body text
--neutral-muted	        #64748B	                         #94A3B8         	                 Helper text, labels
--border	            #E2E8F0	                         #475569         	                 Card & table borders
    
  
### 7.3 Ikony  
Korzystamy z react icons https://react-icons.github.io/react-icons/icons/fa6/

import { IconName } from "react-icons/fa6";

chcę także dać użytkownikowi możliwość wyboru ikon z biblioteki FontAwesome. Wtedy będzie potrzebny fontawesome-svg-core oraz @fortawesome/free-solid-svg-icons. 

  
