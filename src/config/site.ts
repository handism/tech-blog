// src/config/site.ts
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

/**
 * 各ツールアイテムの定義インターフェース。
 */
export interface ToolItem {
  href: string;
  label: string;
  description: string;
  emoji: string;
  category: 'image' | 'convert' | 'dev' | 'external';
  external?: boolean;
}

/**
 * ヘッダー / 専用ページで利用するメニュー項目。
 */
export const toolsMenuItems: readonly ToolItem[] = [
  // ── 画像処理 ＆ グラフィック (image) ──
  {
    href: '/tools/image-editor',
    label: 'Image Studio',
    description: '画像のWebP変換・圧縮、トリミング、Favicon & App Icon生成を行う画像編集ツール集',
    emoji: '🖼️',
    category: 'image',
  },
  {
    href: '/tools/svg-toolkit',
    label: 'SVG Toolkit',
    description:
      'SVGプレビュー、波形/アメーバ生成、SVG-CSS変換、ダミー画像（Placeholder）生成を行うSVGユーティリティ集',
    emoji: '🌊',
    category: 'image',
  },
  {
    href: '/tools/design-generator',
    label: 'UI & Graphic Generator',
    description:
      'Neo-Brutalism UI、メンフィス幾何学背景、Pixel Art（ドット絵）の生成・作成ツール集',
    emoji: '🎨',
    category: 'image',
  },

  // ── データ変換 (convert) ──
  {
    href: '/tools/data-json',
    label: 'Data & JSON Toolkit',
    description:
      'JSON整形・比較・ダミー生成、YAML/CSV変換、TypeScript型生成、SQL整形などのデータユーティリティ集',
    emoji: '📊',
    category: 'convert',
  },
  {
    href: '/tools/crypto',
    label: 'Crypto & ID Generator',
    description:
      'Base64変換、暗号ハッシュ生成、JWTデコード、UUID作成、セキュアパスワード生成などのツール集',
    emoji: '🔑',
    category: 'convert',
  },
  {
    href: '/tools/text-toolkit',
    label: 'Text Studio',
    description:
      '文字カウント・ケース変換、不可視文字検出、Lorem Ipsum（ダミーテキスト）生成、Diff比較を行うテキスト編集ツール集',
    emoji: '📝',
    category: 'convert',
  },

  // ── 開発者ツール (dev) ──
  {
    href: '/tools/markup',
    label: 'Markup & Markdown Editor',
    description:
      'Markdownエディタ、Markdownテーブル生成、HTML実体参照エスケープなどのマークアップ支援ツール集',
    emoji: '📝',
    category: 'dev',
  },
  {
    href: '/tools/url',
    label: 'URL & Web Utilities',
    description:
      'URLエンコード/デコード、URL解析・再構築、UTMタグ作成、User Agent解析などのツール集',
    emoji: '🔗',
    category: 'dev',
  },
  {
    href: '/tools/code-helper',
    label: 'Code Helper',
    description:
      '正規表現テスト、Curlから各種プログラミング言語のコードへの変換、HTMLからJSXへの変換を行う開発支援ツール集',
    emoji: '🚀',
    category: 'dev',
  },
  {
    href: '/tools/calculator',
    label: 'Developer Calculator',
    description:
      '多機能電卓、進数変換・ビット演算（トグル可視化）、アスペクト比計算を行う計算ツール集',
    emoji: '🧮',
    category: 'dev',
  },
  {
    href: '/tools/css',
    label: 'CSS & Layout Toolkit',
    description:
      'CSSグラデーション、すりガラス・影生成、CSS単位変換、イージング曲線設計、Flexbox & GridシミュレーターのCSSツール集',
    emoji: '🎨',
    category: 'dev',
  },
  {
    href: '/tools/aws-diagram',
    label: 'AWS Architecture Diagram Generator',
    description:
      'フォーム操作でAWS構成要素（VPC/サブネット/リソース）と接続を定義し、Mermaid.jsで美しい構成図をリアルタイム生成',
    emoji: '☁️',
    category: 'dev',
  },
  {
    href: '/tools/git',
    label: 'Git Utilities',
    description:
      'Conventional Commits準拠 of メッセージ生成、およびやりたいことからGitコマンドを生成するツール集',
    emoji: '🌱',
    category: 'dev',
  },
  {
    href: '/tools/network',
    label: 'Web & Network Utilities',
    description:
      'HTTPリクエストテスト、HTTPステータスコード検索、セキュリティヘッダー生成、CIDR計算などの通信・ネットワークツール集',
    emoji: '🌐',
    category: 'dev',
  },
  {
    href: '/tools/time',
    label: 'Time & Schedule Utilities',
    description:
      'Unixタイムスタンプの相互変換、主要タイムゾーン時間表示、およびCronスケジュール解析ツール集',
    emoji: '⏰',
    category: 'dev',
  },
  {
    href: '/tools/color',
    label: 'Color Utilities',
    description:
      'HEX/RGB/HSLコードの相互変換、WCAG基準のコントラスト比判定、および配色パレット生成ツール集',
    emoji: '🌈',
    category: 'dev',
  },
  {
    href: '/tools/qr-code',
    label: 'QR Code Generator',
    description: '任意のテキストやURLからカスタムカラーのQRコードを生成',
    emoji: '📱',
    category: 'dev',
  },
  {
    href: '/tools/keyboard-events',
    label: 'Keyboard Event Visualizer',
    description: '押したキーのJavaScriptイベントパラメータや仮想キーボード上の位置を表示',
    emoji: '⌨️',
    category: 'dev',
  },
  {
    href: '/tools/pomodoro',
    label: 'Pomodoro Focus Timer',
    description:
      '25分の作業と5分の休憩を繰り返す、テーマ連動・音響効果付きポモドーロ・フォーカスタイマー',
    emoji: '⏱️',
    category: 'dev',
  },

  // ── 外部ツール (external) ──
  {
    href: 'https://handism.github.io/sauna-itta/',
    label: 'Sauna Itta',
    description: 'サウナ活動を記録する個人ログアプリ（外部サイト）',
    emoji: '🧖',
    category: 'external',
    external: true,
  },
  {
    href: 'https://handism.github.io/sauna-simulator/',
    label: 'Sauna Simulator',
    description: 'サウナの温度変化やととのい度をシミュレーション（外部サイト）',
    emoji: '♨️',
    category: 'external',
    external: true,
  },
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

export type LayoutId = '1-column' | '2-column' | '3-column';
export const DEFAULT_LAYOUT: LayoutId = '2-column';
export const LAYOUT_STORAGE_KEY = 'layout-mode';

export const layoutConfig = [
  { id: '1-column', label: '1 Column List', emoji: '☰' },
  { id: '2-column', label: '2 Column Grid', emoji: '⚏' },
  { id: '3-column', label: '3 Column Grid', emoji: '☱' },
] as const;
