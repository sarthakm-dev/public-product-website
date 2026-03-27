import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRoutes } from '@/lib/routes';

const getServerSessionMock = vi.fn();
const authOptionsMock = { providers: [] };

vi.mock('next-auth', () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock('@/lib/auth-options', () => ({
  authOptions: authOptionsMock,
}));

describe(`POST ${apiRoutes.mockCrawl}`, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when no user session is present', async () => {
    getServerSessionMock.mockResolvedValue(null);

    const { POST } = await import('./route');
    const response = await POST();

    expect(getServerSessionMock).toHaveBeenCalledWith(authOptionsMock);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'Unauthorized',
    });
  });

  it('returns success for authenticated users', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: '7', email: 'user@example.com' },
    });

    const { POST } = await import('./route');
    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Mock crawl queued successfully for the current account.',
    });
  });

  it('returns 500 when the session lookup fails', async () => {
    getServerSessionMock.mockRejectedValue(new Error('boom'));

    const { POST } = await import('./route');
    const response = await POST();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Unable to queue a mock crawl right now.',
    });
  });
});
