// src/components/tools/crypto/JwtDecoder.tsx
'use client';

import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import ResultBox from '@/src/components/ResultBox';

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

  return (
    <div className="space-y-6">
      {/* JWT 入力 */}
      <div>
        <label className="block text-xs font-bold text-text/70 mb-2">JWT トークン</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
          className="theme-textarea w-full h-40"
        />
      </div>

      {/* デコード ボタン */}
      <button
        onClick={handleDecode}
        className="theme-btn w-full py-3 px-4 text-base font-bold cursor-pointer"
      >
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
      {decoded && <ResultBox value={decoded} label="デコード済みペイロード" />}

      {/* JWT 構造の説明 */}
      <div className="theme-card p-6 bg-secondary text-sm space-y-2">
        <p className="font-bold">JWT トークンの構造:</p>
        <p className="font-mono bg-card px-2 py-1 rounded border-2 border-border inline-block text-text font-bold">
          Header.Payload.Signature
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2 font-medium text-text/80">
          <li>Header: トークンの型とハッシュアルゴリズム</li>
          <li>Payload: クレーム（ユーザー情報など）</li>
          <li>Signature: トークンの署名</li>
        </ul>
      </div>
    </div>
  );
}
