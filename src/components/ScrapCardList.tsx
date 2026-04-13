// src/components/ScrapCardList.tsx
import ScrapCard from '@/src/components/ScrapCard';
import type { ScrapMeta } from '@/src/types/scrap';

/**
 * スクラップカードリストのプロパティ。
 */
type ScrapCardListProps = {
  scraps: ScrapMeta[];
};

/**
 * スクラップカードをタイムライン形式で縦に並べる。
 */
export default function ScrapCardList({ scraps }: ScrapCardListProps) {
  if (scraps.length === 0) {
    return <p className="text-text/50 text-center py-12">スクラップはまだありません。</p>;
  }

  return (
    <div className="space-y-8">
      {scraps.map((scrap) => (
        <ScrapCard key={scrap.slug} scrap={scrap} />
      ))}
    </div>
  );
}
