// src/components/ScrapCardList.tsx
import ScrapCard from '@/src/components/ScrapCard';
import type { Scrap } from '@/src/types/scrap';

type ScrapCardListProps = {
  scraps: Scrap[];
};

export default function ScrapCardList({ scraps }: ScrapCardListProps) {
  if (scraps.length === 0) {
    return <p className="text-text/50 text-center py-12">スクラップはまだありません。</p>;
  }

  return (
    <div className="divide-y-2 divide-border">
      {scraps.map((scrap) => (
        <ScrapCard key={scrap.slug} scrap={scrap} />
      ))}
    </div>
  );
}
