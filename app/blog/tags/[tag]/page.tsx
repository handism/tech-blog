// app/blog/tags/[tag]/page.tsx
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import PostCardList from '@/src/components/PostCardList';
import { getAllTags } from '@/src/lib/post-taxonomy';
import { resolveSlugOrNotFound } from '@/src/lib/slug-resolver';
import { getBlogViewContext } from '@/src/lib/posts-view';
import { tagToSlug } from '@/src/lib/utils';

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
 * タグ別の記事一覧ページ。
 */
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: slug } = await params;

  const { allPosts: posts, categories } = await getBlogViewContext();

  // 全タグを取得
  const allTags = getAllTags(posts);

  const actualTag = resolveSlugOrNotFound(slug, allTags, tagToSlug);

  const filteredPosts = posts.filter((p) => p.tags.includes(actualTag));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Tag: #{actualTag}</h1>

        {filteredPosts.length === 0 ? (
          <p className="text-text/60">このタグの記事はありません。</p>
        ) : (
          <>
            <PostCardList posts={filteredPosts} />
            <Pagination currentPage={1} totalPages={1} />
          </>
        )}
      </div>
    </BlogLayout>
  );
}
