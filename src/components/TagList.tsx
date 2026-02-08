import { Post } from '@/src/types/post';
import TagLink from '@/src/components/TagLink';

type Props = {
  posts: Post[];
};

export default function TagList({ posts }: Props) {
  // 全記事からタグを集約（重複排除）
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagLink key={tag} tag={tag} />
      ))}
    </div>
  );
}
