// src/components/ScrapListPage.tsx
import ScrapCardList from '@/src/components/ScrapCardList';
import type { ScrapMeta } from '@/src/types/scrap';

/**
 * スクラップ一覧ページのプロパティ。
 */
type ScrapListPageProps = {
  scraps: ScrapMeta[];
};

/**
 * スクラップ一覧ページの共通レイアウト（1カラム、サイドバーなし）。
 */
export default function ScrapListPage({ scraps }: ScrapListPageProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Scraps</h1>
        <p className="text-text/60 mt-2 text-sm">日々の気づきやエラー解決ログを短く残すメモ帳</p>
      </header>

      <ScrapCardList scraps={scraps} />
    </div>
  );
}
