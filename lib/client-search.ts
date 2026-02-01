/**
 * クライアント側検索機能（SSG/Static Export 対応）
 * ビルド時にすべての記事データが埋め込まれる
 */

export interface SearchablePost {
  slug: string;
  title: string;
  tags: string[];
  category: string;
  content: string;
}

export function searchPosts(posts: SearchablePost[], keyword: string): SearchablePost[] {
  if (!keyword.trim()) return [];

  const lowerKeyword = keyword.toLowerCase();

  return posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.content.toLowerCase().includes(lowerKeyword) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)) ||
      post.category.toLowerCase().includes(lowerKeyword)
    );
  });
}
