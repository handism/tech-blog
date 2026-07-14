'use client';

import { FileCode, Sparkles, Code, ImageIcon } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import SvgEditor from '@/src/components/tools/svg-toolkit/SvgEditor';
import SvgWaveBlob from '@/src/components/tools/svg-toolkit/SvgWaveBlob';
import SvgToCss from '@/src/components/tools/svg-toolkit/SvgToCss';
import PlaceholderGenerator from '@/src/components/tools/svg-toolkit/PlaceholderGenerator';

const SUB_TOOLS: Record<string, SubTool> = {
  editor: {
    label: 'SVG Path Visualizer & Optimizer',
    description: 'SVGコードのプレビュー表示と、不要な属性や余白の簡易クリーンアップを行います。',
    icon: FileCode,
    component: SvgEditor,
  },
  'wave-blob': {
    label: 'SVG Wave & Blob Generator',
    description:
      '美しい波形（Wave）や不定形シェイプ（Blob）を直感的に生成・カスタマイズしSVG出力します。',
    icon: Sparkles,
    component: SvgWaveBlob,
  },
  'to-css': {
    label: 'SVG to CSS Converter',
    description: 'SVGコードをCSS背景画像用URL (Data URI/Base64) やJSX用に最適化・相互変換します。',
    icon: Code,
    component: SvgToCss,
  },
  placeholder: {
    label: 'SVG Placeholder Generator',
    description:
      'モックアップ作成に便利な指定サイズ・指定テキストのダミー画像（SVG / PNG）を一瞬で生成します。',
    icon: ImageIcon,
    component: PlaceholderGenerator,
  },
};

export default function SvgToolkit() {
  return <ToolTabsPage basePath="/tools/svg-toolkit" subTools={SUB_TOOLS} defaultTab="editor" />;
}
