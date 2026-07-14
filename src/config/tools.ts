// src/config/tools.ts
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
