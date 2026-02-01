import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { TocItem } from '@/lib/posts';

interface BlogLayoutProps {
  children: ReactNode;
  posts?: any[];
  toc?: TocItem[]; // ここで TOC をオプションとして受け取る
  categories?: string[]; // カテゴリ一覧
}

export default function BlogLayout({ children, posts, toc, categories }: BlogLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* メイン */}
        <main className="md:w-2/3">{children}</main>

        {/* サイドバー */}
        <aside className="md:w-1/3 md:sticky md:top-0 md:h-fit">
          {posts && <Sidebar posts={posts} toc={toc} categories={categories} />}
        </aside>
      </div>
    </div>
  );
}
