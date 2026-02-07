import { getAllPosts } from '@/src/lib/posts-server';
import SearchPage from './search-client';

export const revalidate = 3600;

function htmlToPlainText(html: string) {
  return html.replace(/<[^>]+>/g, ''); // シンプルなHTMLタグ除去
}

export default async function SearchPageServer() {
  const posts = getAllPosts().map((post) => ({
    ...post,
    plaintext: htmlToPlainText(post.content),
  }));

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return <SearchPage posts={posts} categories={categories} />;
}
