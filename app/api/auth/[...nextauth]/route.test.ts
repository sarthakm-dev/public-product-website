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

  it('creates one NextAuth handler and delegates both GET and POST to it', async () => {
    const handler = vi.fn();
    nextAuthMock.mockReturnValue(handler);

    const routeModule = await import('./route');
    const request = {} as Request;
    const context = {
      params: Promise.resolve({ nextauth: ['session'] }),
    } as RouteContext<'/api/auth/[...nextauth]'>;

    expect(nextAuthMock).toHaveBeenCalledWith(authOptionsMock);

    await routeModule.GET(request as never, context);
    await routeModule.POST(request as never, context);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(1, request, context);
    expect(handler).toHaveBeenNthCalledWith(2, request, context);
  });
});
