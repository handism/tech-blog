// src/components/TagLink.tsx
import Link from 'next/link';
import { tagToSlug } from '@/src/lib/utils';

type Props = {
  tag: string;
  className?: string;
};

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
