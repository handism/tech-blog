'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
            Handism&apos;s Tech Blog
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/blog/about"
              className="text-sm text-text/80 hover:text-accent transition-colors"
            >
              About
            </Link>

            {/* Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-sm transition-colors ${
                  open ? 'text-accent' : 'text-text/80 hover:text-accent'
                }`}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                Tools
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    open ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {open && (
                <div className="absolute left-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg">
                  <Link
                    href="/tools/memphis"
                    className="block px-4 py-2 text-sm text-text hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    Memphis Generator
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/handism"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors p-2"
            aria-label="GitHub"
          >
            {/* GitHub icon（そのまま） */}
            {/* ... */}
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
