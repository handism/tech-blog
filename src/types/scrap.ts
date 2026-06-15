// src/types/scrap.ts
/**
 * スクラップのメタ情報（一覧用）。
 */
export type ScrapMeta = {
  slug: string;
  title: string;
  date?: Date;
  tags: string[];
  description: string;
  /** 下書きフラグ。trueの場合は開発環境のみで表示され、本番ビルドでは除外される。 */
  draft?: boolean;
};

/**
 * スクラップ詳細データ。
 */
export type Scrap = ScrapMeta & {
  content: string;
};
