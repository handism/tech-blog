// app/posts/[slug]/page.tsx
import { getAllPosts, getPost } from '@/lib/posts-server';
import { notFound } from 'next/navigation';
import BlogLayout from '@/components/BlogLayout';
import Link from 'next/link';
import { tagToSlug } from '@/lib/utils';

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  if (!post) notFound();

  // 前後の記事を取得
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <BlogLayout posts={posts} toc={post.toc} categories={categories}>
      <article className="prose dark:prose-invert max-w-none">
        <h1>{post.title}</h1>

        {/* メタ情報 */}
        <div className="flex flex-wrap gap-4 text-sm text-text/70 not-prose mb-8">
          {/* 投稿日時 */}
          {post.date && (
            <time dateTime={post.date.toISOString()}>
              📅{' '}
              {post.date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {/* カテゴリ */}
          <Link href={`/blog/categories/${post.category}`} className="hover:underline text-accent">
            📁 {post.category}
          </Link>
          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tagToSlug(tag)}`}
                  className="hover:underline text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 記事本文 */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* 前後の記事へのリンク */}
      <nav className="mt-12 pt-8 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 前の記事 */}
          {prevPost ? (
            <Link
              href={`/blog/posts/${prevPost.slug}`}
              className="block p-4 rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
            >
              <div className="text-sm text-text/60 mb-1">← 前の記事</div>
              <div className="font-medium text-text">{prevPost.title}</div>
            </Link>
          ) : (
            <div></div>
          )}

          {/* 次の記事 */}
          {nextPost ? (
            <Link
              href={`/blog/posts/${nextPost.slug}`}
              className="block p-4 rounded-lg bg-card border border-border hover:bg-secondary transition-colors md:text-right"
            >
              <div className="text-sm text-text/60 mb-1">次の記事 →</div>
              <div className="font-medium text-text">{nextPost.title}</div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </nav>
    </BlogLayout>
  );
}
