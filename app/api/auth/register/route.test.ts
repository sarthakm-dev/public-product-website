import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRoutes } from '@/lib/routes';

const registerStrapiUserMock = vi.fn();

vi.mock('@/lib/strapi', () => ({
  registerStrapiUser: registerStrapiUserMock,
}));

describe(`POST ${apiRoutes.auth.register}`, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid registration payloads', async () => {
    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.auth.register}`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'A',
          email: 'invalid',
          password: '123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Too small: expected string to have >=2 characters',
    });
    expect(registerStrapiUserMock).not.toHaveBeenCalled();
  });

  it('returns success when Strapi creates the account', async () => {
    registerStrapiUserMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({}),
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.auth.register}`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'user@example.com',
          password: 'secret123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(registerStrapiUserMock).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Account created successfully.',
    });
  });

  it('returns the Strapi error payload and status', async () => {
    registerStrapiUserMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        error: { message: 'Email is already taken.' },
      }),
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.auth.register}`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'user@example.com',
          password: 'secret123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Email is already taken.',
    });
  });

  it('returns 500 when registration throws unexpectedly', async () => {
    registerStrapiUserMock.mockRejectedValue(new Error('boom'));

    const { POST } = await import('./route');
    const response = await POST(
      new Request(`http://localhost${apiRoutes.auth.register}`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'user@example.com',
          password: 'secret123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Internal server error. Please try again later.',
    });
  });
});
