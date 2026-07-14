// src/config/layout.ts
/**
 * 記事一覧のレイアウト表示形式の定義。
 */
export type LayoutId = '1-column' | '2-column' | '3-column';
export const DEFAULT_LAYOUT: LayoutId = '2-column';
export const LAYOUT_STORAGE_KEY = 'layout-mode';

export const layoutConfig = [
  { id: '1-column', label: '1 Column List', emoji: '☰' },
  { id: '2-column', label: '2 Column Grid', emoji: '⚏' },
  { id: '3-column', label: '3 Column Grid', emoji: '☱' },
] as const;
