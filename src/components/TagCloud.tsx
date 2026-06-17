// src/components/TagCloud.tsx
import { tagToSlug } from '@/src/lib/utils';
import Link from 'next/link';
import type { TagCount } from '@/src/lib/post-taxonomy';

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
          className="inline-flex items-center text-xs font-extrabold text-text border border-border rounded-lg px-2.5 py-1 bg-secondary shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100"
          title={`${tag} (${count}件)`}
        >
          #{tag}
          <span className="ml-1 text-[10px] text-text/50 font-medium">({count})</span>
        </Link>
      ))}
    </div>
  );
}
