// app/layout.tsx
import './globals.css';

import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import { ThemeDesignProvider } from '@/src/components/ThemeDesignProvider';
import { DEFAULT_THEME, THEME_STORAGE_KEY, siteConfig } from '@/src/config/site';
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
      <head>
        {/* Google Fonts への preconnect でフォント読み込みを高速化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.className} bg-bg text-text antialiased relative min-h-screen`}>
        {/* フラッシュ防止スクリプト(スキン): キー名は SKIN_STORAGE_KEY、フォールバック値は DEFAULT_SKIN と一致させること */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('skin')||'emerald';document.documentElement.setAttribute('data-skin',s);}catch(e){}})();`,
          }}
        />
        {/* フラッシュ防止スクリプト(デザインテーマ): キー名は THEME_STORAGE_KEY、フォールバック値は DEFAULT_THEME と一致させること */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'${DEFAULT_THEME}';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ThemeDesignProvider>
            <Header />
            <div className="relative z-0">{children}</div>
            <Footer />
            <ScrollToTopButton />
          </ThemeDesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
