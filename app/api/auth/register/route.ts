import { NextResponse } from 'next/server';

import { parseJsonSafely } from '@/lib/api';
import { registerStrapiUser } from '@/lib/strapi';
import { registerSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid payload' },
        { status: 400 }
      );
    }

    const response = await registerStrapiUser(parsed.data);
    const data = await parseJsonSafely<{
      error?: { message?: string };
    }>(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message ?? 'Unable to create account in Strapi.',
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({ message: 'Account created successfully.' });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
