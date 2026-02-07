import { getAllPosts } from '@/src/lib/posts-server';
import PostCard from '@/src/components/PostCard';
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import { notFound, redirect } from 'next/navigation';
import { siteConfig } from '@/src/config/site';

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

type Props = {
  params: { category: string; page: string };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));
  const params: { category: string; page: string }[] = [];

  for (const category of categories) {
    const filteredPosts = allPosts.filter((p) => p.category === category);
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    // ★ i = 1 から始めるように修正
    for (let i = 1; i <= totalPages; i++) {
      params.push({ category, page: String(i) });
    }
  }

  return params;
}

export default async function CategoryPaginationPage({ params }: Props) {
  const { category, page } = params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(`/blog/categories/${category}`);
  }

  const allPosts = getAllPosts();
  const filteredPosts = allPosts.filter((p) => p.category === category);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  if (currentPage > totalPages) {
    notFound();
  }

  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = filteredPosts.slice(startIndex, endIndex);

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
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/blog/categories/${category}`}
        />
      </div>
    </BlogLayout>
  );
}
