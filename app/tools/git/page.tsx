// app/tools/git/page.tsx
'use client';

import { GitCommit, Terminal } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import GitCommitHelper from '@/src/components/tools/git/GitCommitHelper';
import GitHelper from '@/src/components/tools/git/GitHelper';

const SUB_TOOLS: Record<string, SubTool> = {
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
};

export default function GitToolkit() {
  return <ToolTabsPage basePath="/tools/git" subTools={SUB_TOOLS} defaultTab="commit" />;
}
