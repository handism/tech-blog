'use client';

import { Key } from 'lucide-react';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ToolPageLayout from '@/src/components/ToolPageLayout';

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
    <ToolPageLayout
      title="JWT デコーダー"
      description="JSON Web Token (JWT) のヘッダー、ペイロード、署名を解析・検証"
      icon={Key}
    >
      <div className="space-y-6">
        {/* JWT 入力 */}
        <div>
          <label className="block text-sm font-bold text-text mb-2">JWT トークン</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
            className="w-full h-40 px-4 py-3 border-2 border-border bg-card text-text font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none shadow-[2px_2px_0px_0px_var(--border)]"
          />
        </div>

        {/* デコード ボタン */}
        <button onClick={handleDecode} className="neo-btn w-full py-3 px-4 text-base">
          デコード
        </button>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
            <p>エラー: {error}</p>
          </div>
        )}

        {/* 有効性インジケーター */}
        {decoded && (
          <div
            className={`px-4 py-3 rounded-xl border-2 flex items-center gap-2 font-bold ${
              isValid
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isValid ? 'トークンは有効です' : 'トークンの期限が切れています'}</span>
          </div>
        )}

        {/* デコード結果 */}
        {decoded && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-text">デコード済みペイロード</label>
              <button
                onClick={copyToClipboard}
                className="neo-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)]"
              >
                コピー
              </button>
            </div>
            <pre className="bg-secondary p-4 rounded-xl border-2 border-border overflow-auto max-h-96 text-sm text-text font-mono shadow-[2px_2px_0px_0px_var(--border)]">
              {decoded}
            </pre>
          </div>
        )}

        {/* JWT 構造の説明 */}
        <div className="bg-secondary border-2 border-border p-4 rounded-xl text-sm space-y-2 shadow-[4px_4px_0px_0px_var(--border)]">
          <p className="font-bold">JWT トークンの構造:</p>
          <p className="font-mono bg-card px-2 py-1 rounded border border-border inline-block">
            Header.Payload.Signature
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 font-medium">
            <li>Header: トークンの型とハッシュアルゴリズム</li>
            <li>Payload: クレーム（ユーザー情報など）</li>
            <li>Signature: トークンの署名</li>
          </ul>
        </div>
      </div>
    </ToolPageLayout>
  );
}
