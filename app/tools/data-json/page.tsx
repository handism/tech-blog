// app/tools/data-json/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Code, GitCompare, Database, Clipboard, FileJson } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import JsonFormatter from '@/src/components/tools/data-json/JsonFormatter';
import JsonDiff from '@/src/components/tools/data-json/JsonDiff';
import JsonGenerator from '@/src/components/tools/data-json/JsonGenerator';
import JsonToTs from '@/src/components/tools/data-json/JsonToTs';
import YamlJson from '@/src/components/tools/data-json/YamlJson';
import CsvJson from '@/src/components/tools/data-json/CsvJson';
import SqlFormatter from '@/src/components/tools/data-json/SqlFormatter';

type SubToolKey =
  | 'json-formatter'
  | 'json-diff'
  | 'json-generator'
  | 'json-to-ts'
  | 'yaml-json'
  | 'csv-json'
  | 'sql-formatter';

const SUB_TOOLS = {
  'json-formatter': {
    label: 'JSON Formatter',
    description: 'JSON データをきれいに整形・ミニファイし、構文エラー箇所を検出します。',
    icon: Code,
    component: JsonFormatter,
  },
  'json-diff': {
    label: 'JSON Diff',
    description: '2つのJSONオブジェクトを構造的に比較し、差分を色分けして視覚的に確認できます。',
    icon: GitCompare,
    component: JsonDiff,
  },
  'json-generator': {
    label: 'Mock JSON Gen',
    description:
      '開発や検証に使えるランダムなJSON（ダミーデータ）を一括生成・ダウンロードできます。',
    icon: Database,
    component: JsonGenerator,
  },
  'json-to-ts': {
    label: 'JSON to TS/Zod',
    description:
      'JSONオブジェクトからTypeScriptの型定義やZodバリデーションスキーマを自動生成します。',
    icon: Clipboard,
    component: JsonToTs,
  },
  'yaml-json': {
    label: 'YAML ↔ JSON',
    description: 'YAML形式とJSON形式のデータをブラウザ上で双方向に相互変換します。',
    icon: FileJson,
    component: YamlJson,
  },
  'csv-json': {
    label: 'CSV ↔ JSON',
    description: '表形式のCSVデータと構造化されたJSONデータを双方向に相互変換します。',
    icon: Code,
    component: CsvJson,
  },
  'sql-formatter': {
    label: 'SQL Formatter',
    description:
      'ごちゃごちゃしたSQLクエリを、見やすくインデント付きのクエリに整形（フォーマット）します。',
    icon: Database,
    component: SqlFormatter,
  },
} as const;

function DataJsonToolkitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // クエリパラメータの tab を取得（デフォルトは json-formatter）
  const currentTab = (searchParams.get('tab') || 'json-formatter') as SubToolKey;
  const activeTab: SubToolKey = currentTab in SUB_TOOLS ? currentTab : 'json-formatter';

  const activeTool = SUB_TOOLS[activeTab];
  const ActiveComponent = activeTool.component;

  const handleTabChange = (tab: SubToolKey) => {
    router.push(`/tools/data-json?tab=${tab}`);
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

export default function DataJsonToolkit() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center font-bold text-text/60">
          読み込み中...
        </div>
      }
    >
      <DataJsonToolkitContent />
    </Suspense>
  );
}
