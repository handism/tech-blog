'use client';

import { ImageIcon, Crop, Smartphone } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const ImageOptimizer = dynamic(() => import('@/src/components/tools/image-editor/ImageOptimizer'));
const ImageTrimmer = dynamic(() => import('@/src/components/tools/image-editor/ImageTrimmer'));
const FaviconGenerator = dynamic(
  () => import('@/src/components/tools/image-editor/FaviconGenerator')
);

const SUB_TOOLS: Record<string, SubTool> = {
  optimizer: {
    label: 'Image Converter & Optimizer',
    description: 'ブラウザ上だけで画像のWebP変換、リサイズ、品質調整を安全・高速に実行します。',
    icon: ImageIcon,
    component: ImageOptimizer,
  },
  trimmer: {
    label: 'Image Trimmer',
    description: '画像を任意の縦横比やカスタムサイズでトリミング・リサイズ・保存します。',
    icon: Crop,
    component: ImageTrimmer,
  },
  favicon: {
    label: 'Favicon & App Icon Generator',
    description: 'アップロード画像から各サイズアイコンへリサイズ・ZIP一括生成します。',
    icon: Smartphone,
    component: FaviconGenerator,
  },
};

export default function ImageEditorToolkit() {
  return (
    <ToolTabsPage basePath="/tools/image-editor" subTools={SUB_TOOLS} defaultTab="optimizer" />
  );
}
