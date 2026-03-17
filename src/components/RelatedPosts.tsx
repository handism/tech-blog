// src/components/RelatedPosts.tsx
import PostCard from '@/src/components/PostCard';
import type { PostMeta } from '@/src/types/post';

/**
 * 関連記事一覧コンポーネント。
 */
export default function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold mb-6 text-text">関連記事</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
