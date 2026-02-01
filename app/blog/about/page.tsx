import { getAllPosts } from '@/lib/posts-server';
import BlogLayout from '@/components/BlogLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default async function AboutPage() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>About</h1>
        <h2>このブログについて</h2>
        <img src="./public/wolf-icon.webp" alt="狼の画像" />
        <p>
          現役のインハウスエンジニアによる技術ブログです。日々の業務やプライベートで得た知識の備忘録として運用しています。
          当ブログは`VitePress`にて作成し、`GitHub Pages`上でホスティングしています。
          `SSG（静的サイト生成）×
          SPA（シングルページアプリケーション）`に対応しているので軽快に動作するはずです。
          ダークモードにも対応しており、OSの設定でダークモードをONにしている場合は自動的に背景が暗くなります。
        </p>
        <h2>Contact</h2>
        <p>
          <Link href="https://github.com/handism" className="text-accent hover:underline">
            GitHub
          </Link>
        </p>
      </div>
    </BlogLayout>
  );
}
