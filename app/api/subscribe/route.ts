import { NextResponse } from 'next/server';
import { createSubscriber } from '@/lib/strapi';
import { parseJsonSafely } from '@/lib/api';
import { subscribeSchema } from '@/lib/schemas';
import {
  ALREADY_ON_WAITLIST_MESSAGE,
  SUBSCRIBE_FAILURE_MESSAGE,
} from '@/lib/constants';

function isExistingSubscriber(status: number, message?: string) {
  return (
    status === 400 &&
    (/This attribute must be unique/i.test(message ?? '') ||
      /attribute should be unique/i.test(message ?? ''))
  );
}

function getSubscriberErrorMessage(message?: string) {
  if (!message) {
    return SUBSCRIBE_FAILURE_MESSAGE;
  }

  if (/missing or invalid credentials/i.test(message)) {
    return SUBSCRIBE_FAILURE_MESSAGE;
  }

  return message;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid email.' },
        { status: 400 }
      );
    }

    const response = await createSubscriber(parsed.data.email);
    const payload = await parseJsonSafely<{
      error?: { message?: string };
    }>(response);
    const errorMessage = payload?.error?.message;

    if (!response.ok) {
      if (isExistingSubscriber(response.status, errorMessage)) {
        return NextResponse.json({
          message: ALREADY_ON_WAITLIST_MESSAGE,
        });
      }

      return NextResponse.json(
        {
          error: getSubscriberErrorMessage(errorMessage),
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      message: 'You are on the waitlist. Subscriber saved to Strapi.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
