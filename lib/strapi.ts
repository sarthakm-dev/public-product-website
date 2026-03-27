import { cache } from 'react';

import { ISR_INTERVAL } from '@/lib/constants';
import type {
  BlogPost,
  FeatureItem,
  LandingPage,
  PricingPlan,
  StatsDashboard,
  StatsResponse,
  StrapiCollectionItem,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from '@/lib/types';
import type { FetchOptions } from './types';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

function buildHeaders(auth?: boolean) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (auth && STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${STRAPI_API_TOKEN}`);
  }

  return headers;
}

async function fetchStrapi<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetch(`${STRAPI_URL}${path}`, {
    headers: buildHeaders(options.auth),
    cache: options.noStore ? 'no-store' : undefined,
    next: options.noStore
      ? undefined
      : {
          revalidate: options.revalidate ?? ISR_INTERVAL,
        },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

function extractAttributes<T>(
  item: StrapiCollectionItem<T> | null | undefined
): T | null {
  if (!item) {
    return null;
  }

  if ('attributes' in item && item.attributes) {
    return item.attributes;
  }

  return item as T;
}

function extractCollection<T>(
  response: StrapiCollectionResponse<T>
): Array<T & { id: number }> {
  return response.data.map(item => ({
    id: item.id,
    ...(extractAttributes<T>(item) ?? ({} as T)),
  }));
}

export const getLandingPage = cache(async (): Promise<LandingPage | null> => {
  try {
    const response =
      await fetchStrapi<StrapiSingleResponse<LandingPage>>('/api/landing-page');
    return extractAttributes(response.data);
  } catch {
    return null;
  }
});

export const getFeatures = cache(async (): Promise<FeatureItem[]> => {
  try {
    const response = await fetchStrapi<
      StrapiCollectionResponse<Omit<FeatureItem, 'id'>>
    >('/api/features?sort[0]=id:asc');
    return extractCollection(response);
  } catch {
    return [];
  }
});

export const getPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  try {
    const response = await fetchStrapi<
      StrapiCollectionResponse<Omit<PricingPlan, 'id'>>
    >('/api/pricing-plans?sort[0]=price:asc');
    return extractCollection(response);
  } catch {
    return [];
  }
});

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const response = await fetchStrapi<
      StrapiCollectionResponse<Omit<BlogPost, 'id'>>
    >('/api/blog-posts?sort[0]=publishedAt:desc');
    return extractCollection(response);
  } catch {
    return [];
  }
});

export const getStatsDashboard = cache(
  async (): Promise<StatsDashboard | null> => {
    try {
      const response = await fetchStrapi<StrapiSingleResponse<StatsDashboard>>(
        '/api/stats-dashboard'
      );
      return extractAttributes(response.data);
    } catch {
      return null;
    }
  }
);

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const response = await fetchStrapi<
      StrapiCollectionResponse<Omit<BlogPost, 'id'>>
    >(`/api/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}`, {
      noStore: true,
    });
    return extractCollection(response)[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSubscriberCount() {
  try {
    const response = await fetchStrapi<
      StrapiCollectionResponse<Record<string, never>>
    >('/api/subscribers?pagination[page]=1&pagination[pageSize]=1', {
      auth: true,
      noStore: true,
    });
    return response.meta?.pagination?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function createSubscriber(email: string) {
  const response = await fetch(`${STRAPI_URL}/api/subscribers`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({
      data: {
        email,
        source: 'website',
      },
    }),
    cache: 'no-store',
  });

  return response;
}

export async function registerStrapiUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  return fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: buildHeaders(false),
    body: JSON.stringify({
      username: name,
      email,
      password,
    }),
  });
}

export async function loginStrapiUser(email: string, password: string) {
  return fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: buildHeaders(false),
    body: JSON.stringify({
      identifier: email,
      password,
    }),
    cache: 'no-store',
  });
}

export async function getLiveStats(): Promise<StatsResponse> {
  const statsDashboard = await getStatsDashboard();
  const totalSubscribers = await getSubscriberCount();
  return {
    totalSitesCrawled: statsDashboard?.totalSitesCrawled ?? 0,
    accessibilityIssuesFound: statsDashboard?.accessibilityIssuesFound ?? 0,
    averageComplianceScore: statsDashboard?.averageComplianceScore ?? 0,
    totalSubscribers,
    trend: statsDashboard?.trend ?? [],
  };
}
