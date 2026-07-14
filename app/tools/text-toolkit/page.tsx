import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import TextToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Text Toolkit & Diff Viewer | ${siteConfig.name}`,
  description: '文字数カウント、大文字・小文字変換、不可視文字検出、テキストの差分比較（Diff）。',
  alternates: {
    canonical: '/tools/text-toolkit',
  },
};

export default function TextToolkit() {
  return <TextToolkitClient />;
}
