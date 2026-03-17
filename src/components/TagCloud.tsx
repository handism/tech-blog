// src/components/TagCloud.tsx
import { getTagsWithCount } from '@/src/lib/post-taxonomy';
import { tagToSlug } from '@/src/lib/utils';
import type { PostMeta } from '@/src/types/post';
import Link from 'next/link';

type Props = {
  posts: PostMeta[];
};

/**
 * タグの出現頻度をフォントサイズと透明度に反映したタグクラウドを表示する。
 */
export default function TagCloud({ posts }: Props) {
  const tags = getTagsWithCount(posts);
  if (tags.length === 0) return null;

  // getTagsWithCount は降順ソート済みなので先頭が最大、末尾が最小
  const maxCount = tags[0].count;
  const minCount = tags[tags.length - 1].count;
  const range = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 leading-relaxed">
      {tags.map(({ tag, count }) => {
        const t = (count - minCount) / range;
        // フォントサイズ: 0.85rem（最小）〜 1.5rem（最大）
        const fontSize = (0.85 + t * 0.65).toFixed(2);
        // 透明度: 0.55（最小）〜 1.0（最大）
        const opacity = (0.55 + t * 0.45).toFixed(2);

        return (
          <Link
            key={tag}
            href={`/blog/tags/${tagToSlug(tag)}`}
            style={{ fontSize: `${fontSize}rem`, opacity }}
            className="text-accent hover:opacity-100 hover:underline transition-opacity"
            title={`${tag} (${count}件)`}
          >
            #{tag}
          </Link>
        );
      })}
    </div>
  );
}
