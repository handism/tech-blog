import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import MarkupToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Markup & Markdown Editor | ${siteConfig.name}`,
  description:
    'リアルタイムMarkdownエディタ、HTMLエンティティ変換、テーブルジェネレーターなどのマークアップ支援。',
  alternates: {
    canonical: '/tools/markup',
  },
};

export default function MarkupToolkit() {
  return <MarkupToolkitClient />;
}
