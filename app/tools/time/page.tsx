import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import TimeToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Time & Cron Helper | ${siteConfig.name}`,
  description: 'タイムスタンプ変換、世界時計、Cron式のパースと生成。',
  alternates: {
    canonical: '/tools/time',
  },
};

export default function TimeToolkit() {
  return <TimeToolkitClient />;
}
