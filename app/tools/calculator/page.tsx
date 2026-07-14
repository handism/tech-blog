import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import CalculatorToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Calculator & Converter | ${siteConfig.name}`,
  description:
    '標準電卓、プログラマー電卓、および日付計算ツールを搭載したブラウザ完結型の計算ツールセット。',
  alternates: {
    canonical: '/tools/calculator',
  },
};

export default function CalculatorToolkit() {
  return <CalculatorToolkitClient />;
}
