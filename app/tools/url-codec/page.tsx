'use client';

import { Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

export default function UrlCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch {
      setOutput('エンコードエラー');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch {
      setOutput('デコードエラー');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolPageLayout
      title="URL エンコード・デコード"
      description="URL のクエリパラメータなどに用いる文字列のエンコード・デコード"
      icon={LinkIcon}
    >
      <div className="space-y-6">
        {/* 入力エリア */}
        <div>
          <label className="block text-sm font-bold text-text mb-2">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここに URL またはテキストを入力"
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

        {/* 変換例 */}
        <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)]">
          <h2 className="text-sm font-bold text-text mb-4">変換例</h2>
          <div className="space-y-4 text-sm font-mono">
            <div>
              <p className="font-bold text-text/60 mb-1">エンコード前:</p>
              <p className="bg-card p-2 rounded border border-border">hello world 日本語</p>
            </div>
            <div>
              <p className="font-bold text-text/60 mb-1">エンコード後:</p>
              <p className="bg-card p-2 rounded border border-border">
                hello%20world%20%E6%97%A5%E6%9C%AC%E8%AA%9E
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
