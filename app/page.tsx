// app/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCard from '@/src/components/PostCard';
import { siteConfig } from '@/src/config/site';
import { getAllPosts } from '@/src/lib/posts-server';
import type { Metadata } from 'next';

/**
 * トップページのメタデータ。
 */
export const metadata: Metadata = {
  title: siteConfig.name,
};

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

/**
 * トップページ（最新記事一覧）。
 */
export default async function Home() {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  // 1ページ目の記事を取得
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

  return (
    <BlogLayout posts={allPosts} categories={categories}>
      <div>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={totalPages} />
      </div>
    </BlogLayout>
  );
}
