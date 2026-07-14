'use client';

import { Clock, Terminal } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import TimeConverter from '@/src/components/tools/time/TimeConverter';
import CronGenerator from '@/src/components/tools/time/CronGenerator';

const SUB_TOOLS: Record<string, SubTool> = {
  timestamp: {
    label: 'Timestamp & Timezone',
    description: 'Unixタイムスタンプの相互変換や、世界主要都市のタイムゾーン現在時刻を表示します。',
    icon: Clock,
    component: TimeConverter,
  },
  cron: {
    label: 'Cron Parser & Generator',
    description:
      'Cron式の実行スケジュール確認、日本語訳の解説、およびGUIフォームでの生成を行います。',
    icon: Terminal,
    component: CronGenerator,
  },
};

export default function TimeToolkit() {
  return <ToolTabsPage basePath="/tools/time" subTools={SUB_TOOLS} defaultTab="timestamp" />;
}
