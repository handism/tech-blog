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
  keywords?: string;
  plaintext?: string;
  description: string;
  readingMinutes: number;
  image?: string;
  /** 下書きフラグ。trueの場合は開発環境のみで表示され、本番ビルドでは除外される。 */
  draft?: boolean;
};

/**
 * クライアント（一覧・カード表示）へ渡す軽量なメタ情報。
 * 全文由来の plaintext / keywords はサーバー／検索インデックス（search.json）専用のため含まない。
 * 一覧描画コンポーネントはこの型を受け取り、存在しないフィールドへの依存を型で防ぐ。
 */
export type PostSummary = Omit<PostMeta, 'plaintext' | 'keywords'>;

/**
 * 記事詳細データ。
 */
export type Post = PostMeta & {
  content: string;
  toc?: TocItem[];
};
