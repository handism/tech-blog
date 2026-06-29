// src/components/ScrapListPage.tsx
import BlogLayout from '@/src/components/BlogLayout';
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import ScrapCardList from '@/src/components/ScrapCardList';
import type { CategoryCount, TagCount } from '@/src/lib/post-taxonomy';
import type { Scrap } from '@/src/types/scrap';

type ScrapListPageProps = {
  scraps: Scrap[];
  categoryCounts?: CategoryCount[];
  tagCounts?: TagCount[];
};

export default function ScrapListPage({ scraps, categoryCounts, tagCounts }: ScrapListPageProps) {
  return (
    <BlogLayout categoryCounts={categoryCounts} tagCounts={tagCounts}>
      <div className="max-w-none">
        <header className="page-header mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text">Scraps</h1>
          <p className="text-sm text-text/60 mt-2">日々の気づきやエラー解決ログを短く残すメモ帳</p>
        </header>

        <ScrapCardList scraps={scraps} />
        <ImageModal />
        <CopyButtonScript />
      </div>
    </BlogLayout>
  );
}
