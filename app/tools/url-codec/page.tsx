'use client';

import { Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import ResultBox from '@/src/components/ResultBox';

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

  return (
    <ToolPageLayout
      title="URL エンコード・デコード"
      description="URL のクエリパラメータなどに用いる文字列 of エンコード・デコード"
      icon={LinkIcon}
    >
      <div className="space-y-6">
        {/* 入力エリア */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text/70">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここに URL またはテキストを入力"
            className="w-full h-40 border-2 border-border p-3 rounded-lg bg-card text-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
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
        {output && <ResultBox value={output} label="出力" />}

        {/* 変換例 */}
        <div className="theme-card p-6 bg-secondary">
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
