'use client';

import Link from 'next/link';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex items-center justify-between max-w-7xl px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="rounded-2xl bg-cyan-400/15 p-2 text-cyan-400">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="md:text-sm text-xs font-semibold tracking-[0.14em] text-cyan-400 uppercase">
              Compli Scan
            </p>
            <p className="hidden md:block text-sm text-slate-200">
              {SITE_NAME}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center md:gap-3 gap-1">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link className="hidden md:block" href="/signup">
            <Button size="sm">Start Free Crawl</Button>
          </Link>
        </div>
        {/* Mobile menu toggle */}
        <Button
          className="md:hidden p-2 text-slate-500"
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-slate-300">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      )}
    </header>
  );
}
