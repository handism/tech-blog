// src/config/site.ts
/**
 * ヘッダー Tools ドロップダウンのメニュー項目。
 */
export const toolsMenuItems = [
  { href: '/tools/memphis', label: 'Memphis Generator', external: false },
  { href: '/tools/trimming', label: 'Image Trimmer', external: false },
  { href: 'https://handism.github.io/sauna-itta/', label: 'Sauna Itta', external: true },
] as const;

/**
 * サイト全体の設定。
 */
export const siteConfig = {
  name: "Handism's Tech Blog",
  url: 'https://handism.github.io',
  description: '技術的な学びや備忘録を記録するための個人ブログ',
  author: 'handism',
  github: 'https://github.com/handism',
  posts: {
    dir: 'md',
    defaultCategory: 'uncategorized',
    defaultTitle: 'No title',
  },
  pagination: {
    postsPerPage: 10,
  },
};
