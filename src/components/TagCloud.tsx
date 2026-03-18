// src/components/TagCloud.tsx
import { tagToSlug } from '@/src/lib/utils';
import Link from 'next/link';
import type { TagCount } from '@/src/lib/posts-view';

type Props = {
  tagCounts: TagCount[];
};

/**
 * タグクラウドを均一サイズで表示する。
 */
export default function TagCloud({ tagCounts }: Props) {
  if (tagCounts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 leading-relaxed">
      {tagCounts.map(({ tag, count }) => (
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
