// app/about/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import { getAllPostMeta } from '@/src/lib/posts-server';
import { PenSquare, Sword, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { FaGithub } from 'react-icons/fa';

/**
 * Aboutページのメタデータ。
 */
export const metadata: Metadata = {
  title: 'About',
};

/**
 * Aboutページ。
 */
export default async function AboutPage() {
  const posts = await getAllPostMeta();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="max-w-none">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text">About</h1>
          <p className="text-sm text-text/60 mt-2">最終更新日: 2026-02-08</p>
        </header>

        {/* このブログについて */}
        <section className="mb-12 w-full">
          <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
            <PenSquare className="h-7 w-7 text-accent" />
            このブログについて
          </h2>
          <h3 className="text-lg font-semibold mb-4 text-text">特徴</h3>
          <div className="bg-secondary/30 rounded-xl p-4 border-l-4 border-accent mb-12">
            <p className="text-text/90 leading-relaxed">
              現役の内製クラウドエンジニアによる技術ブログです。日々の業務やプライベートで得た知識の備忘録として運用しています。
            </p>
            <p className="text-text/90 leading-relaxed mt-4">
              当ブログは<code className="px-2 py-1 bg-accent/10 rounded text-accent">Next.js</code>
              にて作成し、
              <code className="px-2 py-1 bg-accent/10 rounded text-accent">GitHub Pages</code>
              上でホスティングしています。
              <code className="px-2 py-1 bg-accent/10 rounded text-accent">
                SSG（静的サイト生成）
              </code>
              に対応しているので軽快に動作するはずです。
            </p>
            <p className="text-text/90 leading-relaxed mt-4">
              ダークモードにも対応しており、OSの設定でダークモードをONにしている場合は自動的に背景が暗くなります。
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-text">技術スタック</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GitHub Pages', 'Markdown'].map(
              (tech) => (
                <div
                  key={tech}
                  className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent hover:shadow-md transition-all"
                >
                  <span className="text-text font-medium">{tech}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* プロフィール */}
        <section className="mb-12 w-full">
          <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
            <Sword className="h-7 w-7 text-accent" />
            プロフィール
          </h2>

          <h3 className="text-lg font-semibold mb-4 text-text">運営者情報</h3>
          {/* プロフィールカード */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-lg hover:shadow-xl transition-shadow w-full">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* アイコン */}
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent shadow-lg">
                  <img
                    src="/images/wolf-icon.webp"
                    alt="狼の画像"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* テキスト */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-3 text-text">Handism</h2>
                <p className="text-text/80 leading-relaxed">
                  フロントエンド → バックエンド → クラウドエンジニア/DevOps/SRE
                </p>
              </div>
            </div>
          </div>

          {/* RPG風スキルゲージ */}
          <h3 className="text-lg font-semibold mb-4 text-text">スキルゲージ</h3>
          <div className="bg-linear-to-br from-secondary/60 to-card rounded-2xl border border-border p-6 shadow-lg">
            <div className="grid gap-4">
              {[
                {
                  name: 'フロントエンド (C言語 / HTML / CSS / JavaScript / Next.js / Vue)',
                  level: 78,
                  tone: 'from-violet-400 to-violet-600',
                },
                { name: 'バックエンド (Java / PHP)', level: 31, tone: 'from-cyan-400 to-cyan-600' },
                {
                  name: 'クラウドアーキテクチャ (AWS)',
                  level: 30,
                  tone: 'from-emerald-400 to-emerald-600',
                },
                { name: 'DevOps / SRE', level: 28, tone: 'from-amber-400 to-amber-600' },
                // { name: 'Observability', level: 68, tone: 'from-pink-400 to-pink-600' },
              ].map((skill) => (
                <div key={skill.name} className="grid gap-2">
                  <div className="grid grid-cols-[1fr_auto] items-center">
                    <span className="text-sm font-semibold text-text">{skill.name}</span>
                    <span className="text-xs text-text/70">Lv.{skill.level}</span>
                  </div>
                  <div className="relative h-4 rounded-full bg-black/10 overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${skill.tone} shadow-[inset_0_0_8px_rgba(255,255,255,0.35)]`}
                      style={{ width: `${skill.level}%` }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.35),transparent_55%)]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-text/60">
              クエストログ：年間を通してスキルアップを継続中。
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12 w-full">
          <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
            <Mail className="h-7 w-7 text-accent" />
            問い合わせ
          </h2>
          <div className="bg-linear-to-r from-accent/10 to-purple-500/10 rounded-xl p-6 border border-accent/30">
            <p className="text-text/80 mb-4">お気軽にご連絡ください</p>
            <a
              href="https://github.com/handism"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <FaGithub className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
