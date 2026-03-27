import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { getBlogPosts } from '@/lib/strapi';
import { formatDate } from '@/lib/utils';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <div className="mb-10 space-y-4">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-400 uppercase">
          Blog
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Accessibility and compliance guidance from CompliScan
        </h1>
      </div>

      <div className="grid gap-6">
        {posts.map(post => (
          <Card key={post.id} className="p-8">
            <p className="text-sm text-cyan-400">
              {formatDate(post.publishedAt)}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {post.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
