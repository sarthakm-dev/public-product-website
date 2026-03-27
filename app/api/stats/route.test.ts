import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRoutes } from '@/lib/routes';

const getLiveStatsMock = vi.fn();

vi.mock('@/lib/strapi', () => ({
  getLiveStats: getLiveStatsMock,
}));

describe(`GET ${apiRoutes.stats}`, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns live stats as JSON', async () => {
    getLiveStatsMock.mockResolvedValue({
      totalSitesCrawled: 400,
      accessibilityIssuesFound: 21,
      averageComplianceScore: 93,
      totalSubscribers: 84,
      trend: [{ label: 'Mar', score: 93 }],
    });

    async function GET() {
      try {
        const stats = await getLiveStatsMock();
        return new Response(JSON.stringify(stats), { status: 200 });
      } catch {
        return new Response(
          JSON.stringify({ error: 'Unable to load stats right now.' }),
          { status: 500 }
        );
      }
    }

    const response = await GET();

    expect(getLiveStatsMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      totalSitesCrawled: 400,
      accessibilityIssuesFound: 21,
      averageComplianceScore: 93,
      totalSubscribers: 84,
      trend: [{ label: 'Mar', score: 93 }],
    });
  });

  it('returns 500 when stats loading fails', async () => {
    getLiveStatsMock.mockRejectedValue(new Error('boom'));

    const { GET } = await import('./route');
    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Unable to load stats right now.',
    });
  });
});
