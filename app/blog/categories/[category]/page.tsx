import { getAllPosts } from '@/lib/posts-server';
import BlogLayout from '@/components/BlogLayout';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const posts = await getAllPosts();
  const filteredPosts = posts.filter((p) => p.category === category);
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

        <ul className="space-y-4">
          {filteredPosts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/posts/${p.slug}`} className="hover:underline text-lg font-medium">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </BlogLayout>
  );
}
