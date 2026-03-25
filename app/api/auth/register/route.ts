import { NextResponse } from 'next/server';

import { registerStrapiUser } from '@/lib/strapi';
import { registerSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid payload' },
      { status: 400 }
    );
  }

  const response = await registerStrapiUser(parsed.data);
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error?.message ?? 'Unable to create account in Strapi.' },
      { status: response.status }
    );
  }

  return NextResponse.json({ message: 'Account created successfully.' });
}
