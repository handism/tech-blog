// app/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { siteConfig } from '@/src/config/site';
import { getBlogViewContext, paginatePosts } from '@/src/lib/posts-view';
import type { Metadata } from 'next';

/**
 * トップページのメタデータ。
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  alternates: {
    canonical: '/',
  },
};

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

/**
 * トップページ（最新記事一覧）。
 */
export default async function Home() {
  const { categoryCounts, tagCounts, allPosts } = await getBlogViewContext();
  const { posts, totalPages } = paginatePosts(allPosts, 1, POSTS_PER_PAGE);

  return (
    <PostListPage
      tagCounts={tagCounts}
      categoryCounts={categoryCounts}
      posts={posts}
      currentPage={1}
      totalPages={totalPages}
    />
  );
}
