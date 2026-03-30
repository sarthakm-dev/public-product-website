import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/constants';
import { getBlogPosts } from '@/lib/strapi';

function getBaseUrl() {
  return SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const staticRoutes = ['', '/features', '/pricing', '/blog'];
  const blogPosts = await getBlogPosts();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  return [...staticEntries, ...blogEntries];
}
