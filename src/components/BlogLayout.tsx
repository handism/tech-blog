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
      <div className="grid md:grid-cols-3 gap-8">
        <main className="md:col-span-2">{children}</main>

        {/* サイドバー */}
        <aside className="md:w-1/3 self-start">
          {posts && <Sidebar posts={posts} toc={toc} categories={categories} />}
        </aside>
      </div>
    </div>
  );
}
