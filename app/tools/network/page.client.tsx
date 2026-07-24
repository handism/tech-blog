'use client';

import { Send, Globe, ShieldCheck, Binary } from 'lucide-react';
import ToolTabsPage, { type SubTool } from '@/src/components/ToolTabsPage';
import dynamic from 'next/dynamic';

const HttpTester = dynamic(() => import('@/src/components/tools/network/HttpTester'));
const HttpStatus = dynamic(() => import('@/src/components/tools/network/HttpStatus'));
const SecurityHeaders = dynamic(() => import('@/src/components/tools/network/SecurityHeaders'));
const CidrCalculator = dynamic(() => import('@/src/components/tools/network/CidrCalculator'));

const SUB_TOOLS: Record<string, SubTool> = {
  tester: {
    label: 'Request Tester',
    description: 'ブラウザのFetch APIを用いて、各種APIリクエストの送信とレスポンスをテストします。',
    icon: Send,
    component: HttpTester,
  },
  status: {
    label: 'Status Explorer',
    description:
      'HTTPステータスコードの意味や背景、JSONレスポンス例、MDN仕様書を検索・確認できます。',
    icon: Globe,
    component: HttpStatus,
  },
  security: {
    label: 'Security Headers',
    description:
      'Nginx, Apache, Vercel, Netlify用のセキュリティヘッダー設定コードを瞬時に生成します。',
    icon: ShieldCheck,
    component: SecurityHeaders,
  },
  cidr: {
    label: 'CIDR Calculator',
    description:
      'IPアドレスとCIDRからネットワークアドレス、ブロードキャスト、IP範囲を動的に計算します。',
    icon: Binary,
    component: CidrCalculator,
  },
};

export default function NetworkToolkit() {
  return <ToolTabsPage basePath="/tools/network" subTools={SUB_TOOLS} defaultTab="tester" />;
}
