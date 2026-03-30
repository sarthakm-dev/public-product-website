import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/constants';

function getBaseUrl() {
  return SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/', '/login', '/signup'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
