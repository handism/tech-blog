import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import NetworkToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Network Tester & CIDR Calculator | ${siteConfig.name}`,
  description:
    'HTTPリクエストテスト、セキュリティヘッダー生成、CIDR計算、HTTPステータスコード解説ツール。',
  alternates: {
    canonical: '/tools/network',
  },
};

export default function NetworkToolkit() {
  return <NetworkToolkitClient />;
}
