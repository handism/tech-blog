// app/layout.tsx
import './globals.css';

import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { ThemeDesignProvider } from '@/src/components/ThemeDesignProvider';
import ThemeEffectManager from '@/src/components/ThemeEffectManager';
import { ThemeProvider } from 'next-themes';
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  DEFAULT_LAYOUT,
  LAYOUT_STORAGE_KEY,
  siteConfig,
} from '@/src/config/site';
import type { Metadata } from 'next';

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
      <head>
        {/* Google Fonts への preconnect でフォント読み込みを高速化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg text-text antialiased relative min-h-screen">
        {/* フラッシュ防止スクリプト(デザインテーマ & レイアウト) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'${DEFAULT_THEME}';
              document.documentElement.setAttribute('data-theme',t);
              var l=localStorage.getItem('${LAYOUT_STORAGE_KEY}')||'${DEFAULT_LAYOUT}';
              document.documentElement.setAttribute('data-layout',l);
            }catch(e){console.error('Failed to access localStorage:', e);}})();`,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ThemeDesignProvider>
            <ThemeEffectManager />
            <Header />
            <div className="relative">{children}</div>
            <Footer />
            <ScrollToTopButton />
          </ThemeDesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
