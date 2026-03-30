import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';

import { authOptions } from '@/lib/auth-options';

const handler = NextAuth(authOptions);

export async function GET(
  request: NextRequest,
  context: RouteContext<'/api/auth/[...nextauth]'>
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext<'/api/auth/[...nextauth]'>
) {
  return handler(request, context);
}
