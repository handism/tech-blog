// src/components/PostCard.tsx
import PostMeta from '@/src/components/PostMeta';
import type { PostMeta as PostMetaType } from '@/src/types/post';
import Image from 'next/image';
import Link from 'next/link';

/**
 * 記事カードのプロパティ。
 */
type PostCardProps = {
  post: PostMetaType;
  priorityImage?: boolean;
};

/**
 * 記事一覧向けのカード表示。
 */
export default function PostCard({ post, priorityImage = false }: PostCardProps) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* サムネイル画像 */}
      {post.image ? (
        <Link href={`/blog/posts/${post.slug}`} className="block">
          <div className="relative w-full h-48 bg-secondary">
            <Image
              src={`/images/${post.image}`}
              alt={post.title}
              fill
              priority={priorityImage}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      ) : (
        <Link href={`/blog/posts/${post.slug}`} className="block">
          <div className="w-full h-48 bg-secondary flex items-center justify-center text-text/30">
            No Image
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* タイトル */}
        <h2 className="text-2xl font-bold mb-2 hover:text-accent transition-colors">
          <Link href={`/blog/posts/${post.slug}`} className="hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h2>

        <PostMeta post={post} showReadingTime={false} stackTags />
      </div>
    </article>
  );
}
