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
      <header className="mx-auto w-full max-w-6xl bg-bg/70 backdrop-blur-2xl border border-border/50 shadow-sm rounded-3xl md:rounded-full transition-all">
        <div className="px-4 md:px-6 py-2 md:py-3 relative flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
              {siteConfig.name}
            </Link>

            <nav className="flex items-center gap-x-4 gap-y-1.5 md:gap-6 text-sm flex-wrap">
              <Link href="/about" className="text-text/80 hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/scraps" className="text-text/80 hover:text-accent transition-colors">
                Scraps
              </Link>
              <Link href="/tools" className="text-text/80 hover:text-accent transition-colors">
                Tools
              </Link>
              <Link href="/sitemap" className="text-text/80 hover:text-accent transition-colors">
                Sitemap
              </Link>
              <Link
                href="/privacy-policy"
                className="text-text/80 hover:text-accent transition-colors"
              >
                Policy
              </Link>
            </nav>
          </div>

          {/* アイコン類 */}
          <div className="absolute right-3 top-3 md:static flex items-center gap-1.5 md:gap-2 md:self-auto">
            <SkinSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}
