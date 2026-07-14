import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import CssToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `CSS Toolkit | ${siteConfig.name}`,
  description:
    'CSSグラデーション、すりガラス風ジェネレーター、イージング曲線設計などのビジュアルツール群。',
  alternates: {
    canonical: '/tools/css',
  },
};

export default function CssToolkit() {
  return <CssToolkitClient />;
}
