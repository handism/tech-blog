'use client';

import { Search, Terminal, Code } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const RegexTester = dynamic(() => import('@/src/components/tools/code-helper/RegexTester'));
const CurlConverter = dynamic(() => import('@/src/components/tools/code-helper/CurlConverter'));
const HtmlToJsx = dynamic(() => import('@/src/components/tools/code-helper/HtmlToJsx'));

const SUB_TOOLS: Record<string, SubTool> = {
  regex: {
    label: 'Regex Tester',
    description: '正規表現パターンの一致確認とキャプチャグループのリアルタイムテストを行います。',
    icon: Search,
    component: RegexTester,
  },
  curl: {
    label: 'Curl to Code Converter',
    description: 'CurlリクエストをFetch、Axios、Python等マルチ言語のコードに相互変換します。',
    icon: Terminal,
    component: CurlConverter,
  },
  'html-to-jsx': {
    label: 'HTML to JSX',
    description: 'HTMLコードを、React / Next.js用のJSX / TSX形式に自動パースして変換します。',
    icon: Code,
    component: HtmlToJsx,
  },
};

export default function CodeHelperToolkit() {
  return <ToolTabsPage basePath="/tools/code-helper" subTools={SUB_TOOLS} defaultTab="regex" />;
}
