import { ReactNode } from 'react';
import Sidebar from '@/src/components/Sidebar';
import { Post, TocItem } from '@/src/types/post';

interface BlogLayoutProps {
  children: ReactNode;
  posts?: Post[];
  toc?: TocItem[]; // ここで TOC をオプションとして受け取る
  categories?: string[]; // カテゴリ一覧
}

export default function BlogLayout({ children, posts, toc, categories }: BlogLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        {/* メイン */}
        <main className="min-w-0">{children}</main>

        {/* サイドバー */}
        <aside className="relative">
          {posts && <Sidebar posts={posts} toc={toc} categories={categories} />}
        </aside>
      </div>
    </div>
  );
}
