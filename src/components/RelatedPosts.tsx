// src/components/RelatedPosts.tsx
import type { PostMeta } from '@/src/types/post';
import { Calendar, Folder } from 'lucide-react';
import Link from 'next/link';

/**
 * 関連記事一覧コンポーネント。
 */
export default function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-bold mb-4 text-text">関連記事</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/posts/${post.slug}`}
            className="group block bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-accent/40 transition-all"
          >
            <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-2 mb-2">
              {post.title}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text/60">
              {post.date && (
                <time
                  dateTime={post.date.toISOString()}
                  className="inline-flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  {post.date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              )}
              <span className="inline-flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {post.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
