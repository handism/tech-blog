'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Keyboard } from 'lucide-react';
import KeyboardEventVisualizer from '@/src/components/tools/keyboard-events/KeyboardEventVisualizer';

export default function KeyboardEventsClientPage() {
  return (
    <ToolPageLayout
      title="Keyboard Event Visualizer"
      description="キーボードを押すと、JavaScriptのイベント情報や入力パラメータをリアルタイムで美しく可視化します。"
      icon={Keyboard}
    >
      <KeyboardEventVisualizer />
    </ToolPageLayout>
  );
}
