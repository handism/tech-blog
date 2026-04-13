// app/scraps/page.tsx
import ScrapListPage from '@/src/components/ScrapListPage';
import { siteConfig } from '@/src/config/site';
import { getScrapViewContext } from '@/src/lib/scraps-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Scraps | ${siteConfig.name}`,
  description: '日々の気づきやエラー解決ログを短く残すメモ帳',
  alternates: {
    canonical: '/scraps',
  },
};

/**
 * スクラップ一覧ページ。
 */
export default async function ScrapsPage() {
  const { allScraps } = await getScrapViewContext();

  return <ScrapListPage scraps={allScraps} />;
}
