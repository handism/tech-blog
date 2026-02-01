import { getAllPosts } from '@/lib/posts-server';
import PostCard from '@/components/PostCard';
import BlogLayout from '@/components/BlogLayout';

export default async function Home() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
