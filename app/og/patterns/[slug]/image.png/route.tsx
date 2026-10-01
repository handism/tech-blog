import { getAllAwsPatternMetas, getAwsPatternBySlug } from '@/src/lib/aws-gallery-server';
import { createOgImageResponse } from '@/src/lib/og-card';

/**
 * ビルド時にすべてのAWSパターンのOGPルートを事前生成する
 */
export async function generateStaticParams() {
  const patterns = await getAllAwsPatternMetas();
  return patterns.map((p) => ({
    slug: p.slug,
  }));
}

/**
 * AWSパターンごとの動的OGP画像を生成するルートハンドラ。
 */
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pattern = await getAwsPatternBySlug(params.slug);

  if (!pattern) {
    return new Response('Not Found', { status: 404 });
  }

  return createOgImageResponse({
    title: pattern.title,
    accentColor: '#3b82f6', // blue-500
    subtitle: 'AWS Architecture Gallery',
    category: pattern.category,
    badges: pattern.awsServices?.slice(0, 4),
    size: 'compact',
  });
}
