'use client';

import { Zap, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function RegexTester() {
  const { copy } = useCopyToClipboard();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [replacement, setReplacement] = useState('');
  const [replaced, setReplaced] = useState('');

  // 簡易的な ReDoS チェック (ネストされた繰り返しなどを検出)
  const isPotentiallyDangerous = useMemo(() => {
    if (!pattern) return false;
    // 重複した量指定子やネストされたグループの繰り返しをチェック
    const dangerousPatterns = [
      /(\(.*\).*)[\*\+]/, // グループの繰り返し
      /[\*\+]\{.*\}/, // 量指定子の重複
      /(\[[^\]]*\])[\*\+]{2,}/, // 文字クラスの過剰な繰り返し
    ];
    return dangerousPatterns.some((p) => p.test(pattern));
  }, [pattern]);

  // Web Worker を使って安全に正規表現を実行するヘルパー
  const runRegexInWorker = (
    mode: 'test' | 'replace',
    onSuccess: (data: unknown) => void,
    onFailure: (errStr: string) => void
  ) => {
    setError('');
    if (!pattern) {
      setError('正規表現パターンを入力してください');
      return;
    }

    const workerCode = `
      self.onmessage = function(e) {
        const { pattern, flags, text, mode, replacement } = e.data;
        try {
          const regex = new RegExp(pattern, flags);
          if (mode === 'test') {
            const matches = text.match(regex);
            self.postMessage({ success: true, result: matches });
          } else if (mode === 'replace') {
            const result = text.replace(regex, replacement);
            self.postMessage({ success: true, result: result });
          }
        } catch (err) {
          self.postMessage({ success: false, error: err.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const timeoutId = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      onFailure(
        '処理がタイムアウトしました。正規表現パターンが複雑すぎる（ReDOS）可能性があります。'
      );
    }, 2000); // 2秒タイムアウト

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);

      if (e.data.success) {
        onSuccess(e.data.result);
      } else {
        onFailure(e.data.error || 'エラーが発生しました');
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      onFailure(err.message || 'エラーが発生しました');
    };

    worker.postMessage({ pattern, flags, text, mode, replacement });
  };

  const handleTest = () => {
    runRegexInWorker(
      'test',
      (result) => {
        const matches = result as string[] | null;
        if (matches) {
          setOutput(`マッチ数: ${matches.length}\n\n${matches.join('\n')}`);
        } else {
          setOutput('マッチしませんでした');
        }
      },
      (errStr) => {
        setError(errStr);
        setOutput('');
      }
    );
  };

  const handleReplace = () => {
    runRegexInWorker(
      'replace',
      (result) => {
        setReplaced(result as string);
        setOutput('');
      },
      (errStr) => {
        setError(errStr);
        setReplaced('');
      }
    );
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const copyToClipboard = (text: string) => {
    copy(text);
  };

  return (
    <>
      <div className="space-y-6">
        {/* パターン入力 */}
        <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)]">
          <h2 className="text-lg font-bold text-text mb-4">正規表現パターン</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="例: \d{3}-\\d{4}"
                className="w-full px-4 py-3 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-mono shadow-[2px_2px_0px_0px_var(--border)]"
              />
              {isPotentiallyDangerous && (
                <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>このパターンは複雑なため、実行に時間がかかる可能性があります。</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                <input
                  type="checkbox"
                  checked={flags.includes('g')}
                  onChange={() => toggleFlag('g')}
                  className="w-4 h-4 border-2 border-border rounded"
                />
                <span>グローバル (g)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                <input
                  type="checkbox"
                  checked={flags.includes('i')}
                  onChange={() => toggleFlag('i')}
                  className="w-4 h-4 border-2 border-border rounded"
                />
                <span>大文字小文字区別しない (i)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                <input
                  type="checkbox"
                  checked={flags.includes('m')}
                  onChange={() => toggleFlag('m')}
                  className="w-4 h-4 border-2 border-border rounded"
                />
                <span>複数行 (m)</span>
              </label>
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
            <p>エラー: {error}</p>
          </div>
        )}

        {/* テキスト入力 */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-text">テスト対象テキスト</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ここにテキストを入力してください"
            className="w-full h-40 px-4 py-3 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none shadow-[2px_2px_0px_0px_var(--border)]"
          />
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleTest}
            className="theme-btn flex-1 py-3 text-base bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)]"
          >
            マッチをテスト
          </button>
        </div>

        {/* マッチ結果 */}
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-text">結果</h3>
              <button
                onClick={() => copyToClipboard(output)}
                className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)]"
              >
                コピー
              </button>
            </div>
            <pre className="bg-secondary p-4 rounded-xl border-2 border-border text-sm overflow-auto max-h-48 text-text font-mono shadow-[2px_2px_0px_0px_var(--border)] whitespace-pre-wrap break-words">
              {output}
            </pre>
          </div>
        )}

        {/* 置換セクション */}
        <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)]">
          <h2 className="text-lg font-bold text-text mb-4">置換</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text mb-2">置換後のテキスト</label>
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="置換後のテキストを入力"
                className="w-full px-4 py-3 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-mono shadow-[2px_2px_0px_0px_var(--border)]"
              />
            </div>
            <button onClick={handleReplace} className="theme-btn w-full py-3 text-base">
              置換を実行
            </button>
            {replaced && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-text">置換結果</h3>
                  <button
                    onClick={() => copyToClipboard(replaced)}
                    className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)]"
                  >
                    コピー
                  </button>
                </div>
                <pre className="bg-card p-4 rounded-xl border-2 border-border text-sm overflow-auto max-h-48 text-text font-mono shadow-[2px_2px_0px_0px_var(--border)] whitespace-pre-wrap break-words">
                  {replaced}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
