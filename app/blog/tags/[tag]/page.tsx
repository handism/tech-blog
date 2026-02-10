// app/blog/tags/[tag]/page.tsx
import { getAllPosts } from '@/src/lib/posts-server';
import BlogLayout from '@/src/components/BlogLayout';
import PostCard from '@/src/components/PostCard';
import Pagination from '@/src/components/Pagination';
import { tagToSlug, findTagBySlug } from '@/src/lib/utils';

/**
 * タグページの静的生成パラメータを生成する。
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

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

  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // 全タグを取得
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // findTagBySlugでスラッグから元のタグ名を復元
  const actualTag = findTagBySlug(slug, allTags);

  if (!actualTag) {
    return (
      <BlogLayout posts={posts} categories={categories}>
        <div>
          <h1 className="text-3xl font-bold mb-6">タグが見つかりません</h1>
        </div>
      </BlogLayout>
    );
  }

  const filteredPosts = posts.filter((p) => p.tags.includes(actualTag));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Tag: #{actualTag}</h1>

        {filteredPosts.length === 0 ? (
          <p className="text-text/60">このタグの記事はありません。</p>
        ) : (
          <>
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination currentPage={1} totalPages={1} />
          </>
        )}
      </div>
    </BlogLayout>
  );
}
