// app/scraps/page.tsx
import ScrapsDashboard from '@/src/components/ScrapsDashboard';
import { siteConfig } from '@/src/config/site';
import { getTagsWithCount } from '@/src/lib/post-taxonomy';
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
  // タグフィルタはスクラップ自身のタグから生成する（ブログ記事のタグとは別軸のため）
  const tagCounts = getTagsWithCount(scraps);

  return <ScrapsDashboard scraps={scraps} tagCounts={tagCounts} />;
}
