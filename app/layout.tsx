// app/layout.tsx
import './globals.css';

import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';

const geistSans = localFont({
  src: [
    { path: './fonts/geist-latin.woff2', style: 'normal' },
    { path: './fonts/geist-latin-ext.woff2', style: 'normal' },
  ],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

/**
 * ルートレイアウトで利用するメタデータ。
 */
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * アプリ全体の共通レイアウト。
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.className} bg-bg text-text antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <Header />
          {children}
          <Footer />
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
