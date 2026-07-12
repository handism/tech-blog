// src/components/tools/crypto/Base64Codec.tsx
'use client';

import { useState } from 'react';
import ResultBox from '@/src/components/ResultBox';

/**
 * UTF-8 文字列を Base64 にエンコードする (TextEncoder 版)
 */
const encodeBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
};

/**
 * Base64 を UTF-8 文字列にデコードする (TextDecoder 版)
 */
const decodeBase64 = (base64: string): string => {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  return new TextDecoder().decode(bytes);
};

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      setOutput(encodeBase64(input));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エンコードエラー');
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      setOutput(decodeBase64(input));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'デコードエラー');
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
          <p>エラー: {error}</p>
        </div>
      )}

      {/* 入力エリア */}
      <div>
        <label className="block text-xs font-bold text-text/70 mb-2">入力</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここにテキストまたは Base64 文字列を入力"
          className="theme-textarea w-full h-40"
        />
      </div>

      {/* ボタン */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleEncode}
          className="theme-btn flex-1 min-w-[150px] py-3 text-base font-bold"
        >
          エンコード
        </button>
        <button
          onClick={handleDecode}
          className="theme-btn flex-1 min-w-[150px] py-3 text-base font-bold"
        >
          デコード
        </button>
      </div>

      {/* 出力エリア */}
      {output && <ResultBox value={output} label="出力" />}

      {/* 使用例 */}
      <div className="theme-card p-6 bg-secondary">
        <h2 className="text-sm font-bold text-text mb-3">使用例</h2>
        <div className="text-sm text-text/70 space-y-2 font-medium">
          <p>• テキストを Base64 にエンコード</p>
          <p>• Base64 を元のテキストにデコード</p>
          <p>• 日本語 (UTF-8) も正しく処理されます</p>
        </div>
      </div>
    </div>
  );
}
