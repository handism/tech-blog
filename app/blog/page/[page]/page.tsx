// app/blog/page/[page]/page.tsx
import { getAllPosts } from '@/src/lib/posts-server';
import PostCard from '@/src/components/PostCard';
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import { notFound, redirect } from 'next/navigation';
import { siteConfig } from '@/src/config/site';

type Props = {
  params: Promise<{ page: string }>;
};

export default async function PageView({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // 1ページ目は / にリダイレクト
  if (currentPage === 1) {
    redirect('/');
  }

  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / siteConfig.pagination.postsPerPage);

  if (currentPage > totalPages) {
    notFound();
  }

  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  // ページネーション用に記事を切り出し
  const startIndex = (currentPage - 1) * siteConfig.pagination.postsPerPage;
  const endIndex = startIndex + siteConfig.pagination.postsPerPage;
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
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / siteConfig.pagination.postsPerPage);

  // 2ページ目以降のみ生成
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}
