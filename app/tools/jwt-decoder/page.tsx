'use client';

import { Key } from 'lucide-react';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleDecode = () => {
    try {
      setError('');
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT トークンは 3 つの部分をドット(.)で区切る必要があります');
      }

      const payload = jwtDecode(token);
      const formatted = JSON.stringify(payload, null, 2);
      setDecoded(formatted);

      // トークンの有効性をチェック
      if (typeof payload === 'object' && payload !== null && 'exp' in payload) {
        const exp = (payload as Record<string, unknown>).exp as number;
        const now = Math.floor(Date.now() / 1000);
        setIsValid(exp > now);
      } else {
        setIsValid(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JWT デコードエラー');
      setDecoded('');
      setIsValid(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decoded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Key className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">JWT デコーダー</h1>
          </div>

          <div className="space-y-6">
            {/* JWT 入力 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                JWT トークン
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
                className="w-full h-40 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            {/* デコード ボタン */}
            <button
              onClick={handleDecode}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              デコード
            </button>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">エラー:</p>
                <p className="text-sm break-all">{error}</p>
              </div>
            )}

            {/* 有効性インジケーター */}
            {decoded && (
              <div
                className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                  isValid
                    ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="font-semibold">
                  {isValid ? 'トークンは有効です' : 'トークンの期限が切れています'}
                </span>
              </div>
            )}

            {/* デコード結果 */}
            {decoded && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    デコード済みペイロード
                  </label>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                  >
                    コピー
                  </button>
                </div>
                <pre className="bg-slate-50 dark:bg-slate-700 p-4 rounded border border-slate-300 dark:border-slate-500 overflow-auto max-h-96 text-sm text-slate-900 dark:text-white">
                  {decoded}
                </pre>
              </div>
            )}

            {/* JWT 構造の説明 */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg text-sm space-y-2">
              <p className="font-semibold">JWT トークンの構造:</p>
              <p className="font-mono">Header.Payload.Signature</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Header: トークンの型とハッシュアルゴリズム</li>
                <li>Payload: クレーム（ユーザー情報など）</li>
                <li>Signature: トークンの署名</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
