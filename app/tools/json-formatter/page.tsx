'use client';

import { Code } from 'lucide-react';
import { useState } from 'react';

export default function JsonFormatter() {
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
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              JSON フォーマッター
            </h1>
          </div>

          <div className="space-y-6">
            {/* コントロール */}
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  インデント
                </label>
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={2}>2 スペース</option>
                  <option value={4}>4 スペース</option>
                  <option value={1}>1 スペース</option>
                </select>
              </div>
              <button
                onClick={handleFormat}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                整形
              </button>
              <button
                onClick={handleMinify}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                圧縮
              </button>
              <button
                onClick={handleValidate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                検証
              </button>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">エラー:</p>
                <p className="text-sm font-mono break-all">{error}</p>
              </div>
            )}

            {/* 入出力エリア */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  入力 JSON
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    出力
                  </label>
                  {output && (
                    <button
                      onClick={copyToClipboard}
                      className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                    >
                      コピー
                    </button>
                  )}
                </div>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white font-mono text-sm rounded-lg bg-slate-50 dark:bg-slate-600 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
