'use client';

import { Paintbrush, Layers, Ruler, Activity, Layout } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import CssGradient from '@/src/components/tools/css/CssGradient';
import CssGenerator from '@/src/components/tools/css/CssGenerator';
import CssUnit from '@/src/components/tools/css/CssUnit';
import CubicBezier from '@/src/components/tools/css/CubicBezier';
import FlexboxGrid from '@/src/components/tools/css/FlexboxGrid';

const SUB_TOOLS: Record<string, SubTool> = {
  gradient: {
    label: 'Gradient & Mesh',
    description:
      '線形、放射状、およびドラッグで調整可能なメッシュグラデーションを直感的に作成します。',
    icon: Paintbrush,
    component: CssGradient,
  },
  generator: {
    label: 'CSS Generator',
    description:
      'Glassmorphismやすりガラス風エフェクト、および極上の陰影（Smooth Shadow）をビジュアル調整しながら生成します。',
    icon: Layers,
    component: CssGenerator,
  },
  'flexbox-grid': {
    label: 'Flexbox & Grid Playground',
    description:
      'FlexboxとCSS Gridのレイアウトプロパティを視覚的に操作し、HTML/CSSコードを自動生成します。',
    icon: Layout,
    component: FlexboxGrid,
  },
  unit: {
    label: 'Unit Converter',
    description: 'px, rem, em, vw, vh などの各種CSS単位をリアルタイムに相互変換します。',
    icon: Ruler,
    component: CssUnit,
  },
  'cubic-bezier': {
    label: 'Cubic-Bezier',
    description:
      'ドラッグやスライダーでイージング曲線をビジュアル設計し、他のイージングと動きを比較プレビューします。',
    icon: Activity,
    component: CubicBezier,
  },
};

export default function CssToolkit() {
  return <ToolTabsPage basePath="/tools/css" subTools={SUB_TOOLS} defaultTab="gradient" />;
}
