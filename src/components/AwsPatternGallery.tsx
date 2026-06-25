// src/components/AwsPatternGallery.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Cpu, Tag, ArrowRight, FileCode } from 'lucide-react';
import type { AwsPatternMeta } from '@/src/types/aws-gallery';

type Props = {
  patterns: AwsPatternMeta[];
};

export default function AwsPatternGallery({ patterns }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState('All');

  // 全カテゴリを動的に収集
  const categories = useMemo(() => {
    const set = new Set<string>();
    patterns.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [patterns]);

  // 全AWSサービス（タグ）を動的に収集し、使用頻度の高い順にソート
  const services = useMemo(() => {
    const countMap: Record<string, number> = {};
    patterns.forEach((p) => {
      p.awsServices.forEach((s) => {
        countMap[s] = (countMap[s] || 0) + 1;
      });
    });
    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    return ['All', ...sorted];
  }, [patterns]);

  // フィルタリングと検索の適用
  const filteredPatterns = useMemo(() => {
    return patterns.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.awsServices.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      const matchesService = selectedService === 'All' || p.awsServices.includes(selectedService);

      return matchesSearch && matchesCategory && matchesService;
    });
  }, [patterns, searchQuery, selectedCategory, selectedService]);

  return (
    <div className="space-y-8">
      {/* 検索・フィルタリングコントロール */}
      <div className="theme-card p-6 border-2 border-border rounded-2xl shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 検索入力 */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text/50" />
            <input
              type="text"
              placeholder="テンプレート名、説明、AWSサービスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border-2 border-border rounded-xl bg-card text-text placeholder-text/40 font-medium focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* カテゴリセレクトボックス (モバイル向け) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm font-extrabold text-text">カテゴリ:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border-2 border-border rounded-xl bg-card text-text font-bold focus:outline-none focus:border-accent transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'すべて' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* AWSサービスセレクトボックス */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm font-extrabold text-text">主要サービス:</span>
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border-2 border-border rounded-xl bg-card text-text font-bold focus:outline-none focus:border-accent transition-colors"
            >
              {services.map((srv) => (
                <option key={srv} value={srv}>
                  {srv === 'All' ? 'すべてのサービス' : srv}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* クイックカテゴリタグ (デスクトップ向けスクロールタブ) */}
        <div className="hidden md:flex flex-wrap items-center gap-2 pt-2 border-t border-border/10">
          <span className="text-xs font-black text-text/50 uppercase tracking-wider mr-2">
            カテゴリ絞り込み:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 text-xs font-black border-2 border-border rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white dark:text-neutral-900 shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-card text-text hover:bg-secondary'
              }`}
            >
              {cat === 'All' ? 'すべて' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 検索結果件数表示 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold text-text/70">
          該当パターン:{' '}
          <span className="text-accent text-base font-black">{filteredPatterns.length}</span> 件
        </p>
        {(searchQuery || selectedCategory !== 'All' || selectedService !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedService('All');
            }}
            className="text-xs font-black text-accent hover:underline"
          >
            フィルターをクリア
          </button>
        )}
      </div>

      {/* パターンカードグリッド */}
      {filteredPatterns.length === 0 ? (
        <div className="theme-card p-16 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-text/50 font-bold text-lg">
            条件に一致するAWSアーキテクチャテンプレートが見つかりませんでした。
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatterns.map((pattern) => (
            <Link
              key={pattern.slug}
              href={`/aws-patterns/${pattern.slug}`}
              className="group theme-card theme-card-hover p-6 border-2 rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* カテゴリ & アーキテクチャ図バッジ */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-0.5 bg-secondary text-text border-2 border-border rounded-md">
                    {pattern.category}
                  </span>
                  {pattern.diagramFile && (
                    <span className="text-[10px] font-black px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-md flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      図解あり
                    </span>
                  )}
                </div>

                {/* タイトル */}
                <h3 className="text-xl font-black text-text group-hover:text-accent transition-colors leading-tight line-clamp-2">
                  {pattern.title}
                </h3>

                {/* 説明文 */}
                <p className="text-sm text-text/70 leading-relaxed font-medium line-clamp-3">
                  {pattern.description}
                </p>
              </div>

              {/* 使用サービスとリンク */}
              <div className="mt-6 pt-4 border-t border-border/10 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {pattern.awsServices.slice(0, 4).map((srv) => (
                    <span
                      key={srv}
                      className="text-[11px] font-bold px-2 py-0.5 bg-secondary text-text/80 rounded"
                    >
                      {srv}
                    </span>
                  ))}
                  {pattern.awsServices.length > 4 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-secondary text-text/50 rounded">
                      +{pattern.awsServices.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm font-black text-accent group-hover:translate-x-0.5 transition-transform duration-200">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="h-4 w-4 shrink-0" />
                    構成を確認する
                  </span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
