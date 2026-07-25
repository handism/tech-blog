// src/components/ToolsDashboard.tsx
'use client';

import DashboardFilterBar, {
  type DashboardFilterOption,
} from '@/src/components/dashboard/DashboardFilterBar';
import DashboardHero from '@/src/components/dashboard/DashboardHero';
import DashboardShell from '@/src/components/dashboard/DashboardShell';
import {
  DashboardEmptyState,
  DashboardSectionHeading,
} from '@/src/components/dashboard/DashboardSection';
import { toolsMenuItems, ToolItem } from '@/src/config/tools';
import { ArrowRight, ExternalLink, Image, Repeat, Sparkles, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

// カテゴリ定義
const CATEGORIES = [
  { id: 'all', name: 'すべて', icon: Sparkles },
  { id: 'image', name: '画像処理', icon: Image },
  { id: 'convert', name: 'データ変換', icon: Repeat },
  { id: 'dev', name: '開発者ツール', icon: Wrench },
  { id: 'external', name: '外部ツール', icon: ExternalLink },
] as const satisfies readonly DashboardFilterOption[];

type CategoryId = (typeof CATEGORIES)[number]['id'];

// CATEGORIES から動的にカテゴリメタ情報を生成
const categoryMeta = Object.fromEntries(
  CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, { name: c.name, icon: c.icon }])
) as Record<
  Exclude<CategoryId, 'all'>,
  { name: string; icon: (typeof CATEGORIES)[number]['icon'] }
>;

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
    const groups = Object.fromEntries(
      CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, [] as ToolItem[]])
    ) as Record<Exclude<CategoryId, 'all'>, ToolItem[]>;

    filteredTools.forEach((tool) => {
      if (groups[tool.category]) {
        groups[tool.category].push(tool);
      }
    });

    return groups;
  }, [filteredTools]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <DashboardShell>
      <DashboardHero
        badge="Utilities"
        title="Online Developer Tools"
        description="開発やデザイン、日常のちょっとしたデータ変換作業をブラウザ上で素早く安全に行える便利ツール集です。"
      />

      <DashboardFilterBar
        searchId="tool-search"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ツール名や説明から検索..."
        searchLabel="ツール名や説明から検索"
        options={CATEGORIES}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* ツールリストグリッド */}
      {filteredTools.length === 0 ? (
        <DashboardEmptyState
          message="条件に一致するツールが見つかりませんでした。"
          onReset={handleClearFilters}
        />
      ) : (
        <div className="space-y-12">
          {/* カテゴリごとのセクション表示（カテゴリが「すべて」の場合） */}
          {selectedCategory === 'all' ? (
            Object.entries(groupedTools).map(([catKey, items]) => {
              if (items.length === 0) return null;
              const meta = categoryMeta[catKey as Exclude<CategoryId, 'all'>];
              return (
                <div key={catKey} className="space-y-4">
                  <DashboardSectionHeading icon={meta.icon} name={meta.name} count={items.length} />
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
    </DashboardShell>
  );
}

// ツール個別カードコンポーネント
function ToolCard({ item }: { item: ToolItem }) {
  const Icon = item.icon;
  const CardContent = (
    <div className="group relative h-full theme-card theme-card-hover p-5 md:p-6 flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-border bg-secondary text-accent group-hover:rotate-6 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          {item.external && (
            <span className="text-text/30 group-hover:text-accent transition-colors">
              <ExternalLink className="w-4 h-4" />
            </span>
          )}
        </div>
        <h3 className="text-base md:text-lg font-extrabold text-text group-hover:text-accent transition-colors flex items-center gap-1.5 mb-2">
          {item.label}
        </h3>
        <p className="text-text/80 text-xs md:text-sm leading-relaxed mb-4 font-medium">
          {item.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-end">
        <span className="text-xs font-extrabold text-text group-hover:text-accent group-hover:translate-x-1 transition-all flex items-center gap-1">
          {item.external ? '開く' : '使ってみる'}
          <ArrowRight className="w-3.5 h-3.5" />
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
