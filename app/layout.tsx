import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import './globals.css';
import { ThemeProvider } from 'next-themes'; // ← これが正しい
import 'highlight.js/styles/github-dark.css';
import { CodeHighlight } from '@/src/components/CodeHighlight';

import { siteConfig } from '@/src/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`, // 各ページで使用
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="bg-bg text-text" suppressHydrationWarning>
      <body className="antialiased">
        <CodeHighlight />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
