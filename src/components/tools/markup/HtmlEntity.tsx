// src/components/tools/markup/HtmlEntity.tsx
'use client';

import { useState } from 'react';
import CopyButton from '@/src/components/CopyButton';

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

export default function HtmlEntity() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = () => {
    setOutput(mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
  };

  return (
    <div className="space-y-6 text-text">
      {/* 変換モード選択 */}
      <div className="flex flex-wrap gap-6 items-center p-4 bg-secondary/30 rounded-2xl border-2 border-border font-extrabold text-xs select-none">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="encode"
            checked={mode === 'encode'}
            onChange={() => setMode('encode')}
            className="w-4 h-4 rounded accent-accent"
          />
          エンコード (文字をエスケープ)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="decode"
            checked={mode === 'decode'}
            onChange={() => setMode('decode')}
            className="w-4 h-4 rounded accent-accent"
          />
          デコード (実体参照を戻す)
        </label>
      </div>

      {/* 入出力グリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-text/60 mb-2 uppercase tracking-wider">
            入力
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにテキストを入力してください..."
            className="w-full h-56 px-4 py-3 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-text/60 mb-2 uppercase tracking-wider">
            出力
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="ここに結果が表示されます..."
            className="w-full h-56 px-4 py-3 border-2 border-border bg-card text-text rounded-xl resize-none font-mono text-sm shadow-inner select-all leading-normal"
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="theme-btn py-3 px-5 text-sm font-bold cursor-pointer shadow-[2px_2px_0px_0px_var(--border)] bg-accent border-accent text-white hover:opacity-90"
        >
          変換する
        </button>
        {output && (
          <CopyButton
            value={output}
            label="コピー"
            copiedLabel="コピー完了"
            showIcon={false}
            className="theme-btn py-3 px-5 text-sm font-bold cursor-pointer shadow-[2px_2px_0px_0px_var(--border)] bg-card border-border text-text hover:bg-secondary"
          />
        )}
      </div>
    </div>
  );
}
