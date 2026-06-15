// app/scraps/page.tsx
import ScrapListPage from '@/src/components/ScrapListPage';
import { siteConfig } from '@/src/config/site';
import { getAllScraps } from '@/src/lib/scraps-server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Scraps | ${siteConfig.name}`,
  description: '日々の気づきやエラー解決ログを短く残すメモ帳',
  alternates: {
    canonical: '/scraps',
  },
};

export default async function ScrapsPage() {
  const scraps = await getAllScraps();
  return <ScrapListPage scraps={scraps} />;
}
