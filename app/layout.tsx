// app/layout.tsx
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import { CodeHighlight } from '@/src/components/CodeHighlight';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';

import { siteConfig } from '@/src/config/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
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
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
