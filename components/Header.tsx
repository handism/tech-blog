import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-bg">
      <div
        className="
          max-w-6xl mx-auto px-4
          py-2 md:py-4
          flex flex-col gap-2
          md:flex-row md:items-center md:justify-between md:gap-0
        "
      >
        {/* スマホ: タイトル + アイコン (1段目) */}
        <div className="flex items-center justify-between md:contents">
          <Link href="/" className="text-xl font-bold text-text hover:opacity-80">
            Handism&apos;s Tech Blog
          </Link>

          {/* アイコン (スマホでは右側、PCでは最後に配置) */}
          <div className="flex items-center gap-2 md:order-last">
            <a
              href="https://github.com/handism"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-accent transition-colors p-2"
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

        {/* ナビ (スマホでは2段目、PCではタイトルの隣) */}
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-text/80 hover:text-accent transition-colors">
            About
          </Link>

          <div className="relative group">
            <button
              className="text-sm text-text/80 hover:text-accent transition-colors flex items-center gap-1"
              aria-haspopup="true"
            >
              Tools
              <span className="text-xs">▾</span>
            </button>

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
    </header>
  );
}
