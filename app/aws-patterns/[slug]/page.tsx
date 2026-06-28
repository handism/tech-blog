// app/aws-patterns/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getAllAwsPatternMetas, getAwsPatternBySlug } from '@/src/lib/aws-gallery-server';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import AwsPatternDetailClient from '@/src/components/AwsPatternDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * 静的エクスポート用のパラメータを生成。
 * すべてのスラグに対応する静的HTMLがビルド時に出力されます。
 */
export async function generateStaticParams() {
  const patterns = await getAllAwsPatternMetas();
  return patterns.map((p) => ({
    slug: p.slug,
  }));
}

/**
 * ページ個別の動的メタデータを生成（SEO対応）。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pattern = await getAwsPatternBySlug(slug);

  if (!pattern) {
    return {};
  }

  const ogImageUrl = `${siteConfig.url}/og/aws/${slug}/image.png`;

  return {
    title: `${pattern.title} | AWSアーキテクチャ | ${siteConfig.name}`,
    description: pattern.description,
    alternates: {
      canonical: `/aws-patterns/${slug}`,
    },
    openGraph: {
      title: `${pattern.title} | AWSアーキテクチャ | ${siteConfig.name}`,
      description: pattern.description,
      url: `${siteConfig.url}/aws-patterns/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pattern.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pattern.title} | AWSアーキテクチャ | ${siteConfig.name}`,
      description: pattern.description,
      images: [ogImageUrl],
    },
  };
}

export default async function AwsBestPracticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const pattern = await getAwsPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
      <AwsPatternDetailClient pattern={pattern} />
    </div>
  );
}
