// app/layout.tsx
import './globals.css';

import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased">
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
