import { User } from 'next-auth';
import { afterEach, describe, expect, it, vi } from 'vitest';

const credentialsProviderMock = vi.fn(config => ({
  id: 'credentials',
  type: 'credentials',
  ...config,
}));

const googleProviderMock = vi.fn(config => ({
  id: 'google',
  type: 'oauth',
  ...config,
}));

const loginStrapiUserMock = vi.fn();

vi.mock('next-auth/providers/credentials', () => ({
  default: credentialsProviderMock,
}));

vi.mock('next-auth/providers/google', () => ({
  default: googleProviderMock,
}));

vi.mock('@/lib/strapi', () => ({
  loginStrapiUser: loginStrapiUserMock,
}));

async function importAuthOptions(env?: {
  googleClientId?: string;
  googleClientSecret?: string;
  nextAuthSecret?: string;
}) {
  vi.resetModules();

  if (env?.googleClientId === undefined) {
    delete process.env.GOOGLE_CLIENT_ID;
  } else {
    process.env.GOOGLE_CLIENT_ID = env.googleClientId;
  }

  if (env?.googleClientSecret === undefined) {
    delete process.env.GOOGLE_CLIENT_SECRET;
  } else {
    process.env.GOOGLE_CLIENT_SECRET = env.googleClientSecret;
  }

  if (env?.nextAuthSecret === undefined) {
    delete process.env.NEXTAUTH_SECRET;
  } else {
    process.env.NEXTAUTH_SECRET = env.nextAuthSecret;
  }

  return import('@/lib/auth-options');
}

describe('authOptions', () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.NEXTAUTH_SECRET;
  });

  it('authorizes credentials users against Strapi and exposes the token', async () => {
    loginStrapiUserMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        jwt: 'jwt-token',
        user: {
          id: 42,
          username: 'A11y Admin',
          email: 'admin@example.com',
        },
      }),
    });

    const { authOptions } = await importAuthOptions({
      nextAuthSecret: 'test-secret',
    });

    const credentialsProvider = authOptions.providers?.[0] as ReturnType<
      typeof credentialsProviderMock
    >;

    await expect(
      credentialsProvider.authorize({
        email: 'admin@example.com',
        password: 'secret123',
      })
    ).resolves.toEqual({
      id: '42',
      name: 'A11y Admin',
      email: 'admin@example.com',
      strapiToken: 'jwt-token',
    });

    expect(loginStrapiUserMock).toHaveBeenCalledWith(
      'admin@example.com',
      'secret123'
    );
    expect(authOptions.secret).toBe('test-secret');
    expect(authOptions.pages?.signIn).toBe('/login');
  });

  it('rejects invalid or failed credentials logins', async () => {
    loginStrapiUserMock.mockResolvedValue({ ok: false });

    const { authOptions } = await importAuthOptions();
    const credentialsProvider = authOptions.providers?.[0] as ReturnType<
      typeof credentialsProviderMock
    >;

    await expect(credentialsProvider.authorize()).resolves.toBeNull();
    await expect(
      credentialsProvider.authorize({
        email: 'admin@example.com',
        password: 'wrong-password',
      })
    ).resolves.toBeNull();
  });

  it('adds Google only when both Google env vars are present', async () => {
    const withoutGoogle = await importAuthOptions();
    expect(withoutGoogle.authOptions.providers).toHaveLength(1);
    expect(googleProviderMock).not.toHaveBeenCalled();

    const withGoogle = await importAuthOptions({
      googleClientId: 'google-id',
      googleClientSecret: 'google-secret',
    });

    expect(withGoogle.authOptions.providers).toHaveLength(2);
    expect(googleProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'google-id',
        clientSecret: 'google-secret',
        authorization: {
          params: {
            prompt: 'select_account',
          },
        },
      })
    );
  });

  it('persists ids and Strapi tokens through jwt and session callbacks', async () => {
    const { authOptions } = await importAuthOptions();

    const jwt = authOptions.callbacks?.jwt;
    const session = authOptions.callbacks?.session;

    const tokenFromCredentials = await jwt?.({
      token: {},
      user: {
        id: '42',
        strapiToken: 'jwt-token',
      },
      account: {
        provider: 'credentials',
        type: 'credentials',
        providerAccountId: '42',
      },
      profile: undefined,
      trigger: 'signIn',
      isNewUser: false,
      session: undefined,
    });

    expect(tokenFromCredentials).toMatchObject({
      userId: '42',
      strapiToken: 'jwt-token',
    });

    const tokenFromGoogle = await jwt?.({
      token: tokenFromCredentials ?? {},
      user: undefined as unknown as User,
      account: {
        provider: 'google',
        type: 'oauth',
        providerAccountId: 'google-user',
      },
      profile: undefined,
      trigger: 'signIn',
      isNewUser: false,
      session: undefined,
    });

    expect(tokenFromGoogle).toMatchObject({
      userId: '42',
      strapiToken: undefined,
    });

    await expect(
      session?.({
        session: {
          expires: '2026-03-26T00:00:00.000Z',
          user: { id: '42', name: 'A11y Admin', email: 'admin@example.com' },
        },
        token: {
          userId: '42',
          strapiToken: 'jwt-token',
        },
        user: {
          id: '42',
          name: 'A11y Admin',
          email: 'admin@example.com',
          emailVerified: null,
        },
        newSession: undefined,
        trigger: 'update',
      })
    ).resolves.toMatchObject({
      user: {
        id: '42',
        strapiToken: 'jwt-token',
      },
    });
  });
});
