'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エンコードエラー');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'デコードエラー');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Base64 コンバータ</h1>
          </div>

          <div className="space-y-6">
            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">エラー:</p>
                <p className="text-sm break-all">{error}</p>
              </div>
            )}

            {/* 入力エリア */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                入力
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ここにテキストまたは Base64 文字列を入力"
                className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
              />
            </div>

            {/* ボタン */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEncode}
                className="flex-1 min-w-40 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                エンコード
              </button>
              <button
                onClick={handleDecode}
                className="flex-1 min-w-40 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                デコード
              </button>
            </div>

            {/* 出力エリア */}
            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    出力
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                  >
                    コピー
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg bg-slate-50 dark:bg-slate-600 resize-none font-mono text-sm"
                />
              </div>
            )}

            {/* 使用例 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">使用例</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>• テキストを Base64 にエンコード</p>
                <p>• Base64 を元のテキストにデコード</p>
                <p>• 日本語も対応</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
