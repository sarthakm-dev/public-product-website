import { loginSchema, signupSchema } from './schemas';
import { z } from 'zod';
export type RenderMode = 'SSG' | 'ISR' | 'SSR' | 'CSR' | 'Hybrid';

export type DataSource = 'Strapi CMS' | 'Internal API' | 'NextAuth + Strapi';

export type LandingHero = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type LandingSection = {
  title: string;
  description: string;
  items?: Array<{
    title: string;
    description: string;
  }>;
};

export type QuoteItem = {
  quote: string;
  author: string;
  role: string;
};

export type UseCaseItem = {
  title: string;
  description: string;
};

export type LandingPage = {
  seoTitle?: string;
  seoDescription?: string;
  hero?: LandingHero;
  testimonials?: QuoteItem[];
  useCases?: UseCaseItem[];
  featurePageIntro?: LandingSection;
  pricingPageIntro?: LandingSection;
};

export type FeatureItem = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

export type PricingPlan = {
  id: number;
  name: string;
  price: number;
  description?: string;
  features: string[];
  ctaLabel?: string;
  isPopular?: boolean;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
  publishedAt: string;
};

export type StatsResponse = {
  totalSitesCrawled: number;
  accessibilityIssuesFound: number;
  averageComplianceScore: number;
  totalSubscribers: number;
  trend: Array<{
    label: string;
    score: number;
  }>;
};

export type StatsDashboard = {
  totalSitesCrawled: number;
  accessibilityIssuesFound: number;
  averageComplianceScore: number;
  trend: Array<{
    label: string;
    issues: number;
    score: number;
  }>;
};

export type FetchOptions = {
  revalidate?: number;
  noStore?: boolean;
  auth?: boolean;
};

export type StrapiCollectionItem<T> = {
  id: number;
  attributes?: T;
} & T;

export type StrapiCollectionResponse<T> = {
  data: Array<StrapiCollectionItem<T>>;
  meta?: {
    pagination?: {
      total?: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: StrapiCollectionItem<T> | null;
};

export type FormValues = z.infer<typeof loginSchema>;

export type SignUpFormValues = z.infer<typeof signupSchema>;

export type RouteSectionPlaceholderProps = {
  label: string;
  title?: string;
  lines?: number;
  className?: string;
};
