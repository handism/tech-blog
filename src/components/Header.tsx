// src/components/Header.tsx
'use client';

import { siteConfig } from '@/src/config/site';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/scraps', label: 'Scraps' },
  { href: '/learning', label: 'Learning' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/tools', label: 'Tools' },
];

/**
 * 設定画面への遷移リンクボタン。
 */
const SettingsButton = () => (
  <Link
    href="/settings"
    className="theme-btn w-9 h-9 flex items-center justify-center text-text"
    aria-label="Settings"
  >
    <Settings className="h-4 w-4" />
  </Link>
);

/**
 * サイト全体のヘッダー。
 */
export default function Header() {
  const pathname = usePathname() || '';

  return (
    <div className="pt-4 px-2 md:px-4 sticky top-0 z-50">
      <header className="site-header mx-auto w-full max-w-6xl bg-card transition-all">
        <div className="px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* 左側グループ（ロゴ + ナビゲーション） */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 w-full md:w-auto">
            {/* モバイルで上部にロゴとボタンを並べるためのコンテナ */}
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
              {/* ロゴ */}
              <Link
                href="/"
                className="text-xl font-extrabold text-text tracking-tight hover:text-accent transition-colors shrink-0"
              >
                {siteConfig.name}
              </Link>

              {/* モバイル表示用のアイコン (md以上で非表示) */}
              <div className="flex items-center gap-2 md:hidden">
                <SettingsButton />
              </div>
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="flex items-center gap-x-2 gap-y-2 text-sm overflow-x-auto md:overflow-x-visible whitespace-nowrap md:whitespace-normal pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`theme-btn px-3 py-1 text-sm font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-accent text-white dark:text-black font-extrabold hover:bg-accent hover:text-white dark:hover:text-black'
                        : 'text-text opacity-85 hover:opacity-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* デスクトップ表示用のアイコン (md未満で非表示) */}
          <div className="hidden md:flex items-center gap-2">
            <SettingsButton />
          </div>
        </div>
      </header>
    </div>
  );
}
