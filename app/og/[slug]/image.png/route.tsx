import { createOgImageResponse } from '@/src/lib/og-card';
import { getAllPostMeta, getPostMetaBySlug } from '@/src/lib/posts-server';

/**
 * ビルド時にすべての記事のOGPルートを事前生成する
 */
export async function generateStaticParams() {
  const posts = await getAllPostMeta();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * 記事ごとの動的OGP画像を生成するルートハンドラ。
 */
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostMetaBySlug(params.slug);

  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  return createOgImageResponse({
    title: post.title,
    accentColor: '#10b981', // emerald-500
    category: post.category,
    badges: post.tags?.slice(0, 3).map((tag) => `#${tag}`),
  });
}
