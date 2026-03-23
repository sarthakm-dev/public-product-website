import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "Premium public product website for web crawl accessibility and compliance monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="app-shell relative flex min-h-screen flex-col overflow-hidden">
            <div className="app-glow pointer-events-none absolute inset-x-0 top-0 h-96" />
            <SiteHeader />
            <main className="relative flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
