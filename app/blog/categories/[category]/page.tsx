import { getAllPosts } from '@/src/lib/posts-server';
import BlogLayout from '@/src/components/BlogLayout';
import PostCard from '@/src/components/PostCard';
import Pagination from '@/src/components/Pagination';
import { siteConfig } from '@/src/config/site';

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;

  const allPosts = await getAllPosts();
  const filteredPosts = allPosts.filter((p) => p.category === category);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const posts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <BlogLayout posts={allPosts} categories={categories}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={1}
          totalPages={totalPages}
          basePath={`/blog/categories/${category}`}
        />
      </div>
    </BlogLayout>
  );
}
