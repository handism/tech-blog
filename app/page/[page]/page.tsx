import { getAllPosts } from '@/lib/posts-server';
import PostCard from '@/components/PostCard';
import BlogLayout from '@/components/BlogLayout';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 10;

type Props = {
  params: Promise<{ page: string }>;
};

export default async function PageView({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  // ページネーション用に記事を切り出し
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return (
    <BlogLayout posts={allPosts} categories={categories}>
      <div>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </BlogLayout>
  );
}

// 静的生成用のパス生成
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}
