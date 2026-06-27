'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Code } from 'lucide-react';
import { useState } from 'react';

const encodeHtmlEntities = (input: string) => {
  const textarea = document.createElement('textarea');
  textarea.textContent = input;
  return textarea.innerHTML;
};

const decodeHtmlEntities = (input: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.textContent ?? '';
};

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = () => {
    setOutput(mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolPageLayout title="HTML Entity Encoder / Decoder" icon={Code}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="mode"
              value="encode"
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
              className="w-4 h-4"
            />
            エンコード
          </label>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="mode"
              value="decode"
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
              className="w-4 h-4"
            />
            デコード
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              入力
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ここにテキストを入力"
              className="w-full h-56 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              出力
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-56 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg bg-slate-50 dark:bg-slate-600 resize-none font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-lg transition"
          >
            変換
          </button>
          {output && (
            <button
              onClick={copyToClipboard}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-5 rounded-lg transition"
            >
              コピー
            </button>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
