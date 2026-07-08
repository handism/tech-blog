// app/tools/git/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GitCommit, Terminal } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import GitCommitHelper from '@/src/components/tools/git/GitCommitHelper';
import GitHelper from '@/src/components/tools/git/GitHelper';

type SubToolKey = 'commit' | 'helper';

const SUB_TOOLS = {
  commit: {
    label: 'Commit Helper',
    description:
      'Conventional Commitsに基づいたコミットメッセージとGitコマンド（ブランチ作成・コミット実行）を生成します。',
    icon: GitCommit,
    component: GitCommitHelper,
  },
  helper: {
    label: 'Command Helper',
    description:
      'やりたいこと（ユースケース）を選び、必要なパラメータを入力するだけで最適なGitコマンドを作成します。',
    icon: Terminal,
    component: GitHelper,
  },
} as const;

function GitToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは commit）
  const currentTab = (searchParams.get('tab') || 'commit') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'commit';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/git?tab=${tab}`);
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

export default function GitToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <GitToolkitContent />
    </Suspense>
  );
}
