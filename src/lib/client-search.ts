/**
 * クライアント側検索機能（SSG/Static Export 対応）
 * ビルド時にすべての記事データが埋め込まれる
 */
import Fuse from 'fuse.js';
import type { Post } from '../types/posts';

export interface SearchablePost extends Post {
  plaintext: string;
}

/**
 * Fuse.jsを使用した高度な全文検索
 * タイトル、本文、タグ、カテゴリーを検索対象とする
 */
export function searchPosts(posts: SearchablePost[], keyword: string): SearchablePost[] {
  if (!keyword.trim()) return [];

  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.7 }, // タイトルは重み付け高
      { name: 'plaintext', weight: 0.3 }, // 本文は重み付け低
      { name: 'tags', weight: 0.5 },
      { name: 'category', weight: 0.5 },
    ],
    includeScore: true,
    threshold: 0.3, // 柔軟なマッチング
    minMatchCharLength: 2, // 最小2文字以上
  });

  return fuse.search(keyword).map((result) => result.item);
}
