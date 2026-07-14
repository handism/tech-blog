import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import GitToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Git Utility & Command Helper | ${siteConfig.name}`,
  description:
    'Gitのコミットメッセージ作成、ユースケース別コマンド逆引き、Gitイメージ生成などの支援ツール。',
  alternates: {
    canonical: '/tools/git',
  },
};

export default function GitToolkit() {
  return <GitToolkitClient />;
}
