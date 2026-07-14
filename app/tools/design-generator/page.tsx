// app/tools/design-generator/page.tsx
'use client';

import { Paintbrush, ImageIcon, Gamepad2 } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import NeoBrutalism from '@/src/components/tools/design-generator/NeoBrutalism';
import MemphisGenerator from '@/src/components/tools/design-generator/MemphisGenerator';
import PixelArt from '@/src/components/tools/design-generator/PixelArt';

const SUB_TOOLS: Record<string, SubTool> = {
  'neo-brutalism': {
    label: 'Neo-Brutalism UI Generator',
    description:
      'ネオブルータリズム特有の太線ボーダーやハードシャドウ、発光ネオンを直感的に生成・カスタマイズします。',
    icon: Paintbrush,
    component: NeoBrutalism,
  },
  memphis: {
    label: 'Memphis Generator',
    description: 'メンフィスパターンのモダンな幾何学背景を直感的に生成・カスタマイズします。',
    icon: ImageIcon,
    component: MemphisGenerator,
  },
  'pixel-art': {
    label: 'Pixel Art Canvas',
    description: '16x16や32x32のグリッド上に直感的にドット絵を描き、PNG/SVGで保存します。',
    icon: Gamepad2,
    component: PixelArt,
  },
};

export default function DesignGeneratorToolkit() {
  return (
    <ToolTabsPage
      basePath="/tools/design-generator"
      subTools={SUB_TOOLS}
      defaultTab="neo-brutalism"
    />
  );
}
