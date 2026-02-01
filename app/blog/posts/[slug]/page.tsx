// app/posts/[slug]/page.tsx
import { getAllPosts, getPost } from '@/lib/posts-server';
import { notFound } from 'next/navigation';
import BlogLayout from '@/components/BlogLayout';

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  if (!post) notFound();

  return (
    <BlogLayout posts={posts} toc={post.toc} categories={categories}>
      <article className="prose dark:prose-invert max-w-none">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </BlogLayout>
  );
}
