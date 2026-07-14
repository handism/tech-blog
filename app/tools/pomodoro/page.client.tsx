'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Timer } from 'lucide-react';
import PomodoroTimer from '@/src/components/tools/pomodoro/PomodoroTimer';

export default function PomodoroClientPage() {
  return (
    <ToolPageLayout
      title="Pomodoro Focus Timer"
      description="25分の作業セッションと5分の休憩セッションを繰り返し、集中力を維持するための時間管理ツールです。選択されたテーマ（Steampunk、Terminal、Chalkboardなど）に応じて外見や効果音が変化します。"
      icon={Timer}
    >
      <PomodoroTimer />
    </ToolPageLayout>
  );
}
