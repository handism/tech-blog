'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

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

export default function Base64Converter() {
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolPageLayout
      title="Base64 コンバータ"
      description="テキストやファイルの Base64 エンコード・デコード処理"
      icon={Lock}
    >
      <div className="space-y-6">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
            <p>エラー: {error}</p>
          </div>
        )}

        {/* 入力エリア */}
        <div>
          <label className="block text-sm font-bold text-text mb-2">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにテキストまたは Base64 文字列を入力"
            className="w-full h-40 px-4 py-3 border-2 border-border bg-card text-text font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none shadow-[2px_2px_0px_0px_var(--border)]"
          />
        </div>

        {/* ボタン */}
        <div className="flex flex-wrap gap-4">
          <button onClick={handleEncode} className="theme-btn flex-1 min-w-[150px] py-3 text-base">
            エンコード
          </button>
          <button onClick={handleDecode} className="theme-btn flex-1 min-w-[150px] py-3 text-base">
            デコード
          </button>
        </div>

        {/* 出力エリア */}
        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-text">出力</label>
              <button
                onClick={copyToClipboard}
                className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)]"
              >
                コピー
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 px-4 py-3 border-2 border-border bg-secondary text-text font-mono text-sm rounded-xl resize-none shadow-[2px_2px_0px_0px_var(--border)]"
            />
          </div>
        )}

        {/* 使用例 */}
        <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)]">
          <h2 className="text-sm font-bold text-text mb-3">使用例</h2>
          <div className="text-sm text-text/70 space-y-2 font-medium">
            <p>• テキストを Base64 にエンコード</p>
            <p>• Base64 を元のテキストにデコード</p>
            <p>• 日本語 (UTF-8) も正しく処理されます</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
