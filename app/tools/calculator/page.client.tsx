'use client';

import { Calculator, Hash, Ruler } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const StandardCalculator = dynamic(
  () => import('@/src/components/tools/calculator/StandardCalculator')
);
const BitwiseConverter = dynamic(
  () => import('@/src/components/tools/calculator/BitwiseConverter')
);
const AspectRatio = dynamic(() => import('@/src/components/tools/calculator/AspectRatio'));

const SUB_TOOLS: Record<string, SubTool> = {
  standard: {
    label: 'Calculator',
    description:
      'シンプルで使いやすい多機能電卓。履歴機能、キーボード入力、結果のコピー機能も搭載しています。',
    icon: Calculator,
    component: StandardCalculator,
  },
  bitwise: {
    label: 'Bitwise & Radix Converter',
    description: '進数変換とビット操作（トグル切替）や基本的なビット演算の可視化を行います。',
    icon: Hash,
    component: BitwiseConverter,
  },
  aspect: {
    label: 'Aspect Ratio Calculator',
    description:
      '画面解像度や画像サイズからアスペクト比を計算し、双方向で幅・高さを自動補完します。',
    icon: Ruler,
    component: AspectRatio,
  },
};

export default function CalculatorToolkit() {
  return <ToolTabsPage basePath="/tools/calculator" subTools={SUB_TOOLS} defaultTab="standard" />;
}
