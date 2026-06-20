// src/components/Header.tsx
'use client';

import { siteConfig } from '@/src/config/site';
import { Settings } from 'lucide-react';
import Link from 'next/link';

/**
 * サイト全体のヘッダー。
 */
export default function Header() {
  return (
    <div className="pt-4 px-2 md:px-4 sticky top-0 z-50">
      <header className="site-header mx-auto w-full max-w-6xl bg-card border-3 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] transition-all">
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
                <Link
                  href="/settings"
                  className="theme-btn w-9 h-9 flex items-center justify-center text-text"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* ナビゲーションメニュー */}
            <nav className="flex items-center gap-x-2 gap-y-2 text-sm overflow-x-auto md:overflow-x-visible whitespace-nowrap md:whitespace-normal pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
              <Link
                href="/about"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all shrink-0"
              >
                About
              </Link>
              <Link
                href="/scraps"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all shrink-0"
              >
                Scraps
              </Link>
              <Link
                href="/tools"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all shrink-0"
              >
                Tools
              </Link>
            </nav>
          </div>

          {/* デスクトップ表示用のアイコン (md未満で非表示) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/settings"
              className="theme-btn w-9 h-9 flex items-center justify-center text-text"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
