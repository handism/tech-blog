// src/components/TagCloud.tsx
import { getTagsWithCount } from '@/src/lib/post-taxonomy';
import { tagToSlug } from '@/src/lib/utils';
import type { PostMeta } from '@/src/types/post';
import Link from 'next/link';

type Props = {
  posts: PostMeta[];
};

/**
 * タグクラウドを均一サイズで表示する。
 */
export default function TagCloud({ posts }: Props) {
  const tags = getTagsWithCount(posts);
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 leading-relaxed">
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/blog/tags/${tagToSlug(tag)}`}
          className="text-sm text-accent hover:underline transition-colors"
          title={`${tag} (${count}件)`}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
