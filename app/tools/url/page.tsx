import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import UrlToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `URL Codec & UTM Builder | ${siteConfig.name}`,
  description:
    'URLエンコード・デコード、URLパラメータのパース、UTMリンク生成、ユーザーエージェント解析。',
  alternates: {
    canonical: '/tools/url',
  },
};

export default function UrlToolkit() {
  return <UrlToolkitClient />;
}
