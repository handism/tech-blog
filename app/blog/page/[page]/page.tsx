import { getAllPosts } from '@/src/lib/posts-server';
import PostCard from '@/src/components/PostCard';
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import { notFound, redirect } from 'next/navigation';

const POSTS_PER_PAGE = 10;

type Props = {
  params: { page: string };
};

export const dynamicParams = false;

export default async function PageView({ params }: Props) {
  const { page } = params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // 1ページ目は / にリダイレクト
  if (currentPage === 1) {
    redirect('/');
  }

  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  if (currentPage > totalPages) {
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

// 静的生成用のパス生成（2ページ目以降のみ）
export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // 2ページ目以降のみ生成
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}
