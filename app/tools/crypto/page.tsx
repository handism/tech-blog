import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import CryptoToolkitClient from './page.client';

export const metadata: Metadata = {
  title: `Cryptography & Encoder | ${siteConfig.name}`,
  description:
    'Base64、ハッシュ生成、URLエンコード、各種暗号化/デコードをブラウザ完結で行うツール群。',
  alternates: {
    canonical: '/tools/crypto',
  },
};

export default function CryptoToolkit() {
  return <CryptoToolkitClient />;
}
