import { NextResponse } from 'next/server';

import { getLiveStats } from '@/lib/strapi';

export async function GET() {
  const stats = await getLiveStats();
  return NextResponse.json(stats);
}
