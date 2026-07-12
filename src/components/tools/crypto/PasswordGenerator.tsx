// src/components/tools/crypto/PasswordGenerator.tsx
'use client';

import { useState } from 'react';
import ResultBox from '@/src/components/ResultBox';

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const generatePassword = (
  length: number,
  options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }
) => {
  const charset = [
    options.upper ? upper : '',
    options.lower ? lower : '',
    options.numbers ? numbers : '',
    options.symbols ? symbols : '',
  ].join('');
  if (!charset) {
    throw new Error('少なくとも1つ以上の文字種を選択してください');
  }

  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((value) => charset[value % charset.length])
    .join('');
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    try {
      setError('');
      setOutput(
        generatePassword(length, {
          upper: includeUpper,
          lower: includeLower,
          numbers: includeNumbers,
          symbols: includeSymbols,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成に失敗しました');
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text/70">文字数</label>
          <input
            type="number"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="theme-input w-full font-black"
          />
        </div>
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 text-sm font-bold text-text/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4 h-4 border-2 border-border rounded accent-accent"
            />
            大文字を含める
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-text/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4 h-4 border-2 border-border rounded accent-accent"
            />
            小文字を含める
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-text/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 border-2 border-border rounded accent-accent"
            />
            数字を含める
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-text/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 border-2 border-border rounded accent-accent"
            />
            記号を含める
          </label>
        </div>
      </div>

      {error && (
        <div className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold animate-pulse">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGenerate}
          className="theme-btn px-5 py-3 font-bold text-sm w-full sm:w-auto cursor-pointer"
        >
          パスワードを生成
        </button>

        {output && <ResultBox value={output} />}
      </div>
    </div>
  );
}
