// app/tools/text-toolkit/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, EyeOff, AlignLeft, Split } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import TextCase from '@/src/components/tools/text-toolkit/TextCase';
import InvisibleCharacters from '@/src/components/tools/text-toolkit/InvisibleCharacters';
import LoremIpsum from '@/src/components/tools/text-toolkit/LoremIpsum';
import DiffViewer from '@/src/components/tools/text-toolkit/DiffViewer';

type SubToolKey = 'case' | 'invisible' | 'lorem' | 'diff';

const SUB_TOOLS = {
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
} as const;

function TextToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = (searchParams.get('tab') || 'case') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'case';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/text-toolkit?tab=${tab}`);
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

export default function TextToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <TextToolkitContent />
    </Suspense>
  );
}
