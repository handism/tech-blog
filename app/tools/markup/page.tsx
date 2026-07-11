// app/tools/markup/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, Grid, Code } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import MarkdownEditor from '@/src/components/tools/markup/MarkdownEditor';
import MarkdownTable from '@/src/components/tools/markup/MarkdownTable';
import HtmlEntity from '@/src/components/tools/markup/HtmlEntity';

type SubToolKey = 'editor' | 'table' | 'html-entity';

const SUB_TOOLS = {
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
} as const;

function MarkupToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは editor）
  const currentTab = (searchParams.get('tab') || 'editor') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'editor';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/markup?tab=${tab}`);
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

export default function MarkupToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <MarkupToolkitContent />
    </Suspense>
  );
}
