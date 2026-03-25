import { NextResponse } from 'next/server';
import { createSubscriber } from '@/lib/strapi';
import { subscribeSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid email.' },
      { status: 400 }
    );
  }

  const response = await createSubscriber(parsed.data.email);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          payload?.error?.message ??
          'Unable to store subscriber in Strapi. Check API token and permissions.',
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    message: 'You are on the waitlist. Subscriber saved to Strapi.',
  });
}
