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
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent${className ? ` ${className}` : ''}`}
    >
      #{tag}
    </Link>
  );
}
