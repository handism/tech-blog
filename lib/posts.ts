/**
 * 型定義のみをエクスポート
 * 実装はサーバー側の lib/posts-server.ts で行う
 */

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type Post = {
  slug: string;
  title: string;
  date?: Date;
  tags: string[];
  category: string;
  content: string;
  toc?: TocItem[];
};

// NOTE: 実装関数 (getAllPosts, getPost) はサーバー側からのみインポート可能
// クライアント側で fs モジュールへのアクセスを避けるため
