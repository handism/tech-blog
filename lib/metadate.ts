import { Post } from './posts';

export function generateMetadata(post?: Post) {
  const baseUrl = 'https://yourdomain.com';

  return {
    title: post?.title ?? 'My Blog',
    description: post ? post.content.slice(0, 120) : '最新記事をまとめたブログです',
    openGraph: {
      title: post?.title ?? 'My Blog',
      description: post ? post.content.slice(0, 120) : '最新記事をまとめたブログです',
      url: post ? `${baseUrl}/posts/${post.slug}` : baseUrl,
      siteName: 'My Blog',
      images: post ? [{ url: `${baseUrl}/og-image.png` }] : [],
      locale: 'ja_JP',
      type: post ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title ?? 'My Blog',
      description: post ? post.content.slice(0, 120) : '最新記事をまとめたブログです',
      images: post ? [`${baseUrl}/og-image.png`] : [],
    },
  };
}
