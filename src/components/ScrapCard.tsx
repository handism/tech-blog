// src/components/ScrapCard.tsx
import TagLink from '@/src/components/TagLink';
import type { ScrapMeta } from '@/src/types/scrap';
import Link from 'next/link';

/**
 * スクラップカードのプロパティ。
 */
type ScrapCardProps = {
  scrap: ScrapMeta;
};

/**
 * スクラップ一覧向けのタイムライン風カード表示。
 */
export default function ScrapCard({ scrap }: ScrapCardProps) {
  const formattedDate = scrap.date
    ? scrap.date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null;

  return (
    <article className="group relative pl-6 border-l-2 border-accent/40 hover:border-accent transition-colors duration-300">
      {/* タイムラインドット */}
      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors duration-300" />

      {/* 日付 */}
      {formattedDate && (
        <time
          dateTime={scrap.date?.toISOString()}
          className="block text-xs text-text/50 mb-1 font-mono"
        >
          {formattedDate}
        </time>
      )}

      {/* タイトル */}
      <h2 className="text-base font-semibold leading-snug group-hover:text-accent transition-colors">
        <Link href={`/scraps/${scrap.slug}`}>{scrap.title}</Link>
      </h2>

      {/* 説明文 */}
      {scrap.description && (
        <p className="text-text/60 text-sm mt-1 line-clamp-2">{scrap.description}</p>
      )}

      {/* タグ */}
      {scrap.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {scrap.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
