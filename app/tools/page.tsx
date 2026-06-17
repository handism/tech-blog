import ToolsDashboard from '@/src/components/ToolsDashboard';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Tools | ${siteConfig.name}`,
  description: '開発やデザイン、日常のデータ変換をサポートするブラウザ完結型の便利ツール一覧。',
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsPage() {
  return <ToolsDashboard />;
}
