// app/settings/page.tsx
import { SkinSelector } from '@/src/components/SkinSelector';
import { ThemeSelector } from '@/src/components/ThemeSelector';
import { skinConfig, themeConfig } from '@/src/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'ブログのデザインテーマ・カラーを自由にカスタマイズできる設定ページです。',
};

/**
 * サイト設定（デザインテーマ・カラースキン）ページ。
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
          ブログのデザインをカスタマイズできます。変更はすぐに反映され、次回の訪問時にも引き継がれます。
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

      {/* セクション2: アクセントカラー */}
      <section aria-labelledby="skin-section-heading">
        <div className="mb-6">
          <h2
            id="skin-section-heading"
            className="text-xl font-bold text-text mb-1 flex items-center gap-2"
          >
            <span>🌈</span>
            アクセントカラー
          </h2>
          <p className="text-sm text-text opacity-60">
            {skinConfig.length}
            色のアクセントカラーから選択。リンク・ボタン・ハイライトの色が変わります。
          </p>
        </div>

        {/* スキン選択 – SkinSelector のドロップダウンではなくインラインで表示 */}
        <div className="neo-card p-6 inline-flex flex-wrap gap-4 items-center">
          {skinConfig.map((skin) => (
            <div key={skin.id} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: skin.lightColor }}
                title={skin.label}
                aria-label={skin.label}
              />
              <span className="text-xs text-text opacity-70 font-medium">{skin.label}</span>
            </div>
          ))}
          {/* 実際の切り替えは SkinSelector の既存ロジックを使用 */}
          <div className="ml-4 flex flex-col gap-1">
            <p className="text-xs text-text opacity-50">
              ヘッダー右上のパレットアイコンからも
              <br />
              変更できます
            </p>
            <div className="mt-1">
              <SkinSelector />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
