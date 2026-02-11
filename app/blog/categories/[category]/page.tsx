// app/blog/categories/[category]/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { getBlogViewContext } from '@/src/lib/posts-view';
import { resolveSlugOrNotFound } from '@/src/lib/slug-resolver';
import { categoryToSlug } from '@/src/lib/utils';

/**
 * カテゴリページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const { categories } = await getBlogViewContext();

  return categories.map((category) => ({ category: categoryToSlug(category) }));
}

/**
 * カテゴリ別の記事一覧ページ。
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;

  const { allPosts: posts, categories } = await getBlogViewContext();
  const actualCategory = resolveSlugOrNotFound(slug, categories, categoryToSlug);

  const filteredPosts = posts.filter((p) => p.category === actualCategory);

  return (
    <PostListPage
      allPosts={posts}
      categories={categories}
      posts={filteredPosts}
      heading={`Category: ${actualCategory}`}
      currentPage={1}
      totalPages={1}
    />
  );
}
