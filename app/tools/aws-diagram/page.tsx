import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import AwsDiagramClientPage from './page.client';

export const metadata: Metadata = {
  title: `AWS Architecture Diagram Generator | ${siteConfig.name}`,
  description:
    'フォーム操作だけで、境界線（VPCやサブネット）と主要AWSリソース、それらを結ぶネットワーク接続線をきれいに定義し、Mermaid.jsで美しい構成図を自動描画します。',
  alternates: {
    canonical: '/tools/aws-diagram',
  },
};

export default function AwsDiagramPage() {
  return <AwsDiagramClientPage />;
}
