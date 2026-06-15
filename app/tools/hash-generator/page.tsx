'use client';

import { Hash } from 'lucide-react';
import { useState } from 'react';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generateHash = async () => {
    try {
      setError('');
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ハッシュ生成エラー');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Hash className="w-8 h-8 text-red-600 dark:text-red-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              ハッシュジェネレーター
            </h1>
          </div>

          <div className="space-y-6">
            {/* 入力テキスト */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                入力テキスト
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ここにテキストを入力"
                className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            {/* アルゴリズム選択 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  ハッシュアルゴリズム
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="SHA-1">SHA-1</option>
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-384">SHA-384</option>
                  <option value="SHA-512">SHA-512</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={generateHash}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  生成
                </button>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">エラー:</p>
                <p className="text-sm break-all">{error}</p>
              </div>
            )}

            {/* 出力 */}
            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {algorithm} ハッシュ値
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                  >
                    コピー
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-300 dark:border-slate-500">
                  <p className="font-mono text-sm text-slate-900 dark:text-white break-all">
                    {output}
                  </p>
                </div>
              </div>
            )}

            {/* 情報 */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg text-sm space-y-2">
              <p className="font-semibold">対応アルゴリズム:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>SHA-1: 160 ビット（非推奨）</li>
                <li>SHA-256: 256 ビット（推奨）</li>
                <li>SHA-384: 384 ビット</li>
                <li>SHA-512: 512 ビット</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
