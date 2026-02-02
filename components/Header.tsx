'use client'; // 状態管理を使うため追加

import { useState, useEffect, useRef } from 'react'; // hooksを追加
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

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
    <header className="bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 relative flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
            Handism&apos;s Tech Blog
          </Link>

          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-text/80 hover:text-accent transition-colors">
              About
            </Link>

            {/* ドロップダウン部分 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)} // タップで切り替え
                onMouseEnter={() => setIsOpen(true)} // PCでの利便性のためにホバーも残す
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
                  {/* 上下に少し余白を入れると綺麗です */}
                  <li>
                    <Link
                      href="/tools/memphis"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                    >
                      Memphis Generator
                    </Link>
                  </li>
                  {/* 他のメニューが増えてもここに追加すればOK */}
                  <li>
                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-sm text-text/80 hover:text-accent hover:bg-accent/10 first:rounded-t-md last:rounded-b-md"
                    >
                      About
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
            href="https://github.com/handism"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors p-1.5 -mr-1.5 md:p-2 md:mr-0"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
