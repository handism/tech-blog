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
 * 記事の一覧・メタ情報。
 */
export type PostMeta = {
  slug: string;
  title: string;
  date?: Date;
  tags: string[];
  category: string;
  plaintext: string;
  image?: string;
};

/**
 * 記事詳細データ。
 */
export type Post = PostMeta & {
  content: string;
  toc?: TocItem[];
};
