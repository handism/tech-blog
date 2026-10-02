// src/config/site.ts
// next.config.ts からも import されるため、このファイルではパスエイリアス（@/）や他モジュールを import しないこと。

/**
 * サイトを配信するサブパス（GitHub Pages のプロジェクトサイト ＝ リポジトリ名）。
 * Next.js の `basePath` に渡され、ルート配信に戻す場合は空文字にする。
 */
const basePath = '/tech-blog';
const origin = 'https://handism.github.io';

/**
 * サイト全体の設定。
 */
export const siteConfig = {
  name: "Handism's Tech Blog",
  /** オリジン（プロトコル＋ホスト）。 */
  origin,
  /** 配信サブパス。先頭スラッシュあり・末尾スラッシュなし。 */
  basePath,
  /** サイトのルート URL（origin + basePath）。末尾スラッシュなし。 */
  url: `${origin}${basePath}`,
  description: '技術的な学びや備忘録を記録するための個人ブログ',
  author: 'handism',
  github: 'https://github.com/handism',
  posts: {
    dir: 'md',
    defaultCategory: 'uncategorized',
    defaultTitle: 'No title',
  },
  scraps: {
    dir: 'scraps',
    defaultTitle: 'No title',
  },
  learning: {
    dir: 'learning',
    defaultTitle: 'No title',
  },
  awsGallery: {
    dir: 'patterns',
    defaultTitle: 'No title',
  },
  pagination: {
    postsPerPage: 9,
    scrapsPerPage: 20,
  },
};
