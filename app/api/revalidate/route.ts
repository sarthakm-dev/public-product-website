import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const MARKETING_PATHS = ['/', '/features', '/pricing', '/blog'];

function getConfiguredSecret() {
  return (
    process.env.REVALIDATE_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    ''
  );
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')?.trim() ?? '';
  const scope = request.nextUrl.searchParams.get('scope');
  const configuredSecret = getConfiguredSecret();

  if (!configuredSecret) {
    return NextResponse.json(
      { revalidated: false, error: 'Missing revalidation secret.' },
      { status: 500 }
    );
  }

  if (secret !== configuredSecret) {
    return NextResponse.json(
      { revalidated: false, error: 'Invalid revalidation secret.' },
      { status: 401 }
    );
  }

  const paths = scope === 'marketing' ? MARKETING_PATHS : [];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    paths,
  });
}
