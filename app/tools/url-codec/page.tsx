'use client';

import { Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <LinkIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              URL エンコード・デコード
            </h1>
          </div>

          <div className="space-y-6">
            {/* 入力エリア */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                入力
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ここに URL またはテキストを入力"
                className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono text-sm"
              />
            </div>

            {/* ボタン */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEncode}
                className="flex-1 min-w-40 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                エンコード
              </button>
              <button
                onClick={handleDecode}
                className="flex-1 min-w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
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

            {/* 変換例 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">変換例</h2>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">エンコード前:</p>
                  <p>hello world 日本語</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">エンコード後:</p>
                  <p>hello%20world%20%E6%97%A5%E6%9C%AC%E8%AA%9E</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
