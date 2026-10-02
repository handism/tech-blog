import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import { siteConfig } from './src/config/site';

/**
 * Next.js の設定。
 */
const nextConfig: NextConfig = {
  output: 'export',
  basePath: siteConfig.basePath,
  trailingSlash: true,
  images: {
    unoptimized: true, // 静的エクスポート時は必須
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * Next.js 設定のエクスポート。
 * ANALYZE=true npm run build でバンドル分析レポートを生成する。
 */
export default withBundleAnalyzer(nextConfig);
