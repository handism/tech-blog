// src/components/ScrapCard.tsx
import TagLink from '@/src/components/TagLink';
import { formatDate } from '@/src/lib/utils';
import type { Scrap } from '@/src/types/scrap';
import DOMPurify from 'dompurify';

type ScrapCardProps = {
  scrap: Scrap;
};

export default function ScrapCard({ scrap }: ScrapCardProps) {
  const formattedDate = scrap.date
    ? formatDate(scrap.date, { year: 'numeric', month: '2-digit', day: '2-digit' })
    : null;

  let safeContent = scrap.content;
  try {
    const purifier =
      typeof DOMPurify.sanitize === 'function'
        ? DOMPurify
        : (DOMPurify as unknown as { default?: typeof DOMPurify }).default;
    if (purifier && typeof purifier.sanitize === 'function') {
      safeContent = purifier.sanitize(scrap.content, {
        USE_PROFILES: { html: true },
      });
    }
  } catch {
    safeContent = scrap.content;
  }

  // スマホでは本文の横幅が記事ページと大きく変わらないよう、カード内側の余白を詰める
  return (
    <article className="theme-card p-4 md:p-6">
      {formattedDate && (
        <div className="flex justify-between items-center mb-4 border-b border-border/20 pb-3">
          <time
            dateTime={scrap.date?.toISOString()}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-text border border-border px-2 py-0.5 rounded-md bg-secondary font-mono"
          >
            {formattedDate}
          </time>
        </div>
      )}

      <div
        className="prose prose-sm dark:prose-invert max-w-none font-medium text-text/95"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {scrap.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/10">
          {scrap.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
