// src/components/tools/network/HttpStatus.tsx
'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, ExternalLink, HelpCircle, ArrowRight, CornerDownRight, X } from 'lucide-react';
import { HTTP_STATUS_CODES } from './HttpStatusData';

export default function HttpStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
  >('all');
  const [activeCode, setActiveCode] = useState<number | null>(200);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 検索とフィルタリング
  const filteredCodes = useMemo(() => {
    return HTTP_STATUS_CODES.filter((item) => {
      // カテゴリ一致
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // 検索一致
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.code.toString().includes(query) ||
        item.phrase.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeData = useMemo(() => {
    return HTTP_STATUS_CODES.find((item) => item.code === activeCode) || null;
  }, [activeCode]);

  // カテゴリタブ情報定義
  const TABS = [
    { id: 'all', name: 'すべて', color: 'bg-accent' },
    { id: '1xx', name: '1xx 情報', color: 'bg-blue-500' },
    { id: '2xx', name: '2xx 成功', color: 'bg-emerald-500' },
    { id: '3xx', name: '3xx 転送', color: 'bg-amber-500' },
    { id: '4xx', name: '4xx クライアントエラー', color: 'bg-rose-500' },
    { id: '5xx', name: '5xx サーバーエラー', color: 'bg-purple-500' },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-text">
      {/* 左側: 検索 ＆ リスト選択 (lg:col-span-5) */}
      <div className="lg:col-span-5 space-y-4">
        {/* 検索フォーム */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="コード（例: 404）や名前で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-card border-2 border-border text-text placeholder-text/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm font-bold shadow-inner"
          />
          {searchQuery && (
            <button
              aria-label="検索条件をクリア"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* クラス別タブ */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/20 pb-2">
          {TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`
                  px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-black border border-border cursor-pointer transition-all
                  ${
                    isActive
                      ? `${tab.color} text-white translate-x-[1px] translate-y-[1px] shadow-none`
                      : 'bg-card text-text shadow-[1.5px_1.5px_0px_0px_var(--border)] dark:shadow-[1.5px_1.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                  }
                `}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* リスト表示 */}
        <div className="divide-y divide-border/20 max-h-[450px] overflow-y-auto border-2 border-border rounded-xl bg-card shadow-[2px_2px_0px_0px_var(--border)]">
          {filteredCodes.length === 0 ? (
            <div className="p-8 text-center text-text/50 text-xs font-bold">
              条件に一致するコードが見つかりません
            </div>
          ) : (
            filteredCodes.map((item) => {
              const isActive = item.code === activeCode;
              let pillBg = 'bg-slate-500';
              if (item.category === '1xx') pillBg = 'bg-blue-500';
              if (item.category === '2xx') pillBg = 'bg-emerald-500';
              if (item.category === '3xx') pillBg = 'bg-amber-500';
              if (item.category === '4xx') pillBg = 'bg-rose-500';
              if (item.category === '5xx') pillBg = 'bg-purple-500';

              return (
                <button
                  key={item.code}
                  onClick={() => setActiveCode(item.code)}
                  className={`
                    w-full text-left p-3 flex items-center justify-between cursor-pointer transition-all group
                    ${isActive ? 'bg-secondary' : 'hover:bg-secondary/40'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-12 text-center py-1 text-xs font-black text-white rounded-md ${pillBg}`}
                    >
                      {item.code}
                    </span>
                    <div>
                      <div className="font-extrabold text-sm text-text group-hover:text-accent transition-colors">
                        {item.phrase}
                      </div>
                      <div className="text-[10px] text-text/60 font-medium truncate max-w-[180px] md:max-w-[220px]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 text-text/30 group-hover:translate-x-0.5 transition-transform ${isActive ? 'text-accent opacity-100' : 'opacity-0 md:opacity-30'}`}
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 右側: 選択したコードの詳細 (lg:col-span-7) */}
      <div className="lg:col-span-7">
        {activeData ? (
          <div className="theme-card p-5 md:p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-6">
            {/* ステータスコード巨大ヘッドライン */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-border/20 pb-4 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-black text-accent tracking-tight">
                  {activeData.code}
                </span>
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-text flex items-center gap-1.5">
                    {activeData.phrase}
                  </h2>
                  <span className="text-xs border border-border bg-secondary text-text px-2 py-0.5 rounded-md font-bold">
                    HTTP {activeData.category}
                  </span>
                </div>
              </div>
              <a
                href={activeData.mdnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-btn py-1.5 px-3 text-xs flex items-center gap-1 bg-secondary border-border text-text font-bold cursor-pointer hover:bg-border/20 shadow-[1.5px_1.5px_0px_0px_var(--border)]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                MDNで仕様を見る
              </a>
            </div>

            {/* 概要 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-text/45 uppercase tracking-wider">概要説明</h3>
              <p className="text-text font-semibold leading-relaxed text-sm md:text-base">
                {activeData.description}
              </p>
            </div>

            {/* ユースケース・背景詳細 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-text/45 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-accent" />
                いつ使われるか？（詳細解説）
              </h3>
              <p className="text-text/80 text-xs md:text-sm font-medium leading-relaxed bg-secondary/35 p-3.5 border border-border rounded-xl shadow-inner">
                {activeData.details}
              </p>
            </div>

            {/* 関連ヘッダー */}
            {activeData.commonHeaders && activeData.commonHeaders.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-text/45 uppercase tracking-wider">
                  主な関連ヘッダー
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeData.commonHeaders.map((header) => (
                    <span
                      key={header}
                      className="px-2.5 py-1 bg-secondary border border-border rounded-md text-xs font-mono text-text font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_0px_var(--border)]"
                    >
                      <CornerDownRight className="w-3 h-3 text-accent" />
                      {header}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* レスポンスモック例 */}
            {activeData.mockResponse && (
              <div className="space-y-2">
                <h3 className="text-xs font-black text-text/45 uppercase tracking-wider">
                  一般的なレスポンスボディ (JSON)
                </h3>
                <pre className="p-3.5 bg-black/95 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border-2 border-border shadow-inner select-all leading-normal">
                  {activeData.mockResponse}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="theme-card p-12 text-center bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <p className="text-sm font-bold text-text/50">
              ステータスコードを左のリストから選択してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
