// app/tools/css/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Paintbrush, Layers, Ruler, Activity, Layout } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import CssGradient from '@/src/components/tools/css/CssGradient';
import CssGenerator from '@/src/components/tools/css/CssGenerator';
import CssUnit from '@/src/components/tools/css/CssUnit';
import CubicBezier from '@/src/components/tools/css/CubicBezier';
import FlexboxGrid from '@/src/components/tools/css/FlexboxGrid';

type SubToolKey = 'gradient' | 'generator' | 'unit' | 'cubic-bezier' | 'flexbox-grid';

const SUB_TOOLS = {
  gradient: {
    label: 'Gradient & Mesh',
    description:
      '線形、放射状、およびドラッグで調整可能なメッシュグラデーションを直感的に作成します。',
    icon: Paintbrush,
    component: CssGradient,
  },
  generator: {
    label: 'CSS Generator',
    description:
      'Glassmorphismやすりガラス風エフェクト、および極上の陰影（Smooth Shadow）をビジュアル調整しながら生成します。',
    icon: Layers,
    component: CssGenerator,
  },
  'flexbox-grid': {
    label: 'Flexbox & Grid Playground',
    description:
      'FlexboxとCSS Gridのレイアウトプロパティを視覚的に操作し、HTML/CSSコードを自動生成します。',
    icon: Layout,
    component: FlexboxGrid,
  },
  unit: {
    label: 'Unit Converter',
    description: 'px, rem, em, vw, vh などの各種CSS単位をリアルタイムに相互変換します。',
    icon: Ruler,
    component: CssUnit,
  },
  'cubic-bezier': {
    label: 'Cubic-Bezier',
    description:
      'ドラッグやスライダーでイージング曲線をビジュアル設計し、他のイージングと動きを比較プレビューします。',
    icon: Activity,
    component: CubicBezier,
  },
} as const;

function CssToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは gradient）
  const currentTab = (searchParams.get('tab') || 'gradient') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'gradient';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/css?tab=${tab}`);
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

export default function CssToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <CssToolkitContent />
    </Suspense>
  );
}
