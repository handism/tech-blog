// src/components/ToolsDashboard.tsx
'use client';

import { toolsMenuItems, ToolItem } from '@/src/config/site';
import { Search, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

// カテゴリ定義の定義
const CATEGORIES = [
  { id: 'all', name: 'すべて', emoji: '✨' },
  { id: 'image', name: '画像処理', emoji: '🎨' },
  { id: 'convert', name: 'データ変換', emoji: '🔄' },
  { id: 'dev', name: '開発者ツール', emoji: '🛠️' },
  { id: 'external', name: '外部ツール', emoji: '🧖' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

export default function ToolsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // 検索とカテゴリでのフィルタリングロジック
  const filteredTools = useMemo(() => {
    return toolsMenuItems.filter((tool) => {
      // カテゴリマッチ
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      // 検索ワードマッチ
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        tool.label.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // カテゴリごとにツールをグルーピング
  const groupedTools = useMemo(() => {
    const groups: Record<string, ToolItem[]> = {
      image: [],
      convert: [],
      dev: [],
      external: [],
    };

    filteredTools.forEach((tool) => {
      if (groups[tool.category]) {
        groups[tool.category].push(tool);
      }
    });

    return groups;
  }, [filteredTools]);

  // カテゴリ別のタイトル情報
  const categoryMeta: Record<string, { name: string; emoji: string }> = {
    image: { name: '画像処理', emoji: '🎨' },
    convert: { name: 'データ変換', emoji: '🔄' },
    dev: { name: '開発者向けツール', emoji: '🛠️' },
    external: { name: '外部ツール', emoji: '🧖' },
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      {/* ヒーローヘッダー */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 border border-accent/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Utilities</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight mb-4">
          Online Developer Tools
        </h1>
        <p className="text-text/70 text-sm md:text-base leading-relaxed">
          開発やデザイン、日常のちょっとしたデータ変換作業をブラウザ上で素早く安全に行える便利ツール集です。
        </p>
      </div>

      {/* コントロールパネル (検索 ＆ フィルタ) */}
      <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl p-4 md:p-6 mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 検索入力 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
          <input
            id="tool-search"
            type="text"
            placeholder="ツール名や説明から検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg/50 border border-border text-text placeholder-text/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* カテゴリタブ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 cursor-pointer
                ${
                  selectedCategory === cat.id
                    ? 'bg-accent border-accent text-white shadow-sm shadow-accent/20'
                    : 'bg-bg/40 border-border text-text/80 hover:text-accent hover:border-accent/30 hover:bg-accent/5'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ツールリストグリッド */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-card/20 backdrop-blur-sm border border-border/40 rounded-3xl">
          <p className="text-text/60 mb-4 text-sm md:text-base">
            条件に一致するツールが見つかりませんでした。
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-accent/15 hover:bg-accent/20 border border-accent/30 text-accent rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            検索条件をリセットする
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* カテゴリごとのセクション表示（カテゴリが「すべて」の場合） */}
          {selectedCategory === 'all' ? (
            Object.entries(groupedTools).map(([catKey, items]) => {
              if (items.length === 0) return null;
              const meta = categoryMeta[catKey];
              return (
                <div key={catKey} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                    <span className="text-xl md:text-2xl">{meta.emoji}</span>
                    <h2 className="text-lg md:text-xl font-bold text-text">{meta.name}</h2>
                    <span className="text-xs bg-secondary text-text/60 px-2 py-0.5 rounded-full font-medium">
                      {items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {items.map((item) => (
                      <ToolCard key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // 特定のカテゴリのみが選択されている場合はダイレクトに一覧表示
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTools.map((item) => (
                <ToolCard key={item.href} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ツール個別カードコンポーネント
function ToolCard({ item }: { item: ToolItem }) {
  const CardContent = (
    <div className="group relative h-full bg-card/45 hover:bg-card/75 backdrop-blur-md border border-border/70 hover:border-accent/40 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 text-2xl group-hover:scale-110 group-hover:bg-accent/15 transition-all duration-300">
            {item.emoji}
          </div>
          {item.external && (
            <span className="text-text/30 group-hover:text-accent transition-colors">
              <ExternalLink className="w-4 h-4" />
            </span>
          )}
        </div>
        <h3 className="text-base md:text-lg font-bold text-text group-hover:text-accent transition-colors flex items-center gap-1.5 mb-2">
          {item.label}
        </h3>
        <p className="text-text/70 text-xs md:text-sm leading-relaxed mb-4">{item.description}</p>
      </div>

      <div className="mt-auto flex items-center justify-end">
        <span className="text-xs font-semibold text-accent/80 group-hover:text-accent group-hover:translate-x-1 transition-all flex items-center gap-0.5">
          {item.external ? '開く' : '使ってみる'} ➔
        </span>
      </div>
    </div>
  );

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full outline-none focus:outline-none"
    >
      {CardContent}
    </a>
  ) : (
    <Link href={item.href} className="block h-full outline-none focus:outline-none">
      {CardContent}
    </Link>
  );
}
