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
import {
  Lexend,
  Space_Grotesk,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Press_Start_2P,
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
  Caveat,
  Cinzel,
  Outfit,
  Roboto_Mono,
  Yomogi,
  Architects_Daughter,
} from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-lexend',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});
const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
});
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
  display: 'swap',
});
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
});
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-outfit',
  display: 'swap',
});
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
});
const yomogi = Yomogi({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-yomogi',
  display: 'swap',
});
const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-architects-daughter',
  display: 'swap',
});

const fontVariables = [
  lexend.variable,
  spaceGrotesk.variable,
  notoSansJP.variable,
  notoSerifJP.variable,
  pressStart2P.variable,
  orbitron.variable,
  rajdhani.variable,
  shareTechMono.variable,
  caveat.variable,
  cinzel.variable,
  outfit.variable,
  robotoMono.variable,
  yomogi.variable,
  architectsDaughter.variable,
].join(' ');

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
      <body className={`bg-bg text-text antialiased relative min-h-screen ${fontVariables}`}>
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
