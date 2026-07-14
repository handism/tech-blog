'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Cloud } from 'lucide-react';
import AwsDiagramGenerator from '@/src/components/tools/aws-diagram/AwsDiagramGenerator';

export default function AwsDiagramClientPage() {
  return (
    <ToolPageLayout
      title="AWS Architecture Diagram Generator"
      description="フォーム操作だけで、境界線（VPCやサブネット）と主要AWSリソース、それらを結ぶネットワーク接続線をきれいに定義し、Mermaid.jsで美しい構成図を自動描画します。"
      icon={Cloud}
    >
      <AwsDiagramGenerator />
    </ToolPageLayout>
  );
}
