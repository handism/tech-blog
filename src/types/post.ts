// src/types/post.ts
/**
 * 目次項目。
 */
export type TocItem = {
  id: string;
  text: string;
  level: number;
};

/**
 * 記事データ。
 */
export type Post = {
  slug: string;
  title: string;
  date?: Date;
  tags: string[];
  category: string;
  content: string;
  plaintext?: string;
  toc?: TocItem[];
};
