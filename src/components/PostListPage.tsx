// src/components/PostListPage.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCardList from '@/src/components/PostCardList';
import type { CategoryCount, TagCount } from '@/src/lib/post-taxonomy';
import type { PostMeta } from '@/src/types/post';

type PostListPageProps = {
  tagCounts: TagCount[];
  categoryCounts: CategoryCount[];
  posts: PostMeta[];
  heading?: string;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
};

/**
 * 記事一覧系ページの共通表示。
 */
export default function PostListPage({
  tagCounts,
  categoryCounts,
  posts,
  heading,
  emptyMessage,
  currentPage,
  totalPages,
}: PostListPageProps) {
  return (
    <BlogLayout tagCounts={tagCounts} categoryCounts={categoryCounts}>
      <div>
        {heading && <h1 className="text-3xl font-bold mb-6">{heading}</h1>}

        {posts.length === 0 ? (
          emptyMessage ? (
            <p className="text-text/60">{emptyMessage}</p>
          ) : null
        ) : (
          <PostCardList posts={posts} />
        )}

        {typeof currentPage === 'number' && typeof totalPages === 'number' && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </BlogLayout>
  );
}
