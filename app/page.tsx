import { getAllPosts } from '@/lib/posts-server';
import PostCard from '@/components/PostCard';
import BlogLayout from '@/components/BlogLayout';
import Pagination from '@/components/Pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ホーム',
};

const POSTS_PER_PAGE = 10;

export default async function Home() {
  const allPosts = getAllPosts();
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
