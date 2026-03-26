import { FeatureGrid } from '@/components/marketing/feature-grid';
import { SectionShell } from '@/components/marketing/section-shell';
import { getFeatures, getLandingPage } from '@/lib/strapi';

export default async function FeaturesPage() {
  const [landingPage, features] = await Promise.all([
    getLandingPage(),
    getFeatures(),
  ]);

  return (
    <SectionShell
      eyebrow="Product Features"
      title={
        landingPage?.featurePageIntro?.title ??
        'Accessibility crawl operations at enterprise depth'
      }
      description={
        landingPage?.featurePageIntro?.description ??
        'This route is statically regenerated from Strapi feature collection data.'
      }
    >
      <FeatureGrid features={features} />
    </SectionShell>
  );
}
