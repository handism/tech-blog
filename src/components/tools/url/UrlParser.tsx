// src/components/tools/url/UrlParser.tsx
'use client';

import { Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

export default function UrlParser() {
  const [urlInput, setUrlInput] = useState('');
  const { copied, copy } = useCopyToClipboard();
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
    copy(reconstructedUrl);
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
    <div className="space-y-6">
      {/* 入力URL */}
      <div>
        <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
          解析するURLを入力
        </label>

        <div className="flex gap-3">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="https://example.com/search?q=nextjs&category=tech#doc"
            className="flex-1 px-4 py-3 border-2 border-border bg-card text-text rounded-xl focus:ring-2 focus:ring-accent focus:outline-none font-mono text-sm shadow-[2px_2px_0px_0px_var(--border)]"
          />

          <button
            onClick={handleClear}
            className="theme-btn px-4 py-3 border-2 border-border font-bold rounded-xl transition cursor-pointer"
          >
            クリア
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-3 rounded-xl font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 分析/構築パネル */}
      {hostname && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t-2 border-border/20">
          {/* 左カラム: 基本パラメータ */}
          <div className="lg:col-span-1 theme-card p-5 bg-card space-y-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <h3 className="font-extrabold text-sm border-b-2 border-border/20 pb-2 text-text">
              基本コンポーネント
            </h3>

            {/* Protocol */}
            <div>
              <label className="block text-xs font-bold text-text/60 mb-1">プロトコル</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-lg text-sm font-bold focus:outline-none"
              >
                <option value="https:">https://</option>
                <option value="http:">http://</option>
                <option value="ftp:">ftp://</option>
              </select>
            </div>

            {/* Hostname */}
            <div>
              <label className="block text-xs font-bold text-text/60 mb-1">ホスト名 (Domain)</label>
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>

            {/* Port */}
            <div>
              <label className="block text-xs font-bold text-text/60 mb-1">ポート番号</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="なし"
                className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>

            {/* Pathname */}
            <div>
              <label className="block text-xs font-bold text-text/60 mb-1">パス名 (Path)</label>
              <input
                type="text"
                value={pathname}
                onChange={(e) => setPathname(e.target.value)}
                className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>

            {/* Hash */}
            <div>
              <label className="block text-xs font-bold text-text/60 mb-1">
                ハッシュ (#Anchor)
              </label>
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="例: #section-1"
                className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
              />
            </div>
          </div>

          {/* 右カラム: クエリパラメータ */}
          <div className="lg:col-span-2 theme-card p-5 bg-card space-y-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <div className="flex justify-between items-center border-b-2 border-border/20 pb-2">
              <h3 className="font-extrabold text-sm text-text">
                クエリパラメータ ({params.length})
              </h3>
              <button
                onClick={handleAddParam}
                className="flex items-center gap-1 text-xs font-bold text-accent hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                追加
              </button>
            </div>

            {params.length === 0 ? (
              <div className="text-center py-12 bg-secondary border-2 border-dashed border-border/30 rounded-2xl text-xs text-text/40 font-bold">
                パラメータがありません。追加ボタンからパラメータを追加できます。
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {params.map((p) => (
                  <div key={p.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={p.key}
                      onChange={(e) => handleUpdateParam(p.id, e.target.value, p.value)}
                      placeholder="Key"
                      className="flex-1 min-w-[80px] px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
                    />
                    <span className="text-text/40 text-xs font-bold">=</span>
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => handleUpdateParam(p.id, p.key, e.target.value)}
                      placeholder="Value"
                      className="flex-1.5 min-w-[120px] px-3 py-2 bg-card border-2 border-border text-text rounded-lg font-mono text-xs focus:ring-1 focus:ring-accent focus:outline-none"
                    />
                    <button
                      onClick={() => handleDeleteParam(p.id)}
                      className="p-2 bg-card hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/30 text-text/60 rounded-lg transition border-2 border-border cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 下部: 再構築されたURLパネル */}
          <div className="lg:col-span-3 bg-secondary p-5 rounded-2xl border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text/60 uppercase tracking-wider">
                再構築されたURL
              </span>
              <button
                onClick={handleCopy}
                className="theme-btn bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                {copied ? 'コピー完了' : 'コピー'}
              </button>
            </div>

            <div className="font-mono text-sm text-text bg-card p-3 rounded-xl border border-border break-all select-all leading-relaxed shadow-inner">
              {reconstructedUrl || 'なし'}
            </div>
          </div>
        </div>
      )}

      {/* 解説 */}
      <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)] text-sm">
        <h3 className="font-bold text-text mb-2">URLデコーダとしての便利機能</h3>
        <p className="text-text/75 leading-relaxed font-medium">
          ブラウザのロケーションバーからコピーしたURLは、クエリパラメータがパーセントエンコード（例:
          `%E3%83%86%E3%82%B9%E3%83%88`）されておりそのままでは可読性が著しく低下します。
          このツールに貼り付けると、自動的にすべてのキーと値が人間が読める日本語（UTF-8）にデコードされるため、調査や整形が非常に簡単になります。
        </p>
      </div>
    </div>
  );
}
