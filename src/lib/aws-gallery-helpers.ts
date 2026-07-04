// src/lib/aws-gallery-helpers.ts

/**
 * AWSサービス名とそれに対応する Tailwind バッジスタイルのマッピング。
 * 追加・変更は этот Record に対して行う。
 */
const ORANGE =
  'bg-orange-550/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
const AMBER =
  'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
const GREEN =
  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
const BLUE =
  'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
const PURPLE =
  'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30';
const RED =
  'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
const PINK =
  'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30';

const SERVICE_STYLES: Record<string, string> = {
  // コンテナ・サーバー
  ecs: ORANGE,
  fargate: ORANGE,
  ec2: ORANGE,
  'auto scaling': ORANGE,
  'app runner': ORANGE,

  // サーバーレス・イベント・ストリーミング
  lambda: AMBER,
  'api gateway': AMBER,
  'kinesis data streams': AMBER,
  'kinesis data firehose': AMBER,
  kinesis: AMBER,

  // ストレージ・CDN
  s3: GREEN,
  cloudfront: GREEN,

  // データベース・キャッシュ
  rds: BLUE,
  dynamodb: BLUE,
  elasticache: BLUE,
  postgresql: BLUE,

  // ネットワーク・DNS
  vpc: PURPLE,
  'vpc lattice': PURPLE,
  'route 53': PURPLE,
  alb: PURPLE,
  'security group': PURPLE,

  // セキュリティ・ID・認証
  iam: RED,
  cognito: RED,
  acm: RED,
  kms: RED,
  'secrets manager': RED,

  // ガバナンス・管理・デプロイ
  organizations: PINK,
  'control tower': PINK,
  cloudformation: PINK,
  cloudwatch: PINK,
};

const DEFAULT_STYLE = 'bg-secondary text-text/80 border-border/10 dark:border-border/20';

/**
 * AWSサービス名に応じたカラースタイルの Tailwind クラスを返します。
 * 背景色、文字色、ボーダー色を含みます。
 */
export function getServiceBadgeStyle(service: string): string {
  const s = service.toLowerCase().trim();
  const exact = SERVICE_STYLES[s];
  if (exact) return exact;
  // 部分一致フォールバック（"xxx database" 系）
  if (s.includes('database')) return BLUE;
  return DEFAULT_STYLE;
}
