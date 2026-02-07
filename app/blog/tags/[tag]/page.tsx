import { getAllPosts } from '@/src/lib/posts-server';
import BlogLayout from '@/src/components/BlogLayout';
import Link from 'next/link';
import { tagToSlug, findTagBySlug } from '@/src/lib/utils';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // tagToSlugでスラッグ化してパスを生成
  return tags.map((tag) => ({
    tag: tagToSlug(tag),
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: slug } = await params;

  const posts = getAllPosts();
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
          <ul className="space-y-4">
            {filteredPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/posts/${p.slug}`}
                  className="hover:underline text-lg font-medium"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BlogLayout>
  );
}
