import { getAllPosts } from '@/lib/posts-server';
import BlogLayout from '@/components/BlogLayout';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // URLエンコードしてパスを生成
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: encodedTag } = await params;

  // URLデコードして元のタグ名に戻す
  const tag = decodeURIComponent(encodedTag);

  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const filteredPosts = posts.filter((p) => p.tags.includes(tag));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Tag: #{tag}</h1>

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
