// src/components/Header.tsx
'use client';

import { SkinSelector } from '@/src/components/SkinSelector';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { siteConfig } from '@/src/config/site';
import Link from 'next/link';

/**
 * サイト全体のヘッダー。
 */
export default function Header() {
  return (
    <div className="pt-4 px-2 md:px-4 sticky top-0 z-50">
      <header className="mx-auto w-full max-w-6xl bg-card border-3 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] transition-all">
        <div className="px-4 md:px-6 py-3 relative flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <Link
              href="/"
              className="text-xl font-extrabold text-text tracking-tight hover:text-accent transition-colors"
            >
              {siteConfig.name}
            </Link>

            <nav className="flex items-center gap-x-2 gap-y-2 text-sm flex-wrap">
              <Link
                href="/about"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                About
              </Link>
              <Link
                href="/scraps"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                Scraps
              </Link>
              <Link
                href="/tools"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                Tools
              </Link>
              <Link
                href="/sitemap"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                Sitemap
              </Link>
              <Link
                href="/privacy-policy"
                className="px-3 py-1 border border-border rounded-md font-bold hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--border)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
              >
                Policy
              </Link>
            </nav>
          </div>

          {/* アイコン類 */}
          <div className="absolute right-3 top-3.5 md:static flex items-center gap-2 md:self-auto">
            <SkinSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}
