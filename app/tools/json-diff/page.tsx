'use client';

import { useState, useMemo } from 'react';
import { GitCompare, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

// サンプルJSON 1
const SAMPLE_JSON_1 = `{
  "name": "山田 太郎",
  "age": 30,
  "email": "taro.yamada@example.com",
  "roles": ["developer", "designer"],
  "address": {
    "zip": "100-0001",
    "city": "東京都千代田区",
    "street": "1-1"
  },
  "active": true
}`;

// サンプルJSON 2
const SAMPLE_JSON_2 = `{
  "email": "taro.yamada@example.com",
  "name": "山田 太郎",
  "age": 31,
  "roles": ["developer", "manager"],
  "address": {
    "city": "東京都千代田区",
    "street": "1-1-2",
    "zip": "100-0001"
  },
  "active": true,
  "updatedAt": "2026-06-25T12:00:00Z"
}`;

// JSONのキーを再帰的にソートする関数
function sortJsonObject(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortJsonObject);
  }
  const objRecord = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(objRecord).sort();
  const result: Record<string, unknown> = {};
  sortedKeys.forEach((key) => {
    result[key] = sortJsonObject(objRecord[key]);
  });
  return result;
}

// LCS (最長共通部分系列) によるシンプルな行ベースの差分算出アルゴリズム
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNum1?: number;
  lineNum2?: number;
}

function computeDiff(lines1: string[], lines2: string[]): DiffLine[] {
  const m = lines1.length;
  const n = lines2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff: DiffLine[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      diff.unshift({ type: 'unchanged', value: lines1[i - 1], lineNum1: i, lineNum2: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', value: lines2[j - 1], lineNum2: j });
      j--;
    } else {
      diff.unshift({ type: 'removed', value: lines1[i - 1], lineNum1: i });
      i--;
    }
  }
  return diff;
}

export default function JsonDiffPage() {
  const [jsonInput1, setJsonInput1] = useState<string>(SAMPLE_JSON_1);
  const [jsonInput2, setJsonInput2] = useState<string>(SAMPLE_JSON_2);
  const [shouldSortKeys, setShouldSortKeys] = useState<boolean>(true);

  // JSON 1 のパースおよびエラーチェック
  const parsed1 = useMemo(() => {
    if (!jsonInput1.trim()) return { data: null, error: null };
    try {
      const obj = JSON.parse(jsonInput1);
      return { data: obj, error: null };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return { data: null, error: errorMsg };
    }
  }, [jsonInput1]);

  // JSON 2 のパースおよびエラーチェック
  const parsed2 = useMemo(() => {
    if (!jsonInput2.trim()) return { data: null, error: null };
    try {
      const obj = JSON.parse(jsonInput2);
      return { data: obj, error: null };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return { data: null, error: errorMsg };
    }
  }, [jsonInput2]);

  // 差分計算
  const diffResult = useMemo(() => {
    // どちらかにエラーがある場合は差分計算をスキップ
    if (parsed1.error || parsed2.error || !parsed1.data || !parsed2.data) {
      return null;
    }

    let obj1 = parsed1.data;
    let obj2 = parsed2.data;

    // キーをソートして比較する場合
    if (shouldSortKeys) {
      obj1 = sortJsonObject(obj1);
      obj2 = sortJsonObject(obj2);
    }

    const formatted1 = JSON.stringify(obj1, null, 2);
    const formatted2 = JSON.stringify(obj2, null, 2);

    const lines1 = formatted1.split('\n');
    const lines2 = formatted2.split('\n');

    return computeDiff(lines1, lines2);
  }, [parsed1, parsed2, shouldSortKeys]);

  const handleReset = () => {
    setJsonInput1(SAMPLE_JSON_1);
    setJsonInput2(SAMPLE_JSON_2);
    setShouldSortKeys(true);
  };

  return (
    <ToolPageLayout
      title="JSON Diff Comparer"
      description="2つのJSONオブジェクトを構造的に比較し、差分を色分けして視覚的に確認できます。キー順を自動でソートして整列比較するオプションも搭載。"
      icon={GitCompare}
    >
      <div className="space-y-6">
        {/* 操作バー */}
        <div className="theme-card p-4 bg-secondary/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-bold text-sm text-text cursor-pointer select-none">
              <input
                type="checkbox"
                checked={shouldSortKeys}
                onChange={(e) => setShouldSortKeys(e.target.checked)}
                className="w-4 h-4 text-accent border-2 border-border rounded focus:ring-0 focus:ring-offset-0 accent-accent"
              />
              オブジェクトのキーをアルファベット順にソートして比較
            </label>
          </div>
          <button
            onClick={handleReset}
            className="theme-btn py-1.5 px-3 text-xs flex items-center gap-1 bg-card hover:bg-secondary cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            サンプルデータに戻す
          </button>
        </div>

        {/* 入力エリア（2カラム） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JSON 1 */}
          <div className="space-y-2">
            <label htmlFor="json-input-1" className="block text-sm font-extrabold text-text">
              比較元 JSON (JSON 1)
            </label>
            <div className="relative">
              <textarea
                id="json-input-1"
                value={jsonInput1}
                onChange={(e) => setJsonInput1(e.target.value)}
                placeholder="ここに元のJSONをペースト..."
                rows={10}
                className={`w-full p-4 bg-card border-2 text-text font-mono text-xs md:text-sm rounded-xl focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all resize-y ${
                  parsed1.error ? 'border-red-500' : 'border-border'
                }`}
              />
            </div>
            {parsed1.error && (
              <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                構文エラー: {parsed1.error}
              </p>
            )}
            {!parsed1.error && jsonInput1.trim() && (
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 mt-1">
                <Check className="w-3.5 h-3.5" />
                有効なJSONです
              </p>
            )}
          </div>

          {/* JSON 2 */}
          <div className="space-y-2">
            <label htmlFor="json-input-2" className="block text-sm font-extrabold text-text">
              比較先 JSON (JSON 2)
            </label>
            <div className="relative">
              <textarea
                id="json-input-2"
                value={jsonInput2}
                onChange={(e) => setJsonInput2(e.target.value)}
                placeholder="ここに変更後のJSONをペースト..."
                rows={10}
                className={`w-full p-4 bg-card border-2 text-text font-mono text-xs md:text-sm rounded-xl focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all resize-y ${
                  parsed2.error ? 'border-red-500' : 'border-border'
                }`}
              />
            </div>
            {parsed2.error && (
              <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                構文エラー: {parsed2.error}
              </p>
            )}
            {!parsed2.error && jsonInput2.trim() && (
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 mt-1">
                <Check className="w-3.5 h-3.5" />
                有効なJSONです
              </p>
            )}
          </div>
        </div>

        {/* 比較結果 */}
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-accent" />
            差分比較結果
          </h2>

          {diffResult ? (
            <div className="border-2 border-border rounded-2xl overflow-hidden font-mono text-xs md:text-sm bg-[#1e1e1e] dark:bg-black text-[#d4d4d4]">
              {/* Diff ヘッダー */}
              <div className="bg-[#2d2d2d] px-4 py-2 border-b-2 border-border text-xs text-text/80 font-bold flex justify-between">
                <span>フォーマット済JSON比較</span>
                <span className="flex gap-4">
                  <span className="text-red-400">● 削除行 (-)</span>
                  <span className="text-emerald-400">● 追加行 (+)</span>
                </span>
              </div>

              {/* Diff 行 */}
              <div className="overflow-x-auto divide-y divide-border/20 max-h-[500px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {diffResult.map((line, idx) => {
                      let rowBg = '';
                      let sign = ' ';
                      let signColor = 'text-text/30';
                      let codeColor = '';

                      if (line.type === 'removed') {
                        rowBg = 'bg-red-950/40 text-red-200 line-through decoration-red-900/50';
                        sign = '-';
                        signColor = 'text-red-400 font-bold';
                        codeColor = 'text-red-200';
                      } else if (line.type === 'added') {
                        rowBg = 'bg-emerald-950/40 text-emerald-200';
                        sign = '+';
                        signColor = 'text-emerald-400 font-bold';
                        codeColor = 'text-emerald-200';
                      }

                      return (
                        <tr key={idx} className={`${rowBg} transition-colors hover:bg-white/5`}>
                          {/* 行番号1 */}
                          <td className="w-12 text-right pr-3 pl-2 py-0.5 text-text/30 border-r border-border/20 select-none font-bold">
                            {line.lineNum1 || ''}
                          </td>
                          {/* 行番号2 */}
                          <td className="w-12 text-right pr-3 pl-2 py-0.5 text-text/30 border-r border-border/20 select-none font-bold">
                            {line.lineNum2 || ''}
                          </td>
                          {/* 符号 (+ / -) */}
                          <td
                            className={`w-6 text-center py-0.5 border-r border-border/20 select-none ${signColor}`}
                          >
                            {sign}
                          </td>
                          {/* コード本体 */}
                          <td className={`pl-4 py-0.5 whitespace-pre ${codeColor}`}>
                            {line.value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="theme-card p-8 bg-secondary/50 text-center">
              <p className="text-sm font-bold text-text/60">
                {parsed1.error || parsed2.error
                  ? '入力JSONの構文エラーを修正してください。'
                  : '左右両方のJSON入力欄に正しいデータを入力すると、ここに差分が表示されます。'}
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
