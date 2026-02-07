import type { Metadata } from 'next';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
};

export default async function AboutPage() {
  return (
    <div className="flex flex-col items-stretch p-6 min-h-screen mx-auto max-w-6xl">
      <header className="mb-12 text-center w-full">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3 tracking-tight">
          <User className="w-10 h-10 text-accent" />
          About
        </h1>
        <p className="mt-2 font-medium">このブログについて</p>
      </header>

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
                loading="eager"
              />
            </div>
          </div>

          {/* テキスト */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-3 text-text">Handism</h2>
            <p className="text-text/80 leading-relaxed">内製クラウドエンジニア</p>
          </div>
        </div>
      </div>

      {/* このブログについて */}
      <section className="mb-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
          <span className="text-3xl">📝</span>
          このブログについて
        </h2>
        <div className="bg-secondary/30 rounded-xl p-6 border-l-4 border-accent">
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
      </section>

      {/* 技術スタック */}
      <section className="mb-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          技術スタック
        </h2>
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

      {/* RPG風スキルゲージ */}
      <section className="mb-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
          <span className="text-3xl">🗡️</span>
          Skill Gauge
        </h2>
        <div className="bg-linear-to-br from-secondary/60 to-card rounded-2xl border border-border p-6 shadow-lg">
          <div className="grid gap-4">
            {[
              { name: 'Cloud Architecture', level: 92, tone: 'from-emerald-400 to-emerald-600' },
              { name: 'Backend (Java / Spring)', level: 85, tone: 'from-cyan-400 to-cyan-600' },
              { name: 'Frontend (Next.js)', level: 78, tone: 'from-violet-400 to-violet-600' },
              { name: 'DevOps / CI-CD', level: 74, tone: 'from-amber-400 to-amber-600' },
              { name: 'Observability', level: 68, tone: 'from-pink-400 to-pink-600' },
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
            Quest log: 年間を通してスキルアップを継続中。
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12 w-full">
        <h2 className="text-2xl font-bold mb-6 text-text flex items-center gap-3">
          <span className="text-3xl">📧</span>
          Contact
        </h2>
        <div className="bg-linear-to-r from-accent/10 to-purple-500/10 rounded-xl p-6 border border-accent/30">
          <p className="text-text/80 mb-4">お気軽にご連絡ください</p>
          <a
            href="https://github.com/handism"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
