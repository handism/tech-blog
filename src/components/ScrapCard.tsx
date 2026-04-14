// src/components/ScrapCard.tsx
import TagLink from '@/src/components/TagLink';
import type { Scrap } from '@/src/types/scrap';

type ScrapCardProps = {
  scrap: Scrap;
};

export default function ScrapCard({ scrap }: ScrapCardProps) {
  const formattedDate = scrap.date
    ? scrap.date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null;

  return (
    <article className="py-8 first:pt-0">
      {formattedDate && (
        <time
          dateTime={scrap.date?.toISOString()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent mb-4 font-mono"
        >
          {formattedDate}
        </time>
      )}

      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: scrap.content }}
      />

      {scrap.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {scrap.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
