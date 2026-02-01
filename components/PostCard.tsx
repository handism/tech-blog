import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts-server';
import { tagToSlug } from '@/lib/utils';

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
                {post.date.toLocaleDateString('ja-JP')}
              </time>
            )}
            <span>📁 {post.category}</span>
          </div>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tagToSlug(tag)}`}
                  className="text-xs px-2 py-1 bg-secondary text-text rounded hover:bg-accent hover:text-background transition-colors"
                  // onClick削除 ← ここを削除
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
