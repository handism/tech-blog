'use client';

import { Palette, Eye } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import ColorConverter from '@/src/components/tools/color/ColorConverter';
import ColorContrast from '@/src/components/tools/color/ColorContrast';

const SUB_TOOLS: Record<string, SubTool> = {
  converter: {
    label: 'Color Converter',
    description: 'HEX, RGB, HSL, CMYKなどのカラーコードを相互に変換できます。',
    icon: Palette,
    component: ColorConverter,
  },
  contrast: {
    label: 'Color Contrast & Palette',
    description:
      '背景色と文字色のコントラスト比をWCAG基準に基づいて判定し、調和したパレットを自動作成します。',
    icon: Eye,
    component: ColorContrast,
  },
};

export default function ColorToolkit() {
  return <ToolTabsPage basePath="/tools/color" subTools={SUB_TOOLS} defaultTab="converter" />;
}
