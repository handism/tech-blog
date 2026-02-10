// src/components/TagList.tsx
import TagLink from '@/src/components/TagLink';
import { Post } from '@/src/types/post';

/**
 * タグ一覧のプロパティ。
 */
type Props = {
  posts: Post[];
};

/**
 * 投稿から集計したタグの一覧を表示する。
 */
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
