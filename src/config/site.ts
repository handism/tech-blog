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
  // 画像処理
  {
    href: '/tools/neo-brutalism',
    label: 'Neo-Brutalism UI Generator',
    description: 'ネオブルータリズム特有の太線ボーダーやハードシャドウ、発光ネオンを直感的に生成',
    emoji: '🎨',
    category: 'image',
  },
  {
    href: '/tools/image-optimizer',
    label: 'Image Converter & Optimizer',
    description: 'ブラウザ上だけで画像のWebP変換、リサイズ、品質（画質）調整を安全・高速に実行',
    emoji: '🖼️',
    category: 'image',
  },
  {
    href: '/tools/memphis',
    label: 'Memphis Generator',
    description: 'メンフィスパターンのモダンな幾何学背景を直感的に生成・カスタマイズ',
    emoji: '🎨',
    category: 'image',
  },
  {
    href: '/tools/trimming',
    label: 'Image Trimmer',
    description: '画像を任意の縦横比やカスタムサイズでトリミング・リサイズ・保存',
    emoji: '✂️',
    category: 'image',
  },
  {
    href: '/tools/favicon-generator',
    label: 'Favicon & App Icon Generator',
    description: 'アップロード画像から各サイズアイコンへリサイズ・ZIP一括生成',
    emoji: '📲',
    category: 'image',
  },
  {
    href: '/tools/svg-editor',
    label: 'SVG Path Visualizer & Optimizer',
    description: 'SVGコードのプレビュー表示と、不要な属性や余白の簡易クリーンアップ',
    emoji: '🎨',
    category: 'image',
  },
  {
    href: '/tools/pixel-art',
    label: 'Pixel Art Canvas',
    description: '16x16や32x32のグリッド上に直感的にドット絵を描き、PNG/SVGで保存',
    emoji: '👾',
    category: 'image',
  },
  // データ変換
  {
    href: '/tools/html-to-jsx',
    label: 'HTML to JSX Converter',
    description: '通常のHTMLコードをReact/Next.jsでそのまま使えるJSX/TSX形式に自動変換',
    emoji: '🏷️',
    category: 'convert',
  },
  {
    href: '/tools/json-generator',
    label: 'Mock JSON Data Generator',
    description: 'UUID、名前、メールなどダミーデータのスキーマを定義し、テスト用JSONを一括生成',
    emoji: '📊',
    category: 'convert',
  },
  {
    href: '/tools/timezone',
    label: 'Timezone Converter',
    description: '複数のタイムゾーンと現地時間を一覧比較・双方向変換',
    emoji: '🌐',
    category: 'convert',
  },
  {
    href: '/tools/json-formatter',
    label: 'JSON Formatter',
    description: 'JSONデータをきれいに整形・ミニファイし、構文エラー箇所を検出',
    emoji: '✨',
    category: 'convert',
  },
  {
    href: '/tools/yaml-json',
    label: 'YAML ↔ JSON',
    description: 'YAML形式とJSON形式のデータをブラウザ上で双方向に相互変換',
    emoji: '🔄',
    category: 'convert',
  },
  {
    href: '/tools/base64',
    label: 'Base64 Codec',
    description: 'テキストやファイルのBase64エンコード・デコード処理',
    emoji: '📦',
    category: 'convert',
  },
  {
    href: '/tools/url-codec',
    label: 'URL Codec',
    description: 'URLのクエリパラメータなどに用いる文字列のエンコード・デコード',
    emoji: '🔗',
    category: 'convert',
  },
  {
    href: '/tools/uuid',
    label: 'UUID Generator',
    description: '開発や検証に使えるランダムなUUID (v4) を一括生成',
    emoji: '🆔',
    category: 'convert',
  },
  {
    href: '/tools/html-entity',
    label: 'HTML Entity Encoder / Decoder',
    description: 'HTML特殊文字とエスケープシーケンスの相互変換',
    emoji: '🔤',
    category: 'convert',
  },
  {
    href: '/tools/csv-json',
    label: 'CSV ↔ JSON',
    description: '表形式のCSVデータと構造化されたJSONデータを双方向に変換',
    emoji: '📊',
    category: 'convert',
  },
  {
    href: '/tools/password-generator',
    label: 'Password Generator',
    description: '長さや使用文字種をカスタマイズして安全なランダムパスワードを生成',
    emoji: '🔑',
    category: 'convert',
  },
  {
    href: '/tools/json-to-ts',
    label: 'JSON to TypeScript / Zod',
    description: 'JSONオブジェクトからTypeScriptの型定義やZodのバリデーションスキーマを自動生成',
    emoji: '🏷️',
    category: 'convert',
  },
  // エンジニアツール
  {
    href: '/tools/git-commit-helper',
    label: 'Git Commit & Branch Helper',
    description: 'Conventional Commitsに準拠したコミットメッセージとGitコマンドの自動生成',
    emoji: '🌱',
    category: 'dev',
  },
  {
    href: '/tools/aspect-ratio',
    label: 'Aspect Ratio Calculator',
    description: '画面解像度や画像サイズからアスペクト比を計算し、双方向で幅・高さを自動補完',
    emoji: '📐',
    category: 'dev',
  },
  {
    href: '/tools/security-headers',
    label: 'HTTP Security Headers Generator',
    description: 'CSPやHSTSなどのセキュリティヘッダーを生成し、各種Webサーバー用の設定を出力',
    emoji: '🔒',
    category: 'dev',
  },
  {
    href: '/tools/cubic-bezier',
    label: 'CSS Cubic-Bezier Visualizer',
    description: 'ドラッグや数値指定でイージングカーブを視覚的に編集し、トランジションコードを生成',
    emoji: '📈',
    category: 'dev',
  },
  {
    href: '/tools/regex-tester',
    label: 'Regex Tester',
    description: '正規表現パターンの一致確認とキャプチャグループのリアルタイムテスト',
    emoji: '🔍',
    category: 'dev',
  },
  {
    href: '/tools/hash-generator',
    label: 'Hash Generator',
    description: 'MD5, SHA-1, SHA-256などの暗号ハッシュ値を瞬時に生成',
    emoji: '🔒',
    category: 'dev',
  },
  {
    href: '/tools/color-converter',
    label: 'Color Converter',
    description: 'HEX, RGB, HSL, CMYKなどのカラーコードを相互に変換',
    emoji: '🌈',
    category: 'dev',
  },
  {
    href: '/tools/jwt-decoder',
    label: 'JWT Decoder',
    description: 'JSON Web Token (JWT) のヘッダー、ペイロード、署名を解析・検証',
    emoji: '🎫',
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
    href: '/tools/diff-viewer',
    label: 'Diff Viewer',
    description: '2つのテキストを並べて変更箇所を行単位・文字単位で視覚的に比較',
    emoji: '🆚',
    category: 'dev',
  },
  {
    href: '/tools/unix-timestamp',
    label: 'Unix Timestamp Converter',
    description: 'Unixエポックミリ秒と人間が読める日時形式を双方向変換',
    emoji: '⏰',
    category: 'dev',
  },
  {
    href: '/tools/cron',
    label: 'Cron Parser & Generator',
    description: 'Cron式から次の実行スケジュールを生成・自然言語でわかりやすく解説',
    emoji: '📆',
    category: 'dev',
  },
  {
    href: '/tools/url-parser',
    label: 'URL Parser & Query Inspector',
    description: 'URLのホスト名、パス、クエリパラメータを個別に解析して一覧表示',
    emoji: '🕵️',
    category: 'dev',
  },
  {
    href: '/tools/sql-formatter',
    label: 'SQL Formatter',
    description: '読みづらいSQLクエリをキーワードごとにきれいにインデント整形',
    emoji: '🗄️',
    category: 'dev',
  },
  {
    href: '/tools/text-case',
    label: 'Text Case Converter & Counter',
    description: '大文字・小文字などの変換および文字数・行数のリアルタイムカウント',
    emoji: '✍️',
    category: 'dev',
  },
  {
    href: '/tools/user-agent',
    label: 'User Agent Parser',
    description: 'ブラウザのUser Agent文字列からOSやブラウザ、デバイス情報を判定',
    emoji: '💻',
    category: 'dev',
  },
  {
    href: '/tools/css-generator',
    label: 'CSS Generator',
    description: 'Glassmorphismや美しい極上の影（box-shadow）を直感的に生成',
    emoji: '💎',
    category: 'dev',
  },
  {
    href: '/tools/color-contrast',
    label: 'Color Contrast & Palette',
    description: 'WCAGに基づいた色のコントラスト比判定と配色パレットの自動作成',
    emoji: '🎨',
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
    href: '/tools/bitwise',
    label: 'Bitwise & Radix Converter',
    description: '進数変換とビット操作（トグル切替）や基本的なビット演算の可視化',
    emoji: '🔢',
    category: 'dev',
  },
  {
    href: '/tools/git-helper',
    label: 'Git Command Helper',
    description: 'やりたいことから最適なGitコマンドを生成しパラメータも動的入力',
    emoji: '🌱',
    category: 'dev',
  },
  {
    href: '/tools/curl-converter',
    label: 'Curl to Code Converter',
    description: 'CurlリクエストをFetch、Axios、Python等マルチ言語のコードに相互変換',
    emoji: '🚀',
    category: 'dev',
  },
  {
    href: '/tools/css-unit',
    label: 'CSS Unit Converter',
    description: 'px, rem, em, vw, vh などのWeb開発で頻出する各種単位をリアルタイム相互変換',
    emoji: '📏',
    category: 'dev',
  },
  {
    href: '/tools/http-tester',
    label: 'HTTP Request Tester',
    description:
      '任意のAPIリクエストを送信し、レスポンスヘッダーやJSONデータをブラウザ上で即時テスト',
    emoji: '📡',
    category: 'dev',
  },
  {
    href: '/tools/lorem-ipsum',
    label: 'Lorem Ipsum & Dummy Text',
    description:
      '段落数や文字数を指定して、レイアウト確認用のダミーテキスト（日本語・ラテン語）を瞬時に作成',
    emoji: '✍️',
    category: 'dev',
  },
  {
    href: '/tools/markdown-table',
    label: 'Markdown Table Editor',
    description:
      'スプレッドシート風のGUIで行列を編集し、Markdown形式の表コードを動的に構築・パース',
    emoji: '📋',
    category: 'dev',
  },
  {
    href: '/tools/cidr-calculator',
    label: 'IP Subnet & CIDR Calculator',
    description: 'IPアドレスとCIDRプレフィックスからサブネット範囲やホスト可能数を即時算出・可視化',
    emoji: '🔢',
    category: 'dev',
  },
  // 外部ツール
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
  pagination: {
    postsPerPage: 10,
    scrapsPerPage: 20,
  },
};
