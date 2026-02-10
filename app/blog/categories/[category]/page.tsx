// app/blog/categories/[category]/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCard from '@/src/components/PostCard';
import { getAllPosts } from '@/src/lib/posts-server';

/**
 * カテゴリページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return categories.map((category) => ({ category }));
}

/**
 * カテゴリ別の記事一覧ページ。
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const posts = await getAllPosts();
  const filteredPosts = posts.filter((p) => p.category === category);
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={1} />
      </div>
    </BlogLayout>
  );
}
