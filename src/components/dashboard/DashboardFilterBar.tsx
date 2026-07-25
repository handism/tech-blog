// src/components/dashboard/DashboardFilterBar.tsx
'use client';

import type { LucideIcon } from 'lucide-react';
import { Search, X } from 'lucide-react';

/**
 * フィルタタブ1つ分の定義。
 */
export type DashboardFilterOption<TId extends string = string> = {
  id: TId;
  name: string;
  icon: LucideIcon;
};

interface DashboardFilterBarProps<TId extends string> {
  /** 検索入力の id（label との紐付けとクリア後のフォーカス復帰に使用） */
  searchId: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchLabel: string;
  options: readonly DashboardFilterOption<TId>[];
  selectedId: TId;
  onSelect: (id: TId) => void;
}

/**
 * 一覧ダッシュボード共通の検索＋カテゴリフィルタ。
 */
export default function DashboardFilterBar<TId extends string>({
  searchId,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  options,
  selectedId,
  onSelect,
}: DashboardFilterBarProps<TId>) {
  return (
    <div className="theme-card p-5 md:p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* 検索入力 */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
        <input
          id={searchId}
          type="text"
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 bg-card border-2 border-border text-text placeholder-text/50 rounded-xl focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all text-sm font-bold"
        />
        {searchValue && (
          <button
            onClick={() => {
              onSearchChange('');
              document.getElementById(searchId)?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors p-1 focus-visible:ring-2 focus-visible:ring-accent rounded cursor-pointer"
            aria-label="検索条件をクリア"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* カテゴリタブ */}
      <div className="flex items-center gap-2 overflow-x-auto md:overflow-x-visible py-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {options.map((option) => {
          const isActive = selectedId === option.id;
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              aria-pressed={isActive}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap border-2 border-border transition-all flex items-center gap-1.5 cursor-pointer
                ${
                  isActive
                    ? 'bg-accent text-white translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-card text-text shadow-[2.5px_2.5px_0px_0px_var(--border)] dark:shadow-[2.5px_2.5px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--border)] dark:hover:shadow-[4px_4px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{option.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
