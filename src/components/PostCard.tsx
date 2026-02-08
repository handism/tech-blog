import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/src/lib/posts-server';
import TagLink from '@/src/components/TagLink';

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

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-3 text-sm text-text/70 mb-3">
            {post.date && (
              <time dateTime={post.date.toISOString()}>
                📅 {post.date.toLocaleDateString('ja-JP')}
              </time>
            )}
            {/* カテゴリ */}
            <Link
              href={`/blog/categories/${post.category}`}
              className="text-text/80 hover:text-accent hover:underline block"
            >
              📁 {post.category}
            </Link>
          </div>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
