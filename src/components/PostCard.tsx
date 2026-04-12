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
    <article className="group bg-card border border-border/60 rounded-3xl overflow-hidden hover:shadow-2xl shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1">
      {/* サムネイル画像 */}
      {post.image ? (
        <Link href={`/blog/posts/${post.slug}`} className="block">
          <div className="relative w-full h-56 bg-secondary overflow-hidden">
            <Image
              src={`/images/${post.image}`}
              alt={post.title}
              fill
              priority={priorityImage}
              className="object-cover group-hover:scale-105 group-focus-within:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      ) : (
        <Link href={`/blog/posts/${post.slug}`} className="block">
          <div className="w-full h-56 bg-secondary flex items-center justify-center text-text/30 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
            No Image
          </div>
        </Link>
      )}

      <div className="p-6">
        {/* タイトル */}
        <h2 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-accent group-focus-within:text-accent transition-colors">
          <Link href={`/blog/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* 説明文 */}
        {post.description && (
          <p className="text-text/70 text-sm line-clamp-2 mt-3 mb-4">{post.description}</p>
        )}

        <PostMeta post={post} showReadingTime={false} stackTags />
      </div>
    </article>
  );
}
