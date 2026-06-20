'use client';

import { useState } from 'react';
import { Send, Plus, Trash2, Clipboard, Check, HelpCircle, AlertTriangle } from 'lucide-react';

interface HeaderItem {
  id: string;
  key: string;
  value: string;
}

export default function HttpTesterPage() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { id: '1', key: 'Content-Type', value: 'application/json' },
  ]);
  const [reqBody, setReqBody] = useState(
    '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'
  );

  // レスポンス状態
  const [resStatus, setResStatus] = useState<number | null>(null);
  const [resStatusText, setResStatusText] = useState('');
  const [resHeaders, setResHeaders] = useState<Record<string, string>>({});
  const [resBody, setResBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const handleHeaderChange = (id: string, field: 'key' | 'value', val: string) => {
    setHeaders(
      headers.map((h) => {
        if (h.id === id) {
          return { ...h, [field]: val };
        }
        return h;
      })
    );
  };

  const handlePreset = (presetType: 'get-todo' | 'post-todo') => {
    if (presetType === 'get-todo') {
      setUrl('https://jsonplaceholder.typicode.com/todos/1');
      setMethod('GET');
      setHeaders([{ id: '1', key: 'Content-Type', value: 'application/json' }]);
    } else {
      setUrl('https://jsonplaceholder.typicode.com/posts');
      setMethod('POST');
      setHeaders([{ id: '1', key: 'Content-Type', value: 'application/json' }]);
      setReqBody('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResStatus(null);
    setResStatusText('');
    setResHeaders({});
    setResBody('');

    try {
      const fetchHeaders = new Headers();
      headers.forEach((h) => {
        if (h.key.trim()) {
          fetchHeaders.append(h.key.trim(), h.value.trim());
        }
      });

      const options: RequestInit = {
        method,
        headers: fetchHeaders,
      };

      if (method !== 'GET' && reqBody.trim()) {
        options.body = reqBody;
      }

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();

      setResStatus(res.status);
      setResStatusText(`${res.statusText} (${Math.round(endTime - startTime)}ms)`);

      // レスポンスヘッダーの取得
      const resHdrs: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHdrs[key] = value;
      });
      setResHeaders(resHdrs);

      // レスポンスボディのデコード
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResBody(JSON.stringify(json, null, 2));
      } catch {
        setResBody(text);
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(
        `リクエスト失敗: ${errMsg}\n※接続先のCORSポリシーによってブラウザ側で通信が遮断された可能性があります。`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-3">
            <Send className="w-3.5 h-3.5" />
            <span>Developer Utilities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            HTTP Request Tester
          </h1>
          <p className="text-text/80 text-sm md:text-base font-medium mt-2">
            ブラウザのFetch APIを用いて、各種APIへのリクエストを送信してレスポンスを確認します。
          </p>
        </div>
      </div>

      {/* CORS注意喚起アラート */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-3 border-amber-500 rounded-2xl flex items-start gap-3 mb-8">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm font-bold text-amber-800 dark:text-amber-300 space-y-1">
          <p>⚠️ CORS（オリジン間リソース共有）に関する重要なお知らせ</p>
          <p className="font-medium">
            本ツールは完全にブラウザ側（クライアントサイド）からリクエストを送信します。
            リクエスト先サーバーが CORS を許可していない（`Access-Control-Allow-Origin`
            ヘッダーが未付与、または本サイトが許可されていない）場合、ブラウザセキュリティの制限によって通信がブロックされます。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* リクエスト設定パネル */}
        <div className="lg:col-span-6 space-y-6">
          <div className="theme-card p-5 md:p-6 space-y-5">
            <div className="flex justify-between items-center border-b-2 border-border pb-2">
              <h2 className="text-lg font-bold">📡 リクエスト構成</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreset('get-todo')}
                  className="theme-btn px-2.5 py-1 text-xs bg-secondary"
                >
                  GETデモ
                </button>
                <button
                  onClick={() => handlePreset('post-todo')}
                  className="theme-btn px-2.5 py-1 text-xs bg-secondary"
                >
                  POSTデモ
                </button>
              </div>
            </div>

            {/* URL & Method */}
            <div className="flex gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof method)}
                className="px-3 py-3 border-2 border-border rounded-xl font-bold bg-card text-text focus:outline-none cursor-pointer"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 px-4 py-3 border-2 border-border rounded-xl font-mono text-sm bg-card text-text focus:outline-none"
              />
            </div>

            {/* Headers */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">🔑 リクエストヘッダー</span>
                <button
                  onClick={handleAddHeader}
                  className="theme-btn p-1.5 bg-secondary text-text"
                  title="ヘッダー行を追加"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                {headers.map((header) => (
                  <div key={header.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Header-Name"
                      value={header.key}
                      onChange={(e) => handleHeaderChange(header.id, 'key', e.target.value)}
                      className="w-1/2 px-3 py-1.5 border-2 border-border rounded-lg text-xs font-mono bg-card"
                    />
                    <input
                      type="text"
                      placeholder="value"
                      value={header.value}
                      onChange={(e) => handleHeaderChange(header.id, 'value', e.target.value)}
                      className="w-1/2 px-3 py-1.5 border-2 border-border rounded-lg text-xs font-mono bg-card"
                    />
                    <button
                      onClick={() => handleRemoveHeader(header.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {headers.length === 0 && (
                  <p className="text-xs font-medium text-text/50 py-2">
                    ヘッダーは設定されていません。
                  </p>
                )}
              </div>
            </div>

            {/* Request Body */}
            {method !== 'GET' && (
              <div className="space-y-2">
                <span className="text-sm font-bold">📦 リクエストボディ</span>
                <textarea
                  className="w-full h-[150px] p-3 border-2 border-border rounded-xl font-mono text-xs bg-card text-text focus:outline-none resize-none"
                  value={reqBody}
                  onChange={(e) => setReqBody(e.target.value)}
                  placeholder="リクエストのJSONデータを入力..."
                />
              </div>
            )}

            {/* 送信ボタン */}
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full theme-btn py-3 bg-accent text-white font-extrabold cursor-pointer disabled:opacity-50"
            >
              {loading ? '送信中...' : 'リクエスト送信 🚀'}
            </button>
          </div>
        </div>

        {/* レスポンス結果パネル */}
        <div className="lg:col-span-6 space-y-6">
          <div className="theme-card p-5 md:p-6 flex flex-col h-[520px]">
            <h2 className="text-lg font-bold text-text mb-4 border-b-2 border-border pb-2 flex items-center justify-between">
              <span>📥 レスポンス</span>
              {resStatus !== null && (
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-lg border-2 border-border ${
                    resStatus >= 200 && resStatus < 300
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {resStatus} {resStatusText}
                </span>
              )}
            </h2>

            <div className="flex-1 flex flex-col min-h-0">
              {error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-xl text-red-700 dark:text-red-300 text-sm font-bold whitespace-pre-line overflow-y-auto">
                  {error}
                </div>
              ) : resBody ? (
                <div className="flex-1 flex flex-col min-h-0 relative">
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 z-10 theme-btn p-2 bg-secondary text-text flex items-center justify-center"
                    title="コピー"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 grid grid-rows-3 gap-4 min-h-0">
                    {/* レスポンスヘッダー */}
                    <div className="row-span-1 border-2 border-border rounded-xl p-3 bg-card overflow-y-auto flex flex-col">
                      <span className="text-xs font-extrabold mb-1.5 text-text/60">Headers</span>
                      <pre className="font-mono text-[10px] whitespace-pre-wrap leading-relaxed text-text/85">
                        {Object.entries(resHeaders)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join('\n')}
                      </pre>
                    </div>
                    {/* レスポンスボディ */}
                    <div className="row-span-2 border-2 border-border rounded-xl p-3 bg-slate-950 text-slate-100 overflow-y-auto">
                      <span className="text-xs font-extrabold mb-1.5 text-slate-400 block">
                        Body
                      </span>
                      <pre className="font-mono text-xs whitespace-pre-wrap">{resBody}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-xl text-text/40 font-bold p-8 text-center text-sm">
                  <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
                  リクエストを設定し「送信」ボタンを押すと、ここに結果が表示されます。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
