// src/config/themes.ts
/**
 * デザインテーマ（スタイル全体）の定義。
 */
export const themeConfig = [
  // ── 王道＆モダン (modern) ──
  {
    id: 'minimal',
    label: 'Minimal / Clean',
    description: '余白多め・細線・フラット',
    emoji: '⬜',
    category: 'modern',
    previewBg: '#ffffff',
    previewCard: '#f9f9f9',
    previewAccent: '#3b82f6',
  },
  {
    id: 'neumorphism',
    label: 'Neumorphism',
    description: 'ぷっくり凹凸・立体 Soft UI',
    emoji: '🫧',
    category: 'modern',
    previewBg: '#e0e8f6',
    previewCard: '#e0e8f6',
    previewAccent: '#3b82f6',
  },
  {
    id: 'oled',
    label: 'OLED',
    description: '漆黒と純白・極限の高コントラスト',
    emoji: '🕶️',
    category: 'modern',
    previewBg: '#ffffff',
    previewCard: '#ffffff',
    previewAccent: '#2563eb',
  },

  // ── 立体＆質感 (tactile) ──
  {
    id: 'glassmorphism',
    label: 'Glassmorphism',
    description: '半透明ブラーウィンドウ',
    emoji: '🪟',
    category: 'tactile',
    previewBg: 'linear-gradient(135deg,#667eea,#764ba2)',
    previewCard: 'rgba(255,255,255,0.15)',
    previewAccent: '#a78bfa',
    previewBorderColor: 'rgba(255,255,255,0.3)',
    previewBackdropFilter: 'blur(8px)',
  },
  {
    id: 'claymorphism',
    label: 'Claymorphism',
    description: 'ぷっくり粘土調・ポップ3D',
    emoji: '🍮',
    category: 'tactile',
    previewBg: '#e0f2fe',
    previewCard: '#ffffff',
    previewAccent: '#3b82f6',
    hasBorder: false,
    previewCardShadow:
      '0 4px 10px rgba(3, 105, 161, 0.1), inset -3px -3px 5px rgba(3, 105, 161, 0.05)',
  },
  {
    id: 'three-d',
    label: '3D Interactive',
    description: 'リアル飛び出す厚み・傾斜インタラクション',
    emoji: '🥽',
    category: 'tactile',
    previewBg: '#f1f5f9',
    previewCard: '#ffffff',
    previewAccent: '#0ea5e9',
  },

  // ── レトロ＆SFテック (tech) ──
  {
    id: 'terminal',
    label: 'Terminal / Matrix',
    description: 'グリーンモノクロ・CLIコンソール',
    emoji: '📟',
    category: 'tech',
    previewBg: '#000000',
    previewCard: '#050505',
    previewAccent: '#00ff00',
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    description: '設計図・青写真・CADグリッド・技術的精密感',
    emoji: '🗺️',
    category: 'tech',
    previewBg: '#0a1628',
    previewCard: '#0d1f3c',
    previewAccent: '#60a5fa',
    previewBorderColor: 'rgba(96,165,250,0.5)',
  },
  {
    id: 'synthwave',
    label: 'Synthwave / Outrun',
    description: 'ネオンピンク＆シアン・紫グラデ',
    emoji: '🌌',
    category: 'tech',
    previewBg: 'linear-gradient(135deg,#0d0d26,#1b1b4b)',
    previewCard: '#1a0033',
    previewAccent: '#ff007f',
  },

  // ── アート＆クリエイティブ (creative) ──
  {
    id: 'neo-brutalism',
    label: 'Neo-Brutalism',
    description: '太線ボーダー＋ハードシャドウ',
    emoji: '⬛',
    category: 'creative',
    previewBg: '#fdfcf7',
    previewCard: '#ffffff',
    previewAccent: '#10b981',
  },
  {
    id: 'editorial',
    label: 'Paper / Editorial',
    description: '雑誌・新聞ライク・セリフ体',
    emoji: '📰',
    category: 'creative',
    previewBg: '#f5f0e8',
    previewCard: '#ffffff',
    previewAccent: '#2c3e50',
  },
  {
    id: 'chalkboard',
    label: 'Chalkboard',
    description: '黒板＆チョーク・手書き風のやわらかいタッチ',
    emoji: '🖊️',
    category: 'creative',
    previewBg: '#eef3f0',
    previewCard: '#e0e8e3',
    previewAccent: '#c44545',
    hasBorder: false,
  },
  // ── カルチャー＆ナチュラル (nature) ──
  {
    id: 'modern-japanese',
    label: 'Modern Japanese',
    description: '格子と直線・墨と白砂・落ち着いた引き算の美',
    emoji: '🎋',
    category: 'nature',
    previewBg: '#f5f2eb',
    previewCard: '#faf8f5',
    previewAccent: '#d93333',
  },
  {
    id: 'nordic',
    label: 'Nordic / Cozy',
    description: 'セージグリーン＆アースカラー',
    emoji: '🌲',
    category: 'nature',
    previewBg: '#edf2f0',
    previewCard: '#ffffff',
    previewAccent: '#2e5a44',
    hasBorder: false,
  },
  {
    id: 'steampunk',
    label: 'Steampunk',
    description: '真鍮・歯車・重厚なヴィンテージ機械感',
    emoji: '⚙️',
    category: 'nature',
    previewBg: '#f4ede0',
    previewCard: '#eadaaf',
    previewAccent: '#a05a0c',
  },
] as const;

export type ThemeId = (typeof themeConfig)[number]['id'];
export const DEFAULT_THEME: ThemeId = 'oled';
export const THEME_STORAGE_KEY = 'design-theme';
export const EFFECTS_STORAGE_KEY = 'effects-enabled';
