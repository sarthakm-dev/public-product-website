import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { LandingPage } from '@/lib/types';
import { features } from '@/lib/constants';

export function Hero({ landingPage }: { landingPage: LandingPage | null }) {
  const hero = landingPage?.hero;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-8 lg:pt-24">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              {hero?.title ??
                'CMS content missing: create Landing Page hero in Strapi.'}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              {hero?.subtitle ??
                'Connect Strapi content to populate the hero copy, CTAs, testimonials, and route intros.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={hero?.primaryCtaHref ?? '/signup'}>
              <Button size="lg">
                {hero?.primaryCtaLabel ?? 'Start Free Crawl'}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href={hero?.secondaryCtaHref ?? '/features'}>
              <Button variant="secondary" size="lg">
                {hero?.secondaryCtaLabel ?? 'Explore Features'}
              </Button>
            </Link>
          </div>
        </div>

        <Card className="relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_55%)]" />
          <div className="relative grid gap-4">
            {features.map(item => (
              <div
                key={item}
                className="hero-status-row flex items-center justify-between rounded-3xl px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-cyan-400/10 p-2 text-cyan-400">
                    <Shield className="size-4" />
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
                <span className="font-mono text-xs text-cyan-400">LIVE</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
