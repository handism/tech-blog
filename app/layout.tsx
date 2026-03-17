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
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    creator: `@${siteConfig.author}`,
  },
};

/**
 * アプリ全体の共通レイアウト。
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.className} bg-bg text-text antialiased`}>
        {/* フラッシュ防止スクリプト: キー名は SKIN_STORAGE_KEY、フォールバック値は DEFAULT_SKIN と一致させること */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('skin')||'emerald';document.documentElement.setAttribute('data-skin',s);}catch(e){}})();`,
          }}
        />
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
