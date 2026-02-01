import Link from 'next/link';
import { Post } from '@/lib/posts';
import { tagToSlug } from '@/lib/utils';

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <article
      className="p-6 rounded-lg 
                bg-card
                border border-border
                shadow-sm"
    >
      {/* タイトル */}
      <h2 className="text-xl font-bold mb-2 text-text">
        <Link href={`/blog/posts/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* メタ情報 */}
      <div className="text-sm text-text/70 mb-3 flex gap-3 flex-wrap">
        <span>📅 {post.date ? post.date.toLocaleDateString('ja-JP') : '日付未設定'}</span>

        {post.category && (
          <Link href={`/blog/categories/${post.category}`} className="hover:underline">
            📂 {post.category}
          </Link>
        )}
      </div>

      {/* タグ */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${tagToSlug(tag)}`}
            className="
          text-xs
          text-text/80
          rounded-full
          px-3 py-1
          bg-bg
          hover:bg-border
          transition
        "
          >
            #{tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
