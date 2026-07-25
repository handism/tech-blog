// src/components/dashboard/DashboardShell.tsx
import type { ReactNode } from 'react';

/**
 * 一覧ダッシュボード（Tools / Learning / Scraps）共通の外枠。
 * 3ページで横幅・余白を揃えるための唯一の定義箇所。
 */
export default function DashboardShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">{children}</div>;
}
