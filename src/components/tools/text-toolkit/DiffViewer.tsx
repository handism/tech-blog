'use client';

import { Copy, Trash2, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import CopyButton from '@/src/components/CopyButton';

// LCS (Longest Common Subsequence) Algorithm for diffing
function computeLcs(
  arr1: string[],
  arr2: string[]
): { type: 'added' | 'removed' | 'unchanged'; value: string }[] {
  const dp: number[][] = Array(arr1.length + 1)
    .fill(0)
    .map(() => Array(arr2.length + 1).fill(0));

  for (let i = 1; i <= arr1.length; i++) {
    for (let j = 1; j <= arr2.length; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: { type: 'added' | 'removed' | 'unchanged'; value: string }[] = [];
  let i = arr1.length;
  let j = arr2.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
      result.unshift({ type: 'unchanged', value: arr1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: arr2[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', value: arr1[i - 1] });
      i--;
    }
  }

  return result;
}

// Custom word splitter that handles Japanese/English/numbers/spaces
function splitIntoWords(text: string): string[] {
  // Regex that captures words, Japanese characters, or whitespace/punctuation
  const regex = /([a-zA-Z0-9]+|[^\s\w\p{Punctuation}]|\s+|\p{Punctuation})/gu;
  return text.match(regex) || [];
}

export default function DiffViewer() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffMode, setDiffMode] = useState<'line' | 'word' | 'char'>('line');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  // Computes the raw diff using the selected mode
  const diffResult = useMemo(() => {
    if (diffMode === 'line') {
      const lines1 = text1.split('\n');
      const lines2 = text2.split('\n');
      return computeLcs(lines1, lines2);
    } else if (diffMode === 'word') {
      const words1 = splitIntoWords(text1);
      const words2 = splitIntoWords(text2);
      return computeLcs(words1, words2);
    } else {
      // Character level
      const chars1 = Array.from(text1);
      const chars2 = Array.from(text2);
      return computeLcs(chars1, chars2);
    }
  }, [text1, text2, diffMode]);

  // Aligns lines for Side-by-Side (Split) View in Line Mode
  const splitLines = useMemo(() => {
    if (diffMode !== 'line') return [];

    const result: {
      leftNum?: number;
      leftText?: string;
      leftType: 'removed' | 'normal' | 'empty';
      rightNum?: number;
      rightText?: string;
      rightType: 'added' | 'normal' | 'empty';
    }[] = [];

    let leftNum = 1;
    let rightNum = 1;

    // We can buffer consecutive removals and additions to align them side-by-side
    let bufferLeft: string[] = [];
    let bufferRight: string[] = [];

    const flushBuffers = () => {
      const maxSize = Math.max(bufferLeft.length, bufferRight.length);
      for (let k = 0; k < maxSize; k++) {
        const lText = bufferLeft[k];
        const rText = bufferRight[k];
        result.push({
          leftNum: lText !== undefined ? leftNum++ : undefined,
          leftText: lText,
          leftType: lText !== undefined ? 'removed' : 'empty',
          rightNum: rText !== undefined ? rightNum++ : undefined,
          rightText: rText,
          rightType: rText !== undefined ? 'added' : 'empty',
        });
      }
      bufferLeft = [];
      bufferRight = [];
    };

    for (const item of diffResult) {
      if (item.type === 'removed') {
        bufferLeft.push(item.value);
      } else if (item.type === 'added') {
        bufferRight.push(item.value);
      } else {
        // Flush any buffered changes first
        flushBuffers();
        result.push({
          leftNum: leftNum++,
          leftText: item.value,
          leftType: 'normal',
          rightNum: rightNum++,
          rightText: item.value,
          rightType: 'normal',
        });
      }
    }
    flushBuffers();

    return result;
  }, [diffResult, diffMode]);

  const unifiedText = useMemo(() => {
    let text = '';
    diffResult.forEach((item) => {
      if (item.type === 'added') {
        text += `+ ${item.value}\n`;
      } else if (item.type === 'removed') {
        text += `- ${item.value}\n`;
      } else {
        text += `  ${item.value}\n`;
      }
    });
    return text;
  }, [diffResult]);

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  return (
    <>
      {/* Header */}

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between theme-card border-2 border-border p-4">
          <div className="flex flex-wrap gap-3">
            {/* Mode Selectors */}
            <div className="flex rounded-lg overflow-hidden border-2 border-border bg-card">
              <button
                onClick={() => setDiffMode('line')}
                className={`px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  diffMode === 'line' ? 'bg-accent text-white' : 'text-text/60 hover:bg-secondary'
                }`}
              >
                行単位
              </button>
              <button
                onClick={() => setDiffMode('word')}
                className={`px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  diffMode === 'word' ? 'bg-accent text-white' : 'text-text/60 hover:bg-secondary'
                }`}
              >
                単語単位
              </button>
              <button
                onClick={() => setDiffMode('char')}
                className={`px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  diffMode === 'char' ? 'bg-accent text-white' : 'text-text/60 hover:bg-secondary'
                }`}
              >
                文字単位
              </button>
            </div>

            {/* View Selectors (Only relevant for line diffs, otherwise unified is fallback) */}
            {diffMode === 'line' && (
              <div className="flex rounded-lg overflow-hidden border-2 border-border bg-card">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-accent text-white'
                      : 'text-text/60 hover:bg-secondary'
                  }`}
                >
                  左右分割 (Split)
                </button>
                <button
                  onClick={() => setViewMode('unified')}
                  className={`px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'unified'
                      ? 'bg-accent text-white'
                      : 'text-text/60 hover:bg-secondary'
                  }`}
                >
                  統合表示 (Unified)
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 theme-btn px-4 py-2 text-xs font-bold bg-secondary text-text cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              クリア
            </button>
          </div>
        </div>

        {/* Input Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
              変更前 (Text A)
            </label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="元テキストをここに貼り付け..."
              className="w-full h-64 p-4 border-2 border-border bg-card text-text rounded-xl focus:outline-none font-mono text-sm resize-y transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
              変更後 (Text B)
            </label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="修正後テキストをここに貼り付け..."
              className="w-full h-64 p-4 border-2 border-border bg-card text-text rounded-xl focus:outline-none font-mono text-sm resize-y transition"
            />
          </div>
        </div>

        {/* Output Panel */}
        {(text1 || text2) && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-accent" />
                <h2 className="text-lg font-bold text-text">比較結果</h2>
              </div>
              {viewMode === 'unified' || diffMode !== 'line' ? (
                <CopyButton
                  value={unifiedText}
                  label="Unified形式でコピー"
                  copiedLabel="コピーしました！"
                  icon={Copy}
                  copiedIcon={Copy}
                  className="flex items-center gap-1 theme-btn px-3 py-1.5 text-xs bg-secondary text-text cursor-pointer"
                />
              ) : null}
            </div>

            {/* Diff Contents */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-950 text-slate-100 font-mono text-sm p-4 overflow-x-auto shadow-xl">
              {diffMode === 'line' && viewMode === 'split' ? (
                // Side by Side Split View
                <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800 min-w-[700px]">
                  {/* Left: Original (Removed) */}
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-500 pb-2 border-b border-slate-800 font-sans font-bold">
                      変更前
                    </div>
                    {splitLines.map((row, idx) => (
                      <div
                        key={idx}
                        className={`flex min-h-[1.5rem] leading-6 px-1 rounded ${
                          row.leftType === 'removed'
                            ? 'bg-red-950/60 text-red-300'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="w-8 select-none text-slate-600 text-right pr-2.5 font-sans border-r border-slate-800 mr-2 text-xs">
                          {row.leftNum || ''}
                        </span>
                        <span className="whitespace-pre-wrap break-all flex-1">
                          {row.leftType === 'removed' && '- '}
                          {row.leftText || ''}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Modified (Added) */}
                  <div className="space-y-0.5 pl-4">
                    <div className="text-xs text-slate-500 pb-2 border-b border-slate-800 font-sans font-bold">
                      変更後
                    </div>
                    {splitLines.map((row, idx) => (
                      <div
                        key={idx}
                        className={`flex min-h-[1.5rem] leading-6 px-1 rounded ${
                          row.rightType === 'added'
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : 'text-slate-200'
                        }`}
                      >
                        <span className="w-8 select-none text-slate-600 text-right pr-2.5 font-sans border-r border-slate-800 mr-2 text-xs">
                          {row.rightNum || ''}
                        </span>
                        <span className="whitespace-pre-wrap break-all flex-1">
                          {row.rightType === 'added' && '+ '}
                          {row.rightText || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : diffMode === 'line' ? (
                // Unified View (Line mode)
                <div className="space-y-0.5">
                  {diffResult.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex leading-6 px-2 py-0.5 rounded ${
                        item.type === 'added'
                          ? 'bg-emerald-950/60 text-emerald-300'
                          : item.type === 'removed'
                            ? 'bg-red-950/60 text-red-300'
                            : 'text-slate-350'
                      }`}
                    >
                      <span className="w-6 select-none opacity-40 mr-2">
                        {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                      </span>
                      <span className="whitespace-pre-wrap break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                // Word or Character View (Flow of tags)
                <div className="leading-relaxed whitespace-pre-wrap break-all p-2">
                  {diffResult.map((item, idx) => {
                    if (item.type === 'added') {
                      return (
                        <span
                          key={idx}
                          className="bg-emerald-950 text-emerald-300 px-0.5 mx-0.5 rounded font-bold border-b-2 border-emerald-500"
                        >
                          {item.value}
                        </span>
                      );
                    } else if (item.type === 'removed') {
                      return (
                        <span
                          key={idx}
                          className="bg-red-950 text-red-400 px-0.5 mx-0.5 rounded line-through opacity-70 border-b-2 border-red-500"
                        >
                          {item.value}
                        </span>
                      );
                    } else {
                      return (
                        <span key={idx} className="text-slate-300">
                          {item.value}
                        </span>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explanation card */}
        <div className="theme-card p-6">
          <h3 className="font-bold text-text mb-2">使い方・機能説明</h3>
          <ul className="text-sm text-text/60 space-y-2 list-disc list-inside">
            <li>
              <strong>行単位比較:</strong>{' '}
              ソースコードや文章を行ごとに比較し、左右に並べたり上下で色分けして見比べることができます。
            </li>
            <li>
              <strong>単語単位比較:</strong>{' '}
              日本語・英語などの語句レベルで細かい違いを強調表示します。
            </li>
            <li>
              <strong>文字単位比較:</strong>{' '}
              スペルミスや細かな記号の違いを1文字ずつ検出し、見逃しを防ぎます。
            </li>
            <li>
              <strong>セキュア動作:</strong>{' '}
              すべてブラウザ上で処理されるため、入力したデータが外部サーバーに送信されることはありません。
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
