import { PricingGrid } from '@/components/marketing/pricing-grid';
import { SectionShell } from '@/components/marketing/section-shell';
import { getLandingPage, getPricingPlans } from '@/lib/strapi';

export const revalidate = 300;

export default async function PricingPage() {
  const [landingPage, plans] = await Promise.all([
    getLandingPage(),
    getPricingPlans(),
  ]);

  return (
    <SectionShell
      eyebrow="Pricing"
      title={
        landingPage?.pricingPageIntro?.title ??
        'Choose a plan for your audit velocity'
      }
      description={
        landingPage?.pricingPageIntro?.description ??
        'Pricing content is fetched from Strapi and regenerated on an ISR interval.'
      }
    >
      <PricingGrid plans={plans} />
    </SectionShell>
  );
}
