import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import PomodoroClientPage from './page.client';

export const metadata: Metadata = {
  title: `Pomodoro Focus Timer | ${siteConfig.name}`,
  description:
    '25分の作業セッションと5分の休憩セッションを繰り返し、集中力を維持するための時間管理ツールです。選択されたテーマ（Steampunk、Terminal、Chalkboardなど）に応じて外見や効果音が変化します。',
  alternates: {
    canonical: '/tools/pomodoro',
  },
};

export default function PomodoroPage() {
  return <PomodoroClientPage />;
}
