// app/sitemap/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import TagLink from '@/src/components/TagLink';
import { getAllPosts } from '@/src/lib/posts-server';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * サイトマップページのメタデータ。
 */
export const metadata: Metadata = {
  title: 'サイトマップ',
};

/**
 * サイトマップページ。
 */
export default async function SitemapPage() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="max-w-none">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text">サイトマップ</h1>
          <p className="text-sm text-text/60 mt-2">このサイトの主要ページ一覧です。</p>
        </header>

        <section className="space-y-3 mb-10">
          <h2 className="text-2xl font-semibold text-text">ページ</h2>
          <ul className="list-disc pl-6 space-y-2 text-text/80">
            <li>
              <Link href="/" className="hover:text-accent hover:underline">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-accent hover:underline">
                プライバシーポリシー・免責事項
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-text">カテゴリ</h2>
          {categories.length === 0 ? (
            <p className="text-text/60">カテゴリはまだありません。</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2 text-text/80">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/blog/categories/${cat}`}
                    className="hover:text-accent hover:underline"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-text">タグ</h2>
          {tags.length === 0 ? (
            <p className="text-text/60">タグはまだありません。</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text">記事一覧</h2>
          {posts.length === 0 ? (
            <p className="text-text/60">記事はまだありません。</p>
          ) : (
            <ul className="space-y-2 text-text/80">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/posts/${post.slug}`}
                    className="hover:text-accent hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </BlogLayout>
  );
}
