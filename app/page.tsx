// app/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { siteConfig } from '@/src/config/site';
import { getBlogViewContext, paginatePosts } from '@/src/lib/posts-view';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * トップページのメタデータ。
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  alternates: {
    canonical: '/',
  },
};

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

/**
 * トップページ（最新記事一覧とAWS Patternsプロモーションバナー）。
 */
export default async function Home() {
  const { categoryCounts, tagCounts, allPosts } = await getBlogViewContext();
  const { posts, totalPages } = paginatePosts(allPosts, 1, POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      {/* 豪華な AWS Patterns 紹介セクション (ヒーローバナー) */}
      <div className="mb-10 theme-card p-6 md:p-8 border-3 border-border rounded-3xl shadow-[5px_5px_0px_0px_var(--border)] dark:shadow-[5px_5px_0px_0px_var(--accent)] bg-secondary flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="space-y-4 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border-2 border-border/20 rounded-full">
            <span className="text-[10px] font-black text-accent uppercase tracking-wider">
              NEW CONTENT
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-text tracking-tight leading-tight">
            ☁️ AWS Best Practices IaC Gallery
          </h2>
          <p className="text-sm md:text-base text-text/70 leading-relaxed font-medium">
            ECSコンテナ、サーバーレス、高可用性マルチAZ構成など、AWSのベストプラクティスに基づいた
            13 種類の実践的な CloudFormation
            テンプレートとアーキテクチャ図（Draw.io）を公開しました。コピーしてすぐに IaC
            デプロイが可能です。
          </p>
          <div className="pt-2">
            <Link
              href="/aws-best-practices"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-black rounded-xl border-2 border-border hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
            >
              AWS テンプレートを見る
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
        {/* 背景装飾 */}
        <div className="absolute right-[-20px] bottom-[-40px] opacity-10 md:opacity-20 pointer-events-none select-none text-[150px] font-black text-accent font-sans">
          AWS
        </div>
      </div>

      <PostListPage
        tagCounts={tagCounts}
        categoryCounts={categoryCounts}
        posts={posts}
        currentPage={1}
        totalPages={totalPages}
      />
    </div>
  );
}
