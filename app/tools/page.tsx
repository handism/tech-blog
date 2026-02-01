import { getAllPosts } from '@/lib/posts-server';
import BlogLayout from '@/components/BlogLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools',
};

export default async function ToolsPage() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Tools</h1>

        <p>便利なWebツール集です。</p>

        <h2>デザインツール</h2>
        <ul>
          <li>
            <Link href="/tools/memphis" className="text-accent hover:underline font-semibold">
              Memphis Generator
            </Link>{' '}
            - 80年代風のカラフルな背景画像ジェネレーター
          </li>
        </ul>

        <h2>開発環境</h2>
        <ul>
          <li>
            <strong>エディタ:</strong> VSCode
          </li>
          <li>
            <strong>ターミナル:</strong> iTerm2
          </li>
          <li>
            <strong>シェル:</strong> Zsh
          </li>
        </ul>

        <h2>言語・フレームワーク</h2>
        <ul>
          <li>TypeScript / JavaScript</li>
          <li>React / Next.js</li>
          <li>Python</li>
          <li>Go</li>
        </ul>

        <h2>インフラ・クラウド</h2>
        <ul>
          <li>AWS</li>
          <li>Docker</li>
          <li>Kubernetes</li>
        </ul>

        <h2>その他</h2>
        <ul>
          <li>Git / GitHub</li>
          <li>Notion</li>
          <li>Figma</li>
        </ul>
      </div>
    </BlogLayout>
  );
}
