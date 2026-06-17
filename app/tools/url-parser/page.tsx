'use client';

import { Link, Copy, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

export default function UrlParser() {
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Structured states for URL components
  const [protocol, setProtocol] = useState('https:');
  const [hostname, setHostname] = useState('');
  const [port, setPort] = useState('');
  const [pathname, setPathname] = useState('');
  const [hash, setHash] = useState('');
  const [params, setParams] = useState<QueryParam[]>([]);

  // Parse URL string when it changes
  const handleParse = (input: string) => {
    setUrlInput(input);
    if (!input.trim()) {
      setError('');
      return;
    }

    try {
      setError('');
      // Support protocol-less URLs by prepending https:// if needed
      let rawUrl = input.trim();
      if (!/^[a-zA-Z]+:\/\//.test(rawUrl)) {
        rawUrl = 'https://' + rawUrl;
      }

      const parsed = new URL(rawUrl);
      setProtocol(parsed.protocol);
      setHostname(parsed.hostname);
      setPort(parsed.port);
      setPathname(parsed.pathname);
      setHash(parsed.hash);

      const queryParams: QueryParam[] = [];
      parsed.searchParams.forEach((value, key) => {
        queryParams.push({
          id: Math.random().toString(36).substring(2, 9),
          key,
          value,
        });
      });
      setParams(queryParams);
    } catch {
      setError('有効なURLを入力してください（例: https://example.com/path?query=val）。');
    }
  };

  // Compile structured inputs back to a full URL
  const reconstructedUrl = useMemo(() => {
    try {
      if (!hostname) return '';

      // Build port string
      const portPart = port ? `:${port}` : '';

      // Construct Search Params
      const searchParams = new URLSearchParams();
      params.forEach((p) => {
        if (p.key.trim()) {
          searchParams.append(p.key.trim(), p.value);
        }
      });

      const searchStr = searchParams.toString();
      const queryPart = searchStr ? `?${searchStr}` : '';
      const hashPart = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';

      return `${protocol}//${hostname}${portPart}${pathname}${queryPart}${hashPart}`;
    } catch {
      return '';
    }
  }, [protocol, hostname, port, pathname, hash, params]);

  const handleCopy = () => {
    if (!reconstructedUrl) return;
    navigator.clipboard.writeText(reconstructedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddParam = () => {
    setParams([
      ...params,
      {
        id: Math.random().toString(36).substring(2, 9),
        key: '',
        value: '',
      },
    ]);
  };

  const handleUpdateParam = (id: string, key: string, value: string) => {
    setParams(params.map((p) => (p.id === id ? { ...p, key, value } : p)));
  };

  const handleDeleteParam = (id: string) => {
    setParams(params.filter((p) => p.id !== id));
  };

  const handleClear = () => {
    setUrlInput('');
    setProtocol('https:');
    setHostname('');
    setPort('');
    setPathname('');
    setHash('');
    setParams([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-150 dark:border-slate-800 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                URL Parser & Query Inspector
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                長いURLやクエリパラメータをきれいに分解し、値の編集・追加・削除を行って新しいURLを再生成できます。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Input URL Box */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                解析するURLを入力
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => handleParse(e.target.value)}
                  placeholder="https://example.com/search?q=nextjs&category=tech#doc"
                  className="flex-1 px-4 py-3 border border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono text-sm shadow-inner"
                />

                <button
                  onClick={handleClear}
                  className="px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-855 text-slate-750 dark:text-slate-300 border border-slate-250 dark:border-slate-800 font-bold rounded-xl transition"
                >
                  クリア
                </button>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-650 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}
            </div>

            {/* Split URL Info / Interactive builder */}
            {hostname && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-slate-100 dark:border-slate-850">
                {/* Left Part: General components */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-bold text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">
                    基本コンポーネント
                  </h3>

                  {/* Protocol */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      プロトコル
                    </label>
                    <select
                      value={protocol}
                      onChange={(e) => setProtocol(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg text-sm"
                    >
                      <option value="https:">https://</option>
                      <option value="http:">http://</option>
                      <option value="ftp:">ftp://</option>
                    </select>
                  </div>

                  {/* Hostname */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      ホスト名 (Domain)
                    </label>
                    <input
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Port */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      ポート番号
                    </label>
                    <input
                      type="text"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="なし"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Pathname */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      パス名 (Path)
                    </label>
                    <input
                      type="text"
                      value={pathname}
                      onChange={(e) => setPathname(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Hash */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      ハッシュ (#Anchor)
                    </label>
                    <input
                      type="text"
                      value={hash}
                      onChange={(e) => setHash(e.target.value)}
                      placeholder="例: #section-1"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Right Part: Query parameters inspector */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
                    <h3 className="font-bold text-slate-850 dark:text-white">
                      クエリパラメータ ({params.length})
                    </h3>
                    <button
                      onClick={handleAddParam}
                      className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      追加
                    </button>
                  </div>

                  {params.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl text-xs text-slate-450">
                      パラメータがありません。追加ボタンからパラメータを追加できます。
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                      {params.map((p) => (
                        <div key={p.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={p.key}
                            onChange={(e) => handleUpdateParam(p.id, e.target.value, p.value)}
                            placeholder="Key"
                            className="flex-1 min-w-[80px] px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                          <span className="text-slate-400 text-xs font-bold">=</span>
                          <input
                            type="text"
                            value={p.value}
                            onChange={(e) => handleUpdateParam(p.id, p.key, e.target.value)}
                            placeholder="Value"
                            className="flex-1.5 min-w-[120px] px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                          <button
                            onClick={() => handleDeleteParam(p.id)}
                            className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-650 dark:bg-slate-900 dark:hover:bg-red-950/30 text-slate-450 rounded-lg transition border border-slate-200 dark:border-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Part: Reconstructed URL Panel */}
                <div className="lg:col-span-3 bg-teal-50/40 dark:bg-slate-900 p-5 rounded-2xl border border-teal-150/40 dark:border-slate-850 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                      再構築されたURL
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs bg-teal-650 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? 'コピーしました！' : 'コピー'}
                    </button>
                  </div>

                  <div className="font-mono text-sm text-slate-850 dark:text-white bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 break-all select-all leading-relaxed shadow-inner">
                    {reconstructedUrl || 'なし'}
                  </div>
                </div>
              </div>
            )}

            {/* Explanation box */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl">
              <h3 className="font-bold text-slate-850 dark:text-white mb-2">
                URLデコーダとしての便利機能
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                ブラウザのロケーションバーからコピーしたURLは、クエリパラメータがパーセントエンコード（例:
                `%E3%83%86%E3%82%B9%E3%83%88`）されておりそのままでは可読性が著しく低下します。
                このツールに貼り付けると、自動的にすべてのキーと値が人間が読める日本語（UTF-8）にデコードされるため、調査や整形が非常に簡単になります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
