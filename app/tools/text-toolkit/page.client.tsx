'use client';

import { FileText, EyeOff, AlignLeft, Split } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const TextCase = dynamic(() => import('@/src/components/tools/text-toolkit/TextCase'));
const InvisibleCharacters = dynamic(
  () => import('@/src/components/tools/text-toolkit/InvisibleCharacters')
);
const LoremIpsum = dynamic(() => import('@/src/components/tools/text-toolkit/LoremIpsum'));
const DiffViewer = dynamic(() => import('@/src/components/tools/text-toolkit/DiffViewer'));

const SUB_TOOLS: Record<string, SubTool> = {
  case: {
    label: 'Text Case Converter & Counter',
    description: '大文字・小文字などの変換および文字数・行数のリアルタイムカウントを行います。',
    icon: FileText,
    component: TextCase,
  },
  invisible: {
    label: 'Invisible Character Detector',
    description:
      '全角スペースやゼロ幅スペースなどの不可視文字・特殊文字を検出し、ワンクリックで除去します。',
    icon: EyeOff,
    component: InvisibleCharacters,
  },
  lorem: {
    label: 'Lorem Ipsum & Dummy Text',
    description:
      '段落数や文字数を指定して、レイアウト確認用のダミーテキスト（日本語・ラテン語）を瞬時に作成します。',
    icon: AlignLeft,
    component: LoremIpsum,
  },
  diff: {
    label: 'Diff Viewer',
    description: '2つのテキストを並べて変更箇所を行単位・文字単位で視覚的に比較します。',
    icon: Split,
    component: DiffViewer,
  },
};

export default function TextToolkit() {
  return <ToolTabsPage basePath="/tools/text-toolkit" subTools={SUB_TOOLS} defaultTab="case" />;
}
