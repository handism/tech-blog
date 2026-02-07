import { getAllPosts } from '@/src/lib/posts-server';
import PostCard from '@/src/components/PostCard';
import BlogLayout from '@/src/components/BlogLayout';
import Pagination from '@/src/components/Pagination';
import { notFound, redirect } from 'next/navigation';
import { siteConfig } from '@/src/config/site';
import { tagToSlug, findTagBySlug } from '@/src/lib/utils';

const POSTS_PER_PAGE = siteConfig.pagination.postsPerPage;

type Props = {
  params: { tag: string; page: string };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));
  const params: { tag: string; page: string }[] = [];

  for (const tag of tags) {
    const slug = tagToSlug(tag);
    const filteredPosts = allPosts.filter((p) => p.tags.includes(tag));
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
      params.push({ tag: slug, page: String(i) });
    }
  }

  return params;
}

export default async function TagPaginationPage({ params }: Props) {
  const { tag: slug, page } = params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  if (currentPage === 1) {
    redirect(`/blog/tags/${slug}`);
  }

  const allPosts = getAllPosts();
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));
  const actualTag = findTagBySlug(slug, allTags);

  if (!actualTag) {
    notFound();
  }

  const filteredPosts = allPosts.filter((p) => p.tags.includes(actualTag));
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
        <h1 className="text-3xl font-bold mb-6">Tag: #{actualTag}</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/blog/tags/${slug}`}
        />
      </div>
    </BlogLayout>
  );
}
