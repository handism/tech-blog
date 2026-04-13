// src/config/site.ts
/**
 * スキン（カラーテーマ）の定義。
 */
export const skinConfig = [
  { id: 'emerald', label: 'Emerald', lightColor: '#10b981', darkColor: '#34d399' },
  { id: 'ocean', label: 'Ocean', lightColor: '#0ea5e9', darkColor: '#38bdf8' },
  { id: 'sunset', label: 'Sunset', lightColor: '#f59e0b', darkColor: '#fbbf24' },
  { id: 'purple', label: 'Purple', lightColor: '#a855f7', darkColor: '#c084fc' },
  { id: 'rose', label: 'Rose', lightColor: '#f43f5e', darkColor: '#fb7185' },
] as const;

export type SkinId = (typeof skinConfig)[number]['id'];
export const DEFAULT_SKIN: SkinId = 'emerald';
export const SKIN_STORAGE_KEY = 'skin';

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
  scraps: {
    dir: 'scraps',
    defaultTitle: 'No title',
  },
  pagination: {
    postsPerPage: 10,
    scrapsPerPage: 20,
  },
};
