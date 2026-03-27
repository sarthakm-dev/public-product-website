import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { loginStrapiUser } from '@/lib/strapi';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      const response = await loginStrapiUser(
        credentials.email,
        credentials.password
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        jwt: string;
        user: { id: number; username: string; email: string };
      };

      return {
        id: String(data.user.id),
        name: data.user.username,
        email: data.user.email,
        strapiToken: data.jwt,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.strapiToken = (user as { strapiToken?: string }).strapiToken;
      }

      if (account?.provider === 'google') {
        token.strapiToken = undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.strapiToken = token.strapiToken as string | undefined;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
