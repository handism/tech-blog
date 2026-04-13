// app/scraps/[slug]/page.tsx
import CopyButtonScript from '@/src/components/CopyButtonScript';
import { ImageModal } from '@/src/components/ImageModal';
import TagLink from '@/src/components/TagLink';
import { siteConfig } from '@/src/config/site';
import { getAllScrapMeta, getScrap, getScrapMetaBySlug } from '@/src/lib/scraps-server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * スクラップ詳細ページのルートパラメータ。
 */
type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * スクラップ詳細ページのメタデータを生成する。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scrapMeta = await getScrapMetaBySlug(slug);

  if (!scrapMeta) {
    return { title: 'スクラップが見つかりません' };
  }

  return {
    title: `${scrapMeta.title} | Scraps | ${siteConfig.name}`,
    description: scrapMeta.description,
    openGraph: {
      type: 'article',
      title: scrapMeta.title,
      description: scrapMeta.description,
      url: `${siteConfig.url}/scraps/${slug}`,
      siteName: siteConfig.name,
      publishedTime: scrapMeta.date?.toISOString(),
      authors: [siteConfig.author],
    },
  };
}

/**
 * 静的生成用のパラメータを生成する。
 */
export async function generateStaticParams() {
  const scraps = await getAllScrapMeta();
  return scraps.map((scrap) => ({ slug: scrap.slug }));
}

/**
 * スクラップ詳細ページ。
 */
export default async function ScrapPage({ params }: Props) {
  const { slug } = await params;
  const scrap = await getScrap(slug);

  if (!scrap) notFound();

  const formattedDate = scrap.date
    ? scrap.date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* 戻るリンク */}
      <Link
        href="/scraps"
        className="inline-flex items-center gap-1 text-sm text-text/60 hover:text-accent transition-colors mb-8"
      >
        ← Scraps 一覧に戻る
      </Link>

      <article className="prose dark:prose-invert max-w-none">
        <h1>{scrap.title}</h1>

        {/* メタ情報 */}
        <div className="not-prose flex flex-wrap items-center gap-3 mb-8 text-sm text-text/60">
          {formattedDate && <time dateTime={scrap.date?.toISOString()}>{formattedDate}</time>}
          {scrap.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {scrap.tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* 本文 */}
        <div dangerouslySetInnerHTML={{ __html: scrap.content }} />
      </article>

      <ImageModal />
      <CopyButtonScript />
    </div>
  );
}
