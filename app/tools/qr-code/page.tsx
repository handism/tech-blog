import type { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';
import QrCodeClientPage from './page.client';

export const metadata: Metadata = {
  title: `QR コード生成 | ${siteConfig.name}`,
  description:
    'テキストやURLから簡単にQRコードを生成し、サイズ、エラー訂正レベル、配色をカスタマイズしてダウンロードできます。',
  alternates: {
    canonical: '/tools/qr-code',
  },
};

export default function QrCodePage() {
  return <QrCodeClientPage />;
}
