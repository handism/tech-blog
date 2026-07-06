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
    <div className="post-card-list">
      {posts.map((post, index) => (
        <div key={post.slug} className={`post-card-item ${index === 0 ? 'featured-card' : ''}`}>
          <PostCard post={post} priorityImage={index === 0} />
        </div>
      ))}
    </div>
  );
}
