import Link from 'next/link';
import { Post } from '@/src/types/post';
import { tagToSlug } from '@/src/lib/utils';

type Props = {
  posts: Post[];
};

export default function TagList({ posts }: Props) {
  // 全記事からタグを集約（重複排除）
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog/tags/${tagToSlug(tag)}`}
          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
