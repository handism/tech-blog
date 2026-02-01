'use client';
import SearchBox from '@/components/SearchBox';
import TagList from '@/components/TagList';
import type { TocItem, Post } from '@/lib/posts';

export default function Sidebar({
  posts,
  toc,
  categories,
}: {
  posts?: Post[];
  toc?: TocItem[];
  categories?: string[];
}) {
  return (
    <div className="space-y-6">
      <SearchBox posts={posts ?? []} />

      {/* カテゴリ一覧（全ページ表示可能） */}
      {categories && categories.length > 0 && (
        <div className="p-4 border border-border rounded-lg bg-card">
          <h2 className="font-bold text-lg mb-4 text-text">カテゴリ</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat}>
                <a
                  href={`/blog/categories/${cat}`}
                  className="text-text/80 hover:underline capitalize"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 border border-border rounded-lg bg-card">
        <h2 className="font-bold text-lg mb-4 text-text">タグ</h2>
        <TagList posts={posts ?? []} />
      </div>

      {/* 記事ページのみ TOC を表示 */}
      {toc && toc.length > 0 && (
        <div className="p-4 border border-border rounded-lg bg-card max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="font-bold text-lg mb-4 text-text">目次</h2>
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li key={item.id} className={`pl-${(item.level - 1) * 4}`}>
                <a href={`#${item.id}`} className="text-text/80 hover:underline">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
