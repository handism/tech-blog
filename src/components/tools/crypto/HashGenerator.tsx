// src/components/tools/crypto/HashGenerator.tsx
'use client';

import { useState } from 'react';
import ResultBox from '@/src/components/ResultBox';

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

  return (
    <div className="space-y-6">
      {/* 入力テキスト */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-text/70">入力テキスト</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここにテキストを入力"
          className="w-full h-40 border-2 border-border p-3 rounded-lg bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent resize-none shadow-[2px_2px_0px_0px_var(--border)]"
        />
      </div>

      {/* アルゴリズム選択 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text/70">ハッシュアルゴリズム</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
            className="w-full border-2 border-border p-2.5 rounded-lg bg-card text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent shadow-[2px_2px_0px_0px_var(--border)]"
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
            className="w-full theme-btn py-2.5 px-4 font-bold text-sm h-[44px] cursor-pointer"
          >
            生成
          </button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-bold">
          <p>エラー: {error}</p>
        </div>
      )}

      {/* 出力 */}
      {output && <ResultBox value={output} label={`${algorithm} ハッシュ値`} />}

      {/* 情報 */}
      <div className="theme-card p-6 bg-secondary text-text/80 text-xs space-y-2 leading-relaxed shadow-[4px_4px_0px_0px_var(--border)]">
        <p className="font-extrabold text-text">対応アルゴリズム:</p>
        <ul className="list-disc list-inside space-y-1 font-medium">
          <li>SHA-1: 160 ビット（非推奨）</li>
          <li>SHA-256: 256 ビット（推奨）</li>
          <li>SHA-384: 384 ビット</li>
          <li>SHA-512: 512 ビット</li>
        </ul>
      </div>
    </div>
  );
}
