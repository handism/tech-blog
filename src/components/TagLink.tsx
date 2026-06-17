// src/components/TagLink.tsx
import { tagToSlug } from '@/src/lib/utils';
import Link from 'next/link';

/**
 * タグリンクのプロパティ。
 */
type Props = {
  tag: string;
  className?: string;
};

/**
 * タグページへのリンクを表示する。
 */
export default function TagLink({ tag, className }: Props) {
  return (
    <Link
      href={`/blog/tags/${tagToSlug(tag)}`}
      className={`inline-flex items-center px-2.5 py-1 text-xs font-extrabold text-text border border-border rounded-lg bg-secondary shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100${className ? ` ${className}` : ''}`}
    >
      #{tag}
    </Link>
  );
}
