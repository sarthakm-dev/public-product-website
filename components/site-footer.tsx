import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 text-sm text-slate-400 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="font-medium text-white">
            Web Crawl Accessibility & Compliance Monitoring
          </p>
          <p className="mt-2 max-w-xl">
            A public-facing site powered by Next.js, NextAuth, Recharts, and
            Strapi content delivered through SSG, ISR, SSR, and CSR patterns.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </footer>
  );
}
