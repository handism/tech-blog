// app/blog/page/[page]/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { siteConfig } from '@/src/config/site';
import { getBlogViewContext, paginatePosts } from '@/src/lib/posts-view';
import { notFound, redirect } from 'next/navigation';

/**
 * ページネーション用のルートパラメータ。
 */
type Props = {
  params: Promise<{ page: string }>;
};

/**
 * ページネーション付き記事一覧ページ。
 */
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

  const { allPosts, categories } = await getBlogViewContext();
  const { posts, totalPages } = paginatePosts(
    allPosts,
    currentPage,
    siteConfig.pagination.postsPerPage
  );

  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <PostListPage
      allPosts={allPosts}
      categories={categories}
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}

/**
 * 静的生成用のパス生成（2ページ目以降のみ）。
 */
export async function generateStaticParams() {
  const { allPosts } = await getBlogViewContext();
  const { totalPages } = paginatePosts(allPosts, 1, siteConfig.pagination.postsPerPage);

  // 2ページ目以降のみ生成
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}
