// src/components/ToolTabsPage.tsx
'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import type { LucideIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, type ComponentType } from 'react';

/**
 * タブ切り替え時のローディングスケルトン。
 */
function ToolTabsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 rounded-lg bg-border/20" />
      <div className="h-48 rounded-xl bg-border/10" />
      <div className="h-32 rounded-xl bg-border/10" />
    </div>
  );
}

/**
 * タブ切り替え型ツールページのサブツール定義。
 */
export type SubTool = {
  label: string;
  description: string;
  icon: LucideIcon;
  component: ComponentType;
};

type ToolTabsPageProps = {
  /** ツールページのルートパス（例: '/tools/css'） */
  basePath: string;
  /** タブキーとサブツール定義のマップ */
  subTools: Record<string, SubTool>;
  /** クエリパラメータ未指定・不正時に表示するタブキー */
  defaultTab: string;
};

function ToolTabsContent({ basePath, subTools, defaultTab }: ToolTabsPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（不正値はデフォルトタブにフォールバック）
  const currentTab = searchParams.get('tab') || defaultTab;
  const activeTab = currentTab in subTools ? currentTab : defaultTab;

  const activeTool = subTools[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: string) => {
    router.push(`${basePath}?tab=${tab}`);
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
          {Object.keys(subTools).map((key) => {
            const tool = subTools[key];
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
          <Suspense fallback={<ToolTabsLoading />}>
            <ActiveComponent />
          </Suspense>
        </div>
      </div>
    </ToolPageLayout>
  );
}

/**
 * タブ切り替え型ツールページの共通レイアウト。
 * useSearchParams を使用するため、内部で Suspense 境界を張る。
 */
export default function ToolTabsPage(props: ToolTabsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <ToolTabsContent {...props} />
    </Suspense>
  );
}
