// src/components/dashboard/DashboardHero.tsx
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface DashboardHeroProps {
  /** タイトル上部のバッジ文言（例: Utilities / Curriculum / Notes） */
  badge: string;
  title: string;
  description: string;
  /** バッジ左のアイコン。省略時は Sparkles */
  badgeIcon?: LucideIcon;
  /** タイトル左に添えるアイコン */
  titleIcon?: LucideIcon;
}

/**
 * 一覧ダッシュボード共通のヒーローヘッダー。
 */
export default function DashboardHero({
  badge,
  title,
  description,
  badgeIcon: BadgeIcon = Sparkles,
  titleIcon: TitleIcon,
}: DashboardHeroProps) {
  return (
    <div className="page-header text-center max-w-2xl mx-auto mb-10 md:mb-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-4">
        <BadgeIcon className="w-3.5 h-3.5 text-accent" />
        <span>{badge}</span>
      </div>
      <h1 className="flex items-center justify-center gap-2.5 text-3xl md:text-4xl font-extrabold text-text tracking-tight mb-4">
        {TitleIcon && <TitleIcon className="w-8 h-8 md:w-9 md:h-9 text-accent shrink-0" />}
        <span>{title}</span>
      </h1>
      <p className="text-text/80 text-sm md:text-base leading-relaxed font-medium">{description}</p>
    </div>
  );
}
