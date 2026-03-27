import { describe, expect, it, vi, beforeEach } from 'vitest';
import { apiRoutes } from '@/lib/routes';

const createSubscriberMock = vi.fn();

vi.mock('@/lib/strapi', () => ({
  createSubscriber: createSubscriberMock,
}));

describe(`POST ${apiRoutes.subscribe}`, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid emails', async () => {
    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'bad-email' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid email address',
    });
    expect(createSubscriberMock).not.toHaveBeenCalled();
  });

  it('returns success when Strapi accepts the subscriber', async () => {
    createSubscriberMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
      status: 200,
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(createSubscriberMock).toHaveBeenCalledWith('user@example.com');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'You are on the waitlist. Subscriber saved to Strapi.',
    });
  });

  it('treats existing subscriber (409) as waitlist success', async () => {
    createSubscriberMock.mockResolvedValue({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({
        error: { message: 'Subscriber already exists.' },
      }),
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: 'Subscriber already exists.',
    });
  });

  it('treats Strapi unique attribute errors as already-on-waitlist success', async () => {
    createSubscriberMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        error: { message: 'This attribute should be unique' },
      }),
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'You are already on the waitlist. Subscriber already exists.',
    });
  });

  it('hides Strapi credential errors behind a user-friendly message', async () => {
    createSubscriberMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: vi.fn().mockResolvedValue({
        error: { message: 'Missing or invalid credentials' },
      }),
    });

    const { POST } = await import('./route');

    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error:
        'Newsletter signups are temporarily unavailable. Please try again later.',
    });
  });

  it('returns 500 when an unexpected error occurs', async () => {
    createSubscriberMock.mockRejectedValue(new Error('boom'));

    const { POST } = await import('./route');
    const response = await POST(
      new Request(`http://localhost${apiRoutes.subscribe}`, {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Internal server error. Please try again later.',
    });
  });
});
