// app/tools/svg-toolkit/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileCode, Sparkles, Code, ImageIcon } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import SvgEditor from '@/src/components/tools/svg-toolkit/SvgEditor';
import SvgWaveBlob from '@/src/components/tools/svg-toolkit/SvgWaveBlob';
import SvgToCss from '@/src/components/tools/svg-toolkit/SvgToCss';
import PlaceholderGenerator from '@/src/components/tools/svg-toolkit/PlaceholderGenerator';

type SubToolKey = 'editor' | 'wave-blob' | 'to-css' | 'placeholder';

const SUB_TOOLS = {
  editor: {
    label: 'SVG Path Visualizer & Optimizer',
    description: 'SVGコードのプレビュー表示と、不要な属性や余白の簡易クリーンアップを行います。',
    icon: FileCode,
    component: SvgEditor,
  },
  'wave-blob': {
    label: 'SVG Wave & Blob Generator',
    description:
      '美しい波形（Wave）や不定形シェイプ（Blob）を直感的に生成・カスタマイズしSVG出力します。',
    icon: Sparkles,
    component: SvgWaveBlob,
  },
  'to-css': {
    label: 'SVG to CSS Converter',
    description: 'SVGコードをCSS背景画像用URL (Data URI/Base64) やJSX用に最適化・相互変換します。',
    icon: Code,
    component: SvgToCss,
  },
  placeholder: {
    label: 'SVG Placeholder Generator',
    description:
      'モックアップ作成に便利な指定サイズ・指定テキストのダミー画像（SVG / PNG）を一瞬で生成します。',
    icon: ImageIcon,
    component: PlaceholderGenerator,
  },
} as const;

function SvgToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = (searchParams.get('tab') || 'editor') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'editor';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/svg-toolkit?tab=${tab}`);
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

export default function SvgToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <SvgToolkitContent />
    </Suspense>
  );
}
