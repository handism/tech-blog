import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import ColorToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Color Palette & Converter | ${siteConfig.name}`,
  description: 'カラーコードの相互変換、パレットの作成、画像からの色抽出ツール。',
  alternates: {
    canonical: '/tools/color',
  },
};

export default function ColorToolkit() {
  return <ColorToolkitClient />;
}
