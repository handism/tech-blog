import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import CodeHelperToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Code Helper & Regex Toolkit | ${siteConfig.name}`,
  description:
    '正規表現チェッカー、JSONバリデータ/フォーマッタ、HTMLエディタなどのコード支援ツール群。',
  alternates: {
    canonical: '/tools/code-helper',
  },
};

export default function CodeHelperToolkit() {
  return <CodeHelperToolkitClient />;
}
