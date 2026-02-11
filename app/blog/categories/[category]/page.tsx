// app/blog/categories/[category]/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCardList from '@/src/components/PostCardList';
import { getBlogViewContext } from '@/src/lib/posts-view';
import { categoryToSlug, findCategoryBySlug } from '@/src/lib/utils';

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
  const actualCategory = findCategoryBySlug(slug, categories);

  if (!actualCategory) {
    return (
      <BlogLayout posts={posts} categories={categories}>
        <div>
          <h1 className="text-3xl font-bold mb-6">カテゴリが見つかりません</h1>
        </div>
      </BlogLayout>
    );
  }

  const filteredPosts = posts.filter((p) => p.category === actualCategory);

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Category: {actualCategory}</h1>

        <PostCardList posts={filteredPosts} />

        <Pagination currentPage={1} totalPages={1} />
      </div>
    </BlogLayout>
  );
}
