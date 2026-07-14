'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { QrCode } from 'lucide-react';
import QrCodeGenerator from '@/src/components/tools/qr-code/QrCodeGenerator';

export default function QrCodeClientPage() {
  return (
    <ToolPageLayout
      title="QR コード生成"
      description="テキストやURLからQRコードを生成します"
      icon={QrCode}
    >
      <QrCodeGenerator />
    </ToolPageLayout>
  );
}
