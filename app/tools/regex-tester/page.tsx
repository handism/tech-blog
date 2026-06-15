'use client';

import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [replacement, setReplacement] = useState('');
  const [replaced, setReplaced] = useState('');

  const handleTest = () => {
    try {
      setError('');
      if (!pattern) {
        setError('正規表現パターンを入力してください');
        return;
      }
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      if (matches) {
        setOutput(`マッチ数: ${matches.length}\n\n${matches.join('\n')}`);
      } else {
        setOutput('マッチしませんでした');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setOutput('');
    }
  };

  const handleReplace = () => {
    try {
      setError('');
      if (!pattern) {
        setError('正規表現パターンを入力してください');
        return;
      }
      const regex = new RegExp(pattern, flags);
      const result = text.replace(regex, replacement);
      setReplaced(result);
      setOutput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setReplaced('');
    }
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">正規表現テスター</h1>
          </div>

          <div className="space-y-6">
            {/* パターン入力 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                正規表現パターン
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="例: \\d{3}-\\d{4}"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
                />
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.includes('g')}
                      onChange={() => toggleFlag('g')}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      グローバル (g)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.includes('i')}
                      onChange={() => toggleFlag('i')}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">
                      大文字小文字区別しない (i)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flags.includes('m')}
                      onChange={() => toggleFlag('m')}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">複数行 (m)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">エラー:</p>
                <p className="text-sm font-mono break-all">{error}</p>
              </div>
            )}

            {/* テキスト入力 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-4">
                テキスト
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ここにテキストを入力"
                className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              />
            </div>

            {/* マッチ結果 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <button
                onClick={handleTest}
                className="w-full mb-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                マッチをテスト
              </button>
              {output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">結果</h3>
                    <button
                      onClick={() => copyToClipboard(output)}
                      className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                    >
                      コピー
                    </button>
                  </div>
                  <pre className="bg-white dark:bg-slate-600 p-4 rounded border border-slate-300 dark:border-slate-500 text-sm overflow-auto max-h-48 text-slate-900 dark:text-white whitespace-pre-wrap break-words">
                    {output}
                  </pre>
                </div>
              )}
            </div>

            {/* 置換 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">置換</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    置換後のテキスト
                  </label>
                  <input
                    type="text"
                    value={replacement}
                    onChange={(e) => setReplacement(e.target.value)}
                    placeholder="置換後のテキストを入力"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
                  />
                </div>
                <button
                  onClick={handleReplace}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  置換を実行
                </button>
              </div>
              {replaced && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">置換結果</h3>
                    <button
                      onClick={() => copyToClipboard(replaced)}
                      className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                    >
                      コピー
                    </button>
                  </div>
                  <pre className="bg-white dark:bg-slate-600 p-4 rounded border border-slate-300 dark:border-slate-500 text-sm overflow-auto max-h-48 text-slate-900 dark:text-white whitespace-pre-wrap break-words">
                    {replaced}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
