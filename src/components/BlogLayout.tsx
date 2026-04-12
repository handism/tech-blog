// src/components/BlogLayout.tsx
import Sidebar from '@/src/components/Sidebar';
import type { CategoryCount, TagCount } from '@/src/lib/post-taxonomy';
import { TocItem } from '@/src/types/post';
import { ReactNode } from 'react';

/**
 * ブログレイアウトのプロパティ。
 */
interface BlogLayoutProps {
  children: ReactNode;
  toc?: TocItem[];
  categoryCounts?: CategoryCount[];
  tagCounts?: TagCount[];
}

/**
 * ブログページの共通レイアウト。
 */
export default function BlogLayout({ children, toc, categoryCounts, tagCounts }: BlogLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        {/* メイン */}
        <main className="min-w-0">{children}</main>

        {/* サイドバー */}
        <aside className="relative">
          <Sidebar toc={toc} categoryCounts={categoryCounts} tagCounts={tagCounts} />
        </aside>
      </div>
    </div>
  );
}
