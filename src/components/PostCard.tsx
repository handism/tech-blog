import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/src/lib/posts-server';
import PostMeta from '@/src/components/PostMeta';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/posts/${post.slug}`} className="block">
        {/* サムネイル画像 */}
        {post.image ? (
          <div className="relative w-full h-48 bg-secondary">
            <Image
              src={`/images/${post.image}`}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-secondary flex items-center justify-center text-text/30">
            No Image
          </div>
        )}

        <div className="p-6">
          {/* タイトル */}
          <h2 className="text-2xl font-bold mb-2 hover:text-accent transition-colors">
            {post.title}
          </h2>

          <PostMeta
            post={post}
            showReadingTime={false}
            className="gap-3 mb-3"
            stackTags
          />
        </div>
      </Link>
    </article>
  );
}
