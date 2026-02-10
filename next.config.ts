import type { NextConfig } from 'next';

/**
 * Next.js の設定。
 */
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // 静的エクスポート時は必須
  },
};

/**
 * Next.js 設定のエクスポート。
 */
export default nextConfig;
