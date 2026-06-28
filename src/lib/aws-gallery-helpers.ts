// src/lib/aws-gallery-helpers.ts

/**
 * AWSサービス名に応じたカラースタイルの Tailwind クラスを返します。
 * 背景色、文字色、ボーダー色を含みます。
 */
export function getServiceBadgeStyle(service: string): string {
  const s = service.toLowerCase().trim();

  // コンテナ、サーバー
  if (s === 'ecs' || s === 'fargate' || s === 'ec2' || s === 'auto scaling' || s === 'app runner') {
    return 'bg-orange-550/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
  }

  // サーバーレス、イベント、ストリーミング
  if (
    s === 'lambda' ||
    s === 'api gateway' ||
    s === 'kinesis data streams' ||
    s === 'kinesis data firehose' ||
    s === 'kinesis'
  ) {
    return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
  }

  // ストレージ、CDN
  if (s === 's3' || s === 'cloudfront') {
    return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
  }

  // データベース、キャッシュ
  if (
    s === 'rds' ||
    s === 'dynamodb' ||
    s === 'elasticache' ||
    s === 'postgresql' ||
    s.includes('database')
  ) {
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
  }

  // ネットワーク、DNS
  if (
    s === 'vpc' ||
    s === 'vpc lattice' ||
    s === 'route 53' ||
    s === 'alb' ||
    s === 'security group'
  ) {
    return 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30';
  }

  // セキュリティ、ID、認証
  if (s === 'iam' || s === 'cognito' || s === 'acm' || s === 'kms' || s === 'secrets manager') {
    return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
  }

  // ガバナンス、管理、デプロイ
  if (
    s === 'organizations' ||
    s === 'control tower' ||
    s === 'cloudformation' ||
    s === 'cloudwatch'
  ) {
    return 'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30';
  }

  // デフォルト
  return 'bg-secondary text-text/80 border-border/10 dark:border-border/20';
}
