import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import KeyboardEventsClientPage from './page.client';

export const metadata: Metadata = {
  title: `Keyboard Event Visualizer | ${siteConfig.name}`,
  description:
    'キーボードを押すと、JavaScriptのイベント情報や入力パラメータをリアルタイムで美しく可視化します。',
  alternates: {
    canonical: '/tools/keyboard-events',
  },
};

export default function KeyboardEventsPage() {
  return <KeyboardEventsClientPage />;
}
