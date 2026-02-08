import Link from 'next/link';
import type { Post } from '@/src/lib/posts-server';
import TagLink from '@/src/components/TagLink';

type Props = {
  post: Post;
  className?: string;
  showReadingTime?: boolean;
  showTags?: boolean;
  stackTags?: boolean;
};

export default function PostMeta({
  post,
  className,
  showReadingTime = true,
  showTags = true,
  stackTags = false,
}: Props) {
  const readingMinutes =
    post.plaintext && post.plaintext.length > 0
      ? Math.max(1, Math.ceil(post.plaintext.length / 500))
      : null;

  return (
    <div
      className={`flex flex-wrap items-center gap-4 text-sm text-text/70 not-prose${
        className ? ` ${className}` : ''
      }`}
    >
      {/* 読了時間 */}
      {showReadingTime && readingMinutes && <span>⏱️ 読了 {readingMinutes} 分</span>}
      {/* 投稿日時 */}
      {post.date && (
        <time dateTime={post.date.toISOString()}>
          📅{' '}
          {post.date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      )}
      {/* カテゴリ */}
      <Link
        href={`/blog/categories/${post.category}`}
        className="text-text/80 hover:text-accent hover:underline block"
      >
        📁 {post.category}
      </Link>
      {/* タグ */}
      {showTags && post.tags.length > 0 && (
        <div className={`flex flex-wrap gap-2${stackTags ? ' w-full' : ''}`}>
          {post.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
