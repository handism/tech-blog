// app/settings/page.tsx
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { LayoutSelector } from '@/src/components/LayoutSelector';
import { EffectsSelector } from '@/src/components/EffectsSelector';
import { BackupSettings } from '@/src/components/BackupSettings';
import { themeConfig } from '@/src/config/themes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'ブログのデザインテーマ・カラーを自由にカスタマイズできる設定ページです。',
};

/**
 * サイト設定（デザインテーマ・カラースキン・エフェクト・データ管理）ページ。
 */
export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
      {/* ページヘッダー */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚙️</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">Settings</h1>
        </div>
        <p className="text-text opacity-70 text-lg">
          ブログのデザインや設定をカスタマイズできます。変更はすぐに反映され、次回の訪問時にも引き継がれます。
        </p>
      </div>

      {/* セクション1: デザインテーマ */}
      <section className="mb-16" aria-labelledby="theme-section-heading">
        <div className="mb-6">
          <h2
            id="theme-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>🎨</span>
            デザインテーマ
          </h2>
          <p className="text-sm text-text opacity-60">
            {themeConfig.length}
            種類のデザインスタイルから選択。ボーダー・シャドウ・フォントなど全体のスタイルが変わります。
          </p>
        </div>
        <ThemeSelector />
      </section>

      {/* セクション2: 記事一覧レイアウト */}
      <section className="hidden md:block mb-16" aria-labelledby="layout-section-heading">
        <div className="mb-6">
          <h2
            id="layout-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>📐</span>
            記事一覧レイアウト
          </h2>
          <p className="text-sm text-text opacity-60">
            記事一覧の段組み（1列、2列、3列）を設定します。デザインテーマと組み合わせて自由にカスタマイズ可能です。
          </p>
        </div>
        <LayoutSelector />
      </section>

      {/* セクション3: アニメーションと効果 */}
      <section className="mb-16" aria-labelledby="effects-section-heading">
        <div className="mb-6">
          <h2
            id="effects-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>✨</span>
            アニメーションと効果
          </h2>
          <p className="text-sm text-text opacity-60">
            デザインテーマごとの動的な視覚効果や3D傾斜インタラクションの表示を設定します。
          </p>
        </div>
        <EffectsSelector />
      </section>

      {/* セクション4: ダークモード */}
      <section className="mb-16" aria-labelledby="darkmode-section-heading">
        <div className="mb-6">
          <h2
            id="darkmode-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>🌓</span>
            ダークモード
          </h2>
          <p className="text-sm text-text opacity-60">
            サイトのカラーモード（ライト / ダーク）を切り替えます。
          </p>
        </div>
        <div className="theme-card p-6 inline-block">
          <ThemeToggle />
        </div>
      </section>

      {/* セクション5: データ管理 */}
      <section aria-labelledby="backup-section-heading" className="mt-16">
        <div className="mb-6">
          <h2
            id="backup-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>💾</span>
            データ管理
          </h2>
          <p className="text-sm text-text opacity-60">
            学習進捗（読了チェックやクイズ履歴）やカスタム設定のバックアップ、データのインポート、削除リセットが行えます。
          </p>
        </div>
        <BackupSettings />
      </section>
    </main>
  );
}
