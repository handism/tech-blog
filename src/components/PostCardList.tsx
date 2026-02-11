// src/components/PostCardList.tsx
import PostCard from '@/src/components/PostCard';
import type { PostMeta } from '@/src/types/post';

type Props = {
  posts: PostMeta[];
};

/**
 * 投稿カード一覧を描画する。
 */
export default function PostCardList({ posts }: Props) {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} priorityImage={index === 0} />
      ))}
    </div>
  );
}
