import { getAllPosts } from '@/lib/posts-server';
import PostCard from '@/components/PostCard';
import BlogLayout from '@/components/BlogLayout';

export default async function Home() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </BlogLayout>
  );
}
