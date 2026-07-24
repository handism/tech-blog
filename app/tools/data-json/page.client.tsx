'use client';

import { Code, GitCompare, Database, Clipboard, FileJson } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const JsonFormatter = dynamic(() => import('@/src/components/tools/data-json/JsonFormatter'));
const JsonDiff = dynamic(() => import('@/src/components/tools/data-json/JsonDiff'));
const JsonGenerator = dynamic(() => import('@/src/components/tools/data-json/JsonGenerator'));
const JsonToTs = dynamic(() => import('@/src/components/tools/data-json/JsonToTs'));
const YamlJson = dynamic(() => import('@/src/components/tools/data-json/YamlJson'));
const CsvJson = dynamic(() => import('@/src/components/tools/data-json/CsvJson'));
const SqlFormatter = dynamic(() => import('@/src/components/tools/data-json/SqlFormatter'));

const SUB_TOOLS: Record<string, SubTool> = {
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
};

export default function DataJsonToolkit() {
  return (
    <ToolTabsPage basePath="/tools/data-json" subTools={SUB_TOOLS} defaultTab="json-formatter" />
  );
}
