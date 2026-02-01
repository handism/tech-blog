import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <div className="relative group">
              <button
                className="text-sm text-text/80 hover:text-accent transition-colors flex items-center gap-1"
                aria-haspopup="true"
              >
                Tools
                <span className="text-xs">▾</span>
              </button>

              {/* Dropdown menu */}
              <div
                className="
                absolute left-0 mt-2 w-48
                rounded-md border border-border
                bg-card shadow-lg
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all
                z-50
              "
              >
                <Link
                  href="/tools/memphis"
                  className="
                    block px-4 py-2 text-sm
                    text-text/80 hover:text-accent
                    hover:bg-accent/10
                  "
                >
                  Memphis Generator
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/handism"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors p-2"
            aria-label="GitHub"
          >
            {/* svg省略（そのままでOK） */}
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
