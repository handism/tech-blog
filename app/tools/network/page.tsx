// app/tools/network/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Globe, ShieldCheck, Binary } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import HttpTester from '@/src/components/tools/network/HttpTester';
import HttpStatus from '@/src/components/tools/network/HttpStatus';
import SecurityHeaders from '@/src/components/tools/network/SecurityHeaders';
import CidrCalculator from '@/src/components/tools/network/CidrCalculator';

type SubToolKey = 'tester' | 'status' | 'security' | 'cidr';

const SUB_TOOLS = {
  tester: {
    label: 'Request Tester',
    description: 'ブラウザのFetch APIを用いて、各種APIリクエストの送信とレスポンスをテストします。',
    icon: Send,
    component: HttpTester,
  },
  status: {
    label: 'Status Explorer',
    description:
      'HTTPステータスコードの意味や背景、JSONレスポンス例、MDN仕様書を検索・確認できます。',
    icon: Globe,
    component: HttpStatus,
  },
  security: {
    label: 'Security Headers',
    description:
      'Nginx, Apache, Vercel, Netlify用のセキュリティヘッダー設定コードを瞬時に生成します。',
    icon: ShieldCheck,
    component: SecurityHeaders,
  },
  cidr: {
    label: 'CIDR Calculator',
    description:
      'IPアドレスとCIDRからネットワークアドレス、ブロードキャスト、IP範囲を動的に計算します。',
    icon: Binary,
    component: CidrCalculator,
  },
} as const;

function NetworkToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは tester）
  const currentTab = (searchParams.get('tab') || 'tester') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'tester';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/network?tab=${tab}`);
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

export default function NetworkToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <NetworkToolkitContent />
    </Suspense>
  );
}
