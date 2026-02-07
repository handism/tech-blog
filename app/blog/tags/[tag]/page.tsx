import { getAllPosts } from '@/src/lib/posts-server';
import BlogLayout from '@/src/components/BlogLayout';
import PostCard from '@/src/components/PostCard';
import Pagination from '@/src/components/Pagination';
import { tagToSlug, findTagBySlug } from '@/src/lib/utils';
import { siteConfig } from '@/src/config/site';

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // tagToSlugでスラッグ化してパスを生成
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag: slug } = params;

  const allPosts = getAllPosts();
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  // 全タグを取得
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));

  // findTagBySlugでスラッグから元のタグ名を復元
  const actualTag = findTagBySlug(slug, allTags);

  if (!actualTag) {
    return (
      <BlogLayout posts={allPosts} categories={categories}>
        <div>
          <h1 className="text-3xl font-bold mb-6">タグが見つかりません</h1>
        </div>
      </BlogLayout>
    );
  }

  const filteredPosts = allPosts.filter((p) => p.tags.includes(actualTag));
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const posts = filteredPosts.slice(0, POSTS_PER_PAGE);

  return (
    <BlogLayout posts={allPosts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Tag: #{actualTag}</h1>

        {posts.length === 0 ? (
          <p className="text-text/60">このタグの記事はありません。</p>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={1}
              totalPages={totalPages}
              basePath={`/blog/tags/${slug}`}
            />
          </>
        )}
      </div>
    </BlogLayout>
  );
}
