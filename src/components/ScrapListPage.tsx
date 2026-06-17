// src/components/ScrapListPage.tsx
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import ScrapCardList from '@/src/components/ScrapCardList';
import type { Scrap } from '@/src/types/scrap';

type ScrapListPageProps = {
  scraps: Scrap[];
};

export default function ScrapListPage({ scraps }: ScrapListPageProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-10 border-b-3 border-border pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Scraps</h1>
        <p className="text-text/80 mt-2 text-sm font-bold">
          日々の気づきやエラー解決ログを短く残すメモ帳
        </p>
      </header>

      <ScrapCardList scraps={scraps} />
      <ImageModal />
      <CopyButtonScript />
    </div>
  );
}
