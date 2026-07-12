// src/components/tools/data-json/JsonFormatter.tsx
'use client';

import { useState } from 'react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function JsonFormatter() {
  const { copy } = useCopyToClipboard();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON パースエラー');
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON パースエラー');
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ 有効な JSON です');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON パースエラー');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    copy(output);
  };

  return (
    <div className="space-y-6">
      {/* コントロール */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-text mb-2">インデント</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="theme-select w-full font-bold"
          >
            <option value={2}>2 スペース</option>
            <option value={4}>4 スペース</option>
            <option value={1}>1 スペース</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleFormat}
            className="theme-btn px-6 py-2 bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] font-bold"
          >
            整形
          </button>
          <button onClick={handleMinify} className="theme-btn px-6 py-2 font-bold">
            圧縮
          </button>
          <button onClick={handleValidate} className="theme-btn px-6 py-2 font-bold">
            検証
          </button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
          <p>エラー: {error}</p>
        </div>
      )}

      {/* 入出力エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text">入力 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="theme-textarea w-full h-96 font-mono text-sm resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-text">出力</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)] font-bold"
              >
                コピー
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="theme-textarea w-full h-96 bg-secondary font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
