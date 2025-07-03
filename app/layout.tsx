import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AccountProvider } from "@/contexts/account-context";
import { LayoutWrapper } from "@/components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyBudget - Personal Budget Manager",
  description: "A beautiful personal budget management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccountProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="w-full min-h-screen">
                <main className="flex-1 w-full overflow-x-hidden">
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </main>
              </SidebarInset>
            </SidebarProvider>
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
