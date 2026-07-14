import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import DataJsonToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Data & JSON Processor | ${siteConfig.name}`,
  description: 'JSON整形、CSV-JSON相互変換、YAML変換などのデータ処理ユーティリティ。',
  alternates: {
    canonical: '/tools/data-json',
  },
};

export default function DataJsonToolkit() {
  return <DataJsonToolkitClient />;
}
