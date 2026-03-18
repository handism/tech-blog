// src/components/Footer.tsx
import Link from 'next/link';

/**
 * サイト全体のフッター。
 */
export default function Footer() {
  return (
    <footer className="py-8 border-t border-border mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text/60 mb-4">
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/sitemap" className="hover:text-accent transition-colors">
            Sitemap
          </Link>
          <Link href="/privacy-policy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <Link href="/rss.xml" className="hover:text-accent transition-colors">
            RSS
          </Link>
        </nav>
        <p className="text-center text-sm text-text/60">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
