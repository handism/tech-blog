// src/components/dashboard/DashboardSection.tsx
import type { LucideIcon } from 'lucide-react';

/**
 * カテゴリ見出し（アイコン＋名称＋件数バッジ）。
 */
export function DashboardSectionHeading({
  icon: Icon,
  name,
  count,
}: {
  icon: LucideIcon;
  name: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2 border-b-3 border-border pb-2">
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent shrink-0" />
      <h2 className="text-lg md:text-xl font-extrabold text-text">{name}</h2>
      <span className="text-xs border border-border bg-secondary text-text px-2 py-0.5 rounded-md font-bold">
        {count}
      </span>
    </div>
  );
}

/**
 * 検索・フィルタ結果が0件のときの表示。
 */
export function DashboardEmptyState({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="text-center py-16 theme-card">
      <p className="text-text/75 mb-4 text-sm md:text-base font-bold">{message}</p>
      <button
        onClick={onReset}
        className="theme-btn px-5 py-2.5 text-sm font-bold text-text cursor-pointer"
      >
        検索条件をリセットする
      </button>
    </div>
  );
}
