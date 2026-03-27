import { NextResponse } from 'next/server';

import { getLiveStats } from '@/lib/strapi';

export async function GET() {
  try {
    const stats = await getLiveStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { error: 'Unable to load stats right now.' },
      { status: 500 }
    );
  }
}
