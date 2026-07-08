// app/tools/url/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link as LinkIcon, ShieldAlert } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import UrlCodec from '@/src/components/tools/url/UrlCodec';
import UrlParser from '@/src/components/tools/url/UrlParser';
import UtmBuilder from '@/src/components/tools/url/UtmBuilder';
import UserAgentParser from '@/src/components/tools/url/UserAgentParser';

type SubToolKey = 'url-codec' | 'url-parser' | 'utm-builder' | 'user-agent';

const SUB_TOOLS = {
  'url-codec': {
    label: 'URL Codec',
    description:
      'URLのクエリパラメータなどに用いる文字列のパーセントエンコード・デコード処理を行います。',
    icon: LinkIcon,
    component: UrlCodec,
  },
  'url-parser': {
    label: 'URL Parser',
    description:
      '長いURLやクエリパラメータをきれいに分解し、値の編集・追加・削除を行って新しいURLを再生成します。',
    icon: LinkIcon,
    component: UrlParser,
  },
  'utm-builder': {
    label: 'UTM Builder',
    description:
      'Google Analytics等でのアクセス解析に用いるカスタムキャンペーンパラメータ（UTM）を追加したURLを作成します。',
    icon: LinkIcon,
    component: UtmBuilder,
  },
  'user-agent': {
    label: 'User Agent',
    description:
      'ブラウザが送信するユーザーエージェント（UA）文字列を解析し、OS・ブラウザ・エンジンを調べられます。',
    icon: ShieldAlert,
    component: UserAgentParser,
  },
} as const;

function UrlToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは url-codec）
  const currentTab = (searchParams.get('tab') || 'url-codec') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'url-codec';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/url?tab=${tab}`);
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

export default function UrlToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <CryptoToolkitContent />
    </Suspense>
  );
}

// 共通インポート名との重複を避けるためのコンポーネントラップ
function CryptoToolkitContent() {
  return <UrlToolkitContent />;
}
