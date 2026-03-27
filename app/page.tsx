import dynamic from 'next/dynamic';

import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { SectionSkeleton } from '@/components/common/section-skeleton';
import { PricingGrid } from '@/components/marketing/pricing-grid';
import { SectionShell } from '@/components/marketing/section-shell';
import { Testimonials } from '@/components/marketing/testimonials';
import { getFeatures, getLandingPage, getPricingPlans } from '@/lib/strapi';

export const revalidate = 300;

const LiveStats = dynamic(
  () => import('@/components/marketing/live-stats').then(mod => mod.LiveStats),
  {
    loading: () => (
      <SectionSkeleton
        label="live-stats"
        title="Loading live stats"
        lines={4}
      />
    ),
  }
);

const NewsletterForm = dynamic(
  () =>
    import('@/components/marketing/newsletter-form').then(
      mod => mod.NewsletterForm
    ),
  {
    loading: () => (
      <SectionSkeleton
        label="newsletter-form"
        title="Loading newsletter form"
      />
    ),
  }
);

export default async function HomePage() {
  const [landingPage, features, pricingPlans] = await Promise.all([
    getLandingPage(),
    getFeatures(),
    getPricingPlans(),
  ]);

  return (
    <div className="pb-16">
      <Hero landingPage={landingPage} />
      <SectionShell
        eyebrow="Features"
        title={
          landingPage?.featurePageIntro?.title ??
          'Crawl, score, and export with confidence'
        }
        description={
          landingPage?.featurePageIntro?.description ??
          'Tools built for modern web compliance.'
        }
      >
        <FeatureGrid features={features} />
      </SectionShell>
      <SectionShell
        eyebrow="Pricing"
        title={
          landingPage?.pricingPageIntro?.title ??
          'Flexible plans for growing compliance programs'
        }
        description={
          landingPage?.pricingPageIntro?.description ??
          'Pricing cards are generated from Strapi pricing plans and served with ISR.'
        }
      >
        <PricingGrid plans={pricingPlans} />
      </SectionShell>
      <SectionShell
        eyebrow="Trust"
        title="Testimonials and use cases"
        description="What our clients say about us"
      >
        <Testimonials
          testimonials={landingPage?.testimonials ?? []}
          useCases={landingPage?.useCases ?? []}
        />
      </SectionShell>
      <SectionShell
        eyebrow="Telemetry"
        title="Live operational snapshot"
        description="Watch crawl metrics in real time"
      >
        <LiveStats />
      </SectionShell>
      <SectionShell
        eyebrow="Growth"
        title="Newsletter and waitlist capture"
        description="Prospects can subscribe without leaving the landing page, and subscribers are written back to Strapi."
      >
        <NewsletterForm />
      </SectionShell>
    </div>
  );
}
