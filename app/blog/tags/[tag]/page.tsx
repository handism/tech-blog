// app/blog/tags/[tag]/page.tsx
import PostListPage from '@/src/components/PostListPage';
import { siteConfig } from '@/src/config/site';
import { getAllTags } from '@/src/lib/post-taxonomy';
import { resolveSlugOrNotFound } from '@/src/lib/slug-resolver';
import { getBlogViewContext } from '@/src/lib/posts-view';
import { tagToSlug } from '@/src/lib/utils';
import type { Metadata } from 'next';

/**
 * タグページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const { allPosts } = await getBlogViewContext();
  const tags = getAllTags(allPosts);

  // tagToSlugでスラッグ化してパスを生成
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }));
}

/**
 * タグページのメタデータを生成する。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const { allPosts } = await getBlogViewContext();
  const allTags = getAllTags(allPosts);
  const actualTag = resolveSlugOrNotFound(slug, allTags, tagToSlug);
  const title = `#${actualTag} | ${siteConfig.name}`;
  const description = `「${actualTag}」タグの記事一覧`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

/**
 * タグ別の記事一覧ページ。
 */
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: slug } = await params;

  const { allPosts: posts, categoryCounts, tagCounts } = await getBlogViewContext();

  // 全タグを取得
  const allTags = getAllTags(posts);

  const actualTag = resolveSlugOrNotFound(slug, allTags, tagToSlug);

  const filteredPosts = posts.filter((p) => p.tags.includes(actualTag));

  return (
    <PostListPage
      tagCounts={tagCounts}
      categoryCounts={categoryCounts}
      posts={filteredPosts}
      heading={`Tag: #${actualTag}`}
      emptyMessage="このタグの記事はありません。"
      currentPage={1}
      totalPages={1}
    />
  );
}
