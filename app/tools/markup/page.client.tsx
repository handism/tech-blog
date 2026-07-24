'use client';

import { FileText, Grid, Code } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(() => import('@/src/components/tools/markup/MarkdownEditor'));
const MarkdownTable = dynamic(() => import('@/src/components/tools/markup/MarkdownTable'));
const HtmlEntity = dynamic(() => import('@/src/components/tools/markup/HtmlEntity'));

const SUB_TOOLS: Record<string, SubTool> = {
  editor: {
    label: 'Markdown Editor',
    description: 'ブログのパース・装飾がリアルタイムに反映される高機能Markdownライブエディタです。',
    icon: FileText,
    component: MarkdownEditor,
  },
  table: {
    label: 'Table Editor',
    description:
      '表計算ライクなUIで直感的に表を作成・編集し、Markdown形式のテーブルを入出力します。',
    icon: Grid,
    component: MarkdownTable,
  },
  'html-entity': {
    label: 'HTML Entity',
    description: '特殊文字をHTML実体参照（エンティティ表記）へエンコード・デコードします。',
    icon: Code,
    component: HtmlEntity,
  },
};

export default function MarkupToolkit() {
  return <ToolTabsPage basePath="/tools/markup" subTools={SUB_TOOLS} defaultTab="editor" />;
}
