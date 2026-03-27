import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockResponseInit = {
  ok?: boolean;
  status?: number;
  json?: unknown;
};

function createMockResponse({
  ok = true,
  status = 200,
  json,
}: MockResponseInit = {}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(json),
  } as unknown as Response;
}

async function importStrapiModule(env?: {
  strapiUrl?: string;
  strapiApiToken?: string;
}) {
  vi.resetModules();

  if (env?.strapiUrl === undefined) {
    delete process.env.STRAPI_URL;
  } else {
    process.env.STRAPI_URL = env.strapiUrl;
  }

  if (env?.strapiApiToken === undefined) {
    delete process.env.STRAPI_API_TOKEN;
  } else {
    process.env.STRAPI_API_TOKEN = env.strapiApiToken;
  }

  return import('@/lib/strapi');
}

describe('strapi services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete process.env.STRAPI_URL;
    delete process.env.STRAPI_API_TOKEN;
  });

  it('maps landing page attributes from Strapi responses', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      createMockResponse({
        json: {
          data: {
            id: 1,
            attributes: {
              seoTitle: 'Accessibility Monitoring',
            },
          },
        },
      })
    );

    const { getLandingPage } = await importStrapiModule({
      strapiUrl: 'https://cms.example.com',
    });

    await expect(getLandingPage()).resolves.toEqual({
      seoTitle: 'Accessibility Monitoring',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://cms.example.com/api/landing-page',
      expect.objectContaining({
        headers: expect.any(Headers),
        next: { revalidate: 300 },
      })
    );
  });

  it('normalizes collection items and combines live stats from both sources', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        createMockResponse({
          json: {
            data: [
              {
                id: 2,
                attributes: {
                  title: 'Scheduled crawls',
                  description: 'Runs checks automatically',
                  icon: 'clock',
                },
              },
            ],
          },
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          json: {
            data: {
              id: 1,
              attributes: {
                totalSitesCrawled: 120,
                accessibilityIssuesFound: 18,
                averageComplianceScore: 92,
                trend: [{ label: 'Mar', issues: 4, score: 92 }],
              },
            },
          },
        })
      )
      .mockResolvedValueOnce(
        createMockResponse({
          json: {
            data: [{ id: 1 }],
            meta: { pagination: { total: 37 } },
          },
        })
      );

    const { getFeatures, getLiveStats } = await importStrapiModule({
      strapiApiToken: 'secret-token',
    });

    await expect(getFeatures()).resolves.toEqual([
      {
        id: 2,
        title: 'Scheduled crawls',
        description: 'Runs checks automatically',
        icon: 'clock',
      },
    ]);

    await expect(getLiveStats()).resolves.toEqual({
      totalSitesCrawled: 120,
      accessibilityIssuesFound: 18,
      averageComplianceScore: 92,
      totalSubscribers: 37,
      trend: [{ label: 'Mar', issues: 4, score: 92 }],
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'http://localhost:1337/api/subscribers?pagination[page]=1&pagination[pageSize]=1',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.any(Headers),
      })
    );

    const subscriberHeaders = fetchMock.mock.calls[2]?.[1]?.headers as Headers;
    expect(subscriberHeaders.get('Authorization')).toBe('Bearer secret-token');
  });

  it('uses no-store and encoded slugs for single blog post lookups', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      createMockResponse({
        json: {
          data: [
            {
              id: 7,
              attributes: {
                title: 'Audit Ready',
                slug: 'wcag tips & tricks',
                content: 'content',
                publishedAt: '2026-03-26',
              },
            },
          ],
        },
      })
    );

    const { getBlogPostBySlug } = await importStrapiModule();

    await expect(getBlogPostBySlug('wcag tips & tricks')).resolves.toEqual({
      id: 7,
      title: 'Audit Ready',
      slug: 'wcag tips & tricks',
      content: 'content',
      publishedAt: '2026-03-26',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:1337/api/blog-posts?filters[slug][$eq]=wcag%20tips%20%26%20tricks',
      expect.objectContaining({
        cache: 'no-store',
        next: undefined,
      })
    );
  });

  it('returns safe fallbacks when Strapi requests fail', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
      })
    );

    const { getPricingPlans, getStatsDashboard, getSubscriberCount } =
      await importStrapiModule();

    await expect(getPricingPlans()).resolves.toEqual([]);
    await expect(getStatsDashboard()).resolves.toBeNull();
    await expect(getSubscriberCount()).resolves.toBe(0);
  });

  it('posts subscriber and auth payloads to the expected endpoints', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(createMockResponse());

    const { createSubscriber, registerStrapiUser, loginStrapiUser } =
      await importStrapiModule({
        strapiUrl: 'https://cms.example.com',
        strapiApiToken: 'server-token',
      });

    await createSubscriber('hello@example.com');
    await registerStrapiUser({
      name: 'Test User',
      email: 'hello@example.com',
      password: 'secret123',
    });
    await loginStrapiUser('hello@example.com', 'secret123');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://cms.example.com/api/subscribers',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        headers: expect.any(Headers),
        body: JSON.stringify({
          data: {
            email: 'hello@example.com',
            source: 'website',
          },
        }),
      })
    );

    const createSubscriberHeaders = fetchMock.mock.calls[0]?.[1]
      ?.headers as Headers;
    expect(createSubscriberHeaders.get('Authorization')).toBe(
      'Bearer server-token'
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://cms.example.com/api/auth/local/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          username: 'Test User',
          email: 'hello@example.com',
          password: 'secret123',
        }),
      })
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://cms.example.com/api/auth/local',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify({
          identifier: 'hello@example.com',
          password: 'secret123',
        }),
      })
    );
  });
});
