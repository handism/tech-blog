import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import SvgToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `SVG Toolkit & Optimizer | ${siteConfig.name}`,
  description: 'SVGの波形・Blobジェネレーター、コード最適化、CSS背景変換、プレースホルダー生成。',
  alternates: {
    canonical: '/tools/svg-toolkit',
  },
};

export default function SvgToolkit() {
  return <SvgToolkitClient />;
}
