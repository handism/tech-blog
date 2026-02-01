import { getAllPosts } from '@/lib/posts-server';
import SearchPage from './search-client';

export const revalidate = 3600; // 1時間ごとに再検証

export default async function SearchPageServer() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return <SearchPage posts={posts} categories={categories} />;
}
