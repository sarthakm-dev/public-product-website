import { notFound } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { getBlogPostBySlug } from '@/lib/strapi';
import { formatDate } from '@/lib/utils';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <Card className="p-10">
        <p className="text-sm text-cyan-400">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          {post.description}
        </p>
        <article className="prose-content mt-10 text-base leading-8 text-slate-200">
          {post.content
            .split('\n')
            .map(paragraph =>
              paragraph.trim() ? <p key={paragraph}>{paragraph}</p> : null
            )}
        </article>
      </Card>
    </section>
  );
}
