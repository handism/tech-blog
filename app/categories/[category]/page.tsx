// app/blog/categories/[category]/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { siteConfig } from '@/src/config/site';
import { getBlogViewContext } from '@/src/lib/posts-view';
import { resolveSlugOrNotFound } from '@/src/lib/slug-resolver';
import { categoryToSlug } from '@/src/lib/utils';
import type { Metadata } from 'next';

/**
 * カテゴリページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const { categories } = await getBlogViewContext();

  return categories.map((category) => ({ category: categoryToSlug(category) }));
}

/**
 * カテゴリページのメタデータを生成する。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const { categories } = await getBlogViewContext();
  const actualCategory = resolveSlugOrNotFound(slug, categories, categoryToSlug);
  const title = `${actualCategory} | ${siteConfig.name}`;
  const description = `「${actualCategory}」カテゴリの記事一覧`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

/**
 * カテゴリ別の記事一覧ページ。
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;

  const { allPosts: posts, categories, categoryCounts, tagCounts } = await getBlogViewContext();
  const actualCategory = resolveSlugOrNotFound(slug, categories, categoryToSlug);

  const filteredPosts = posts.filter((p) => p.category === actualCategory);

  return (
    <PostListPage
      tagCounts={tagCounts}
      categoryCounts={categoryCounts}
      posts={filteredPosts}
      heading={`Category: ${actualCategory}`}
      currentPage={1}
      totalPages={1}
    />
  );
}
