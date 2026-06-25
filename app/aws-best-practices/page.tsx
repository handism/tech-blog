// app/aws-best-practices/page.tsx
import { getAllAwsPatternMetas } from '@/src/lib/aws-gallery-server';
import { siteConfig } from '@/src/config/site';
import type { Metadata } from 'next';
import AwsPatternGallery from '@/src/components/AwsPatternGallery';

export const metadata: Metadata = {
  title: `AWSアーキテクチャ・テンプレート集 | ${siteConfig.name}`,
  description:
    'AWSのベストプラクティスに基づき設計された、CloudFormationテンプレート（IaC）およびアーキテクチャ図（Draw.io）のギャラリーカタログ。コンテナ、サーバーレス、高可用性構成など、実用的なインフラ定義コードをプレビュー・コピー・ダウンロードできます。',
  alternates: {
    canonical: '/aws-best-practices',
  },
};

export default async function AwsBestPracticesPage() {
  // サーバーサイドで全アーキテクチャのメタデータをロード
  const patterns = await getAllAwsPatternMetas();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-24">
      {/* ヒーローセクション */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          <span className="text-xs font-black text-accent uppercase tracking-wider">
            AWS Well-Architected / IaC
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight">
          ☁️ AWS Patterns
        </h1>
        <p className="text-text/70 font-medium max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          AWSのベストプラクティスに沿って設計されたインフラ定義テンプレート（CloudFormation）とアーキテクチャ図（Draw.io）のギャラリーです。コピー＆ペーストやダウンロードですぐに開発に活用できます。
        </p>
      </div>

      {/* ギャラリーインタラクション */}
      <AwsPatternGallery patterns={patterns} />
    </div>
  );
}
