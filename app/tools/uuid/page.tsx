'use client';

import { Code } from 'lucide-react';
import { useState } from 'react';

const generateUuid = () => {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
};

export default function UuidGenerator() {
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generateUuid());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-slate-600 dark:text-slate-300" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">UUID Generator</h1>
          </div>

          <div className="space-y-6">
            <p className="text-slate-700 dark:text-slate-300">
              ボタンを押すだけで UUID v4 を生成できます。
            </p>

            <button
              onClick={handleGenerate}
              className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-lg transition"
            >
              生成
            </button>

            {output && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    生成結果
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                  >
                    コピー
                  </button>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-3 font-mono text-sm text-slate-900 dark:text-white break-all">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
