// app/posts/[slug]/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import PostMeta from '@/src/components/PostMeta';
import { getAllPostMeta, getPost } from '@/src/lib/posts-server';
import { getBlogViewContext } from '@/src/lib/posts-view';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * 記事詳細ページのルートパラメータ。
 */
type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * 記事詳細ページのメタデータを生成する。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: '記事が見つかりません',
    };
  }

  return {
    title: post.title,
    description: post.plaintext?.slice(0, 160),
  };
}

/**
 * 静的生成用のパラメータを生成する。
 */
export async function generateStaticParams() {
  const posts = await getAllPostMeta();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * 記事詳細ページ。
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const { allPosts: posts, categories } = await getBlogViewContext();

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
        <PostMeta post={post} />

        {/* サムネイル画像（オプション） */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 mb-6 md:mb-8 lg:mb-10 not-prose">
            <Image
              src={`/images/${post.image}`}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* 記事本文 */}
        <div className="mt-16 md:mt-20" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <ImageModal />

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
      <CopyButtonScript />
    </BlogLayout>
  );
}
