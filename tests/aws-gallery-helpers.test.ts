import { describe, expect, it } from 'vitest';
import { getServiceBadgeStyle } from '@/src/lib/aws-gallery-helpers';

describe('getServiceBadgeStyle', () => {
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
  const DEFAULT_STYLE = 'bg-secondary text-text/80 border-border/10 dark:border-border/20';

  it('コンテナ・サーバー系（ECS, EC2など）にはORANGEのスタイルを返す', () => {
    expect(getServiceBadgeStyle('ecs')).toBe(ORANGE);
    expect(getServiceBadgeStyle('fargate')).toBe(ORANGE);
    expect(getServiceBadgeStyle('ec2')).toBe(ORANGE);
    expect(getServiceBadgeStyle('auto scaling')).toBe(ORANGE);
    expect(getServiceBadgeStyle('app runner')).toBe(ORANGE);
  });

  it('サーバーレス・イベント系にはAMBERのスタイルを返す', () => {
    expect(getServiceBadgeStyle('lambda')).toBe(AMBER);
    expect(getServiceBadgeStyle('api gateway')).toBe(AMBER);
  });

  it('ストレージ系にはGREENのスタイルを返す', () => {
    expect(getServiceBadgeStyle('s3')).toBe(GREEN);
    expect(getServiceBadgeStyle('cloudfront')).toBe(GREEN);
  });

  it('データベース・キャッシュ系にはBLUEのスタイルを返す', () => {
    expect(getServiceBadgeStyle('rds')).toBe(BLUE);
    expect(getServiceBadgeStyle('dynamodb')).toBe(BLUE);
  });

  it('ネットワーク・DNS系にはPURPLEのスタイルを返す', () => {
    expect(getServiceBadgeStyle('vpc')).toBe(PURPLE);
    expect(getServiceBadgeStyle('route 53')).toBe(PURPLE);
  });

  it('セキュリティ・認証系にはREDのスタイルを返す', () => {
    expect(getServiceBadgeStyle('iam')).toBe(RED);
    expect(getServiceBadgeStyle('cognito')).toBe(RED);
  });

  it('ガバナンス・管理系にはPINKのスタイルを返す', () => {
    expect(getServiceBadgeStyle('organizations')).toBe(PINK);
    expect(getServiceBadgeStyle('cloudwatch')).toBe(PINK);
  });

  it('大文字・小文字を区別せず、前後の空白を取り除いて判定する', () => {
    expect(getServiceBadgeStyle(' ECS ')).toBe(ORANGE);
    expect(getServiceBadgeStyle('  eC2  ')).toBe(ORANGE);
    expect(getServiceBadgeStyle('Lambda')).toBe(AMBER);
  });

  it('名前に"database"が含まれる場合はBLUEのスタイルを返す（部分一致）', () => {
    expect(getServiceBadgeStyle('aurora database')).toBe(BLUE);
    expect(getServiceBadgeStyle('graph database')).toBe(BLUE);
  });

  it('未定義のサービスにはデフォルトのスタイルを返す', () => {
    expect(getServiceBadgeStyle('unknown service')).toBe(DEFAULT_STYLE);
    expect(getServiceBadgeStyle('hoge')).toBe(DEFAULT_STYLE);
  });
});
