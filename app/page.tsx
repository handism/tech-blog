// app/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCardList from '@/src/components/PostCardList';
import { siteConfig } from '@/src/config/site';
import { getBlogViewContext, paginatePosts } from '@/src/lib/posts-view';
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
  const { allPosts, categories } = await getBlogViewContext();
  const { posts, totalPages } = paginatePosts(allPosts, 1, POSTS_PER_PAGE);

  return (
    <BlogLayout posts={allPosts} categories={categories}>
      <div>
        <PostCardList posts={posts} />

        <Pagination currentPage={1} totalPages={totalPages} />
      </div>
    </BlogLayout>
  );
}
