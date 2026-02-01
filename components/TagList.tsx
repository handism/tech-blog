import Link from 'next/link';
import { Post } from '@/lib/posts';
import { tagToSlug } from '@/lib/utils';

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
          className="
              text-xs
              text-text/80
              px-2
              py-1
              rounded-full
              bg-bg
              hover:bg-border
              transition
              tag-chip
            "
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
