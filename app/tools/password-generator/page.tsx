'use client';

import { Code } from 'lucide-react';
import { useState } from 'react';

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-slate-600 dark:text-slate-300" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Password Generator
            </h1>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  文字数
                </label>
                <input
                  type="number"
                  min={8}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                    className="w-4 h-4"
                  />
                  大文字を含める
                </label>
                <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                    className="w-4 h-4"
                  />
                  小文字を含める
                </label>
                <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4"
                  />
                  数字を含める
                </label>
                <label className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4"
                  />
                  記号を含める
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-lg transition"
              >
                パスワードを生成
              </button>

              {output && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-4 py-3 font-mono text-sm text-slate-900 dark:text-white break-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      生成結果
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                    >
                      コピー
                    </button>
                  </div>
                  {output}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
