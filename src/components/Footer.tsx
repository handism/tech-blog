// src/components/Footer.tsx
import { siteConfig } from '@/src/config/site';
import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const footerLinks: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/sitemap', label: 'Sitemap' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/rss.xml', label: 'RSS', external: true },
];

/**
 * サイト全体のフッター。
 */
export default function Footer() {
  return (
    <footer className="py-8 border-t border-border mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text/60 mb-4">
          {footerLinks.map((link) => {
            if (link.external) {
              return (
                <a key={link.href} href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="text-center text-sm text-text/60">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
