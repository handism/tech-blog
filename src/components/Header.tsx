// src/components/Header.tsx
'use client';

import { ThemeToggle } from '@/src/components/ThemeToggle';
import { siteConfig } from '@/src/config/site';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaGithub } from 'react-icons/fa';

/**
 * サイト全体のヘッダー。
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // メニューの外側をクリックしたら閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header>
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 relative flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
            {siteConfig.name}
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-text/80 hover:text-accent transition-colors">
              About
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

            {/* ドロップダウン部分 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className="text-text/80 hover:text-accent transition-colors flex items-center gap-1"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                Tools
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              <div
                onMouseLeave={() => setIsOpen(false)}
                className={`
                  absolute left-0 mt-2 w-48
                  rounded-md border border-border
                  bg-card/95 backdrop-blur-md 
                  shadow-xl shadow-black/20
                  transition-all z-50
                  ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                `}
              >
                <ul className="py-1">
                  {' '}
                  <li>
                    <Link
                      href="/tools/memphis"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                    >
                      Memphis Generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tools/trimming"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                    >
                      Image Trimmer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* アイコン類 */}
        <div className="absolute right-3 top-3 md:static flex items-center gap-1.5 md:gap-2 md:self-auto">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors p-1.5 -mr-1.5 md:p-2 md:mr-0"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
