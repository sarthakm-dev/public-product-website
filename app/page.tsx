import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LiveStats } from "@/components/marketing/live-stats";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { SectionShell } from "@/components/marketing/section-shell";
import { Testimonials } from "@/components/marketing/testimonials";
import { getFeatures, getLandingPage, getPricingPlans } from "@/lib/strapi";

export const revalidate = 300;

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
        title={landingPage?.featurePageIntro?.title ?? "Crawl, score, and export with confidence"}
        description={
          landingPage?.featurePageIntro?.description ??
          "Feature content is sourced from the `Feature` collection in Strapi and statically regenerated."
        }
      >
        <FeatureGrid features={features} />
      </SectionShell>
      <SectionShell
        eyebrow="Pricing"
        title={landingPage?.pricingPageIntro?.title ?? "Flexible plans for growing compliance programs"}
        description={
          landingPage?.pricingPageIntro?.description ??
          "Pricing cards are generated from Strapi pricing plans and served with ISR."
        }
      >
        <PricingGrid plans={pricingPlans} />
      </SectionShell>
      <SectionShell
        eyebrow="Trust"
        title="Testimonials and use cases"
        description="These sections show how CMS-authored marketing content is mapped into reusable card layouts."
      >
        <Testimonials
          testimonials={landingPage?.testimonials ?? []}
          useCases={landingPage?.useCases ?? []}
        />
      </SectionShell>
      <SectionShell
        eyebrow="Telemetry"
        title="Live operational snapshot"
        description="This section fetches dynamic aggregate crawl metrics from an internal API route at runtime on the client."
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
