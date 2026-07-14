import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import DesignGeneratorToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Design Layout & Asset Generator | ${siteConfig.name}`,
  description:
    'アスペクト比計算、グリッドレイアウト生成、ダミー画像生成などのデザイナー向け支援ツール群。',
  alternates: {
    canonical: '/tools/design-generator',
  },
};

export default function DesignGeneratorToolkit() {
  return <DesignGeneratorToolkitClient />;
}
