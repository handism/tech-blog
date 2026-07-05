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
    <article className="group theme-card theme-card-hover overflow-hidden flex flex-col h-full">
      {/* サムネイル画像 */}
      <Link href={`/blog/posts/${post.slug}`} className="post-card-image-link block shrink-0">
        <div className="post-card-image-wrapper relative w-full h-56 bg-secondary border-b-3 border-border overflow-hidden">
          <Image
            src={post.image ? `/images/${post.image}` : `/og/${post.slug}/image.png`}
            alt={post.title}
            fill
            priority={priorityImage}
            className="object-cover group-hover:scale-105 group-focus-within:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="post-card-content p-6 flex flex-col flex-grow justify-between">
        <div className="post-card-text">
          {/* タイトル */}
          <h2 className="post-card-title text-2xl font-extrabold mb-3 tracking-tight group-hover:text-accent group-focus-within:text-accent transition-colors">
            <Link
              href={`/blog/posts/${post.slug}`}
              className="hover:underline decoration-3 decoration-accent"
            >
              {post.title}
            </Link>
          </h2>

          {/* 説明文 */}
          {post.description && (
            <p className="post-card-description text-text/80 text-sm line-clamp-2 mt-3 mb-4 font-medium">
              {post.description}
            </p>
          )}
        </div>

        <div className="post-card-meta mt-auto">
          <PostMeta post={post} showReadingTime={false} stackTags />
        </div>
      </div>
    </article>
  );
}
