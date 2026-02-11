// src/components/TagList.tsx
import TagLink from '@/src/components/TagLink';
import { getAllTags } from '@/src/lib/posts-view';
import { PostMeta } from '@/src/types/post';

/**
 * タグ一覧のプロパティ。
 */
type Props = {
  posts: PostMeta[];
};

/**
 * 投稿から集計したタグの一覧を表示する。
 */
export default function TagList({ posts }: Props) {
  const tags = getAllTags(posts);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagLink key={tag} tag={tag} />
      ))}
    </div>
  );
}
