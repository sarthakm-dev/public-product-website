import './globals.css';
import { SiteFooter } from '@/components/common/site-footer';
import { SiteHeader } from '@/components/common/site-header';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { siteMetadata } from '@/lib/site-metedata';

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-white">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="app-shell relative flex min-h-screen flex-col overflow-hidden">
            <div className="app-glow pointer-events-none absolute inset-x-0 top-0 h-96" />
            <SiteHeader />
            <main className="relative flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
