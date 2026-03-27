import { beforeEach, describe, expect, it, vi } from 'vitest';

const nextAuthMock = vi.fn();
const authOptionsMock = { pages: { signIn: '/login' } };

vi.mock('next-auth', () => ({
  default: nextAuthMock,
}));

vi.mock('@/lib/auth-options', () => ({
  authOptions: authOptionsMock,
}));

describe('NextAuth route wiring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates one NextAuth handler and exports it for both GET and POST', async () => {
    const handler = vi.fn();
    nextAuthMock.mockReturnValue(handler);

    const routeModule = await import('./route');

    expect(nextAuthMock).toHaveBeenCalledWith(authOptionsMock);
    expect(routeModule.GET).toBe(handler);
    expect(routeModule.POST).toBe(handler);
  });
});
