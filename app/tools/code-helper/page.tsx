// app/tools/code-helper/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Terminal, Code } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import RegexTester from '@/src/components/tools/code-helper/RegexTester';
import CurlConverter from '@/src/components/tools/code-helper/CurlConverter';
import HtmlToJsx from '@/src/components/tools/code-helper/HtmlToJsx';

type SubToolKey = 'regex' | 'curl' | 'html-to-jsx';

const SUB_TOOLS = {
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
} as const;

function CodeHelperToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = (searchParams.get('tab') || 'regex') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'regex';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/code-helper?tab=${tab}`);
  };

  return (
    <ToolPageLayout
      title={activeTool.label}
      description={activeTool.description}
      icon={activeTool.icon}
    >
      <div className="space-y-8">
        {/* サブツールの切り替えタブ */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-b-2 border-border/20 -mx-4 px-4 md:mx-0 md:px-0">
          {(Object.keys(SUB_TOOLS) as SubToolKey[]).map((key) => {
            const tool = SUB_TOOLS[key];
            const isActive = activeTab === key;
            const Icon = tool.icon;

            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 border-border transition-all flex items-center gap-1.5 cursor-pointer
                  ${
                    isActive
                      ? 'bg-accent text-white translate-x-[1px] translate-y-[1px] shadow-none'
                      : 'bg-card text-text shadow-[2.5px_2.5px_0px_0px_var(--border)] dark:shadow-[2.5px_2.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] dark:hover:shadow-[4px_4px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* アクティブなサブツールのレンダリング */}
        <div className="min-h-[400px]">
          <ActiveComponent />
        </div>
      </div>
    </ToolPageLayout>
  );
}

export default function CodeHelperToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <CodeHelperToolkitContent />
    </Suspense>
  );
}
