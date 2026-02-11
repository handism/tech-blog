// app/blog/categories/[category]/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCardList from '@/src/components/PostCardList';
import { getBlogViewContext } from '@/src/lib/posts-view';

/**
 * カテゴリページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const { categories } = await getBlogViewContext();

  return categories.map((category) => ({ category }));
}

/**
 * カテゴリ別の記事一覧ページ。
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const { allPosts: posts, categories } = await getBlogViewContext();
  const filteredPosts = posts.filter((p) => p.category === category);

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

        <PostCardList posts={filteredPosts} />

        <Pagination currentPage={1} totalPages={1} />
      </div>
    </BlogLayout>
  );
}
