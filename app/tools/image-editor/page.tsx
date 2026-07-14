import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import ImageEditorToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Image Editor & Converter | ${siteConfig.name}`,
  description:
    '画像の圧縮、WebP変換、リサイズ、ファビコン生成、アイコン変換などをブラウザ完結で行います。',
  alternates: {
    canonical: '/tools/image-editor',
  },
};

export default function ImageEditorToolkit() {
  return <ImageEditorToolkitClient />;
}
